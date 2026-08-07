import type { Config } from "tailwindcss";

/**
 * Tailwind is a thin mapping over the CSS variables in client/src/index.css.
 * Nothing here hardcodes a colour, so rebranding happens in one place.
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
        rule: {
          DEFAULT: "hsl(var(--rule))",
          strong: "hsl(var(--rule-strong))",
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
        serif: ["Instrument Serif", "ui-serif", "Georgia", "serif"],
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
        // Editorial scale: big jumps at the display end, tight steps at the
        // interface end. The gap between a title and body text is the whole
        // point, so display sizes are deliberately far from 14px.
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
        xs: ["0.75rem", { lineHeight: "1.15rem", letterSpacing: "0.005em" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.875rem", { lineHeight: "1.45rem" }],
        md: ["0.9375rem", { lineHeight: "1.55rem" }],
        lg: ["1.0625rem", { lineHeight: "1.6rem", letterSpacing: "-0.008em" }],
        // Display steps, for Instrument Serif.
        d1: ["1.5rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        d2: ["2rem", { lineHeight: "1", letterSpacing: "-0.015em" }],
        d3: ["2.75rem", { lineHeight: "0.98", letterSpacing: "-0.018em" }],
        d4: ["3.75rem", { lineHeight: "0.94", letterSpacing: "-0.02em" }],
        d5: ["6rem", { lineHeight: "0.86", letterSpacing: "-0.025em" }],
        d6: ["8.5rem", { lineHeight: "0.82", letterSpacing: "-0.03em" }],
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      spacing: {
        gutter: "1.5rem",
        rail: "13.5rem",
      },
      maxWidth: {
        shell: "82rem",
        prose: "38rem",
        measure: "46rem",
      },
      transitionTimingFunction: {
        ease: "var(--ease)",
        "ease-out": "var(--ease-out)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
      boxShadow: {
        // Elevation is borders and surface steps. Exactly one shadow exists,
        // for layers that genuinely float above the page.
        pop: "0 1px 2px hsl(0 0% 0% / 0.05), 0 10px 30px hsl(0 0% 0% / 0.10)",
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
