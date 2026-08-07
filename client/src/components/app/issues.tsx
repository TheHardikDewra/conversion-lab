import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { CATEGORY_META, type Issue } from "@shared/schema";
import { cn, severityTone, SEVERITY_LABEL } from "@/lib/utils";
import { Badge, EmptyState, Tick } from "@/components/ui";

/**
 * Findings are the product, so they are set like the numbered entries in a
 * report: an index, a tone rule down the left edge, the finding, the cost.
 * A reader scanning from three feet away should be able to tell what is
 * broken and how much it costs without expanding anything.
 */
export function IssueRow({ issue, index }: { issue: Issue; index: number }) {
  const [open, setOpen] = React.useState(false);
  const tone = severityTone(issue.severity);
  const isPass = issue.severity === "pass";

  return (
    <div className="rule-b last:border-b-0">
      <button
        onClick={() => !isPass && setOpen((v) => !v)}
        aria-expanded={isPass ? undefined : open}
        disabled={isPass}
        className={cn(
          "flex w-full items-stretch gap-0 text-left",
          "transition-colors duration-fast ease-ease",
          !isPass && "hover:bg-surface-hover",
        )}
      >
        <Tick tone={isPass ? "neutral" : tone} className={isPass ? "opacity-30" : ""} />

        {/* min-w-0 is load-bearing: a flex item defaults to min-width:auto, so
            without it this span grows to the width of the longest evidence
            string and the truncate below never engages. */}
        <span className="flex min-w-0 flex-1 items-baseline gap-4 px-4 py-3.5">
          <span
            className={cn(
              "shrink-0 pt-px font-mono text-2xs tnum",
              isPass ? "text-ink-subtle/60" : "text-ink-subtle",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block text-base leading-snug",
                isPass ? "text-ink-subtle" : "font-medium text-ink",
              )}
            >
              {issue.title}
            </span>
            {issue.evidence && (
              <span className="mt-1 block truncate font-mono text-2xs text-ink-subtle">
                {issue.evidence}
              </span>
            )}
          </span>

          <span className="flex shrink-0 items-center gap-3 pt-px">
            <span className="hidden font-mono text-2xs uppercase tracking-[0.1em] text-ink-subtle sm:inline">
              {CATEGORY_META[issue.category].label}
            </span>
            <span
              className={cn(
                "w-9 text-right font-mono text-sm tnum",
                isPass ? "text-ink-subtle/50" : "font-medium",
                !isPass && tone === "critical" && "text-critical",
                !isPass && tone === "warn" && "text-warn",
              )}
            >
              {isPass ? "ok" : `−${issue.penalty}`}
            </span>
            {!isPass &&
              (open ? (
                <Minus className="h-3 w-3 text-ink-subtle" strokeWidth={2} />
              ) : (
                <Plus className="h-3 w-3 text-ink-subtle" strokeWidth={2} />
              ))}
            {isPass && <span className="w-3" />}
          </span>
        </span>
      </button>

      {open && !isPass && (
        <div className="animate-in-fade flex items-stretch gap-0 bg-sunken">
          <Tick tone={tone} className="opacity-40" />
          <div className="flex-1 space-y-4 px-4 py-4 pl-[3.25rem]">
            <Detail label="Why it costs you">{issue.why}</Detail>
            <Detail label="What to do">{issue.fix}</Detail>
            {issue.evidence && (
              <Detail label="Found on the page">
                <span className="font-mono text-2xs">{issue.evidence}</span>
              </Detail>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4">
      <div className="label pt-0.5">{label}</div>
      <p className="max-w-measure text-xs leading-relaxed text-ink-muted">{children}</p>
    </div>
  );
}

export function IssueList({
  issues,
  emptyLabel,
}: {
  issues: Issue[];
  emptyLabel: string;
}) {
  if (!issues.length) return <EmptyState title={emptyLabel} />;
  return (
    <div className="stagger">
      {issues.map((issue, i) => (
        <IssueRow key={issue.id} issue={issue} index={i} />
      ))}
    </div>
  );
}

export function SeveritySummary({ issues }: { issues: Issue[] }) {
  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    warning: issues.filter((i) => i.severity === "warning").length,
    pass: issues.filter((i) => i.severity === "pass").length,
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(["critical", "warning", "pass"] as const).map((key) => (
        <Badge key={key} tone={severityTone(key)} mono>
          {counts[key]} {SEVERITY_LABEL[key].toLowerCase()}
        </Badge>
      ))}
    </div>
  );
}
