import type { CategoryKey, Issue, Severity } from "@shared/schema";
import type { ExtractOutput } from "./extract";
import { CTA_HELPERS } from "./extract";

/**
 * The rubric. Every check is owned by exactly one category.
 *
 * A rule returns `null` when it has nothing useful to say (usually because the
 * page does not have the thing being judged). Otherwise it returns a verdict:
 * `pass` costs nothing, `warning` and `critical` cost points.
 *
 * Remixing: add, delete, or reweight rules here. Nothing else needs to change.
 */

export type RuleContext = ExtractOutput & { host: string };

type Verdict = {
  severity: Severity;
  title: string;
  why: string;
  fix: string;
  evidence?: string;
  penalty: number;
};

type Rule = {
  id: string;
  category: CategoryKey;
  run: (ctx: RuleContext) => Verdict | null;
};

const ok = (title: string, evidence?: string): Verdict => ({
  severity: "pass",
  title,
  why: "",
  fix: "",
  evidence,
  penalty: 0,
});

const BUZZWORDS = [
  "innovative", "cutting edge", "cutting-edge", "world class", "world-class",
  "next generation", "next-generation", "seamless", "revolutionary",
  "state of the art", "state-of-the-art", "empower", "leverage", "synergy",
  "best in class", "best-in-class", "solutions", "robust", "holistic",
];

const OUTCOME_WORDS = [
  "save", "grow", "increase", "reduce", "cut", "double", "faster", "stop",
  "fix", "win", "earn", "launch", "ship", "close", "convert", "scale",
  "without", "in minutes", "in days", "per week", "per month",
];

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);

/* ==========================================================================
   CLARITY
   ========================================================================== */

const clarityRules: Rule[] = [
  {
    id: "h1-present",
    category: "clarity",
    run: (c) =>
      c.extracted.h1.length > 0
        ? ok("Page has an H1", c.extracted.h1[0])
        : {
            severity: "critical",
            title: "No H1 on the page",
            why: "The H1 is the one line a visitor reads before deciding whether to stay. Without it, the page has no headline, and search engines have no primary signal about what it is.",
            fix: "Add a single H1 that names the outcome and the audience. Style it however you like, but it has to exist in the markup.",
            penalty: 34,
          },
  },
  {
    id: "h1-single",
    category: "clarity",
    run: (c) => {
      if (c.extracted.h1.length <= 1) return null;
      return {
        severity: "warning",
        title: `${c.extracted.h1.length} competing H1 headings`,
        why: "Multiple H1s split the page's primary message. Visitors skim for the biggest promise and find several, so none of them land.",
        fix: "Keep one H1 for the main promise. Demote the rest to H2.",
        evidence: c.extracted.h1.slice(0, 3).join("  •  "),
        penalty: 10,
      };
    },
  },
  {
    id: "h1-length",
    category: "clarity",
    run: (c) => {
      const first = c.extracted.h1[0];
      if (!first) return null;
      const n = words(first).length;
      if (n >= 4 && n <= 14) return ok(`H1 is ${n} words, a readable length`, first);
      if (n < 4) {
        return {
          severity: "warning",
          title: `H1 is only ${n} word${n === 1 ? "" : "s"}`,
          why: "Very short headlines usually name the product instead of the payoff. The visitor still has to work out what they get.",
          fix: "Expand it to state the outcome. A useful shape: [achieve outcome] without [the usual cost].",
          evidence: first,
          penalty: 9,
        };
      }
      return {
        severity: "warning",
        title: `H1 runs to ${n} words`,
        why: "Long headlines get skimmed rather than read. The promise ends up buried in the second half, which most visitors never reach.",
        fix: "Cut to under 14 words and move the qualifier into a subhead.",
        evidence: first,
        penalty: 8,
      };
    },
  },
  {
    id: "h1-buzzwords",
    category: "clarity",
    run: (c) => {
      const first = c.extracted.h1[0];
      if (!first) return null;
      const hits = BUZZWORDS.filter((b) => first.toLowerCase().includes(b));
      if (!hits.length) return null;
      return {
        severity: "warning",
        title: "Headline leans on filler vocabulary",
        why: `Words like ${hits.map((h) => `"${h}"`).join(", ")} appear on every competitor's page too, so they carry no information. The visitor learns nothing they can compare.`,
        fix: "Replace each one with a concrete noun, number, or outcome specific to this product.",
        evidence: first,
        penalty: 8,
      };
    },
  },
  {
    id: "h1-brand-only",
    category: "clarity",
    run: (c) => {
      const first = c.extracted.h1[0];
      if (!first) return null;
      const brand = c.host.replace(/^www\./, "").split(".")[0].toLowerCase();
      const stripped = first.toLowerCase().replace(brand, "").replace(/[^a-z]/g, "");
      if (brand.length > 2 && first.toLowerCase().includes(brand) && stripped.length < 12) {
        return {
          severity: "critical",
          title: "Headline is mostly just the brand name",
          why: "Nobody arrives already caring about the brand. A headline that only says the name spends the most valuable line on the page telling the visitor something they cannot act on.",
          fix: "Move the brand to the logo and give the H1 to the promise.",
          evidence: first,
          penalty: 22,
        };
      }
      return null;
    },
  },
  {
    id: "title-tag",
    category: "clarity",
    run: (c) => {
      const t = c.extracted.title;
      if (!t) {
        return {
          severity: "critical",
          title: "No title tag",
          why: "The title is the label on the browser tab, the search result, and every link preview when the page gets shared. Missing it costs clicks before anyone reaches the page.",
          fix: "Add a title under 60 characters that leads with the outcome.",
          penalty: 16,
        };
      }
      if (t.length > 65) {
        return {
          severity: "warning",
          title: `Title tag is ${t.length} characters`,
          why: "Search results and link previews truncate around 60 characters, so the tail gets cut mid-word.",
          fix: "Trim to 60 characters or fewer, with the important half first.",
          evidence: t,
          penalty: 5,
        };
      }
      return ok(`Title tag is ${t.length} characters`, t);
    },
  },
  {
    id: "meta-description",
    category: "clarity",
    run: (c) =>
      c.extracted.metaDescription
        ? ok("Meta description present", c.extracted.metaDescription)
        : {
            severity: "warning",
            title: "No meta description",
            why: "Without one, search engines and social platforms invent a preview from whatever text they find first. That is usually navigation or a cookie notice.",
            fix: "Write 140 to 160 characters that repeat the promise and name the next step.",
            penalty: 8,
          },
  },
  {
    id: "audience-named",
    category: "clarity",
    run: (c) => {
      const opening = c.openingText.toLowerCase();
      const named = /\bfor\s+(founders|teams|agencies|developers|designers|marketers|startups|creators|freelancers|small business|smbs|enterprises|coaches|students|parents|women|men|beginners)\b/.test(
        opening,
      );
      if (named) return ok("Opening names a specific audience");
      return {
        severity: "warning",
        title: "Opening does not say who this is for",
        why: "When a page tries to speak to everyone, no single visitor recognises themselves in it. Naming the audience raises relevance for the right people and filters out the wrong ones.",
        fix: 'Add a qualifier near the headline. "For agencies billing over $20k a month" beats "for teams of all sizes".',
        penalty: 9,
      };
    },
  },
];

/* ==========================================================================
   OFFER
   ========================================================================== */

const offerRules: Rule[] = [
  {
    id: "risk-reversal",
    category: "offer",
    run: (c) => {
      const found = c.extracted.proofSignals.find((p) => p.kind === "guarantee");
      if (found) return ok("Risk reversal present", found.evidence);
      return {
        severity: "critical",
        title: "Nothing removes the risk of saying yes",
        why: "Every conversion asks the visitor to bet something: money, time, or an email address. With no guarantee, free tier, or cancellation promise, the visitor carries all of that risk alone and the safest move is to leave.",
        fix: 'Add one explicit risk reverser near the primary CTA. "Cancel anytime", "no card required", and "30-day refund" all work.',
        penalty: 26,
      };
    },
  },
  {
    id: "price-transparency",
    category: "offer",
    run: (c) => {
      const hasPrice = /[$£€₹]\s?\d|(\b\d+\s?(?:usd|eur|gbp|inr)\b)|\bfree\b|\bpricing\b/i.test(
        c.bodyText,
      );
      if (hasPrice) return ok("Price or pricing signal is on the page");
      return {
        severity: "warning",
        title: "No price or pricing signal anywhere",
        why: "Visitors assume the worst when price is hidden. Cost is the second question everyone asks, and a page that dodges it pushes the decision into a sales call most people will not book.",
        fix: 'Show a number, a range, or at minimum a "starts at" line. If it is genuinely custom, say what drives the price.',
        penalty: 12,
      };
    },
  },
  {
    id: "concrete-numbers",
    category: "offer",
    run: (c) => {
      const nums = c.bodyText.match(/\b\d[\d,.]*\s?(%|x|hours?|days?|weeks?|minutes?|×)\b/gi) ?? [];
      if (nums.length >= 2) return ok(`${nums.length} quantified claims`, nums.slice(0, 4).join(", "));
      return {
        severity: "warning",
        title: "The offer is described without numbers",
        why: "Unquantified claims read as opinion. A visitor cannot compare \"saves you time\" against a competitor, but they can compare \"cuts invoicing from 3 hours to 20 minutes\".",
        fix: "Attach a number to the two strongest claims. Time saved, percentage gained, or count delivered.",
        penalty: 10,
      };
    },
  },
  {
    id: "outcome-language",
    category: "offer",
    run: (c) => {
      const hits = OUTCOME_WORDS.filter((w) => c.openingText.toLowerCase().includes(w));
      if (hits.length >= 2) return ok("Opening is written around outcomes", hits.slice(0, 5).join(", "));
      return {
        severity: "warning",
        title: "Opening describes features, not outcomes",
        why: "Features answer \"what is it\". Visitors are buying the answer to \"what changes for me\". Pages that never make that jump convert the already-convinced and nobody else.",
        fix: "Rewrite the opening so each feature is followed by the result it produces.",
        penalty: 11,
      };
    },
  },
  {
    id: "offer-thinness",
    category: "offer",
    run: (c) => {
      if (c.metrics.wordCount >= 150) return null;
      return {
        severity: "critical",
        title: `Only ${c.metrics.wordCount} words of copy on the page`,
        why: "There is not enough here to answer the objections a stranger arrives with. Thin pages convert traffic that was already sold and lose everyone else.",
        fix: "Add the three sections almost every page needs: what it does, proof it works, and what happens after you click.",
        penalty: 20,
      };
    },
  },
];

/* ==========================================================================
   PROOF
   ========================================================================== */

const proofRules: Rule[] = [
  {
    id: "proof-any",
    category: "proof",
    run: (c) => {
      const nonGuarantee = c.extracted.proofSignals.filter((p) => p.kind !== "guarantee");
      if (nonGuarantee.length) return null;
      return {
        severity: "critical",
        title: "No social proof detected anywhere on the page",
        why: "The page is asking a stranger to take its word for everything. Proof is what converts scepticism into action, and there is currently none to find.",
        fix: "Add one real customer quote with a full name, and one number that shows scale. Both beat a logo wall.",
        penalty: 45,
      };
    },
  },
  {
    id: "proof-testimonial",
    category: "proof",
    run: (c) => {
      const t = c.extracted.proofSignals.find((p) => p.kind === "testimonial");
      if (t) return ok("Testimonial or quote blocks found", t.evidence);
      if (!c.extracted.proofSignals.some((p) => p.kind !== "guarantee")) return null;
      return {
        severity: "warning",
        title: "No customer testimonials",
        why: "Logos and counts prove popularity. A quote proves the thing actually solved somebody's problem, which is the objection most visitors are stuck on.",
        fix: "Add two or three quotes naming the specific problem and the result. Include full name, role, and photo.",
        penalty: 14,
      };
    },
  },
  {
    id: "proof-quantified",
    category: "proof",
    run: (c) => {
      const q = c.extracted.proofSignals.find(
        (p) => p.kind === "volume" || p.kind === "rating-value",
      );
      if (q) return ok("Quantified proof present", q.evidence);
      if (!c.extracted.proofSignals.some((p) => p.kind !== "guarantee")) return null;
      return {
        severity: "warning",
        title: "Proof is present but not quantified",
        why: "\"Loved by customers\" is a claim. \"4.8 out of 5 across 1,240 reviews\" is evidence. Only the second one survives a sceptical read.",
        fix: "Put a real count or rating next to the proof section header.",
        penalty: 12,
      };
    },
  },
  {
    id: "proof-thirdparty",
    category: "proof",
    run: (c) => {
      const t = c.extracted.proofSignals.find(
        (p) => p.kind === "third-party" || p.kind === "authority",
      );
      if (t) return ok("Third-party validation referenced", t.evidence);
      return {
        severity: "warning",
        title: "No third-party validation",
        why: "Proof hosted on your own page is proof you control. A rating from a platform the visitor already trusts does work that self-reported claims cannot.",
        fix: "Link a review platform, a press mention, a certification, or a named customer the audience recognises.",
        penalty: 10,
      };
    },
  },
];

/* ==========================================================================
   FRICTION
   ========================================================================== */

const frictionRules: Rule[] = [
  {
    id: "form-length",
    category: "friction",
    run: (c) => {
      const n = c.extracted.formFields.length;
      if (n === 0) return null;
      if (n <= 4) return ok(`Form asks for ${n} field${n === 1 ? "" : "s"}`);
      const severity: Severity = n > 7 ? "critical" : "warning";
      return {
        severity,
        title: `Form asks for ${n} fields`,
        why: "Every field is another chance to abandon. Fields beyond the third are usually there for internal routing, not because the visitor cannot be served without them.",
        fix: "Cut to the minimum needed to deliver value, then collect the rest after the conversion.",
        evidence: c.extracted.formFields.slice(0, 8).map((f) => f.name).join(", "),
        penalty: severity === "critical" ? 24 : 13,
      };
    },
  },
  {
    id: "form-labels",
    category: "friction",
    run: (c) => {
      const unlabelled = c.extracted.formFields.filter((f) => !f.labelled);
      if (!c.extracted.formFields.length) return null;
      if (!unlabelled.length) return ok("Every form field is labelled");
      return {
        severity: "warning",
        title: `${unlabelled.length} form field${unlabelled.length === 1 ? "" : "s"} without a label`,
        why: "Placeholder-only fields vanish the moment someone starts typing, so people lose track of what they are filling in and screen readers announce nothing.",
        fix: "Add a visible <label> tied to each input with for/id.",
        evidence: unlabelled.slice(0, 6).map((f) => f.name).join(", "),
        penalty: 9,
      };
    },
  },
  {
    id: "nav-leaks",
    category: "friction",
    run: (c) => {
      const n = c.extracted.navLinks;
      if (n <= 6) return ok(`${n} navigation link${n === 1 ? "" : "s"} in the header`);
      const severity: Severity = n > 14 ? "critical" : "warning";
      return {
        severity,
        title: `${n} navigation links compete with the CTA`,
        why: "Each header link is an exit the visitor can take instead of converting. On a page with one job, full site navigation leaks the traffic you paid for.",
        fix: "Strip the header to a logo and the primary CTA. Move the rest to the footer.",
        penalty: severity === "critical" ? 20 : 11,
      };
    },
  },
  {
    id: "reading-ease",
    category: "friction",
    run: (c) => {
      const e = c.metrics.readingEase;
      // Below a handful of real sentences the score is noise, so say nothing
      // rather than grade a page on five nav labels.
      if (c.metrics.proseSentences < 5) return null;
      if (e >= 55) return ok(`Reading ease ${e}, comfortable for most readers`);
      const severity: Severity = e < 35 ? "critical" : "warning";
      return {
        severity,
        title: `Reading ease scores ${e} out of 100`,
        why: "Dense prose slows skimming, and visitors skim before they read. Copy that needs concentration gets skipped, not decoded.",
        fix: "Shorten sentences, swap abstract nouns for verbs, and cut clauses that qualify rather than persuade.",
        evidence: `Average sentence runs ${c.metrics.avgSentenceWords} words`,
        penalty: severity === "critical" ? 18 : 10,
      };
    },
  },
  {
    id: "sentence-length",
    category: "friction",
    run: (c) => {
      if (c.metrics.proseSentences < 5) return null;
      if (c.metrics.avgSentenceWords <= 22) return null;
      return {
        severity: "warning",
        title: `Sentences average ${c.metrics.avgSentenceWords} words`,
        why: "Past roughly 20 words a sentence starts carrying more than one idea, and readers have to hold the first half in memory to parse the second.",
        fix: "Split anything over 25 words. Aim for a mix, with the shortest sentences carrying the most important claims.",
        penalty: 8,
      };
    },
  },
  {
    id: "reader-focus",
    category: "friction",
    run: (c) => {
      if (c.metrics.wordCount < 120) return null;
      const r = c.metrics.youRatio;
      if (r >= 0.45) return ok(`Reader-focused language at ${Math.round(r * 100)}%`);
      return {
        severity: "warning",
        title: `Page talks about itself ${Math.round((1 - r) * 100)}% of the time`,
        why: "Counting first and second person pronouns is a fast read on whose problem the page is about. When \"we\" dominates, the copy is a company introduction rather than an argument for the visitor.",
        fix: "Rewrite the heaviest \"we\" sentences to start with \"you\". The facts stay, the subject changes.",
        evidence: `you/your vs we/our ratio is ${r.toFixed(2)}`,
        penalty: 9,
      };
    },
  },
];

/* ==========================================================================
   ACTION
   ========================================================================== */

const actionRules: Rule[] = [
  {
    id: "cta-present",
    category: "action",
    run: (c) =>
      c.extracted.ctas.length > 0
        ? null
        : {
            severity: "critical",
            title: "No call to action found",
            why: "There is no button, no submit control, and no action-worded link. Whatever the page is meant to achieve, there is currently no way for a visitor to do it.",
            fix: "Add one primary action, worded as what the visitor gets rather than what the system does.",
            penalty: 55,
          },
  },
  {
    id: "cta-opening",
    category: "action",
    run: (c) => {
      if (!c.extracted.ctas.length) return null;
      if (c.openingHasCta) return ok("A CTA appears in the opening section");
      return {
        severity: "critical",
        title: "No CTA in the opening section",
        why: "Visitors who are already sold have nothing to click without scrolling. Making a ready buyer hunt for the button is the cheapest conversion loss on any page.",
        fix: "Place the primary CTA directly under the headline, then repeat it after each proof section.",
        penalty: 20,
      };
    },
  },
  {
    id: "cta-weak-text",
    category: "action",
    run: (c) => {
      if (!c.extracted.ctas.length) return null;
      const weak = c.extracted.ctas.filter((cta) =>
        CTA_HELPERS.WEAK_CTA_TEXT.includes(cta.text.toLowerCase().trim()),
      );
      if (!weak.length) return ok("CTA labels are specific");
      return {
        severity: "warning",
        title: `${weak.length} CTA${weak.length === 1 ? "" : "s"} use generic wording`,
        why: "Generic labels make the visitor guess what happens next. Uncertainty at the moment of clicking is exactly where hesitation costs conversions.",
        fix: 'Name the outcome instead. "Get my free audit" outperforms "Submit" because it says what arrives.',
        evidence: weak.map((w) => `"${w.text}"`).join(", "),
        penalty: 12,
      };
    },
  },
  {
    id: "cta-competing",
    category: "action",
    run: (c) => {
      const distinct = new Set(c.extracted.ctas.map((x) => x.text.toLowerCase()));
      if (distinct.size <= 4) return null;
      const severity: Severity = distinct.size > 8 ? "critical" : "warning";
      return {
        severity,
        title: `${distinct.size} different actions on one page`,
        why: "Each additional choice adds a decision the visitor did not come here to make. Pages with one job convert better than pages offering a menu.",
        fix: "Pick one primary action and repeat it. Demote everything else to a text link.",
        evidence: [...distinct].slice(0, 8).map((t) => `"${t}"`).join(", "),
        penalty: severity === "critical" ? 18 : 10,
      };
    },
  },
  {
    id: "cta-repetition",
    category: "action",
    run: (c) => {
      if (!c.extracted.ctas.length) return null;
      if (c.metrics.wordCount < 500) return null;
      // Placements, not distinct labels. One button repeated four times is the
      // ideal, not a finding.
      if (c.ctaOccurrences >= 3)
        return ok(`CTA appears in ${c.ctaOccurrences} places down the page`);
      return {
        severity: "warning",
        title: `Long page with only ${c.ctaOccurrences} CTA placement${c.ctaOccurrences === 1 ? "" : "s"}`,
        why: "Readers reach the decision point at different scroll depths. A single button means everyone has to scroll back to the one place it lives.",
        fix: "Repeat the same primary CTA after the proof section and again at the end.",
        penalty: 9,
      };
    },
  },
];

/* ==========================================================================
   CRAFT
   ========================================================================== */

const craftRules: Rule[] = [
  {
    id: "viewport",
    category: "craft",
    run: (c) =>
      c.metrics.hasViewport
        ? ok("Viewport meta tag present")
        : {
            severity: "critical",
            title: "No viewport meta tag",
            why: "Mobile browsers render the page at desktop width and zoom out, so text arrives unreadably small. Most landing page traffic is mobile.",
            fix: '<meta name="viewport" content="width=device-width, initial-scale=1">',
            penalty: 30,
          },
  },
  {
    id: "https",
    category: "craft",
    run: (c) =>
      c.metrics.https
        ? ok("Served over HTTPS")
        : {
            severity: "critical",
            title: "Page is not served over HTTPS",
            why: "Browsers mark the page as not secure, and any form on it will trigger a warning at the exact moment the visitor is deciding to trust you.",
            fix: "Issue a certificate and redirect all HTTP traffic to HTTPS.",
            penalty: 30,
          },
  },
  {
    id: "lang-attr",
    category: "craft",
    run: (c) =>
      c.metrics.hasLang
        ? null
        : {
            severity: "warning",
            title: "No lang attribute on <html>",
            why: "Screen readers pick a pronunciation from it, and translation tools use it to decide whether to offer a translation.",
            fix: '<html lang="en">',
            penalty: 6,
          },
  },
  {
    id: "img-alt",
    category: "craft",
    run: (c) => {
      const { total, missingAlt } = c.extracted.images;
      if (total === 0) return null;
      if (missingAlt === 0) return ok(`All ${total} images have alt text`);
      const share = missingAlt / total;
      const severity: Severity = share > 0.5 ? "warning" : "warning";
      return {
        severity,
        title: `${missingAlt} of ${total} images have no alt text`,
        why: "Screen reader users get silence where the proof, product shot, or logo wall should be. It is also the single most common accessibility failure on landing pages.",
        fix: 'Describe what the image communicates. Decorative images take alt="" so they get skipped deliberately.',
        penalty: Math.min(14, Math.round(share * 16)),
      };
    },
  },
  {
    id: "heading-order",
    category: "craft",
    run: (c) => {
      const levels = c.extracted.headings.map((h) => h.level);
      let skips = 0;
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) skips++;
      }
      if (!levels.length) return null;
      if (skips === 0) return ok("Heading hierarchy is sequential");
      return {
        severity: "warning",
        title: `Heading levels skip ${skips} time${skips === 1 ? "" : "s"}`,
        why: "Assistive tech builds a document outline from heading order. Jumping from H2 to H4 reads as a missing section.",
        fix: "Choose heading levels by position in the outline, then style them with CSS.",
        penalty: 6,
      };
    },
  },
  {
    id: "page-weight",
    category: "craft",
    run: (c) => {
      const kb = Math.round(c.metrics.htmlBytes / 1024);
      if (kb <= 400) return ok(`HTML document is ${kb} KB`);
      const severity: Severity = kb > 1000 ? "critical" : "warning";
      return {
        severity,
        title: `HTML document is ${kb} KB before any assets load`,
        why: "The document has to arrive and parse before anything renders. On a mid-range phone over mobile data, this is measured in seconds of blank screen.",
        fix: "Move inlined data and styles into cached files, and render below-fold sections on demand.",
        penalty: severity === "critical" ? 16 : 8,
      };
    },
  },
  {
    id: "script-load",
    category: "craft",
    run: (c) => {
      const n = c.metrics.scriptCount;
      const hosts = c.metrics.externalHosts;
      if (n <= 15) return ok(`${n} script tags, ${hosts} external hosts`);
      const severity: Severity = n > 40 ? "critical" : "warning";
      return {
        severity,
        title: `${n} script tags across ${hosts} external hosts`,
        why: "Every third-party host adds a DNS lookup and a TLS handshake before its script even starts. Tag stacks are the usual reason a well-built page still feels slow.",
        fix: "Audit what each tag is for, drop the ones nobody reads, and defer the rest.",
        penalty: severity === "critical" ? 14 : 7,
      };
    },
  },
];

export const ALL_RULES: Rule[] = [
  ...clarityRules,
  ...offerRules,
  ...proofRules,
  ...frictionRules,
  ...actionRules,
  ...craftRules,
];

export function runRules(ctx: RuleContext): Issue[] {
  const issues: Issue[] = [];
  for (const rule of ALL_RULES) {
    let verdict: Verdict | null = null;
    try {
      verdict = rule.run(ctx);
    } catch {
      // A single misbehaving rule must never take down the whole audit.
      continue;
    }
    if (!verdict) continue;
    issues.push({
      id: rule.id,
      category: rule.category,
      severity: verdict.severity,
      title: verdict.title,
      why: verdict.why,
      fix: verdict.fix,
      evidence: verdict.evidence,
      penalty: verdict.penalty,
    });
  }
  return issues;
}

export const RULE_COUNT = ALL_RULES.length;
