# Contra submission copy

Draft text for the Replit Buildathon entry. Nothing here has been submitted.
Edit freely before pasting.

**Live preview:** https://theconversionlab.vercel.app
**Source:** https://github.com/TheHardikDewra/conversion-lab

---

## Title

**Conversion Lab - landing page teardowns that score**

## One-liner

Paste any landing page URL and get a scored CRO teardown: six weighted
categories, ranked findings with the evidence behind each one, and stronger
copy you can ship.

## Category

Business tools / AI-agent apps. It also ships a documented design system, so it
fits that category too.

---

## Description

Every founder shipping a landing page has the same question and no good way to
answer it: is this actually going to convert? Analytics tell you it did not,
three weeks too late. Conversion Lab tells you before you spend the traffic.

Paste a URL. It fetches the live page, reads the copy and the structure, and
scores it 0-100 across Clarity, Offer, Proof, Friction, Action and Craft. Every
finding says what is wrong, quotes the evidence it found on the page, explains
what it costs you in plain language, and tells you what to do instead.

**Two layers, and only one needs a key.** The rulebook is 35 deterministic
checks written in plain TypeScript: heading structure, CTA wording and
placement, form length, proof signals, risk reversal, readability, reader-focus
ratio, page weight, alt text, script load. No model involved, nothing to
configure, nothing leaves your server beyond the page fetch. Add an Anthropic
key and audits also return a written verdict plus three rewrites for every
headline, subhead and CTA, each labelled with the angle it takes and why it
should win.

That split is the whole design. A template that only works once you have wired
up billing is a template nobody remixes. This one boots into a populated,
working product in about a second with nothing set up.

**It is designed like the thing it is.** A CRO audit is a report, so it is
typeset like one: Instrument Serif for display, Geist for the interface, Geist
Mono for every number, and an editorial scale with real contrast between them.
The score is a typeset figure read against a calibrated rail with tick marks,
not a dashboard donut. Structure comes from hairline rules and margin rather
than cards nested inside cards. Findings are numbered like report entries with
a severity rule down the left edge. Light and dark are both first-class, with
signal colours re-tuned for each rather than dimmed.

**Six screens:** an index with score history and distribution, the full report,
a rewrite studio, a public share link that reads as a document rather than
somebody else's dashboard, a live rubric editor, and design system docs.

**Genuinely remixable, at three depths.** Drag the sliders on /rubric and every
stored audit re-scores instantly from its existing findings, no re-fetching, so
comparisons stay honest. Add a check by appending one fifteen-line object to
`server/analyzer/rules.ts` and it appears in the UI, the score and the share
report with nothing else to touch. Rebrand the entire app, both themes, by
editing one block of CSS variables, because no component hardcodes a colour.

**The sample data is real.** The six audits it ships with are actual analyzer
output against Stripe, Linear, Basecamp, Plausible, Ghost and Tally. Nothing is
estimated or illustrative. Regenerate any time with `npm run seed:build`.

**Built to be deployed by strangers.** Fetching a user-supplied URL is the most
dangerous thing this app does, so it resolves DNS and blocks private, loopback,
link-local and cloud-metadata addresses, re-validates every redirect hop instead
of letting fetch follow them, and enforces size and time caps. Storage runs
in-memory by default and upgrades itself to Postgres when DATABASE_URL appears,
falling back rather than failing if the connection is bad. `npm run
verify:layout` checks every route at five viewport widths in both themes for
horizontal overflow, so a remixer who breaks the layout finds out immediately.

---

## Why someone would remix this

- A designer wants a CRO audit they can hand a client with their own logo on it
- An agency wants the rubric reweighted for ecommerce and three checks added
- A SaaS team wants it pointed at their own pages on a schedule
- Anyone building on Replit just shipped a landing page and wants to know if it
  is any good

---

## Tech

React, Vite, Express, TypeScript, Tailwind mapped entirely onto CSS variables,
Drizzle, Cheerio, and the Anthropic SDK for the optional layer. Every mark is
hand-drawn SVG or laid-out elements; no charting library. Single process, one
port, published straight from Replit.

---

## Links to paste

- Live app: *(paste the Replit published URL here)*
- Source: https://github.com/TheHardikDewra/conversion-lab
- Preview deploy: https://theconversionlab.vercel.app
- Demo clip: `docs/demo.gif` in the repo, embedded at the top of the README

---

## Pre-submit checklist

- [ ] Imported into Replit and Run succeeds
- [ ] Published, and the published URL loads
- [ ] Decide on the copy layer: add `ANTHROPIC_API_KEY` to Secrets and re-run a
      sample so the Rewrites tab has real variants in it. Without a key that tab
      shows the page's actual headline and CTA with empty A/B/C slots marked
      "awaiting key", which is honest but sells the feature less well.
- [ ] Replit URL pasted into the links section above
- [ ] Confirm this is the only published app on the Starter plan, or accept it
      taking that slot
