import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { z } from "zod";

/* ==========================================================================
   THE RUBRIC
   Six categories. Every issue belongs to exactly one. Weights sum to 100.
   Editable at runtime from /rubric - that is the main remix surface.
   ========================================================================== */

export const CATEGORY_KEYS = [
  "clarity",
  "offer",
  "proof",
  "friction",
  "action",
  "craft",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export const CATEGORY_META: Record<
  CategoryKey,
  { label: string; blurb: string; defaultWeight: number }
> = {
  clarity: {
    label: "Clarity",
    blurb:
      "Can a stranger tell what this is, who it is for, and what happens next within five seconds?",
    defaultWeight: 22,
  },
  offer: {
    label: "Offer",
    blurb:
      "Is there a specific, valuable, believable reason to act instead of leaving?",
    defaultWeight: 18,
  },
  proof: {
    label: "Proof",
    blurb:
      "Does anything on the page make the claim credible to someone who has never heard of you?",
    defaultWeight: 18,
  },
  friction: {
    label: "Friction",
    blurb:
      "How much work, risk, and second-guessing sits between intent and conversion?",
    defaultWeight: 16,
  },
  action: {
    label: "Action",
    blurb:
      "Is there one obvious next step, repeated at the right moments, worded as a benefit?",
    defaultWeight: 16,
  },
  craft: {
    label: "Craft",
    blurb:
      "Structure, semantics, accessibility, and weight - the things that quietly cost you conversions.",
    defaultWeight: 10,
  },
};

export const SEVERITIES = ["critical", "warning", "pass"] as const;
export type Severity = (typeof SEVERITIES)[number];

/* ==========================================================================
   ANALYSIS SHAPES
   ========================================================================== */

export const issueSchema = z.object({
  id: z.string(),
  category: z.enum(CATEGORY_KEYS),
  severity: z.enum(SEVERITIES),
  title: z.string(),
  /** Why this costs money, in plain language. */
  why: z.string(),
  /** What to actually do about it. */
  fix: z.string(),
  /** What we found on the page, verbatim where possible. */
  evidence: z.string().optional(),
  /** Points deducted from this category's 100. */
  penalty: z.number(),
});
export type Issue = z.infer<typeof issueSchema>;

export const categoryScoreSchema = z.object({
  key: z.enum(CATEGORY_KEYS),
  score: z.number(),
  weight: z.number(),
  issueCount: z.number(),
});
export type CategoryScore = z.infer<typeof categoryScoreSchema>;

export const extractedSchema = z.object({
  title: z.string().nullable(),
  metaDescription: z.string().nullable(),
  h1: z.array(z.string()),
  headings: z.array(z.object({ level: z.number(), text: z.string() })),
  ctas: z.array(
    z.object({
      text: z.string(),
      kind: z.enum(["button", "link", "submit"]),
      href: z.string().nullable(),
    }),
  ),
  formFields: z.array(
    z.object({ name: z.string(), type: z.string(), labelled: z.boolean() }),
  ),
  proofSignals: z.array(z.object({ kind: z.string(), evidence: z.string() })),
  navLinks: z.number(),
  images: z.object({ total: z.number(), missingAlt: z.number() }),
});
export type Extracted = z.infer<typeof extractedSchema>;

export const metricsSchema = z.object({
  wordCount: z.number(),
  /** Segments long enough to count as prose. Readability is unreliable below ~5. */
  proseSentences: z.number(),
  avgSentenceWords: z.number(),
  readingEase: z.number(),
  youRatio: z.number(),
  htmlBytes: z.number(),
  scriptCount: z.number(),
  externalHosts: z.number(),
  fetchMs: z.number(),
  hasViewport: z.boolean(),
  hasLang: z.boolean(),
  https: z.boolean(),
});
export type Metrics = z.infer<typeof metricsSchema>;

export const rewriteSchema = z.object({
  slot: z.enum(["headline", "subhead", "cta", "proof"]),
  original: z.string(),
  variants: z.array(
    z.object({
      text: z.string(),
      angle: z.string(),
      rationale: z.string(),
    }),
  ),
});
export type Rewrite = z.infer<typeof rewriteSchema>;

export const auditResultSchema = z.object({
  score: z.number(),
  grade: z.string(),
  categories: z.array(categoryScoreSchema),
  issues: z.array(issueSchema),
  extracted: extractedSchema,
  metrics: metricsSchema,
  rewrites: z.array(rewriteSchema),
  /** Free-text qualitative read. Only present when the AI layer ran. */
  verdict: z.string().nullable(),
  engine: z.enum(["heuristic", "heuristic+ai"]),
});
export type AuditResult = z.infer<typeof auditResultSchema>;

/* ==========================================================================
   TABLES
   Used when DATABASE_URL is set. The in-memory store mirrors these types
   exactly, so the app is identical with or without a database.
   ========================================================================== */

export const audits = pgTable("audits", {
  id: text("id").primaryKey(),
  shareToken: text("share_token").notNull(),
  url: text("url").notNull(),
  finalUrl: text("final_url").notNull(),
  pageTitle: text("page_title"),
  score: integer("score").notNull(),
  grade: text("grade").notNull(),
  engine: text("engine").notNull(),
  isSample: boolean("is_sample").notNull().default(false),
  result: jsonb("result").$type<AuditResult>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const rubricWeights = pgTable("rubric_weights", {
  key: text("key").primaryKey(),
  weight: integer("weight").notNull(),
});

export type AuditRow = typeof audits.$inferSelect;

/** What the client actually receives. */
export type Audit = {
  id: string;
  shareToken: string;
  url: string;
  finalUrl: string;
  pageTitle: string | null;
  score: number;
  grade: string;
  engine: string;
  isSample: boolean;
  result: AuditResult;
  createdAt: string;
};

/* ==========================================================================
   API CONTRACTS
   ========================================================================== */

export const runAuditSchema = z.object({
  url: z
    .string()
    .min(3, "Enter a URL")
    .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
    .refine((v) => {
      try {
        const u = new URL(v);
        return !!u.hostname && u.hostname.includes(".");
      } catch {
        return false;
      }
    }, "That does not look like a valid URL"),
});
export type RunAuditInput = z.infer<typeof runAuditSchema>;

export const weightsSchema = z.record(z.enum(CATEGORY_KEYS), z.number().min(0).max(60));
export type Weights = Record<CategoryKey, number>;

export const DEFAULT_WEIGHTS: Weights = Object.fromEntries(
  CATEGORY_KEYS.map((k) => [k, CATEGORY_META[k].defaultWeight]),
) as Weights;

export function gradeFor(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 55) return "D";
  return "F";
}
