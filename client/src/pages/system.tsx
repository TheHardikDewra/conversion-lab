import * as React from "react";
import { Check } from "lucide-react";
import {
  Badge,
  Button,
  Callout,
  Card,
  CardHeader,
  Dot,
  EmptyState,
  Eyebrow,
  Field,
  Input,
  Skeleton,
  Spinner,
  Stat,
  Tabs,
} from "@/components/ui";
import { PageHeader } from "@/components/app/shell";
import { ScoreRing, CategoryBar, Sparkline, ScoreHistogram } from "@/components/app/charts";

/**
 * Living documentation. Every swatch below reads its value from the same CSS
 * variable the app uses, so this page cannot drift from the product - if a
 * token changes, this page changes with it.
 */
export default function System() {
  const [tab, setTab] = React.useState<"tokens" | "components" | "charts">("tokens");

  return (
    <>
      <PageHeader
        eyebrow="Design system"
        title="Tokens, primitives, and the rules behind them"
        description="Three layers: raw scales, semantic roles, and component knobs. Components only ever read the semantic layer, so re-theming the whole app means editing one block of CSS."
      />

      <div className="mb-6">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "tokens", label: "Tokens" },
            { value: "components", label: "Components" },
            { value: "charts", label: "Charts" },
          ]}
        />
      </div>

      {tab === "tokens" && <TokensTab />}
      {tab === "components" && <ComponentsTab />}
      {tab === "charts" && <ChartsTab />}
    </>
  );
}

/* ==========================================================================
   TOKENS
   ========================================================================== */

function TokensTab() {
  return (
    <div className="space-y-6">
      <Callout tone="accent" title="How to rebrand this template">
        Open <Mono>client/src/index.css</Mono>. Change the accent ramp and the
        neutral ramp under <Mono>:root</Mono>, then the same handful of values
        under <Mono>.dark</Mono>. Nothing in any component hardcodes a colour, so
        that is the entire job.
      </Callout>

      <Card>
        <CardHeader
          title="Surfaces and text"
          subtitle="Elevation comes from borders and background steps. There are no drop shadows in the interface and no glows anywhere."
        />
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Swatch name="--bg" label="Page" className="bg-bg" />
          <Swatch name="--surface" label="Surface" className="bg-surface" />
          <Swatch name="--bg-sunken" label="Sunken" className="bg-sunken" />
          <Swatch name="--border" label="Border" className="bg-line" />
          <Swatch name="--text" label="Ink" className="bg-ink" invert />
          <Swatch name="--text-muted" label="Ink muted" className="bg-ink-muted" invert />
          <Swatch name="--text-subtle" label="Ink subtle" className="bg-ink-subtle" invert />
          <Swatch name="--accent" label="Accent" className="bg-accent" invert />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Signal colours"
          subtitle="Reserved for data. Interface chrome stays achromatic so that a colour on screen always means something."
        />
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Swatch name="--signal-critical" label="Critical" className="bg-critical" invert />
          <Swatch name="--signal-warn" label="Warning" className="bg-warn" invert />
          <Swatch name="--signal-pass" label="Pass" className="bg-pass" invert />
          <Swatch name="--signal-info" label="Info" className="bg-info" invert />
        </div>
        <div className="border-t border-line px-4 py-3">
          <p className="text-xs leading-relaxed text-ink-muted">
            Each signal has a soft companion for backgrounds. Both are redefined
            under <Mono>.dark</Mono> rather than dimmed, so contrast holds in both
            themes instead of degrading in one.
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Type scale"
          subtitle="Geist for interface, Geist Mono for anything that is a number. Numerals are tabular everywhere so figures do not jitter as they change."
        />
        <div className="divide-y divide-line">
          {[
            ["text-4xl", "4xl · 48px", "Display"],
            ["text-2xl", "2xl · 28px", "Page title"],
            ["text-xl", "xl · 21px", "Section title"],
            ["text-lg", "lg · 17px", "Lead"],
            ["text-base", "base · 14px", "Body"],
            ["text-sm", "sm · 13px", "Interface"],
            ["text-xs", "xs · 12px", "Secondary"],
            ["text-2xs", "2xs · 11px", "Label"],
          ].map(([cls, label, role]) => (
            <div key={cls} className="flex items-baseline gap-4 px-4 py-3">
              <span className="w-28 shrink-0 font-mono text-2xs text-ink-subtle">
                {label}
              </span>
              <span className={`${cls} truncate font-medium tracking-tight text-ink`}>
                Conversion Lab
              </span>
              <span className="ml-auto shrink-0 text-2xs text-ink-subtle">{role}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader title="Radius" />
          <div className="flex flex-wrap gap-4 p-4">
            {[
              ["rounded-xs", "3px"],
              ["rounded-sm", "5px"],
              ["rounded-md", "8px"],
              ["rounded-lg", "12px"],
            ].map(([cls, px]) => (
              <div key={cls} className="text-center">
                <div className={`h-12 w-12 border border-line-strong bg-sunken ${cls}`} />
                <div className="mt-1.5 font-mono text-2xs text-ink-subtle">{px}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Motion" />
          <div className="divide-y divide-line">
            {[
              ["--dur-fast", "120ms", "Hover, focus"],
              ["--dur-base", "180ms", "Theme, colour"],
              ["--dur-slow", "260ms", "Entrance, bars"],
            ].map(([token, ms, use]) => (
              <div key={token} className="flex items-baseline justify-between px-4 py-2.5">
                <Mono>{token}</Mono>
                <span className="font-mono text-xs tnum text-ink">{ms}</span>
                <span className="text-2xs text-ink-subtle">{use}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-4 py-3">
            <p className="text-xs leading-relaxed text-ink-muted">
              Everything respects <Mono>prefers-reduced-motion</Mono>. One easing
              curve is used throughout.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Swatch({
  name,
  label,
  className,
  invert,
}: {
  name: string;
  label: string;
  className: string;
  invert?: boolean;
}) {
  return (
    <div className="bg-surface p-3">
      <div
        className={`h-14 w-full rounded-sm border border-line ${className} flex items-end p-1.5`}
      >
        <span
          className={`font-mono text-2xs ${invert ? "text-ink-inverse" : "text-ink-subtle"}`}
        >
          {label}
        </span>
      </div>
      <div className="mt-1.5 font-mono text-2xs text-ink-subtle">{name}</div>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-xs bg-sunken px-1 py-0.5 font-mono text-2xs text-ink">
      {children}
    </code>
  );
}

/* ==========================================================================
   COMPONENTS
   ========================================================================== */

function ComponentsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Buttons" subtitle="Four variants, three sizes, every state" />
        <div className="space-y-4 p-4">
          <Row label="Variants">
            <Button variant="primary">Run audit</Button>
            <Button variant="secondary">Visit page</Button>
            <Button variant="ghost">Clear</Button>
            <Button variant="danger">Delete</Button>
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="States">
            <Button variant="primary" loading>
              Auditing
            </Button>
            <Button disabled>Disabled</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </Row>
        </div>
      </Card>

      <Card>
        <CardHeader title="Badges and dots" subtitle="Status at a glance" />
        <div className="space-y-4 p-4">
          <Row label="Tones">
            <Badge tone="neutral">Sample</Badge>
            <Badge tone="critical">3 critical</Badge>
            <Badge tone="warn">7 warnings</Badge>
            <Badge tone="pass">14 passing</Badge>
            <Badge tone="info">Info</Badge>
            <Badge tone="accent">Copy layer</Badge>
          </Row>
          <Row label="Mono">
            <Badge tone="critical" mono>
              −26
            </Badge>
            <Badge tone="warn" mono>
              −12
            </Badge>
            <Badge tone="neutral" mono>
              84/100
            </Badge>
          </Row>
          <Row label="Dots">
            <Dot tone="critical" />
            <Dot tone="warn" />
            <Dot tone="pass" />
            <Dot tone="accent" />
            <Dot tone="neutral" />
          </Row>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Form controls" />
          <div className="space-y-4 p-4">
            <Field label="Landing page URL" hint="Any public http or https page.">
              <Input placeholder="yourlandingpage.com" />
            </Field>
            <Field label="Disabled">
              <Input placeholder="Not editable" disabled />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Feedback" />
          <div className="space-y-3 p-4">
            <Callout tone="critical" title="Could not reach that page">
              The site may be blocking automated requests.
            </Callout>
            <Callout tone="pass" title="Re-scored 6 audits" />
            <div className="flex items-center gap-3 pt-1">
              <Spinner />
              <span className="text-xs text-ink-muted">Inline spinner</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Stats" />
          <div className="grid grid-cols-2 divide-x divide-line">
            <Stat label="Average score" value={81} suffix="/100" />
            <Stat label="Open findings" value={54} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Empty state" />
          <EmptyState title="No audits yet" action={<Button size="sm">Run one</Button>}>
            Paste a landing page URL to run the first one.
          </EmptyState>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Eyebrow className="mb-2">{label}</Eyebrow>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/* ==========================================================================
   CHARTS
   ========================================================================== */

function ChartsTab() {
  return (
    <div className="space-y-6">
      <Callout tone="info" title="Drawn, not plotted">
        Every mark is hand-written SVG. No charting library, no gradients, and no
        curve smoothing - a line only bends where a real measurement sits.
      </Callout>

      <Card>
        <CardHeader
          title="Score ring"
          subtitle="Colour comes from the band, not the number. Under 60 critical, under 80 warning, above pass."
        />
        <div className="flex flex-wrap items-center justify-center gap-10 p-6">
          {[
            [42, "F"],
            [68, "D"],
            [84, "B"],
            [95, "A"],
          ].map(([score, grade]) => (
            <ScoreRing
              key={score}
              score={score as number}
              grade={grade as string}
              size={112}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 border-t border-line px-4 py-3">
          {[44, 56, 72].map((s) => (
            <ScoreRing key={s} score={s} grade="C" size={s < 60 ? 44 : 56} animate={false} />
          ))}
          <span className="text-xs text-ink-subtle">Compact variants</span>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Category bars" />
          <div className="divide-y divide-line">
            <CategoryBar label="Clarity" score={92} weight={22} issueCount={1} />
            <CategoryBar label="Offer" score={62} weight={18} issueCount={2} />
            <CategoryBar label="Friction" score={41} weight={16} issueCount={5} />
            <CategoryBar label="Craft" score={100} weight={10} issueCount={0} />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Sparkline" subtitle="Straight segments between real points" />
            <div className="p-4">
              <Sparkline points={[78, 84, 78, 84, 80, 88]} width={260} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Histogram" />
            <ScoreHistogram scores={[42, 58, 66, 72, 78, 84, 88, 91, 95]} />
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Rules the charts follow" />
        <ul className="divide-y divide-line">
          {[
            "Colour encodes a band, never a series. Two greens always mean the same thing.",
            "Tabular numerals everywhere, so a changing figure does not shift the layout.",
            "Every chart states its axis or its bucket in words, not a legend to decode.",
            "Below the point where a chart would mislead, it says so instead of drawing.",
            "Signal colours are re-tuned for dark mode rather than dimmed.",
          ].map((rule) => (
            <li key={rule} className="flex items-start gap-2.5 px-4 py-2.5">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
              <span className="text-xs leading-relaxed text-ink-muted">{rule}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
