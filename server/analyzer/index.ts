import {
  CATEGORY_KEYS,
  DEFAULT_WEIGHTS,
  gradeFor,
  type AuditResult,
  type CategoryScore,
  type Issue,
  type Weights,
} from "../../shared/schema";
import { fetchPage, FetchError } from "./fetch";
import { extractPage } from "./extract";
import { runRules, RULE_COUNT } from "./rules";
import { aiAvailable, runAiLayer } from "./ai";

export { FetchError, RULE_COUNT };

/**
 * Scoring
 * -------
 * Each category starts at 100 and loses the penalties of its own issues.
 * The overall score is the weighted mean. Weights are supplied by the caller
 * so the /rubric screen can re-score an existing audit without re-fetching.
 */
export function scoreIssues(
  issues: Issue[],
  weights: Weights = DEFAULT_WEIGHTS,
): { score: number; categories: CategoryScore[] } {
  const categories: CategoryScore[] = CATEGORY_KEYS.map((key) => {
    const own = issues.filter((i) => i.category === key);
    const penalty = own.reduce((sum, i) => sum + i.penalty, 0);
    return {
      key,
      score: Math.max(0, Math.min(100, 100 - penalty)),
      weight: weights[key] ?? 0,
      issueCount: own.filter((i) => i.severity !== "pass").length,
    };
  });

  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
  const score =
    totalWeight === 0
      ? 0
      : Math.round(
          categories.reduce((sum, c) => sum + c.score * c.weight, 0) / totalWeight,
        );

  return { score, categories };
}

/** Re-score an existing audit under different weights. No network involved. */
export function rescore(result: AuditResult, weights: Weights): AuditResult {
  const { score, categories } = scoreIssues(result.issues, weights);
  return { ...result, score, grade: gradeFor(score), categories };
}

const SEVERITY_ORDER = { critical: 0, warning: 1, pass: 2 } as const;

export async function runAudit(
  url: string,
  weights: Weights = DEFAULT_WEIGHTS,
): Promise<{ result: AuditResult; finalUrl: string }> {
  const page = await fetchPage(url);
  const ctx = extractPage(page);
  const host = new URL(page.finalUrl).host;

  const issues = runRules({ ...ctx, host });

  // Sort the way a person would read them: what is broken, then what is weak,
  // then what already works, with the heaviest penalties first inside each band.
  issues.sort((a, b) => {
    const bySeverity = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    return bySeverity !== 0 ? bySeverity : b.penalty - a.penalty;
  });

  const { score, categories } = scoreIssues(issues, weights);

  const ai = aiAvailable() ? await runAiLayer(ctx, issues, host) : { verdict: null, rewrites: [] };

  return {
    finalUrl: page.finalUrl,
    result: {
      score,
      grade: gradeFor(score),
      categories,
      issues,
      extracted: ctx.extracted,
      metrics: ctx.metrics,
      rewrites: ai.rewrites,
      verdict: ai.verdict,
      engine: ai.verdict || ai.rewrites.length ? "heuristic+ai" : "heuristic",
    },
  };
}
