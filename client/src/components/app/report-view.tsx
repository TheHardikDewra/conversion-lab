import * as React from "react";
import { Copy, Check, ArrowUpRight } from "lucide-react";
import {
  CATEGORY_META,
  type Audit,
  type CategoryKey,
  type Rewrite,
} from "@shared/schema";
import { bytes, cn, hostOf, relativeTime } from "@/lib/utils";
import {
  Badge,
  Button,
  DataRow,
  EmptyState,
  Label,
  Note,
  SectionHead,
  Sheet,
  Tabs,
} from "@/components/ui";
import { ScoreGauge, CategoryBar } from "@/components/app/charts";
import { IssueList } from "@/components/app/issues";

type Tab = "findings" | "rewrites" | "extracted";

export function ReportView({
  audit,
  actions,
  publicView,
}: {
  audit: Audit;
  actions?: React.ReactNode;
  publicView?: boolean;
}) {
  const [tab, setTab] = React.useState<Tab>("findings");
  const [filter, setFilter] = React.useState<CategoryKey | null>(null);

  const { result } = audit;
  const open = result.issues.filter((i) => i.severity !== "pass");
  const shown = filter
    ? result.issues.filter((i) => i.category === filter)
    : result.issues;

  return (
    <>
      {/* ---- Masthead ----------------------------------------------------- */}
      <header className="mb-10 animate-rise">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <Label>
            Report · {hostOf(audit.finalUrl)} · {relativeTime(audit.createdAt)}
          </Label>
          <div className="flex items-center gap-4">
            <a
              href={audit.finalUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1 font-mono text-2xs text-ink-subtle transition-colors duration-fast ease-ease hover:text-accent"
            >
              Open the page
              <ArrowUpRight className="h-3 w-3" strokeWidth={1.75} />
            </a>
            {actions}
          </div>
        </div>

        <h1 className="display mt-5 max-w-measure text-d4 text-ink">
          {audit.pageTitle ?? hostOf(audit.finalUrl)}
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end lg:gap-16">
          <ScoreGauge score={result.score} grade={result.grade} />

          {/* A ruled tally rather than floating chips. It gives the right-hand
              column a reason to exist and lines its baseline up with the rail. */}
          <dl className="divide-y divide-rule border-y border-rule">
            {(
              [
                ["Critical", result.issues.filter((i) => i.severity === "critical").length, "text-critical"],
                ["Warning", result.issues.filter((i) => i.severity === "warning").length, "text-warn"],
                ["Passing", result.issues.filter((i) => i.severity === "pass").length, "text-pass"],
              ] as const
            ).map(([name, count, tone]) => (
              <div key={name} className="flex items-baseline justify-between py-2">
                <dt className="label">{name}</dt>
                <dd className={cn("font-mono text-sm tnum font-medium", tone)}>
                  {String(count).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {result.verdict && (
        <div className="mb-10 grid gap-4 rule-t rule-b py-6 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-8">
          <Label>The read</Label>
          <p className="max-w-measure text-lg leading-relaxed text-ink">
            {result.verdict}
          </p>
        </div>
      )}

      <div className="grid gap-8 grid-cols-[minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-10">
        {/* ---- Rail -------------------------------------------------------- */}
        <div className="space-y-6">
          <Sheet>
            <SectionHead
              label="Categories"
              note="Weighted contributions to the score"
              action={
                filter && (
                  <Button size="sm" variant="ghost" onClick={() => setFilter(null)}>
                    Clear
                  </Button>
                )
              }
            />
            <div className="divide-y divide-rule">
              {result.categories.map((cat, i) => (
                <CategoryBar
                  key={cat.key}
                  index={i}
                  label={CATEGORY_META[cat.key].label}
                  score={cat.score}
                  weight={cat.weight}
                  issueCount={cat.issueCount}
                  active={filter === cat.key}
                  onClick={() => {
                    setTab("findings");
                    setFilter((f) => (f === cat.key ? null : cat.key));
                  }}
                />
              ))}
            </div>
          </Sheet>

          <Sheet>
            <SectionHead label="Page vitals" />
            <dl className="divide-y divide-rule py-1">
              <DataRow label="Words of copy" value={result.metrics.wordCount} />
              <DataRow label="Sentences" value={result.metrics.proseSentences} />
              <DataRow
                label="Avg sentence"
                value={`${result.metrics.avgSentenceWords}w`}
              />
              <DataRow label="Reading ease" value={result.metrics.readingEase} />
              <DataRow
                label="Reader focus"
                value={`${Math.round(result.metrics.youRatio * 100)}%`}
              />
              <DataRow label="HTML weight" value={bytes(result.metrics.htmlBytes)} />
              <DataRow label="Script tags" value={result.metrics.scriptCount} />
              <DataRow label="Fetch" value={`${result.metrics.fetchMs}ms`} />
            </dl>
          </Sheet>
        </div>

        {/* ---- Main -------------------------------------------------------- */}
        <Sheet>
          <Tabs<Tab>
            value={tab}
            onChange={(v) => setTab(v)}
            tabs={[
              { value: "findings", label: "Findings", count: open.length },
              { value: "rewrites", label: "Rewrites", count: result.rewrites.length },
              { value: "extracted", label: "What we read" },
            ]}
          />

          {tab === "findings" && (
            <>
              {filter && (
                <div className="rule-b bg-sunken px-5 py-3">
                  <p className="max-w-measure text-xs leading-relaxed text-ink-muted">
                    <span className="font-medium text-ink">
                      {CATEGORY_META[filter].label}.
                    </span>{" "}
                    {CATEGORY_META[filter].blurb}
                  </p>
                </div>
              )}
              <IssueList issues={shown} emptyLabel="Nothing flagged here" />
            </>
          )}

          {tab === "rewrites" && <RewritePanel rewrites={result.rewrites} />}
          {tab === "extracted" && <ExtractedPanel audit={audit} />}
        </Sheet>
      </div>

      {publicView && (
        <p className="mt-12 rule-t pt-5 text-center font-mono text-2xs text-ink-subtle">
          Scored against this rubric only · Generated by Conversion Lab
        </p>
      )}
    </>
  );
}

/* ==========================================================================
   REWRITES
   ========================================================================== */

const SLOT_LABEL: Record<Rewrite["slot"], string> = {
  headline: "Headline",
  subhead: "Subhead",
  cta: "Call to action",
  proof: "Proof",
};

function RewritePanel({ rewrites }: { rewrites: Rewrite[] }) {
  if (!rewrites.length) {
    return (
      <div className="p-5">
        <Note tone="accent" title="No rewrites on this audit">
          Rewrites come from the optional copy layer. Add an Anthropic API key to
          the environment and re-run the audit to get three variants for each
          headline, subhead and call to action, each with the angle it takes and
          why it should outperform the original.
        </Note>
      </div>
    );
  }

  return (
    <div className="divide-y divide-rule">
      {rewrites.map((rewrite, i) => (
        <div key={rewrite.slot} className="px-5 py-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xs tnum text-ink-subtle">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Label>{SLOT_LABEL[rewrite.slot]}</Label>
          </div>

          <p className="mt-4 max-w-measure border-l-2 border-rule-strong pl-4 text-md leading-relaxed text-ink-muted">
            {rewrite.original}
          </p>

          <div className="mt-5 space-y-0 divide-y divide-rule border-y border-rule">
            {rewrite.variants.map((variant, j) => (
              <VariantRow key={j} variant={variant} index={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function VariantRow({
  variant,
  index,
}: {
  variant: Rewrite["variants"][number];
  index: number;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(variant.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="group flex items-start gap-4 py-4 transition-colors duration-fast ease-ease hover:bg-surface-hover">
      <span className="shrink-0 pt-1 font-mono text-2xs text-ink-subtle">
        {String.fromCharCode(65 + index)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="display max-w-measure text-d1 text-ink">{variant.text}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
          <Badge tone="accent">{variant.angle}</Badge>
          <span className="max-w-measure text-xs leading-relaxed text-ink-subtle">
            {variant.rationale}
          </span>
        </div>
      </div>
      <button
        onClick={copy}
        aria-label="Copy this variant"
        className="shrink-0 p-1 text-ink-subtle opacity-0 transition-opacity duration-fast ease-ease hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-pass" strokeWidth={2.5} />
        ) : (
          <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}

/* ==========================================================================
   EXTRACTED
   Showing the working. A score nobody can audit is a score nobody trusts.
   ========================================================================== */

function ExtractedPanel({ audit }: { audit: Audit }) {
  const { extracted } = audit.result;

  return (
    <div className="divide-y divide-rule">
      <Section label="Headline">
        {extracted.h1.length ? (
          extracted.h1.map((h, i) => (
            <p key={i} className="display max-w-measure text-d1 text-ink">
              {h}
            </p>
          ))
        ) : (
          <Missing>No H1 element on the page</Missing>
        )}
      </Section>

      <Section label="Title tag">
        {extracted.title ? (
          <p className="max-w-measure text-sm leading-relaxed text-ink">
            {extracted.title}
          </p>
        ) : (
          <Missing>Not set</Missing>
        )}
      </Section>

      <Section label="Meta description">
        {extracted.metaDescription ? (
          <p className="max-w-measure text-sm leading-relaxed text-ink-muted">
            {extracted.metaDescription}
          </p>
        ) : (
          <Missing>Not set</Missing>
        )}
      </Section>

      <Section label={`Calls to action · ${extracted.ctas.length}`}>
        {extracted.ctas.length ? (
          <div className="flex flex-wrap gap-1.5">
            {extracted.ctas.map((cta, i) => (
              <Badge key={i} tone="neutral" mono>
                {cta.text}
              </Badge>
            ))}
          </div>
        ) : (
          <Missing>None detected</Missing>
        )}
      </Section>

      <Section label={`Proof signals · ${extracted.proofSignals.length}`}>
        {extracted.proofSignals.length ? (
          <ul className="space-y-2">
            {extracted.proofSignals.map((p, i) => (
              <li
                key={i}
                className="grid max-w-measure gap-1 text-xs leading-relaxed text-ink-muted sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-3"
              >
                <span className="font-mono text-2xs uppercase tracking-[0.08em] text-accent">
                  {p.kind}
                </span>
                <span>{p.evidence}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Missing>None detected</Missing>
        )}
      </Section>

      <Section label={`Form fields · ${extracted.formFields.length}`}>
        {extracted.formFields.length ? (
          <div className="flex flex-wrap gap-1.5">
            {extracted.formFields.map((f, i) => (
              <Badge key={i} tone={f.labelled ? "neutral" : "warn"} mono>
                {f.name}
                {!f.labelled && " · no label"}
              </Badge>
            ))}
          </div>
        ) : (
          <Missing>No form on the page</Missing>
        )}
      </Section>

      <Section label={`Heading outline · ${extracted.headings.length}`}>
        <ol className="space-y-1">
          {extracted.headings.slice(0, 22).map((h, i) => (
            <li
              key={i}
              className="flex max-w-measure gap-3 text-xs leading-relaxed text-ink-muted"
              style={{ paddingLeft: `${(h.level - 1) * 14}px` }}
            >
              <span className="shrink-0 font-mono text-2xs text-ink-subtle">
                H{h.level}
              </span>
              <span className="truncate">{h.text}</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 px-5 py-5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6">
      <Label className="pt-1">{label}</Label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Missing({ children }: { children: React.ReactNode }) {
  return <p className="text-xs italic text-ink-subtle">{children}</p>;
}
