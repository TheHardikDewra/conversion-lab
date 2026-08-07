import * as React from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, Trash2, Sparkles } from "lucide-react";
import type { Audit } from "@shared/schema";
import { api, ApiError, queryClient } from "@/lib/api";
import { cn, hostOf, relativeTime, scoreTone, TONE_TEXT } from "@/lib/utils";
import {
  Badge,
  Button,
  Callout,
  Card,
  CardHeader,
  EmptyState,
  Input,
  Skeleton,
  Stat,
} from "@/components/ui";
import { PageHeader } from "@/components/app/shell";
import { ScoreRing, Sparkline, ScoreHistogram } from "@/components/app/charts";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState<{ message: string; hint?: string } | null>(null);

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
  // Oldest first, so the line reads left to right in time order.
  const trend = [...(audits ?? [])].reverse().map((a) => a.score);

  return (
    <>
      <PageHeader
        eyebrow="Conversion Lab"
        title="Landing page teardowns that score"
        description={
          <>
            Paste a URL. The rulebook checks {config?.ruleCount ?? 31} conversion
            heuristics against the live page and scores it across six categories,
            with the evidence it used and a fix for every finding.
          </>
        }
      />

      <Card className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (url.trim()) run.mutate(url.trim());
          }}
          className="flex flex-col gap-2 p-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
              strokeWidth={1.75}
            />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourlandingpage.com"
              aria-label="Landing page URL to audit"
              className="pl-9"
              disabled={run.isPending}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={run.isPending}
            disabled={!url.trim()}
          >
            {run.isPending ? "Auditing" : "Run audit"}
            {!run.isPending && <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />}
          </Button>
        </form>

        {error && (
          <div className="border-t border-line p-3">
            <Callout tone="critical" title={error.message}>
              {error.hint}
            </Callout>
          </div>
        )}
      </Card>

      {config && !config.aiEnabled && (
        <div className="mb-6">
          <Callout
            tone="accent"
            title="The copy layer is off"
            action={
              <Badge tone="neutral" mono>
                ANTHROPIC_API_KEY
              </Badge>
            }
          >
            Every score, finding and fix on this page came from the rulebook, with
            no API key and no external service. Add an Anthropic key in Secrets and
            new audits also get a written verdict and three rewrites for each
            headline, subhead and CTA.
          </Callout>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="divide-y divide-line">
          <Stat
            label="Average score"
            value={average}
            suffix="/100"
            tone={TONE_TEXT[scoreTone(average)]}
          />
        </Card>
        <Card>
          <div className="px-4 py-3">
            <div className="text-2xs font-medium uppercase tracking-[0.1em] text-ink-subtle">
              Score history
            </div>
            <div className="mt-1">
              <Sparkline points={trend} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="border-b border-line px-4 pt-3">
            <div className="text-2xs font-medium uppercase tracking-[0.1em] text-ink-subtle">
              Distribution
            </div>
          </div>
          <ScoreHistogram scores={scores} />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Audits"
          subtitle={
            audits?.length
              ? `${audits.length} page${audits.length === 1 ? "" : "s"}, ${totalIssues} open findings`
              : undefined
          }
        />
        {isLoading ? (
          <div className="space-y-px">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[72px] rounded-none" />
            ))}
          </div>
        ) : !audits?.length ? (
          <EmptyState title="No audits yet">
            Paste a landing page URL above to run the first one.
          </EmptyState>
        ) : (
          <div>
            {audits.map((audit) => (
              <AuditRow
                key={audit.id}
                audit={audit}
                onDelete={
                  audit.isSample ? undefined : () => remove.mutate(audit.id)
                }
              />
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

function AuditRow({
  audit,
  onDelete,
}: {
  audit: Audit;
  onDelete?: () => void;
}) {
  const open = audit.result.issues.filter((i) => i.severity !== "pass");
  const critical = open.filter((i) => i.severity === "critical").length;
  // Colour the finding count by what it says, not by the page's overall score.
  // A green "3 critical" is worse than no colour at all.
  const countTone = critical > 0 ? "critical" : open.length > 0 ? "warn" : "pass";

  return (
    <div className="group flex items-center gap-4 border-b border-line px-4 py-3 transition-colors duration-fast ease-ease last:border-b-0 hover:bg-surface-hover">
      <Link
        href={`/audit/${audit.id}`}
        className="flex min-w-0 flex-1 items-center gap-4"
      >
          <ScoreRing score={audit.score} grade={audit.grade} size={44} animate={false} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-medium text-ink">
                {hostOf(audit.finalUrl)}
              </span>
              {audit.isSample && <Badge tone="neutral">Sample</Badge>}
              {audit.result.engine === "heuristic+ai" && (
                <Badge tone="accent">
                  <Sparkles className="h-2.5 w-2.5" strokeWidth={2} />
                  Copy layer
                </Badge>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-ink-subtle">
              {audit.pageTitle ?? audit.finalUrl}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-4 sm:flex">
            <div className="text-right">
              <div
                className={cn("font-mono text-xs tnum font-semibold", TONE_TEXT[countTone])}
              >
                {critical > 0
                  ? `${critical} critical`
                  : open.length > 0
                    ? `${open.length} to fix`
                    : "all clear"}
              </div>
              <div className="mt-0.5 font-mono text-2xs tnum text-ink-subtle">
                {relativeTime(audit.createdAt)}
              </div>
            </div>
          </div>
      </Link>

      {onDelete && (
        <button
          onClick={onDelete}
          aria-label={`Delete audit for ${hostOf(audit.finalUrl)}`}
          className="shrink-0 rounded-sm p-1.5 text-ink-subtle opacity-0 transition-all duration-fast ease-ease hover:bg-critical-soft hover:text-critical focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
