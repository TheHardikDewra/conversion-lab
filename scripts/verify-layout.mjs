/**
 * Deterministic layout verification. Drives the installed Chrome headlessly so
 * the result does not depend on an extension staying connected.
 *
 * For every route, at every width, in both themes: does the document scroll
 * horizontally, and if so which element is responsible?
 */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE ?? "http://localhost:5051";

const ROUTES = [
  "/",
  "/audit/sample-stripe",
  "/audit/sample-linear",
  "/rubric",
  "/system",
  "/r/smpl_stripe_1a7d4b9e2f",
  "/nope",
];

const WIDTHS = [
  { name: "iphone-se", width: 375, height: 812 },
  { name: "iphone-pro", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 900 },
  { name: "desktop", width: 1600, height: 1000 },
];

const THEMES = ["light", "dark"];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
const failures = [];
let checks = 0;

for (const theme of THEMES) {
  for (const vp of WIDTHS) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 30000 });
      await page.evaluate((t) => {
        localStorage.setItem("cl-theme", t);
        document.documentElement.classList.toggle("dark", t === "dark");
      }, theme);
      // Let fonts settle and the entrance animations finish.
      await page.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, 350));

      const result = await page.evaluate(() => {
        const d = document.documentElement;
        const vw = d.clientWidth;
        const sw = d.scrollWidth;
        const offenders = [];
        if (sw > vw + 1) {
          document.querySelectorAll("*").forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.right > vw + 1 && r.width > 0) {
              offenders.push(
                el.tagName.toLowerCase() +
                  (el.className ? "." + String(el.className).slice(0, 45) : "") +
                  ` w=${Math.round(r.width)} right=${Math.round(r.right)}`,
              );
            }
          });
        }
        return { vw, sw, offenders: offenders.slice(0, 3) };
      });

      checks++;
      if (result.sw > result.vw + 1) {
        failures.push({ theme, vp: vp.name, route, ...result });
      }
    }
  }
}

// Spot-check that the responsive display type actually swaps at the breakpoint.
const typeCheck = [];
for (const vp of [{ w: 375 }, { w: 1280 }]) {
  await page.setViewport({ width: vp.w, height: 900 });
  await page.goto(BASE + "/audit/sample-stripe", { waitUntil: "networkidle2" });
  await page.evaluate(() => document.fonts.ready);
  const sizes = await page.evaluate(() => {
    const score = document.querySelector('[role="img"] span');
    const h1 = document.querySelector("h1");
    const mark = document.querySelector("header span.display");
    return {
      score: score ? getComputedStyle(score).fontSize : null,
      title: h1 ? getComputedStyle(h1).fontSize : null,
      wordmark: mark ? getComputedStyle(mark).fontSize : null,
    };
  });
  typeCheck.push({ viewport: vp.w, ...sizes });
}

await browser.close();

console.log(`\nran ${checks} layout checks (${ROUTES.length} routes x ${WIDTHS.length} widths x ${THEMES.length} themes)\n`);
console.log("responsive display type:");
for (const t of typeCheck) {
  console.log(`  ${String(t.viewport).padStart(4)}px  score ${t.score}  title ${t.title}  wordmark ${t.wordmark}`);
}
console.log("");
if (!failures.length) {
  console.log("no horizontal overflow on any route, at any width, in either theme");
  process.exit(0);
}
console.log(`${failures.length} OVERFLOW FAILURES:`);
for (const f of failures) {
  console.log(`  [${f.theme}/${f.vp}] ${f.route}  vw=${f.vw} sw=${f.sw}`);
  f.offenders.forEach((o) => console.log(`      ${o}`));
}
process.exit(1);
