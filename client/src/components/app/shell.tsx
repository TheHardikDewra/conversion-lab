import * as React from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { DISPLAY_SIZE, type DisplaySize } from "@/components/ui";

const NAV = [
  { href: "/", label: "Audits" },
  { href: "/rubric", label: "Rubric" },
  { href: "/system", label: "System" },
];

function useTheme() {
  const [dark, setDark] = React.useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const toggle = React.useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("cl-theme", next ? "dark" : "light");
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);
  return { dark, toggle };
}

/**
 * The wordmark. A typeset lockup rather than an initials-in-a-rounded-square,
 * with a ruled underline that echoes the calibrated rail the scores sit on.
 */
export function Wordmark({ compact }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-2 leading-none">
      <span className="display text-d1 leading-none text-ink">
        Conversion
        <span className="italic text-accent"> Lab</span>
      </span>
      {!compact && (
        <span className="mb-[3px] hidden h-2 w-8 border-b border-t border-rule-strong sm:block" />
      )}
    </span>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { dark, toggle } = useTheme();
  const { data: config } = useQuery({ queryKey: ["config"], queryFn: api.config });

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 rule-b bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-6 px-5 lg:px-10">
          <Link href="/" className="shrink-0">
            <Wordmark />
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            {NAV.map(({ href, label }) => {
              const active =
                href === "/" ? location === "/" : location.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative px-2.5 py-1.5 text-2xs uppercase tracking-[0.12em]",
                    "transition-colors duration-fast ease-ease",
                    active
                      ? "font-semibold text-ink"
                      : "font-medium text-ink-subtle hover:text-ink",
                  )}
                >
                  {label}
                  {active && (
                    <span className="absolute inset-x-2.5 -bottom-px h-px bg-accent" />
                  )}
                </Link>
              );
            })}

            <span className="mx-1 hidden h-4 w-px bg-rule sm:block" />

            <button
              onClick={toggle}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              className="flex h-7 w-7 items-center justify-center text-ink-subtle transition-colors duration-fast ease-ease hover:text-ink"
            >
              {dark ? (
                <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />
              ) : (
                <Moon className="h-3.5 w-3.5" strokeWidth={1.5} />
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-5 py-10 lg:px-10 lg:py-14">{children}</main>

      <footer className="mx-auto max-w-shell px-5 pb-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 rule-t pt-5">
          <span className="font-mono text-2xs text-ink-subtle">
            {config
              ? `${config.ruleCount} checks · ${
                  config.aiEnabled ? "copy layer on" : "copy layer off"
                } · ${config.storage === "postgres" ? "postgres" : "in-memory"}`
              : ""}
          </span>
          <span className="font-mono text-2xs text-ink-subtle">
            Conversion Lab · MIT
          </span>
        </div>
      </footer>
    </div>
  );
}

/**
 * The page masthead. A label, a display title, and a rule. Every screen opens
 * the same way, which is what makes the set read as one publication.
 */
export function PageHeader({
  label,
  title,
  description,
  action,
  size = "d3",
}: {
  label?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  size?: DisplaySize;
}) {
  return (
    <header className="mb-10 rule-b pb-6">
      {label && <div className="label mb-3">{label}</div>}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h1 className={cn("display max-w-measure text-ink", DISPLAY_SIZE[size])}>
          {title}
        </h1>
        {action && <div className="shrink-0 pb-1">{action}</div>}
      </div>
      {description && (
        <p className="mt-4 max-w-measure text-md leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </header>
  );
}
