import * as React from "react";
import { Copy, Check, ExternalLink, Sparkles } from "lucide-react";
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
  Callout,
  Card,
  CardHeader,
  EmptyState,
  Eyebrow,
  Tabs,
} from "@/components/ui";
import { ScoreRing, CategoryBar } from "@/components/app/charts";
import { IssueList, SeveritySummary } from "@/components/app/issues";

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
      {/* ---- Header ------------------------------------------------------- */}
      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center">
          <ScoreRing score={result.score} grade={result.grade} />

          <div className="min-w-0 flex-1">
            <Eyebrow>Audited {relativeTime(audit.createdAt)}</Eyebrow>
            <h1 className="mt-1.5 truncate text-xl font-semibold tracking-tight text-ink">
              {hostOf(audit.finalUrl)}
            </h1>
            {audit.pageTitle && (
              <p className="mt-1 line-clamp-2 max-w-prose text-sm leading-relaxed text-ink-muted">
                {audit.pageTitle}
              </p>
            )}

            <div className="mt-3">
              <SeveritySummary issues={result.issues} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a href={audit.finalUrl} target="_blank" rel="noopener noreferrer nofollow">
                <Button size="sm" variant="secondary">
                  Visit page
                  <ExternalLink className="h-3 w-3" strokeWidth={2} />
                </Button>
              </a>
              {actions}
            </div>
          </div>
        </div>

        {result.verdict && (
          <div className="border-t border-line bg-sunken px-5 py-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-accent" strokeWidth={2} />
              <Eyebrow>The read</Eyebrow>
            </div>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">
              {result.verdict}
            </p>
          </div>
        )}
      </Card>

      {/* grid-cols-[minmax(0,1fr)] on the base case is load-bearing: a grid item
          defaults to min-width:auto, so without it the column sizes to the
          widest evidence string and every `truncate` below stops working. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
        {/* ---- Category rail --------------------------------------------- */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Categories"
              subtitle="Weighted contributions to the overall score"
              action={
                filter && (
                  <Button size="sm" variant="ghost" onClick={() => setFilter(null)}>
                    Clear
                  </Button>
                )
              }
            />
            <div className="divide-y divide-line">
              {result.categories.map((cat) => (
                <CategoryBar
                  key={cat.key}
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
          </Card>

          <Card>
            <CardHeader title="Page vitals" />
            <dl className="divide-y divide-line">
              <Vital label="Words of copy" value={result.metrics.wordCount} />
              <Vital
                label="Avg sentence"
                value={result.metrics.avgSentenceWords}
                suffix=" words"
              />
              <Vital label="Reading ease" value={result.metrics.readingEase} />
              <Vital
                label="Reader focus"
                value={`${Math.round(result.metrics.youRatio * 100)}%`}
              />
              <Vital label="HTML weight" value={bytes(result.metrics.htmlBytes)} />
              <Vital label="Script tags" value={result.metrics.scriptCount} />
              <Vital label="Fetch time" value={`${result.metrics.fetchMs}ms`} />
            </dl>
          </Card>
        </div>

        {/* ---- Main panel ------------------------------------------------- */}
        <Card>
          <div className="px-2">
            <Tabs<Tab>
              value={tab}
              onChange={(v) => setTab(v)}
              tabs={[
                { value: "findings", label: "Findings", count: open.length },
                { value: "rewrites", label: "Rewrites", count: result.rewrites.length },
                { value: "extracted", label: "What we read" },
              ]}
            />
          </div>

          {tab === "findings" && (
            <>
              {filter && (
                <div className="border-b border-line bg-sunken px-4 py-2.5">
                  <p className="text-xs text-ink-muted">
                    <span className="font-medium text-ink">
                      {CATEGORY_META[filter].label}.
                    </span>{" "}
                    {CATEGORY_META[filter].blurb}
                  </p>
                </div>
              )}
              <IssueList
                issues={shown}
                emptyLabel="Nothing flagged in this category."
              />
            </>
          )}

          {tab === "rewrites" && <RewritePanel rewrites={result.rewrites} />}

          {tab === "extracted" && <ExtractedPanel audit={audit} />}
        </Card>
      </div>

      {publicView && (
        <p className="mt-6 text-center text-xs text-ink-subtle">
          Scored against this rubric only. Generated by Conversion Lab.
        </p>
      )}
    </>
  );
}

function Vital({
  label,
  value,
  suffix,
}: {
  label: string;
  value: React.ReactNode;
  suffix?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-4 py-2">
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="font-mono text-xs tnum font-medium text-ink">
        {value}
        {suffix}
      </dd>
    </div>
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
      <div className="p-4">
        <Callout tone="accent" title="No rewrites on this audit">
          Rewrites come from the optional copy layer. Add an Anthropic API key to
          the environment and re-run the audit to get three variants for each
          headline, subhead and call to action, each with the angle it takes and
          why it should outperform the original.
        </Callout>
      </div>
    );
  }

  return (
    <div className="divide-y divide-line">
      {rewrites.map((rewrite) => (
        <div key={rewrite.slot} className="p-4">
          <Eyebrow>{SLOT_LABEL[rewrite.slot]}</Eyebrow>

          <div className="mt-2 rounded-sm border border-line bg-sunken px-3 py-2.5">
            <div className="text-2xs font-medium uppercase tracking-[0.1em] text-ink-subtle">
              On the page now
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              {rewrite.original}
            </p>
          </div>

          <div className="mt-3 space-y-2">
            {rewrite.variants.map((variant, i) => (
              <VariantRow key={i} variant={variant} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function VariantRow({
  variant,
}: {
  variant: Rewrite["variants"][number];
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
    <div className="group flex items-start gap-3 rounded-sm border border-line px-3 py-2.5 transition-colors duration-fast ease-ease hover:border-line-strong">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-relaxed text-ink">{variant.text}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge tone="accent">{variant.angle}</Badge>
          <span className="text-xs leading-relaxed text-ink-subtle">
            {variant.rationale}
          </span>
        </div>
      </div>
      <button
        onClick={copy}
        aria-label="Copy this variant"
        className="shrink-0 rounded-sm p-1.5 text-ink-subtle transition-colors duration-fast ease-ease hover:bg-surface-hover hover:text-ink"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-pass" strokeWidth={2.5} />
        ) : (
          <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
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
    <div className="divide-y divide-line">
      <Section label="Headline">
        {extracted.h1.length ? (
          extracted.h1.map((h, i) => (
            <p key={i} className="text-sm leading-relaxed text-ink">
              {h}
            </p>
          ))
        ) : (
          <Missing>No H1 element on the page</Missing>
        )}
      </Section>

      <Section label="Title tag">
        {extracted.title ? (
          <p className="text-sm text-ink">{extracted.title}</p>
        ) : (
          <Missing>Not set</Missing>
        )}
      </Section>

      <Section label="Meta description">
        {extracted.metaDescription ? (
          <p className="text-sm leading-relaxed text-ink-muted">
            {extracted.metaDescription}
          </p>
        ) : (
          <Missing>Not set</Missing>
        )}
      </Section>

      <Section label={`Calls to action (${extracted.ctas.length})`}>
        {extracted.ctas.length ? (
          <div className="flex flex-wrap gap-1.5">
            {extracted.ctas.map((cta, i) => (
              <Badge key={i} tone="neutral">
                {cta.text}
              </Badge>
            ))}
          </div>
        ) : (
          <Missing>None detected</Missing>
        )}
      </Section>

      <Section label={`Proof signals (${extracted.proofSignals.length})`}>
        {extracted.proofSignals.length ? (
          <ul className="space-y-1.5">
            {extracted.proofSignals.map((p, i) => (
              <li key={i} className="text-xs leading-relaxed text-ink-muted">
                <span className="font-mono text-2xs uppercase tracking-wide text-accent">
                  {p.kind}
                </span>
                <span className="mx-1.5 text-ink-subtle">·</span>
                {p.evidence}
              </li>
            ))}
          </ul>
        ) : (
          <Missing>None detected</Missing>
        )}
      </Section>

      <Section label={`Form fields (${extracted.formFields.length})`}>
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

      <Section label={`Section headings (${extracted.headings.length})`}>
        <ol className="space-y-1">
          {extracted.headings.slice(0, 20).map((h, i) => (
            <li
              key={i}
              className="flex gap-2 text-xs leading-relaxed text-ink-muted"
              style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
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

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-3.5">
      <Eyebrow className="mb-2">{label}</Eyebrow>
      {children}
    </div>
  );
}

function Missing({ children }: { children: React.ReactNode }) {
  return <p className="text-xs italic text-ink-subtle">{children}</p>;
}
