import * as React from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Trash2 } from "lucide-react";
import type { Audit } from "@shared/schema";
import { api, ApiError, queryClient } from "@/lib/api";
import { cn, hostOf, relativeTime, scoreTone, TONE_TEXT } from "@/lib/utils";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Label,
  Note,
  SectionHead,
  Sheet,
  Skeleton,
  Stat,
} from "@/components/ui";
import { PageHeader } from "@/components/app/shell";
import { ScoreMark, Sparkline, ScoreHistogram } from "@/components/app/charts";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState<{ message: string; hint?: string } | null>(
    null,
  );

  const { data: config } = useQuery({ queryKey: ["config"], queryFn: api.config });
  const { data: audits, isLoading } = useQuery({
    queryKey: ["audits"],
    queryFn: api.audits,
  });

  const run = useMutation({
    mutationFn: api.runAudit,
    onMutate: () => setError(null),
    onSuccess: (audit) => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      setUrl("");
      navigate(`/audit/${audit.id}`);
    },
    onError: (err) =>
      setError({
        message: err instanceof ApiError ? err.message : "Something went wrong.",
        hint: err instanceof ApiError ? err.hint : undefined,
      }),
  });

  const remove = useMutation({
    mutationFn: api.deleteAudit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audits"] }),
  });

  const scores = (audits ?? []).map((a) => a.score);
  const average = scores.length
    ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length)
    : 0;
  const totalIssues = (audits ?? []).reduce(
    (sum, a) => sum + a.result.issues.filter((i) => i.severity !== "pass").length,
    0,
  );
  const trend = [...(audits ?? [])].reverse().map((a) => a.score);

  return (
    <>
      <PageHeader
        label="Conversion Lab"
        size="d3"
        title={
          <>
            Landing page teardowns
            <br />
            <span className="italic text-ink-muted">that score.</span>
          </>
        }
        description={
          <>
            Paste a URL. {config?.ruleCount ?? 35} conversion checks run against the
            live page and score it across six categories, with the evidence behind
            every finding and a fix for each one.
          </>
        }
      />

      {/* ---- Run bar -------------------------------------------------------- */}
      <div className="mb-12 animate-rise">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (url.trim()) run.mutate(url.trim());
          }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <Label className="mb-2 block">Page to audit</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourlandingpage.com"
              aria-label="Landing page URL to audit"
              disabled={run.isPending}
              className="font-mono"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={run.isPending}
            disabled={!url.trim()}
          >
            {run.isPending ? "Auditing" : "Run audit"}
            {!run.isPending && <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />}
          </Button>
        </form>

        {error && (
          <div className="mt-4">
            <Note tone="critical" title={error.message}>
              {error.hint}
            </Note>
          </div>
        )}
      </div>

      {config && !config.aiEnabled && (
        <div className="mb-12">
          <Note
            tone="accent"
            title="The copy layer is off"
            action={
              <Badge tone="neutral" mono>
                ANTHROPIC_API_KEY
              </Badge>
            }
          >
            Every score, finding and fix here came from the rulebook, with no API key
            and no external service. Add an Anthropic key in Secrets and new audits
            also get a written verdict and three rewrites for each headline, subhead
            and CTA.
          </Note>
        </div>
      )}

      {/* ---- Summary -------------------------------------------------------- */}
      <div className="mb-12 grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-3">
        <div className="bg-surface">
          <Stat
            label="Average score"
            value={average}
            suffix="/100"
            tone={TONE_TEXT[scoreTone(average)]}
          />
        </div>
        <div className="bg-surface px-5 py-4">
          <Label>Score history</Label>
          <div className="mt-3">
            <Sparkline points={trend} />
          </div>
        </div>
        <div className="bg-surface">
          <div className="px-5 pt-4">
            <Label>Distribution</Label>
          </div>
          <ScoreHistogram scores={scores} />
        </div>
      </div>

      {/* ---- Index ---------------------------------------------------------- */}
      <Sheet>
        <SectionHead
          label="Index"
          title={
            audits?.length
              ? `${audits.length} page${audits.length === 1 ? "" : "s"} audited`
              : "Audits"
          }
          note={
            audits?.length ? `${totalIssues} findings still open across all reports` : undefined
          }
        />
        {isLoading ? (
          <div className="divide-y divide-rule">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[86px]" />
            ))}
          </div>
        ) : !audits?.length ? (
          <EmptyState title="Nothing audited yet">
            Paste a landing page URL above to run the first report.
          </EmptyState>
        ) : (
          <div className="stagger divide-y divide-rule">
            {audits.map((audit, i) => (
              <AuditRow
                key={audit.id}
                audit={audit}
                index={i}
                onDelete={audit.isSample ? undefined : () => remove.mutate(audit.id)}
              />
            ))}
          </div>
        )}
      </Sheet>
    </>
  );
}

function AuditRow({
  audit,
  index,
  onDelete,
}: {
  audit: Audit;
  index: number;
  onDelete?: () => void;
}) {
  const open = audit.result.issues.filter((i) => i.severity !== "pass");
  const critical = open.filter((i) => i.severity === "critical").length;
  // Colour by what the number says, not by the page's overall score.
  const countTone = critical > 0 ? "critical" : open.length > 0 ? "warn" : "pass";

  return (
    <div className="group relative flex items-center gap-5 px-5 py-5 transition-colors duration-fast ease-ease hover:bg-surface-hover">
      <span className="hidden shrink-0 font-mono text-2xs tnum text-ink-subtle sm:block">
        {String(index + 1).padStart(2, "0")}
      </span>

      <Link
        href={`/audit/${audit.id}`}
        className="flex min-w-0 flex-1 items-center gap-5"
      >
        <ScoreMark score={audit.score} grade={audit.grade} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="truncate font-mono text-sm text-ink">
              {hostOf(audit.finalUrl)}
            </span>
            {audit.isSample && <Badge tone="neutral">Sample</Badge>}
            {audit.result.engine === "heuristic+ai" && (
              <Badge tone="accent">Copy layer</Badge>
            )}
          </div>
          <p className="mt-1 max-w-measure truncate text-sm text-ink-subtle">
            {audit.pageTitle ?? audit.finalUrl}
          </p>
        </div>

        <div className="hidden shrink-0 text-right sm:block">
          <div className={cn("font-mono text-xs tnum font-medium", TONE_TEXT[countTone])}>
            {critical > 0
              ? `${critical} critical`
              : open.length > 0
                ? `${open.length} to fix`
                : "all clear"}
          </div>
          <div className="mt-1 font-mono text-2xs tnum text-ink-subtle">
            {relativeTime(audit.createdAt)}
          </div>
        </div>
      </Link>

      {onDelete && (
        <button
          onClick={onDelete}
          aria-label={`Delete audit for ${hostOf(audit.finalUrl)}`}
          className="shrink-0 p-1.5 text-ink-subtle opacity-0 transition-all duration-fast ease-ease hover:text-critical focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
