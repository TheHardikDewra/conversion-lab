/**
 * Headless layout check.
 *
 * Drives a Chrome you already have installed (via puppeteer-core, so nothing
 * is downloaded) and asserts that no route scrolls horizontally at any of the
 * viewport widths this template claims to support, in either theme. When it
 * finds overflow it names the element responsible, because "something is too
 * wide" is not a useful failure.
 *
 * Start the app first, then:  npm run verify:layout
 * Point it elsewhere with:    BASE=https://your-app npm run verify:layout
 * Override the browser with:  CHROME=/path/to/chrome npm run verify:layout
 */
import { existsSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:5000";

/** Chrome lives in a different place on every platform, so look rather than assume. */
const CANDIDATES = [
  process.env.CHROME,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/snap/bin/chromium",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);

const executablePath = CANDIDATES.find((p) => {
  try {
    return existsSync(p);
  } catch {
    return false;
  }
});

if (!executablePath) {
  console.error(
    "\nNo Chrome found. This check drives a browser you already have rather than\n" +
      "downloading one. Install Chrome or Chromium, or point at it directly:\n\n" +
      "  CHROME=/path/to/chrome npm run verify:layout\n",
  );
  process.exit(1);
}

// Deliberately not a dependency of this template. It is ~13MB and only this
// optional check needs it, so a remixer who just wants the app does not carry
// it. One command away if you do want to run the check.
let puppeteer;
try {
  puppeteer = (await import("puppeteer-core")).default;
} catch {
  console.error(
    "\nThis check needs puppeteer-core, which is deliberately not bundled with\n" +
      "the template so the install stays small. Add it when you want it:\n\n" +
      "  npm install -D puppeteer-core\n",
  );
  process.exit(1);
}

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
  { name: "phone-sm", width: 375, height: 812 },
  { name: "phone-lg", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 900 },
  { name: "desktop", width: 1600, height: 1000 },
];

const THEMES = ["light", "dark"];

// Fail fast with a useful message rather than a connection stack trace.
try {
  const res = await fetch(`${BASE}/healthz`, { signal: AbortSignal.timeout(4000) });
  if (!res.ok) throw new Error(String(res.status));
} catch {
  console.error(`\nNothing responding at ${BASE}. Start the app first:\n\n  npm run dev\n`);
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath,
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
      await page.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, 300));

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
                `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).slice(0, 45) : ""} w=${Math.round(r.width)}`,
              );
            }
          });
        }
        return { vw, sw, offenders: offenders.slice(0, 3) };
      });

      checks++;
      if (result.sw > result.vw + 1) failures.push({ theme, vp: vp.name, route, ...result });
    }
  }
}

await browser.close();

console.log(
  `\n${checks} checks: ${ROUTES.length} routes x ${WIDTHS.length} widths x ${THEMES.length} themes\n`,
);

if (!failures.length) {
  console.log("no horizontal overflow anywhere\n");
  process.exit(0);
}

console.log(`${failures.length} OVERFLOW FAILURES:\n`);
for (const f of failures) {
  console.log(`  [${f.theme} / ${f.vp}] ${f.route}   viewport ${f.vw}, content ${f.sw}`);
  f.offenders.forEach((o) => console.log(`      ${o}`));
}
console.log("");
process.exit(1);
