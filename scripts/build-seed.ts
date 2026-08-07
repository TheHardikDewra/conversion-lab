/**
 * Generates server/seed.ts by running the real analyzer against real pages.
 *
 * Nothing in the seed file is hand-written or estimated. Every score, issue,
 * and metric below is the actual output of the rulebook against the live page
 * on the date stamped in the header. Re-run with `npm run seed:build` to
 * refresh it.
 */
import { writeFileSync } from "node:fs";
import { runAudit } from "../server/analyzer/index";

// A deliberate spread: two flagship pages, two indie SaaS pages, a publishing
// platform and a design tool. Whatever they score is what ships - the point of
// the sample set is a believable range, not a flattering one.
const TARGETS = [
  "https://basecamp.com",
  "https://linear.app",
  "https://www.stripe.com",
  "https://plausible.io",
  "https://ghost.org",
  "https://tally.so",
  "https://buttondown.com",
  "https://www.framer.com",
  "https://beehiiv.com",
  "https://usefathom.com",
  "https://cal.com",
  "https://posthog.com",
];

const WANT = 6;

// Deterministic ids so re-running the builder does not churn share links.
const IDS = [
  ["sample-basecamp", "smpl_basecamp_2f4a9c1b7e"],
  ["sample-linear", "smpl_linear_9b1c7d5e3a"],
  ["sample-stripe", "smpl_stripe_1a7d4b9e2f"],
  ["sample-plausible", "smpl_plausible_6d3e8a2f4c"],
  ["sample-ghost", "smpl_ghost_4e8f2a6c9d"],
  ["sample-tally", "smpl_tally_5b2e9f7a1c"],
  ["sample-buttondown", "smpl_buttondown_2c8a4f6d3b"],
  ["sample-framer", "smpl_framer_9e3b7c1a5f"],
  ["sample-beehiiv", "smpl_beehiiv_6a1d8e4b2c"],
  ["sample-fathom", "smpl_fathom_4f7c2b9d6e"],
  ["sample-cal", "smpl_cal_3d9e6b4a8c"],
  ["sample-posthog", "smpl_posthog_8c2f5a1d7b"],
];

async function main() {
  const collected: string[] = [];
  let index = 0;

  for (const url of TARGETS) {
    if (collected.length >= WANT) break;
    const [id, token] = IDS[index++];
    process.stdout.write(`  ${url} ... `);
    try {
      const { result, finalUrl } = await runAudit(url);
      console.log(
        `${result.score}/100 (${result.grade})  ${
          result.issues.filter((i) => i.severity !== "pass").length
        } issues`,
      );
      // Stagger timestamps so the dashboard has a believable ordering.
      const created = new Date(
        Date.UTC(2026, 7, 6, 9, 0, 0) + collected.length * 3_600_000,
      ).toISOString();
      collected.push(
        JSON.stringify(
          {
            id,
            shareToken: token,
            url,
            finalUrl,
            pageTitle: result.extracted.title,
            createdAt: created,
            result,
          },
          null,
          2,
        ),
      );
    } catch (err) {
      console.log(`skipped (${(err as Error).message})`);
    }
  }

  if (collected.length < 3) {
    throw new Error(`only ${collected.length} audits succeeded, need at least 3`);
  }

  const file = `// GENERATED FILE - do not edit by hand. Run \`npm run seed:build\` to refresh.
//
// Every number in here is real output from server/analyzer against the live
// page, captured ${new Date().toISOString().slice(0, 10)}. No values are estimated or illustrative.
// These are the sample audits a fresh remix boots into, so the app is never
// an empty state on first run.
//
// Scores reflect this template's own rubric and nothing else. They are not a
// judgement of the companies involved, whose pages are public and were fetched
// exactly as any browser would fetch them.
import type { AuditResult } from "../shared/schema";

export type SeedAudit = {
  id: string;
  shareToken: string;
  url: string;
  finalUrl: string;
  pageTitle: string | null;
  createdAt: string;
  result: AuditResult;
};

export const SEED_AUDITS: SeedAudit[] = ${
    "[\n" + collected.map((c) => c.replace(/^/gm, "  ")).join(",\n") + "\n]"
  };
`;

  writeFileSync(new URL("../server/seed.ts", import.meta.url), file);
  console.log(`\nwrote server/seed.ts with ${collected.length} audits`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
