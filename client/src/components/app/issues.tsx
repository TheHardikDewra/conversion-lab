import * as React from "react";
import { ChevronRight, Check } from "lucide-react";
import { CATEGORY_META, type Issue } from "@shared/schema";
import { cn, severityTone, SEVERITY_LABEL } from "@/lib/utils";
import { Badge, Dot, EmptyState } from "@/components/ui";

/**
 * Findings are the product. Everything here optimises for one thing: a reader
 * scanning the list should be able to tell what is broken, how much it costs,
 * and what to do, without expanding anything.
 */
export function IssueRow({ issue }: { issue: Issue }) {
  const [open, setOpen] = React.useState(false);
  const tone = severityTone(issue.severity);
  const isPass = issue.severity === "pass";

  return (
    <div className="border-b border-line last:border-b-0">
      <button
        onClick={() => !isPass && setOpen((v) => !v)}
        aria-expanded={isPass ? undefined : open}
        disabled={isPass}
        className={cn(
          "flex w-full items-start gap-3 px-4 py-3 text-left",
          "transition-colors duration-fast ease-ease",
          !isPass && "hover:bg-surface-hover",
        )}
      >
        <span className="mt-1.5 shrink-0">
          {isPass ? (
            <Check className="h-3.5 w-3.5 text-pass" strokeWidth={2.5} />
          ) : (
            <Dot tone={tone} />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={cn(
                "text-sm font-medium",
                isPass ? "text-ink-muted" : "text-ink",
              )}
            >
              {issue.title}
            </span>
            <Badge tone="neutral">{CATEGORY_META[issue.category].label}</Badge>
            {!isPass && (
              <Badge tone={tone} mono>
                −{issue.penalty}
              </Badge>
            )}
          </span>
          {issue.evidence && (
            <span className="mt-1 block truncate font-mono text-2xs text-ink-subtle">
              {issue.evidence}
            </span>
          )}
        </span>

        {!isPass && (
          <ChevronRight
            className={cn(
              "mt-1 h-4 w-4 shrink-0 text-ink-subtle transition-transform duration-fast ease-ease",
              open && "rotate-90",
            )}
            strokeWidth={1.75}
          />
        )}
      </button>

      {open && !isPass && (
        <div className="animate-in-fade space-y-3 border-t border-line bg-sunken px-4 py-3.5 pl-10">
          <Detail label="Why it costs you">{issue.why}</Detail>
          <Detail label="What to do">{issue.fix}</Detail>
          {issue.evidence && (
            <Detail label="Found on the page">
              <span className="font-mono text-2xs">{issue.evidence}</span>
            </Detail>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink-subtle">
        {label}
      </div>
      <p className="mt-1 max-w-prose text-xs leading-relaxed text-ink-muted">
        {children}
      </p>
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
  if (!issues.length) {
    return <EmptyState title={emptyLabel} />;
  }
  return (
    <div>
      {issues.map((issue) => (
        <IssueRow key={issue.id} issue={issue} />
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
