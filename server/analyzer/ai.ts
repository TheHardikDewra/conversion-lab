import Anthropic from "@anthropic-ai/sdk";
import type { Issue, Rewrite } from "../../shared/schema";
import type { ExtractOutput } from "./extract";

/**
 * The optional layer.
 *
 * Everything in rules.ts runs with no credentials and no network beyond the
 * page fetch. This file adds the part a rulebook cannot do: judging whether the
 * words are any good, and writing better ones.
 *
 * If no key is present the app does not degrade - it simply reports that the
 * copy layer is off, and the deterministic audit stands on its own. That is
 * deliberate: a template that only works once you have wired up billing is a
 * template nobody remixes.
 */

const MODEL = process.env.CL_MODEL ?? "claude-opus-5";
const EFFORT = (process.env.CL_EFFORT ?? "medium") as
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "max";

/** Replit's managed AI integration and a plain key both land in this var. */
function resolveKey(): string | undefined {
  return (
    process.env.ANTHROPIC_API_KEY ||
    process.env.REPLIT_ANTHROPIC_API_KEY ||
    undefined
  );
}

export function aiAvailable(): boolean {
  return !!resolveKey();
}

export type AiOutput = {
  verdict: string | null;
  rewrites: Rewrite[];
};

const EMPTY: AiOutput = { verdict: null, rewrites: [] };

/**
 * Structured outputs keep the response parseable without a retry loop.
 * Note the schema constraints: every object needs additionalProperties:false
 * and a complete `required` list, and length/range keywords are not supported.
 */
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "rewrites"],
  properties: {
    verdict: {
      type: "string",
      description:
        "Three to five sentences. What this page is actually selling, who it speaks to, and the single biggest reason a qualified visitor would leave without converting. Concrete and specific to this page. No preamble.",
    },
    rewrites: {
      type: "array",
      description:
        "One entry per slot that exists on the page. Skip any slot with no source text.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["slot", "original", "variants"],
        properties: {
          slot: {
            type: "string",
            enum: ["headline", "subhead", "cta", "proof"],
          },
          original: { type: "string" },
          variants: {
            type: "array",
            description: "Exactly three, each taking a different angle.",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["text", "angle", "rationale"],
              properties: {
                text: { type: "string", description: "The rewritten copy itself." },
                angle: {
                  type: "string",
                  description:
                    "Two or three words naming the approach. For example: outcome-led, objection-first, specificity, curiosity, loss-framing.",
                },
                rationale: {
                  type: "string",
                  description:
                    "One sentence on why this should outperform the original.",
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

const SYSTEM = `You are a conversion copywriter reviewing a landing page. You have
spent years running split tests, so you write about what moves numbers rather than
what sounds impressive.

How you work:
- Judge the page in front of you. Never invent facts about the product, the
  company, or its customers that are not in the material you were given.
- A rewrite that promises something the page has not earned is worse than the
  original. Stay inside what the page can actually support.
- Specific beats clever. A number, a named audience, or a concrete outcome will
  out-convert a pun every time.
- Write the way people talk. No filler openers, no "unlock", no "seamless",
  no "elevate", no em dashes.
- If a slot has no source text on the page, leave it out of your rewrites
  entirely rather than inventing an original to improve on.

You will be given the extracted structure of a page plus the issues a
deterministic rulebook already found. Do not repeat those issues back. Your job
is the judgement the rulebook cannot make: whether the words work, and what
better words would look like.`;

function buildPrompt(ctx: ExtractOutput, issues: Issue[], host: string): string {
  const { extracted, metrics } = ctx;
  const problems = issues.filter((i) => i.severity !== "pass");

  const lines: string[] = [
    `Page: ${host}`,
    `Title: ${extracted.title ?? "(none)"}`,
    `Meta description: ${extracted.metaDescription ?? "(none)"}`,
    "",
    `Headline (H1): ${extracted.h1[0] ?? "(none found)"}`,
    "",
    "Section headings, in document order:",
    ...extracted.headings
      .filter((h) => h.level >= 2)
      .slice(0, 14)
      .map((h) => `  H${h.level}  ${h.text}`),
    "",
    "Calls to action, in document order:",
    ...(extracted.ctas.length
      ? extracted.ctas.slice(0, 10).map((c) => `  [${c.kind}] ${c.text}`)
      : ["  (none found)"]),
    "",
    "Proof signals found:",
    ...(extracted.proofSignals.length
      ? extracted.proofSignals.map((p) => `  ${p.kind}: ${p.evidence}`)
      : ["  (none found)"]),
    "",
    `Form fields: ${
      extracted.formFields.length
        ? extracted.formFields.map((f) => f.name).join(", ")
        : "(no form)"
    }`,
    "",
    `Copy metrics: ${metrics.wordCount} words, average sentence ${metrics.avgSentenceWords} words, reading ease ${metrics.readingEase}, reader-focus ratio ${metrics.youRatio}.`,
    "",
    "Opening section text, verbatim:",
    ctx.openingText.slice(0, 1400),
    "",
    `Rulebook already flagged ${problems.length} issue(s): ${problems
      .map((p) => p.title)
      .join("; ")}`,
    "",
    "Write the verdict, then rewrites for whichever of headline, subhead, cta and proof actually exist on this page.",
  ];

  return lines.join("\n");
}

export async function runAiLayer(
  ctx: ExtractOutput,
  issues: Issue[],
  host: string,
): Promise<AiOutput> {
  const apiKey = resolveKey();
  if (!apiKey) return EMPTY;

  const client = new Anthropic({
    apiKey,
    baseURL: process.env.ANTHROPIC_BASE_URL,
    // The SDK default is ten minutes. An audit that hangs that long is a
    // broken audit, so fail fast and fall back to the rulebook.
    timeout: 90_000,
    maxRetries: 1,
  });

  try {
    const response = await client.messages.create({
      model: MODEL,
      // Thinking is on by default on Opus 5 and shares this budget with the
      // response, so leave real headroom or the JSON truncates mid-object.
      max_tokens: 12_000,
      system: SYSTEM,
      output_config: {
        effort: EFFORT,
        format: { type: "json_schema", schema: SCHEMA as unknown as Record<string, unknown> },
      },
      messages: [{ role: "user", content: buildPrompt(ctx, issues, host) }],
    });

    if (response.stop_reason === "refusal") {
      console.warn("[ai] request declined by safety classifiers");
      return EMPTY;
    }
    if (response.stop_reason === "max_tokens") {
      console.warn("[ai] response hit the token ceiling, discarding partial JSON");
      return EMPTY;
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    if (!text.trim()) return EMPTY;

    const parsed = JSON.parse(text) as AiOutput;
    return {
      verdict: parsed.verdict ?? null,
      rewrites: Array.isArray(parsed.rewrites) ? parsed.rewrites : [],
    };
  } catch (err) {
    // The copy layer is a bonus. Nothing it can do should sink an audit.
    if (err instanceof Anthropic.AuthenticationError) {
      console.warn("[ai] key rejected, continuing without the copy layer");
    } else if (err instanceof Anthropic.RateLimitError) {
      console.warn("[ai] rate limited, continuing without the copy layer");
    } else if (err instanceof Anthropic.APIError) {
      console.warn(`[ai] api error ${err.status}, continuing without the copy layer`);
    } else {
      console.warn("[ai] unexpected failure, continuing without the copy layer", err);
    }
    return EMPTY;
  }
}
