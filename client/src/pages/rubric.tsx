import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { CATEGORY_KEYS, CATEGORY_META, type Weights } from "@shared/schema";
import { api, queryClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button, Label, Note, SectionHead, Sheet, Skeleton } from "@/components/ui";
import { PageHeader } from "@/components/app/shell";

/**
 * The remix surface. A rubric is an opinion, and every team's opinion differs:
 * an ecommerce PDP lives and dies on proof, a developer tool on clarity.
 * Rather than bake one opinion in, expose the weights and re-score everything
 * already stored the moment they change. No page is fetched again, so the
 * comparison stays honest.
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
        <PageHeader label="Remix this" title="Rubric" />
        <Skeleton className="h-96 w-full" />
      </>
    );
  }

  const total = CATEGORY_KEYS.reduce((sum, k) => sum + draft[k], 0);
  const dirty = CATEGORY_KEYS.some((k) => draft[k] !== data.weights[k]);

  return (
    <>
      <PageHeader
        label="Remix this"
        title="Rubric"
        description="Six categories, one weight each. Change them and every stored audit is re-scored from its existing findings. Nothing is fetched again."
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
        <div className="mb-8">
          <Note tone="pass" title={`Re-scored ${saved} audit${saved === 1 ? "" : "s"}`}>
            Every stored report now reflects the new weights.
          </Note>
        </div>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-10">
        <Sheet>
          <SectionHead
            label="Category weights"
            note="Relative importance. These are normalised, so they need not sum to 100."
            action={
              <span
                className={cn(
                  "font-mono text-xs tnum",
                  total === 0 ? "text-critical" : "text-ink-subtle",
                )}
              >
                {total}
              </span>
            }
          />
          <div className="divide-y divide-rule">
            {CATEGORY_KEYS.map((key, i) => {
              const meta = CATEGORY_META[key];
              const value = draft[key];
              const share = total ? Math.round((value / total) * 100) : 0;

              return (
                <div key={key} className="px-5 py-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <label
                      htmlFor={`weight-${key}`}
                      className="flex items-baseline gap-3"
                    >
                      <span className="font-mono text-2xs tnum text-ink-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="display text-d1 text-ink">{meta.label}</span>
                    </label>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-2xs tnum text-ink-subtle">
                        {share}% of score
                      </span>
                      <span className="display w-10 text-right text-d1 tnum text-ink">
                        {value}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 max-w-measure text-xs leading-relaxed text-ink-subtle">
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
                    className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-sunken accent-accent"
                  />
                </div>
              );
            })}
          </div>
        </Sheet>

        <Sheet>
          <SectionHead label="Going further" />
          <div className="space-y-4 px-5 py-5 text-xs leading-relaxed text-ink-muted">
            <p>
              Weights are the shallow end. The checks themselves live in{" "}
              <Mono>server/analyzer/rules.ts</Mono>, where each rule is about fifteen
              lines: a condition, a severity, a penalty, and the sentence explaining
              what it costs.
            </p>
            <p>
              Adding a rule means appending one object to a category array. Nothing
              else in the app needs to know about it.
            </p>
          </div>
          <div className="rule-t px-5 py-5">
            <Label className="mb-3 block">Worth changing first</Label>
            <ul className="divide-y divide-rule">
              {[
                ["Ecommerce", "raise Proof, add a shipping and returns check"],
                ["B2B SaaS", "raise Clarity, add a pricing transparency rule"],
                ["Lead gen", "raise Friction, penalise every field past the third"],
                ["Publishers", "drop Offer to zero, weight Craft higher"],
              ].map(([who, what]) => (
                <li key={who} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="font-mono text-2xs uppercase tracking-[0.08em] text-accent">
                    {who}
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                    {what}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Sheet>
      </div>
    </>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-sunken px-1 py-0.5 font-mono text-2xs text-ink">{children}</code>
  );
}
