import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RotateCcw, Check } from "lucide-react";
import { CATEGORY_KEYS, CATEGORY_META, type Weights } from "@shared/schema";
import { api, queryClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button, Callout, Card, CardHeader, Skeleton } from "@/components/ui";
import { PageHeader } from "@/components/app/shell";

/**
 * The remix surface. A rubric is an opinion, and every team's opinion differs - * an ecommerce PDP lives and dies on proof, a developer tool on clarity. Rather
 * than bake one opinion in, expose the weights and re-score everything already
 * stored the moment they change. No page is re-fetched: the findings are on
 * disk, only their relative importance moved.
 */
export default function Rubric() {
  const { data, isLoading } = useQuery({ queryKey: ["rubric"], queryFn: api.rubric });
  const [draft, setDraft] = React.useState<Weights | null>(null);
  const [saved, setSaved] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (data && !draft) setDraft({ ...data.weights });
  }, [data, draft]);

  const save = useMutation({
    mutationFn: (weights: Weights) => api.saveRubric(weights),
    onSuccess: (res) => {
      setSaved(res.rescored);
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
      queryClient.invalidateQueries({ queryKey: ["rubric"] });
      setTimeout(() => setSaved(null), 4000);
    },
  });

  if (isLoading || !draft || !data) {
    return (
      <>
        <PageHeader title="Rubric" />
        <Skeleton className="h-96 w-full" />
      </>
    );
  }

  const total = CATEGORY_KEYS.reduce((sum, k) => sum + draft[k], 0);
  const dirty = CATEGORY_KEYS.some((k) => draft[k] !== data.weights[k]);

  return (
    <>
      <PageHeader
        eyebrow="Remix this"
        title="Rubric"
        description="Six categories, one weight each. Change them and every stored audit is re-scored from its existing findings. Nothing is fetched again, so the comparison stays honest."
        action={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDraft({ ...data.defaults })}
              disabled={CATEGORY_KEYS.every((k) => draft[k] === data.defaults[k])}
            >
              <RotateCcw className="h-3 w-3" strokeWidth={2} />
              Reset
            </Button>
            <Button
              size="sm"
              variant="primary"
              loading={save.isPending}
              disabled={!dirty || total === 0}
              onClick={() => save.mutate(draft)}
            >
              Save and re-score
            </Button>
          </div>
        }
      />

      {saved !== null && (
        <div className="mb-6">
          <Callout tone="pass" title={`Re-scored ${saved} audit${saved === 1 ? "" : "s"}`}>
            Weights saved. Every stored audit now reflects the new rubric.
          </Callout>
        </div>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <Card>
          <CardHeader
            title="Category weights"
            subtitle="Relative importance. These are normalised, so they do not need to sum to 100."
            action={
              <span
                className={cn(
                  "font-mono text-xs tnum font-semibold",
                  total === 0 ? "text-critical" : "text-ink-subtle",
                )}
              >
                {total} total
              </span>
            }
          />
          <div className="divide-y divide-line">
            {CATEGORY_KEYS.map((key) => {
              const meta = CATEGORY_META[key];
              const value = draft[key];
              const share = total ? Math.round((value / total) * 100) : 0;

              return (
                <div key={key} className="px-4 py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <label
                      htmlFor={`weight-${key}`}
                      className="text-sm font-medium text-ink"
                    >
                      {meta.label}
                    </label>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xs tnum text-ink-subtle">
                        {share}% of score
                      </span>
                      <span className="w-8 text-right font-mono text-sm tnum font-semibold text-ink">
                        {value}
                      </span>
                    </div>
                  </div>

                  <p className="mt-1 max-w-prose text-xs leading-relaxed text-ink-subtle">
                    {meta.blurb}
                  </p>

                  <input
                    id={`weight-${key}`}
                    type="range"
                    min={0}
                    max={40}
                    step={1}
                    value={value}
                    onChange={(e) =>
                      setDraft({ ...draft, [key]: Number(e.target.value) })
                    }
                    className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-sunken accent-accent"
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Going further" />
          <div className="space-y-4 px-4 py-4 text-xs leading-relaxed text-ink-muted">
            <p>
              Weights are the shallow end. The checks themselves live in{" "}
              <code className="rounded-xs bg-sunken px-1 py-0.5 font-mono text-2xs text-ink">
                server/analyzer/rules.ts
              </code>
              , where each rule is about fifteen lines: a condition, a severity, a
              penalty, and the sentence explaining what it costs.
            </p>
            <p>
              Adding a rule means appending one object to a category array. Nothing
              else in the app needs to know about it. Deleting one means deleting
              the object.
            </p>
            <div className="rounded-sm border border-line bg-sunken p-3">
              <div className="mb-2 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-subtle">
                Worth changing first
              </div>
              <ul className="space-y-1.5">
                {[
                  "Ecommerce: raise Proof, add a shipping-and-returns check",
                  "B2B SaaS: raise Clarity, add a pricing-transparency rule",
                  "Lead gen: raise Friction, penalise every field past the third",
                  "Publishers: drop Offer to zero, weight Craft higher",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-2xs text-ink-muted">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
