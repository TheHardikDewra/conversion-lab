import { cn, scoreTone, TONE_TEXT, TONE_BG } from "@/lib/utils";

/* ==========================================================================
   CHARTS
   --------------------------------------------------------------------------
   Hand-drawn SVG rather than a charting library. Three reasons: the bundle
   stays small, the marks stay crisp at every size, and a remixer can read the
   geometry instead of a config object. No gradients and no curve smoothing - a value is drawn where it actually sits.
   ========================================================================== */

export function ScoreRing({
  score,
  grade,
  size = 168,
  animate = true,
}: {
  score: number;
  grade: string;
  size?: number;
  animate?: boolean;
}) {
  const stroke = size < 80 ? 5 : 9;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const tone = scoreTone(score);

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score ${score} out of 100, grade ${grade}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className={TONE_TEXT[tone]}
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={`${filled} ${circumference - filled}`}
          style={
            animate
              ? ({
                  ["--dash-total" as string]: `${circumference}`,
                  animation: "sweep 1.1s var(--ease) both",
                } as React.CSSProperties)
              : undefined
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-mono tnum font-semibold leading-none text-ink",
            size < 80 ? "text-sm" : "text-4xl",
          )}
        >
          {score}
        </span>
        {size >= 80 && (
          <span className="mt-1.5 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Grade {grade}
          </span>
        )}
      </div>
    </div>
  );
}

export function CategoryBar({
  label,
  score,
  weight,
  issueCount,
  onClick,
  active,
}: {
  label: string;
  score: number;
  weight: number;
  issueCount: number;
  onClick?: () => void;
  active?: boolean;
}) {
  const tone = scoreTone(score);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "block w-full px-4 py-2.5 text-left transition-colors duration-fast ease-ease",
        onClick && "hover:bg-surface-hover",
        active && "bg-surface-active",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="flex items-baseline gap-2">
          {issueCount > 0 && (
            <span className="font-mono text-2xs tnum text-ink-subtle">
              {issueCount} issue{issueCount === 1 ? "" : "s"}
            </span>
          )}
          <span className={cn("font-mono text-sm tnum font-semibold", TONE_TEXT[tone])}>
            {score}
          </span>
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-sunken">
          <div
            className={cn("h-full rounded-full transition-[width] duration-slow ease-ease", TONE_BG[tone])}
            style={{ width: `${Math.max(1, score)}%` }}
          />
        </div>
        <span className="w-9 shrink-0 text-right font-mono text-2xs tnum text-ink-subtle">
          {weight}%
        </span>
      </div>
    </Tag>
  );
}

/**
 * Score history. Straight segments between real points - no interpolation,
 * because a curve through five audits invents four values that never existed.
 */
export function Sparkline({
  points,
  width = 220,
  height = 44,
}: {
  points: number[];
  width?: number;
  height?: number;
}) {
  if (points.length < 2) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center text-2xs text-ink-subtle"
      >
        Not enough audits yet
      </div>
    );
  }

  const pad = 4;
  const min = Math.min(...points, 40);
  const max = Math.max(...points, 100);
  const span = Math.max(1, max - min);

  const coords = points.map((value, i) => {
    const x = pad + (i / (points.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (value - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];
  const tone = scoreTone(points[points.length - 1]);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--border-strong))"
        strokeWidth="1.5"
        strokeLinejoin="round"
        shapeRendering="geometricPrecision"
      />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.75" fill="hsl(var(--border-strong))" />
      ))}
      <circle cx={last[0]} cy={last[1]} r="3" className={TONE_TEXT[tone]} fill="currentColor" />
    </svg>
  );
}

/** A count of audits per ten-point band. Flat bars, honest buckets. */
export function ScoreHistogram({ scores }: { scores: number[] }) {
  const buckets = [
    { label: "0-59", tone: "critical" as const, test: (s: number) => s < 60 },
    { label: "60-79", tone: "warn" as const, test: (s: number) => s >= 60 && s < 80 },
    { label: "80-100", tone: "pass" as const, test: (s: number) => s >= 80 },
  ];
  const counts = buckets.map((b) => scores.filter(b.test).length);
  const max = Math.max(1, ...counts);

  return (
    <div className="flex items-end gap-3 px-4 py-3" style={{ height: 88 }}>
      {buckets.map((bucket, i) => (
        <div key={bucket.label} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="font-mono text-xs tnum text-ink">{counts[i]}</span>
          <div
            className={cn("w-full rounded-xs", TONE_BG[bucket.tone])}
            style={{ height: `${Math.max(2, (counts[i] / max) * 40)}px` }}
          />
          <span className="font-mono text-2xs tnum text-ink-subtle">{bucket.label}</span>
        </div>
      ))}
    </div>
  );
}
