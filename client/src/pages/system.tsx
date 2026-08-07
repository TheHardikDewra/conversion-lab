import * as React from "react";
import {
  Badge,
  Button,
  DataRow,
  EmptyState,
  Field,
  Input,
  Label,
  Note,
  SectionHead,
  Sheet,
  Skeleton,
  Spinner,
  Stat,
  Tabs,
  Tick,
} from "@/components/ui";
import { PageHeader } from "@/components/app/shell";
import { DISPLAY_SIZE } from "@/components/ui";
import {
  ScoreGauge,
  ScoreMark,
  CategoryBar,
  Sparkline,
  ScoreHistogram,
} from "@/components/app/charts";

/**
 * Living documentation. Every swatch reads its value from the same CSS
 * variable the app uses, so this page cannot drift from the product. Change a
 * token and this page changes with it.
 */
export default function System() {
  const [tab, setTab] = React.useState<"tokens" | "type" | "components" | "marks">(
    "tokens",
  );

  return (
    <>
      <PageHeader
        label="Design system"
        title={
          <>
            Tokens, primitives, and
            <br />
            <span className="italic text-ink-muted">the rules behind them.</span>
          </>
        }
        description="Three layers: raw scales, semantic roles, component knobs. Components only ever read the semantic layer, so re-theming the whole app means editing one block of CSS."
      />

      <Sheet className="overflow-hidden">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "tokens", label: "Tokens" },
            { value: "type", label: "Type" },
            { value: "components", label: "Components" },
            { value: "marks", label: "Marks" },
          ]}
        />
        <div className="p-5 lg:p-8">
          {tab === "tokens" && <TokensTab />}
          {tab === "type" && <TypeTab />}
          {tab === "components" && <ComponentsTab />}
          {tab === "marks" && <MarksTab />}
        </div>
      </Sheet>
    </>
  );
}

/* ==========================================================================
   TOKENS
   ========================================================================== */

function TokensTab() {
  return (
    <div className="space-y-10">
      <Note tone="accent" title="How to rebrand this template">
        Open <Mono>client/src/index.css</Mono>. Change the paper ramp, the ink ramp
        and the accent ramp under <Mono>:root</Mono>, then the handful of values
        under <Mono>.dark</Mono>. Nothing in any component hardcodes a colour, so
        that is the whole job.
      </Note>

      <Group
        label="Surfaces and text"
        note="Elevation comes from hairline rules and background steps. There is one shadow in the entire system and it is only used for floating layers."
      >
        <div className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
          <Swatch name="--bg" label="Page" className="bg-bg" />
          <Swatch name="--surface" label="Surface" className="bg-surface" />
          <Swatch name="--bg-sunken" label="Sunken" className="bg-sunken" />
          <Swatch name="--rule" label="Rule" className="bg-rule" />
          <Swatch name="--text" label="Ink" className="bg-ink" invert />
          <Swatch name="--text-muted" label="Ink muted" className="bg-ink-muted" invert />
          <Swatch name="--text-subtle" label="Ink subtle" className="bg-ink-subtle" invert />
          <Swatch name="--accent" label="Ultramarine" className="bg-accent" invert />
        </div>
      </Group>

      <Group
        label="Signal colours"
        note="Reserved for data. Interface chrome stays achromatic so that a colour on screen always means something."
      >
        <div className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
          <Swatch name="--signal-critical" label="Critical" className="bg-critical" invert />
          <Swatch name="--signal-warn" label="Warning" className="bg-warn" invert />
          <Swatch name="--signal-pass" label="Pass" className="bg-pass" invert />
          <Swatch name="--signal-info" label="Info" className="bg-info" invert />
        </div>
        <p className="mt-4 max-w-measure text-xs leading-relaxed text-ink-muted">
          Each signal has a soft companion for backgrounds. Both are redefined under{" "}
          <Mono>.dark</Mono> rather than dimmed, so contrast holds in both themes
          instead of degrading in one.
        </p>
      </Group>

      <div className="grid gap-10 sm:grid-cols-2">
        <Group label="Radius">
          <div className="flex flex-wrap gap-5">
            {[
              ["rounded-xs", "2px"],
              ["rounded-sm", "3px"],
              ["rounded-md", "5px"],
              ["rounded-lg", "8px"],
            ].map(([cls, px]) => (
              <div key={cls}>
                <div className={`h-12 w-12 border border-rule-strong bg-sunken ${cls}`} />
                <div className="mt-2 font-mono text-2xs text-ink-subtle">{px}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-measure text-xs leading-relaxed text-ink-muted">
            Deliberately tight. Soft corners read as friendly consumer software, and
            this is an instrument.
          </p>
        </Group>

        <Group label="Motion">
          <dl className="divide-y divide-rule border-y border-rule">
            <DataRow label="Hover, focus" value="110ms" />
            <DataRow label="Theme, colour" value="180ms" />
            <DataRow label="Entrance, gauge" value="300ms" />
            <DataRow label="Row stagger" value="26ms each" />
          </dl>
          <p className="mt-4 max-w-measure text-xs leading-relaxed text-ink-muted">
            Two easing curves, both defined once. Everything respects{" "}
            <Mono>prefers-reduced-motion</Mono>.
          </p>
        </Group>
      </div>
    </div>
  );
}

/* ==========================================================================
   TYPE
   ========================================================================== */

function TypeTab() {
  return (
    <div className="space-y-10">
      <Group
        label="Three voices"
        note="Instrument Serif carries display, Geist carries the interface, Geist Mono carries every number. The gap between them is what makes the hierarchy read."
      >
        <div className="divide-y divide-rule border-y border-rule">
          {[
            ["Instrument Serif", "display", "Nothing removes the risk of saying yes", "text-d2"],
            ["Geist", "interface", "Add one explicit risk reverser near the primary CTA.", "text-md font-sans"],
            ["Geist Mono", "data", "78 / 100  ·  −26  ·  1552 words", "text-md font-mono tnum"],
          ].map(([name, role, sample, cls]) => (
            <div key={name} className="grid gap-2 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
              <div>
                <div className="text-xs font-medium text-ink">{name}</div>
                <div className="label mt-0.5">{role}</div>
              </div>
              <div
                className={`min-w-0 truncate text-ink ${cls} ${
                  role === "display" ? "display" : ""
                }`}
              >
                {sample}
              </div>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Display scale" note="Instrument Serif. Big jumps, because editorial hierarchy is made of contrast, not of six similar sizes.">
        <div className="divide-y divide-rule border-y border-rule">
          {([
            ["d6", "136px", "Score"],
            ["d5", "96px", "Hero figure"],
            ["d4", "60px", "Page title"],
            ["d3", "44px", "Section title"],
            ["d2", "32px", "Subhead"],
            ["d1", "24px", "Inline display"],
          ] as const).map(([token, px, role]) => (
            <div key={token} className="flex items-baseline gap-6 py-4">
              <span className="w-28 shrink-0 font-mono text-2xs text-ink-subtle">
                {token} · {px}
              </span>
              <span className={`display truncate text-ink ${DISPLAY_SIZE[token]}`}>78</span>
              <span className="ml-auto shrink-0 text-2xs text-ink-subtle">{role}</span>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Interface scale" note="Geist. Tight steps, because interface text needs to sit in dense rows without shifting.">
        <div className="divide-y divide-rule border-y border-rule">
          {[
            ["md", "15px", "Lead paragraph", "text-md"],
            ["base", "14px", "Body, finding titles", "text-base"],
            ["sm", "13px", "Interface, rows", "text-sm"],
            ["xs", "12px", "Secondary, detail", "text-xs"],
            ["2xs", "11px", "Labels, mono figures", "text-2xs"],
          ].map(([token, px, role, cls]) => (
            <div key={token} className="flex items-baseline gap-6 py-3">
              <span className="w-24 shrink-0 font-mono text-2xs text-ink-subtle">
                {token} · {px}
              </span>
              <span className={`truncate text-ink ${cls}`}>
                Nothing removes the risk of saying yes
              </span>
              <span className="ml-auto shrink-0 text-2xs text-ink-subtle">{role}</span>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Labels">
        <div className="flex flex-wrap items-center gap-6">
          <Label>Section label</Label>
          <Label>Page vitals</Label>
          <Label>The read</Label>
        </div>
        <p className="mt-4 max-w-measure text-xs leading-relaxed text-ink-muted">
          11px, 500 weight, 0.14em tracking, uppercase. The tracking is what makes it
          read as a printed label rather than shouty interface text.
        </p>
      </Group>
    </div>
  );
}

/* ==========================================================================
   COMPONENTS
   ========================================================================== */

function ComponentsTab() {
  return (
    <div className="space-y-10">
      <Group label="Buttons" note="Four variants, three sizes, every state. Uppercase and tracked, so they read as controls rather than as prose.">
        <div className="space-y-5">
          <Row label="Variants">
            <Button variant="primary">Run audit</Button>
            <Button variant="secondary">Share report</Button>
            <Button variant="ghost">Clear</Button>
            <Button variant="danger">Delete</Button>
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="States">
            <Button variant="primary" loading>Auditing</Button>
            <Button disabled>Disabled</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </Row>
        </div>
      </Group>

      <Group label="Badges and ticks">
        <div className="space-y-5">
          <Row label="Tones">
            <Badge tone="neutral">Sample</Badge>
            <Badge tone="critical">3 critical</Badge>
            <Badge tone="warn">8 warnings</Badge>
            <Badge tone="pass">14 passing</Badge>
            <Badge tone="info">Info</Badge>
            <Badge tone="accent">Copy layer</Badge>
          </Row>
          <Row label="Mono">
            <Badge tone="critical" mono>−26</Badge>
            <Badge tone="warn" mono>−12</Badge>
            <Badge tone="neutral" mono>84/100</Badge>
          </Row>
          <Row label="Severity ticks">
            <span className="flex h-6 items-stretch gap-3">
              <Tick tone="critical" />
              <Tick tone="warn" />
              <Tick tone="pass" />
              <Tick tone="accent" />
              <Tick tone="neutral" />
            </span>
          </Row>
        </div>
      </Group>

      <div className="grid gap-10 lg:grid-cols-2">
        <Group label="Form controls" note="Inputs are ruled, not boxed. One line, one job.">
          <div className="space-y-6">
            <Field label="Landing page URL" hint="Any public http or https page.">
              <Input placeholder="yourlandingpage.com" className="font-mono" />
            </Field>
            <Field label="Disabled">
              <Input placeholder="Not editable" disabled />
            </Field>
          </div>
        </Group>

        <Group label="Feedback">
          <div className="space-y-3">
            <Note tone="critical" title="Could not reach that page">
              The site may be blocking automated requests.
            </Note>
            <Note tone="pass" title="Re-scored 6 audits" />
            <div className="flex items-center gap-3 pt-1">
              <Spinner />
              <span className="text-xs text-ink-muted">Inline spinner</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </Group>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <Group label="Data">
          <div className="border border-rule">
            <div className="grid grid-cols-2 divide-x divide-rule">
              <Stat label="Average score" value={81} suffix="/100" />
              <Stat label="Open findings" value={56} />
            </div>
            <dl className="divide-y divide-rule rule-t py-1">
              <DataRow label="Words of copy" value={1552} />
              <DataRow label="Reading ease" value={43.1} />
              <DataRow label="HTML weight" value="665 KB" />
            </dl>
          </div>
        </Group>
        <Group label="Empty state">
          <div className="border border-rule">
            <EmptyState title="Nothing audited yet" action={<Button size="sm">Run one</Button>}>
              Paste a landing page URL to run the first report.
            </EmptyState>
          </div>
        </Group>
      </div>
    </div>
  );
}

/* ==========================================================================
   MARKS
   ========================================================================== */

function MarksTab() {
  return (
    <div className="space-y-10">
      <Note tone="info" title="Drawn, not plotted">
        Every mark is hand-written. No charting library, no gradients, no curve
        smoothing, and no donuts. A line only bends where a real measurement sits.
      </Note>

      <Group
        label="Score gauge"
        note="The hero. A typeset figure read against a calibrated rail, because that is what a score is. Colour comes from the band, not the number: under 60 critical, under 80 warning, above that pass."
      >
        <div className="space-y-12 border-y border-rule py-8">
          <ScoreGauge score={42} grade="F" animate={false} />
          <ScoreGauge score={78} grade="C" animate={false} />
          <ScoreGauge score={95} grade="A" animate={false} />
        </div>
      </Group>

      <Group label="Score mark" note="The compact reading used in list rows.">
        <div className="flex flex-wrap gap-10 border-y border-rule py-6">
          <ScoreMark score={42} grade="F" />
          <ScoreMark score={68} grade="D" />
          <ScoreMark score={78} grade="C" />
          <ScoreMark score={84} grade="B" />
          <ScoreMark score={95} grade="A" />
        </div>
      </Group>

      <div className="grid gap-10 lg:grid-cols-2">
        <Group label="Category bars">
          <div className="divide-y divide-rule border border-rule">
            <CategoryBar index={0} label="Clarity" score={92} weight={22} issueCount={1} />
            <CategoryBar index={1} label="Offer" score={53} weight={18} issueCount={3} />
            <CategoryBar index={2} label="Proof" score={100} weight={18} issueCount={0} />
            <CategoryBar index={3} label="Friction" score={79} weight={16} issueCount={2} />
          </div>
        </Group>

        <div className="space-y-10">
          <Group label="Sparkline" note="Straight segments between real points.">
            <div className="border border-rule px-4 py-4">
              <Sparkline points={[78, 84, 78, 84, 80, 88]} />
            </div>
          </Group>
          <Group label="Histogram">
            <div className="border border-rule">
              <ScoreHistogram scores={[42, 58, 66, 72, 78, 84, 88, 91, 95]} />
            </div>
          </Group>
        </div>
      </div>

      <Group label="Rules the marks follow">
        <ol className="divide-y divide-rule border-y border-rule">
          {[
            "Colour encodes a band, never a series. Two greens always mean the same thing.",
            "Tabular numerals everywhere, so a changing figure never shifts the layout.",
            "Every mark states its scale in words, not a legend to decode.",
            "Below the point where a chart would mislead, it says so instead of drawing.",
            "Signal colours are re-tuned for dark mode, not dimmed.",
          ].map((rule, i) => (
            <li key={rule} className="flex gap-4 py-3">
              <span className="shrink-0 font-mono text-2xs tnum text-ink-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="max-w-measure text-xs leading-relaxed text-ink-muted">
                {rule}
              </span>
            </li>
          ))}
        </ol>
      </Group>
    </div>
  );
}

/* ==========================================================================
   PAGE FURNITURE
   ========================================================================== */

function Group({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <Label>{label}</Label>
        {note && (
          <p className="mt-2 max-w-measure text-xs leading-relaxed text-ink-muted">
            {note}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5">
      <div className="label pt-2">{label}</div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
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
      <div className={`flex h-16 w-full items-end border border-rule p-2 ${className}`}>
        <span
          className={`font-mono text-2xs ${
            invert ? "text-ink-inverse" : "text-ink-subtle"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="mt-2 font-mono text-2xs text-ink-subtle">{name}</div>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-sunken px-1 py-0.5 font-mono text-2xs text-ink">{children}</code>
  );
}
