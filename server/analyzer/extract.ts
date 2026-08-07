import * as cheerio from "cheerio";
import type { Extracted, Metrics } from "@shared/schema";
import type { FetchedPage } from "./fetch";

/**
 * Turns raw HTML into the structured facts the rubric reasons about.
 * No judgement happens here - this file only reports what is on the page.
 */

const ACTION_VERBS = [
  "get", "start", "try", "book", "buy", "join", "sign up", "signup", "subscribe",
  "download", "request", "claim", "schedule", "order", "shop", "add to cart",
  "contact", "demo", "apply", "register", "create", "launch", "unlock", "grab",
  "reserve", "install", "upgrade", "continue", "checkout", "enroll", "begin",
];

const WEAK_CTA_TEXT = [
  "submit", "click here", "learn more", "read more", "find out more", "more info",
  "see more", "explore", "discover", "continue", "next", "go", "here", "view",
];

const GUARANTEE_WORDS = [
  "money back", "money-back", "refund", "guarantee", "guaranteed",
  "cancel anytime", "no credit card", "free trial", "risk free", "risk-free",
  "no commitment", "full refund", "30-day", "30 day",
];

/**
 * Site chrome that looks like a call to action to a naive matcher. Without
 * this list a nav bar reads as a dozen competing CTAs and the Action score
 * collapses on pages that are actually fine.
 */
const NAV_WORDS = new Set([
  "product", "products", "resources", "pricing", "company", "about", "about us",
  "blog", "docs", "documentation", "careers", "login", "log in", "sign in",
  "signin", "contact", "contact us", "support", "customers", "changelog",
  "security", "integrations", "solutions", "features", "enterprise", "developers",
  "community", "help", "status", "terms", "privacy", "legal", "partners", "news",
  "press", "events", "guides", "api", "download", "menu", "search", "home",
  "case studies", "testimonials", "faq", "faqs", "team", "story", "use cases",
  "open menu", "close menu", "toggle menu", "skip to content", "skip to main content",
  "accept all", "reject all", "manage cookies", "cookie settings",
]);

/**
 * Elements that imply a line break. Cheerio's .text() concatenates descendants
 * with no separator, so without this a heading welds onto the paragraph after
 * it and sentence detection never finds a boundary. That was making every
 * heading-heavy page score 0 for readability.
 */
const BLOCK_TAGS =
  "address,article,aside,blockquote,br,dd,details,div,dl,dt,fieldset," +
  "figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,li,main," +
  "nav,ol,p,pre,section,summary,table,tbody,td,tfoot,th,thead,tr,ul,button," +
  "label,option,legend";

/** Inline wrappers commonly used to split a headline into animated words. */
const INLINE_TAGS = "span,a,strong,em,b,i,small,mark,abbr,cite,q,u";

const PROOF_BRANDS = [
  "g2", "trustpilot", "capterra", "product hunt", "producthunt",
  "yelp", "clutch", "gartner", "forbes", "techcrunch",
];

/** Rough but stable syllable count. Good enough for a readability band. */
function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return w.length ? 1 : 0;
  const groups = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

function normalise(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export type ExtractOutput = {
  extracted: Extracted;
  metrics: Metrics;
  /** Visible body copy with chrome stripped. The rubric reads this. */
  bodyText: string;
  /** First slice of the document, used as an opening-section proxy. */
  openingText: string;
  openingHasCta: boolean;
  /** Total CTA placements, before de-duplicating by label. */
  ctaOccurrences: number;
};

export function extractPage(page: FetchedPage): ExtractOutput {
  const $ = cheerio.load(page.html);
  const origin = new URL(page.finalUrl).host;

  // Drop anything explicitly hidden from assistive tech before reading a single
  // word. Animated hero headlines routinely ship two or three aria-hidden
  // copies of the same sentence next to one real one, and counting all of them
  // makes the headline look three times its length. Removing them early means
  // every downstream measurement sees the page a screen reader would see.
  $('[aria-hidden="true"], [hidden], template, noscript').remove();

  // ---- Head ---------------------------------------------------------------
  const title = normalise($("head > title").first().text()) || null;
  const metaDescription =
    normalise($('meta[name="description"]').attr("content") ?? "") || null;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasLang = !!$("html").attr("lang");

  // ---- Counts taken before we strip anything ------------------------------
  const scriptCount = $("script[src]").length + $("script:not([src])").length;
  const externalHosts = new Set<string>();
  $("script[src], link[href], img[src], iframe[src]").each((_, el) => {
    const raw =
      $(el).attr("src") ?? $(el).attr("href") ?? "";
    if (!raw) return;
    try {
      const host = new URL(raw, page.finalUrl).host;
      if (host && host !== origin) externalHosts.add(host);
    } catch {
      /* relative or malformed - ignore */
    }
  });

  const images = {
    total: $("img").length,
    missingAlt: $("img").filter((_, el) => {
      const alt = $(el).attr("alt");
      return alt === undefined || alt.trim() === "";
    }).length,
  };

  const navLinks = $("nav a, header a").length;

  // ---- Headings -----------------------------------------------------------
  const headings: { level: number; text: string }[] = [];
  $("h1, h2, h3, h4").each((_, el) => {
    const text = normalise($(el).text());
    if (text) headings.push({ level: Number(el.tagName.slice(1)), text });
  });
  const h1 = headings.filter((h) => h.level === 1).map((h) => h.text);

  // ---- Calls to action ----------------------------------------------------
  const ctaSeen = new Set<string>();
  const ctas: Extracted["ctas"] = [];
  // Distinct labels answer "how many different things is this page asking for".
  // Total placements answer "how often can someone act". They are different
  // questions and the rubric asks both.
  let ctaOccurrences = 0;

  /**
   * A candidate counts as a call to action only if it reads like one: either it
   * opens with an action verb, or it is styled as a button. Site navigation and
   * product-screenshot UI clear neither bar once nav vocabulary is excluded.
   * Being strict here matters - the "competing CTAs" rule is meaningless if a
   * nav bar inflates the count.
   */
  const pushCta = (
    rawText: string,
    kind: "button" | "link" | "submit",
    href: string | null,
    looksButton: boolean,
  ) => {
    const clean = normalise(rawText);
    if (!clean) return;

    // Buttons say "Get the report". Cards say "Hertz unifies commerce with
    // Stripe." Length and a trailing full stop separate the two reliably, and
    // without them every linked card heading counts as a competing action.
    if (clean.length > 40) return;
    if (clean.split(" ").length > 6) return;
    if (/[.!?]$/.test(clean)) return;

    const key = clean.toLowerCase();
    if (NAV_WORDS.has(key)) return;

    const verbMatch = ACTION_VERBS.some(
      (v) => key === v || key.startsWith(`${v} `),
    );
    if (!verbMatch && !looksButton) return;

    // A lone noun with no verb and no button styling is almost always a label.
    if (!verbMatch && key.split(" ").length < 2) return;

    ctaOccurrences++;
    if (ctaSeen.has(key)) return;
    ctaSeen.add(key);
    ctas.push({ text: clean, kind, href });
  };

  const isButtonish = (el: cheerio.Cheerio<never>) => {
    const cls = (el.attr("class") ?? "").toLowerCase();
    return /\b(btn|button|cta)\b/.test(cls) || el.attr("role") === "button";
  };

  // A <button> tag is not evidence of a call to action. Product screenshots and
  // embedded app demos are made of buttons, and treating each one as an action
  // is what makes a well-built page look like it is asking for thirty things.
  // Require the same proof as a link: an action verb, or CTA styling.
  $("button").each((_, el) =>
    pushCta($(el).text(), "button", null, isButtonish($(el) as never)),
  );
  $('input[type="submit"], input[type="button"]').each((_, el) =>
    pushCta($(el).attr("value") ?? "Submit", "submit", null, true),
  );
  $("a").each((_, el) => {
    const $el = $(el);
    // Links inside a <nav> are navigation by the author's own markup.
    if ($el.closest("nav").length) return;
    pushCta($el.text(), "link", $el.attr("href") ?? null, isButtonish($el as never));
  });

  // ---- Forms --------------------------------------------------------------
  const formFields: Extracted["formFields"] = [];
  $("input, select, textarea").each((_, el) => {
    const $el = $(el);
    const type = ($el.attr("type") ?? el.tagName).toLowerCase();
    if (["hidden", "submit", "button", "image", "reset"].includes(type)) return;
    const id = $el.attr("id");
    const labelled =
      (!!id && $(`label[for="${id}"]`).length > 0) ||
      $el.closest("label").length > 0 ||
      !!$el.attr("aria-label") ||
      !!$el.attr("aria-labelledby");
    formFields.push({
      name: $el.attr("name") ?? $el.attr("placeholder") ?? type,
      type,
      labelled,
    });
  });

  // ---- Body copy ----------------------------------------------------------
  $("script, style, svg, iframe").remove();

  // Cheerio joins descendant text with nothing at all, so "…system.<h2>Built for"
  // comes back as "system.Built for". Inject the separators the markup implies
  // before reading, or every measurement downstream is computed on a single
  // run-on string.
  $(BLOCK_TAGS).each((_, el) => {
    $(el).append("\n");
  });
  $(INLINE_TAGS).each((_, el) => {
    $(el).append(" ");
  });

  const rawBody = $("body").text();
  const bodyText = normalise(rawBody);
  const lowerBody = bodyText.toLowerCase();

  // Opening-section proxy. We cannot render, so we use the leading slice of
  // the document. Everything phrased around this says "opening", never
  // "above the fold" - we have not measured pixels and will not pretend to.
  const openingText = bodyText.slice(0, Math.max(600, Math.floor(bodyText.length * 0.15)));
  const openingLower = openingText.toLowerCase();
  const openingHasCta = ctas.some((c) => openingLower.includes(c.text.toLowerCase()));

  // ---- Proof signals ------------------------------------------------------
  const proofSignals: Extracted["proofSignals"] = [];
  const addProof = (kind: string, evidence: string) => {
    if (proofSignals.length < 12) proofSignals.push({ kind, evidence: normalise(evidence).slice(0, 160) });
  };

  const quoteNodes = $(
    'blockquote, [class*="testimonial" i], [class*="review" i], [class*="quote" i], [id*="testimonial" i]',
  );
  if (quoteNodes.length) {
    addProof("testimonial", `${quoteNodes.length} testimonial or quote block(s): "${quoteNodes.first().text()}"`);
  }

  const starNodes = $('[class*="star" i], [class*="rating" i], [aria-label*="star" i]');
  if (starNodes.length || /★|⭐/.test(bodyText)) {
    addProof("rating", `Rating markup or star glyphs present (${starNodes.length} node(s))`);
  }

  const ratingMatch = bodyText.match(/\b\d(?:[.,]\d)?\s*\/\s*5\b|\b\d(?:[.,]\d)?\s*out of\s*5\b/i);
  if (ratingMatch) addProof("rating-value", ratingMatch[0]);

  const countMatch = bodyText.match(
    /\b\d{1,3}(?:,\d{3})+\+?\s+(?:customers|users|members|businesses|companies|teams|people|reviews|downloads|subscribers)\b/i,
  ) || bodyText.match(
    /\b\d{1,3}(?:k|K|m|M)\+?\s+(?:customers|users|members|businesses|companies|teams|people|reviews|downloads|subscribers)\b/,
  );
  if (countMatch) addProof("volume", countMatch[0]);

  if (/trusted by|as seen in|as featured in|used by|backed by/i.test(bodyText)) {
    const m = bodyText.match(/.{0,40}(trusted by|as seen in|as featured in|used by|backed by).{0,60}/i);
    addProof("authority", m?.[0] ?? "Authority phrase present");
  }

  const logoNodes = $('[class*="logo" i][class*="grid" i], [class*="clients" i], [class*="brands" i], [class*="partners" i]');
  if (logoNodes.length) addProof("logo-wall", `${logoNodes.length} logo or client grid container(s)`);

  for (const brand of PROOF_BRANDS) {
    if (lowerBody.includes(brand)) {
      addProof("third-party", `Mentions ${brand}`);
      break;
    }
  }

  const guarantee = GUARANTEE_WORDS.find((g) => lowerBody.includes(g));
  if (guarantee) {
    const idx = lowerBody.indexOf(guarantee);
    addProof("guarantee", bodyText.slice(Math.max(0, idx - 30), idx + 70));
  }

  // ---- Copy metrics -------------------------------------------------------
  const words = bodyText.match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
  const wordCount = words.length;

  // Segment on real punctuation and on the block boundaries injected above. A
  // heading is its own unit of reading even though it carries no full stop.
  const rawSegments = rawBody
    .split(/(?<=[.!?])\s+|[\n\r]+/)
    .map((s) => normalise(s))
    .filter(Boolean);

  // Markup splits sentences the reader experiences as continuous: a wrapper
  // <div> mid-paragraph, a styled <span> promoted to a block. Where a segment
  // does not end in terminal punctuation and the next opens lowercase, those
  // two were one sentence before the markup got involved. Without this the
  // average sentence reads about 30% shorter than the page actually is.
  const segments: string[] = [];
  for (const seg of rawSegments) {
    const prev = segments[segments.length - 1];
    if (prev && !/[.!?:;,]$/.test(prev) && /^[a-z]/.test(seg)) {
      segments[segments.length - 1] = `${prev} ${seg}`;
    } else {
      segments.push(seg);
    }
  }

  // Only segments long enough to be prose feed the readability figure. Nav
  // labels and one-word buttons are not sentences, and averaging them in makes
  // a dense page look breezy.
  const prose = segments.filter((s) => s.split(" ").length >= 4);
  const proseSentences = prose.length;

  const proseWords = prose.join(" ").match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
  const proseSyllables = proseWords.reduce((n, w) => n + syllables(w), 0);

  const avgSentenceWords = proseSentences ? proseWords.length / proseSentences : 0;
  const readingEase =
    proseWords.length === 0
      ? 0
      : 206.835 -
        1.015 * avgSentenceWords -
        84.6 * (proseSyllables / proseWords.length);

  const youWords = (bodyText.match(/\b(you|your|you're|yours)\b/gi) ?? []).length;
  const weWords = (bodyText.match(/\b(we|our|us|ours|i|my)\b/gi) ?? []).length;
  const youRatio = youWords + weWords === 0 ? 0 : youWords / (youWords + weWords);

  return {
    extracted: {
      title,
      metaDescription,
      h1,
      headings: headings.slice(0, 60),
      ctas: ctas.slice(0, 30),
      formFields: formFields.slice(0, 30),
      proofSignals,
      navLinks,
      images,
    },
    metrics: {
      wordCount,
      proseSentences,
      avgSentenceWords: Number(avgSentenceWords.toFixed(1)),
      readingEase: Number(Math.max(0, Math.min(100, readingEase)).toFixed(1)),
      youRatio: Number(youRatio.toFixed(2)),
      htmlBytes: page.bytes,
      scriptCount,
      externalHosts: externalHosts.size,
      fetchMs: page.fetchMs,
      hasViewport,
      hasLang,
      https: page.finalUrl.startsWith("https://"),
    },
    bodyText,
    openingText,
    openingHasCta,
    ctaOccurrences,
  };
}

export const CTA_HELPERS = { ACTION_VERBS, WEAK_CTA_TEXT, GUARANTEE_WORDS };
