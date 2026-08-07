import * as React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   PRIMITIVES
   --------------------------------------------------------------------------
   Hand-rolled rather than pulled from a component library, because the point
   of this file is that a remixer can read it in one sitting and change it.
   Every colour here is a semantic token, so re-theming is done in index.css
   and nothing in this file needs to be touched.
   ========================================================================== */

/* ---------- Button ------------------------------------------------------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const BUTTON_VARIANTS = {
  primary: "bg-accent text-accent-on hover:bg-accent-hover border-transparent",
  secondary:
    "bg-surface text-ink border-line hover:bg-surface-hover hover:border-line-strong",
  ghost: "bg-transparent text-ink-muted border-transparent hover:bg-surface-hover hover:text-ink",
  danger: "bg-transparent text-critical border-line hover:bg-critical-soft",
} as const;

const BUTTON_SIZES = {
  sm: "h-7 px-2.5 text-xs gap-1.5 rounded-sm",
  md: "h-9 px-3.5 text-sm gap-2 rounded-md",
  lg: "h-11 px-5 text-md gap-2 rounded-md",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center border font-medium whitespace-nowrap",
        "transition-colors duration-fast ease-ease",
        "disabled:opacity-45 disabled:pointer-events-none",
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
      className={cn("h-3.5 w-3.5 shrink-0 animate-spin", className)}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path
        d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Surfaces ----------------------------------------------------- */

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border border-line bg-surface rounded-md", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-line px-4 py-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-ink-subtle leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------- Text --------------------------------------------------------- */

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-2xs font-semibold uppercase tracking-[0.12em] text-ink-subtle",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Badge -------------------------------------------------------- */

type Tone = "neutral" | "critical" | "warn" | "pass" | "info" | "accent";

const BADGE_TONES: Record<Tone, string> = {
  neutral: "bg-sunken text-ink-muted border-line",
  critical: "bg-critical-soft text-critical border-transparent",
  warn: "bg-warn-soft text-warn border-transparent",
  pass: "bg-pass-soft text-pass border-transparent",
  info: "bg-info-soft text-info border-transparent",
  accent: "bg-accent-quiet text-accent border-transparent",
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
        "inline-flex items-center gap-1 rounded-xs border px-1.5 py-0.5 text-2xs font-semibold",
        mono && "font-mono tnum",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone }: { tone: Tone }) {
  const map: Record<Tone, string> = {
    neutral: "bg-ink-subtle",
    critical: "bg-critical",
    warn: "bg-warn",
    pass: "bg-pass",
    info: "bg-info",
    accent: "bg-accent",
  };
  return <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", map[tone])} />;
}

/* ---------- Input -------------------------------------------------------- */

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-9 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink",
      "placeholder:text-ink-subtle",
      "transition-colors duration-fast ease-ease",
      "hover:border-line-strong focus:border-accent focus:outline-none",
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
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-medium text-ink">
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
    <div role="tablist" className="flex gap-0.5 border-b border-line overflow-x-auto">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative -mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium",
              "transition-colors duration-fast ease-ease",
              active
                ? "border-accent text-ink"
                : "border-transparent text-ink-subtle hover:text-ink",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 font-mono text-xs tnum text-ink-subtle">
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

export function Callout({
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
  const border: Record<Tone, string> = {
    neutral: "border-l-ink-subtle",
    critical: "border-l-critical",
    warn: "border-l-warn",
    pass: "border-l-pass",
    info: "border-l-info",
    accent: "border-l-accent",
  };
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-sm border border-line border-l-2 bg-surface px-3.5 py-3",
        border[tone],
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{title}</p>
        {children && (
          <div className="mt-1 text-xs leading-relaxed text-ink-muted">{children}</div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
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
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {children && (
        <p className="max-w-sm text-xs leading-relaxed text-ink-subtle">{children}</p>
      )}
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-sunken", className)}
      aria-hidden="true"
    />
  );
}

/* ---------- Layout ------------------------------------------------------- */

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
    <div className="px-4 py-3">
      <div className="text-2xs font-medium uppercase tracking-[0.1em] text-ink-subtle">
        {label}
      </div>
      <div className={cn("mt-1 font-mono text-xl tnum text-ink", tone)}>
        {value}
        {suffix && <span className="ml-0.5 text-sm text-ink-subtle">{suffix}</span>}
      </div>
    </div>
  );
}
