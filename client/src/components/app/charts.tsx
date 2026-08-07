import { cn, scoreTone, TONE_TEXT, TONE_BG, TONE_BORDER } from "@/lib/utils";

/* ==========================================================================
   MARKS
   --------------------------------------------------------------------------
   Every mark here is hand-drawn. No charting library, no gradients, no curve
   smoothing, and no donuts. The score reads as an instrument reading taken
   against a calibrated scale, because that is what it is.
   ========================================================================== */

const MAJOR = [0, 20, 40, 60, 80, 100];

/**
 * The hero. A typeset figure over a calibrated rail.
 *
 * Built from elements rather than SVG on purpose: the rail is full-width and
 * fluid, and a stretched viewBox would distort both the ticks and the labels.
 * This way every hairline lands on a real device pixel at any width.
 */
export function ScoreGauge({
  score,
  grade,
  animate = true,
}: {
  score: number;
  grade: string;
  animate?: boolean;
}) {
  const tone = scoreTone(score);
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div
      className="w-full"
      role="img"
      aria-label={`Score ${score} out of 100, grade ${grade}`}
    >
      <div className="flex items-end gap-5">
        <span className={cn("display text-d6 tnum leading-none", TONE_TEXT[tone])}>
          {score}
        </span>
        <div className="mb-3 flex flex-col gap-1.5">
          <span className="label">Grade</span>
          <span className="display text-d2 leading-none text-ink">{grade}</span>
        </div>
      </div>

      {/* Calibrated rail */}
      <div className="relative mt-7 h-8 w-full">
        <div className="absolute inset-x-0 bottom-0 h-px bg-rule-strong" />

        <div
          className={cn("absolute bottom-0 left-0 h-[3px] origin-left", TONE_BG[tone])}
          style={{
            width: `${clamped}%`,
            animation: animate ? "gauge-fill 900ms var(--ease-out) both" : undefined,
          }}
        />

        {Array.from({ length: 21 }, (_, i) => i * 5).map((t) => {
          const major = MAJOR.includes(t);
          return (
            <div
              key={t}
              className={cn(
                "absolute bottom-0 w-px",
                major ? "h-3 bg-rule-strong" : "h-1.5 bg-rule",
              )}
              style={{ left: `${t}%` }}
              aria-hidden="true"
            />
          );
        })}

        {/* The reading */}
        <div
          className={cn("absolute bottom-0 h-8 w-px", TONE_BG[tone])}
          style={{
            left: `${clamped}%`,
            animation: animate ? "gauge-mark 900ms var(--ease-out) both" : undefined,
          }}
          aria-hidden="true"
        />
      </div>

      <div className="mt-2 flex justify-between">
        {MAJOR.map((t) => (
          <span key={t} className="font-mono text-2xs tnum text-ink-subtle">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Compact reading for list rows. Typeset figure over a short tone rule. */
export function ScoreMark({ score, grade }: { score: number; grade: string }) {
  const tone = scoreTone(score);
  return (
    <div className="flex w-12 shrink-0 flex-col items-start">
      <span className={cn("display text-d2 tnum leading-none", TONE_TEXT[tone])}>
        {score}
      </span>
      <span className="mt-2 block h-[2px] w-full bg-sunken">
        <span
          className={cn("block h-full", TONE_BG[tone])}
          style={{ width: `${Math.max(2, score)}%` }}
        />
      </span>
      <span className="mt-1 font-mono text-2xs text-ink-subtle">{grade}</span>
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
  index,
}: {
  label: string;
  score: number;
  weight: number;
  issueCount: number;
  onClick?: () => void;
  active?: boolean;
  index?: number;
}) {
  const tone = scoreTone(score);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "block w-full px-5 py-3 text-left transition-colors duration-fast ease-ease",
        onClick && "hover:bg-surface-hover",
        active && "bg-surface-active",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex min-w-0 items-baseline gap-2">
          {index !== undefined && (
            <span className="font-mono text-2xs tnum text-ink-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span className="truncate text-sm text-ink">{label}</span>
        </span>
        <span className={cn("shrink-0 font-mono text-sm tnum font-medium", TONE_TEXT[tone])}>
          {score}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div className="relative h-[3px] flex-1 bg-sunken">
          <div
            className={cn("absolute inset-y-0 left-0", TONE_BG[tone])}
            style={{ width: `${Math.max(1, score)}%` }}
          />
        </div>
        <span className="w-14 shrink-0 text-right font-mono text-2xs tnum text-ink-subtle">
          {issueCount > 0 ? `${issueCount} open` : "clear"}
        </span>
        <span className="w-7 shrink-0 text-right font-mono text-2xs tnum text-ink-subtle">
          {weight}%
        </span>
      </div>
    </Tag>
  );
}

/**
 * Score history. Straight segments between real points, because a curve
 * through six audits invents five values that were never measured.
 */
export function Sparkline({
  points,
  width = 240,
  height = 48,
}: {
  points: number[];
  width?: number;
  height?: number;
}) {
  if (points.length < 2) {
    return (
      <div style={{ height }} className="flex items-center text-2xs text-ink-subtle">
        Not enough audits yet
      </div>
    );
  }

  const pad = 5;
  const min = Math.min(...points, 50);
  const max = Math.max(...points, 100);
  const span = Math.max(1, max - min);

  const coords = points.map((value, i) => {
    const x = pad + (i / (points.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (value - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  const path = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const last = coords[coords.length - 1];
  const tone = scoreTone(points[points.length - 1]);

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--text-subtle))"
        strokeWidth="1.25"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        shapeRendering="geometricPrecision"
      />
      {coords.map(([x, y], i) => (
        <rect key={i} x={x - 1.25} y={y - 1.25} width="2.5" height="2.5" fill="hsl(var(--text-subtle))" />
      ))}
      <rect
        x={last[0] - 2.5}
        y={last[1] - 2.5}
        width="5"
        height="5"
        className={TONE_TEXT[tone]}
        fill="currentColor"
      />
    </svg>
  );
}

/** Counts per band. Flat bars, stated buckets, no legend to decode. */
export function ScoreHistogram({ scores }: { scores: number[] }) {
  const buckets = [
    { label: "0-59", tone: "critical" as const, test: (s: number) => s < 60 },
    { label: "60-79", tone: "warn" as const, test: (s: number) => s >= 60 && s < 80 },
    { label: "80-100", tone: "pass" as const, test: (s: number) => s >= 80 },
  ];
  const counts = buckets.map((b) => scores.filter(b.test).length);
  const max = Math.max(1, ...counts);

  return (
    <div className="flex items-end gap-4 px-5 py-4" style={{ height: 96 }}>
      {buckets.map((bucket, i) => (
        <div key={bucket.label} className="flex flex-1 flex-col justify-end gap-2">
          <span className="font-mono text-xs tnum text-ink">{counts[i]}</span>
          {/* An empty bucket still gets a rule, so the axis stays readable
              rather than the bar simply vanishing. */}
          <div
            className={cn(
              "w-full",
              counts[i] === 0 ? "border-t border-dashed" : "",
              counts[i] === 0 ? TONE_BORDER[bucket.tone] : TONE_BG[bucket.tone],
            )}
            style={{
              height: counts[i] === 0 ? 0 : `${Math.max(4, (counts[i] / max) * 34)}px`,
              opacity: counts[i] === 0 ? 0.5 : 1,
            }}
          />
          <span className="font-mono text-2xs tnum text-ink-subtle">{bucket.label}</span>
        </div>
      ))}
    </div>
  );
}
