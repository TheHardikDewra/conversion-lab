import type { Config } from "tailwindcss";

/**
 * Tailwind is a thin mapping over the CSS variables in client/src/index.css.
 * Nothing here hardcodes a colour — rebranding happens in one place.
 */
const config: Config = {
  darkMode: "class",
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        sunken: "hsl(var(--bg-sunken))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised: "hsl(var(--surface-raised))",
          hover: "hsl(var(--surface-hover))",
          active: "hsl(var(--surface-active))",
        },
        line: {
          DEFAULT: "hsl(var(--border))",
          strong: "hsl(var(--border-strong))",
        },
        ink: {
          DEFAULT: "hsl(var(--text))",
          muted: "hsl(var(--text-muted))",
          subtle: "hsl(var(--text-subtle))",
          inverse: "hsl(var(--text-inverse))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          hover: "hsl(var(--accent-hover))",
          quiet: "hsl(var(--accent-quiet))",
          on: "hsl(var(--accent-on))",
        },
        critical: {
          DEFAULT: "hsl(var(--signal-critical))",
          soft: "hsl(var(--signal-critical-soft))",
        },
        warn: {
          DEFAULT: "hsl(var(--signal-warn))",
          soft: "hsl(var(--signal-warn-soft))",
        },
        pass: {
          DEFAULT: "hsl(var(--signal-pass))",
          soft: "hsl(var(--signal-pass-soft))",
        },
        info: {
          DEFAULT: "hsl(var(--signal-info))",
          soft: "hsl(var(--signal-info-soft))",
        },
      },
      fontFamily: {
        sans: [
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "Geist Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        // A tight modular scale. Line heights are baked in.
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
        xs: ["0.75rem", { lineHeight: "1.125rem", letterSpacing: "0.01em" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.875rem", { lineHeight: "1.4375rem" }],
        md: ["0.9375rem", { lineHeight: "1.5rem" }],
        lg: ["1.0625rem", { lineHeight: "1.625rem", letterSpacing: "-0.01em" }],
        xl: ["1.3125rem", { lineHeight: "1.875rem", letterSpacing: "-0.015em" }],
        "2xl": ["1.75rem", { lineHeight: "2.125rem", letterSpacing: "-0.02em" }],
        "3xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.025em" }],
        "4xl": ["3rem", { lineHeight: "3.125rem", letterSpacing: "-0.03em" }],
        "5xl": ["4rem", { lineHeight: "4rem", letterSpacing: "-0.035em" }],
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      spacing: {
        // 4px rhythm, named for intent
        gutter: "1.5rem",
        rail: "15rem",
      },
      maxWidth: {
        shell: "78rem",
        prose: "42rem",
      },
      transitionTimingFunction: {
        ease: "var(--ease)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
      boxShadow: {
        // Deliberately minimal. Elevation comes from borders and surface steps,
        // never from glows. Exactly one shadow exists, for floating layers.
        pop: "0 1px 2px hsl(0 0% 0% / 0.06), 0 8px 24px hsl(0 0% 0% / 0.10)",
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
