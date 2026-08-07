import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import type { Severity } from "@shared/schema";

/**
 * tailwind-merge only knows the stock scales. Our custom font sizes (d1-d6,
 * 2xs, md) and custom colours (ink, accent, critical, warn, pass, info) both
 * look like `text-*`, so out of the box it treats them as one conflicting
 * group and keeps whichever came last. In practice that meant
 * `cn("text-d6", "text-pass")` silently dropped the size and rendered every
 * score at body-text size. Teaching it the two groups fixes it everywhere.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["2xs", "xs", "sm", "base", "md", "lg", "d1", "d2", "d3", "d4", "d5", "d6"] },
      ],
      "text-color": [
        {
          text: [
            "ink",
            "ink-muted",
            "ink-subtle",
            "ink-inverse",
            "accent",
            "accent-hover",
            "accent-on",
            "critical",
            "warn",
            "pass",
            "info",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** Score bands drive every colour decision in the app. One place to change. */
export function scoreTone(score: number): "critical" | "warn" | "pass" {
  if (score < 60) return "critical";
  if (score < 80) return "warn";
  return "pass";
}

export const TONE_TEXT = {
  critical: "text-critical",
  warn: "text-warn",
  pass: "text-pass",
} as const;

export const TONE_BG = {
  critical: "bg-critical",
  warn: "bg-warn",
  pass: "bg-pass",
} as const;

export const TONE_SOFT = {
  critical: "bg-critical-soft",
  warn: "bg-warn-soft",
  pass: "bg-pass-soft",
} as const;

export const TONE_BORDER = {
  critical: "border-critical",
  warn: "border-warn",
  pass: "border-pass",
} as const;

export function severityTone(s: Severity): "critical" | "warn" | "pass" {
  return s === "critical" ? "critical" : s === "warning" ? "warn" : "pass";
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  warning: "Warning",
  pass: "Passing",
};

export function bytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
