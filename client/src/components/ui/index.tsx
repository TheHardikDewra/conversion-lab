import * as React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   PRIMITIVES
   --------------------------------------------------------------------------
   Hand-rolled rather than pulled from a library, because the point of this
   file is that a remixer can read it in one sitting and change it.

   The structural idea: sections are separated by hairline rules and margin,
   not by nesting boxes inside boxes. A page should read as one sheet of
   paper with rules drawn on it.
   ========================================================================== */

/* ---------- Button ------------------------------------------------------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const BUTTON_VARIANTS = {
  primary:
    "bg-ink text-ink-inverse border-ink hover:bg-accent hover:border-accent hover:text-accent-on",
  secondary:
    "bg-transparent text-ink border-rule-strong hover:border-ink hover:bg-surface-hover",
  ghost:
    "bg-transparent text-ink-subtle border-transparent hover:text-ink hover:bg-surface-hover",
  danger:
    "bg-transparent text-critical border-rule hover:border-critical hover:bg-critical-soft",
} as const;

const BUTTON_SIZES = {
  sm: "h-7 px-2.5 text-2xs gap-1.5 tracking-[0.06em] uppercase font-medium",
  md: "h-9 px-4 text-xs gap-2 tracking-[0.05em] uppercase font-medium",
  lg: "h-11 px-6 text-sm gap-2 tracking-[0.04em] uppercase font-medium",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "secondary", size = "md", loading, children, disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xs border",
        "transition-colors duration-fast ease-ease",
        "disabled:opacity-30 disabled:pointer-events-none",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-3 w-3 shrink-0 animate-spin", className)}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Sheet: the one container ------------------------------------- */

/**
 * There is deliberately only one surface component. Hierarchy comes from
 * rules and spacing, so a nested stack of bordered cards never happens.
 */
export function Sheet({
  className,
  children,
  flush,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { flush?: boolean }) {
  return (
    <div
      className={cn(
        "border border-rule bg-surface",
        flush ? "rounded-none" : "rounded-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  label,
  title,
  note,
  action,
  className,
}: {
  label?: string;
  title?: React.ReactNode;
  note?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 rule-b px-5 py-3.5",
        className,
      )}
    >
      <div className="min-w-0">
        {label && <div className="label">{label}</div>}
        {title && (
          <h2 className="mt-1 text-base font-medium leading-snug text-ink">{title}</h2>
        )}
        {note && <p className="mt-1 text-xs leading-relaxed text-ink-subtle">{note}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------- Text --------------------------------------------------------- */

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("label", className)}>{children}</div>;
}

/**
 * Display sizes are looked up rather than interpolated. Tailwind scans source
 * for complete class strings, so `text-${size}` would be purged from the
 * production build and every heading would silently fall back to 16px.
 */
export const DISPLAY_SIZE = {
  d1: "text-d1",
  d2: "text-d2",
  d3: "text-d3",
  d4: "text-d4",
  d5: "text-d5",
  d6: "text-d6",
} as const;

export type DisplaySize = keyof typeof DISPLAY_SIZE;

export function Display({
  children,
  size = "d2",
  className,
  as: Tag = "h1",
}: {
  children: React.ReactNode;
  size?: DisplaySize;
  className?: string;
  as?: "h1" | "h2" | "div" | "span" | "p";
}) {
  return <Tag className={cn("display", DISPLAY_SIZE[size], className)}>{children}</Tag>;
}

/* ---------- Badge -------------------------------------------------------- */

type Tone = "neutral" | "critical" | "warn" | "pass" | "info" | "accent";

const BADGE_TONES: Record<Tone, string> = {
  neutral: "text-ink-subtle border-rule",
  critical: "text-critical border-critical/35 bg-critical-soft",
  warn: "text-warn border-warn/35 bg-warn-soft",
  pass: "text-pass border-pass/35 bg-pass-soft",
  info: "text-info border-info/35 bg-info-soft",
  accent: "text-accent border-accent/35 bg-accent-quiet",
};

export function Badge({
  tone = "neutral",
  children,
  className,
  mono,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xs border px-1.5 py-px text-2xs font-medium",
        mono ? "font-mono tnum tracking-normal" : "uppercase tracking-[0.08em]",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A short colour bar. Reads faster than a dot at a glance. */
export function Tick({ tone, className }: { tone: Tone; className?: string }) {
  const map: Record<Tone, string> = {
    neutral: "bg-rule-strong",
    critical: "bg-critical",
    warn: "bg-warn",
    pass: "bg-pass",
    info: "bg-info",
    accent: "bg-accent",
  };
  return <span className={cn("block h-full w-[3px] shrink-0", map[tone], className)} />;
}

/* ---------- Input -------------------------------------------------------- */

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full border-0 border-b border-rule-strong bg-transparent px-0 text-lg text-ink",
      "placeholder:text-ink-subtle placeholder:font-normal",
      "transition-colors duration-fast ease-ease",
      "hover:border-ink focus:border-accent focus:outline-none focus:ring-0",
      "disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="label block">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-subtle">{hint}</p>}
    </div>
  );
}

/* ---------- Tabs --------------------------------------------------------- */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="flex gap-6 overflow-x-auto rule-b px-5">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative -mb-px whitespace-nowrap border-b py-3 text-2xs uppercase tracking-[0.12em]",
              "transition-colors duration-fast ease-ease",
              active
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-medium text-ink-subtle hover:text-ink",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 font-mono tnum tracking-normal text-ink-subtle">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Feedback ----------------------------------------------------- */

export function Note({
  tone = "info",
  title,
  children,
  action,
}: {
  tone?: Tone;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  const bar: Record<Tone, string> = {
    neutral: "bg-rule-strong",
    critical: "bg-critical",
    warn: "bg-warn",
    pass: "bg-pass",
    info: "bg-info",
    accent: "bg-accent",
  };
  return (
    <div className="flex items-stretch gap-0 border border-rule bg-surface">
      <span className={cn("w-[3px] shrink-0", bar[tone])} />
      <div className="flex flex-1 items-start justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{title}</p>
          {children && (
            <div className="mt-1 max-w-measure text-xs leading-relaxed text-ink-muted">
              {children}
            </div>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
      <p className="display text-d1 text-ink">{title}</p>
      {children && (
        <p className="max-w-sm text-xs leading-relaxed text-ink-subtle">{children}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-sunken", className)} aria-hidden="true" />
  );
}

/* ---------- Data --------------------------------------------------------- */

export function Stat({
  label,
  value,
  suffix,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  suffix?: string;
  tone?: string;
}) {
  return (
    <div className="px-5 py-4">
      <div className="label">{label}</div>
      <div className={cn("display mt-2 text-d3 tnum text-ink", tone)}>
        {value}
        {suffix && (
          <span className="ml-1 font-sans text-xs tracking-normal text-ink-subtle">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/** A key/value line. The dotted leader is what makes a list read as a table. */
export function DataRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-2 px-5 py-2">
      <dt className="shrink-0 text-xs text-ink-muted">{label}</dt>
      <span
        className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-rule-strong"
        aria-hidden="true"
      />
      <dd className="shrink-0 font-mono text-xs tnum font-medium text-ink">{value}</dd>
    </div>
  );
}
