import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  Gauge,
  SlidersHorizontal,
  SwatchBook,
  Moon,
  Sun,
  Sparkles,
  Database,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

const NAV = [
  { href: "/", label: "Audits", icon: Gauge },
  { href: "/rubric", label: "Rubric", icon: SlidersHorizontal },
  { href: "/system", label: "Design system", icon: SwatchBook },
];

function useTheme() {
  const [dark, setDark] = React.useState(
    () => document.documentElement.classList.contains("dark"),
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

export function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-accent">
        <span className="font-mono text-2xs font-bold text-accent-on">CL</span>
      </div>
      <span className="text-sm font-semibold tracking-tight text-ink">
        Conversion Lab
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { dark, toggle } = useTheme();
  const { data: config } = useQuery({ queryKey: ["config"], queryFn: api.config });

  return (
    <div className="min-h-screen bg-bg">
      {/* Rail on desktop, top bar on small screens. */}
      <aside className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:inset-y-0 lg:right-auto lg:h-auto lg:w-rail lg:flex-col lg:items-stretch lg:justify-start lg:border-b-0 lg:border-r lg:px-0 lg:py-4">
        <div className="lg:px-4">
          <Link href="/" className="inline-block">
            <Wordmark />
          </Link>
        </div>

        <nav className="flex items-center gap-1 lg:mt-6 lg:flex-col lg:items-stretch lg:gap-0.5 lg:px-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm font-medium",
                  "transition-colors duration-fast ease-ease",
                  active
                    ? "bg-surface-active text-ink"
                    : "text-ink-muted hover:bg-surface-hover hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 lg:mt-auto lg:flex-col lg:items-stretch lg:gap-3 lg:px-4">
          {config && (
            <div className="hidden lg:flex lg:flex-col lg:gap-1.5">
              <Badge tone={config.aiEnabled ? "accent" : "neutral"}>
                <Sparkles className="h-2.5 w-2.5" strokeWidth={2} />
                {config.aiEnabled ? "Copy layer on" : "Copy layer off"}
              </Badge>
              <Badge tone="neutral">
                <Database className="h-2.5 w-2.5" strokeWidth={2} />
                {config.storage === "postgres" ? "Postgres" : "In-memory"}
              </Badge>
            </div>
          )}
          <button
            onClick={toggle}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-ease hover:bg-surface-hover hover:text-ink lg:w-full lg:justify-start lg:gap-2.5 lg:px-2.5 lg:text-sm"
          >
            {dark ? (
              <Sun className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            ) : (
              <Moon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            )}
            <span className="hidden lg:inline">{dark ? "Light" : "Dark"}</span>
          </button>
        </div>
      </aside>

      <main className="pt-14 lg:pl-rail lg:pt-0">
        <div className="mx-auto max-w-shell px-4 py-6 lg:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1.5 text-2xs font-semibold uppercase tracking-[0.12em] text-accent">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
