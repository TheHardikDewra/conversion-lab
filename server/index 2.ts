import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { registerRoutes } from "./routes";
import { getStorage } from "./storage";

const isDev = process.env.NODE_ENV !== "production";
// Replit maps this to port 80 on the published app. Binding to 0.0.0.0 is not
// optional there - a server on localhost passes locally and fails the health
// check the moment it is published.
const PORT = Number(process.env.PORT ?? 5000);
const HOST = "0.0.0.0";

async function main() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "256kb" }));

  app.get("/healthz", (_req, res) => res.json({ ok: true }));

  registerRoutes(app);

  if (isDev) {
    // Vite in middleware mode: one process, one port, HMR intact.
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true, hmr: { server: undefined } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const dist = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "public",
    );
    if (!fs.existsSync(dist)) {
      throw new Error(`Client build missing at ${dist}. Run \`npm run build\` first.`);
    }
    app.use(express.static(dist, { index: false, maxAge: "1h" }));
    // Client-side routing: anything that is not a file or an API call is a page.
    app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
  }

  // Warm the store before accepting traffic so the very first request is not
  // the one that pays for seeding. Replit's publish health check gives the
  // homepage five seconds.
  await getStorage();

  app.listen(PORT, HOST, () => {
    console.log(`[conversion-lab] listening on http://${HOST}:${PORT}`);
  });
}

main().catch((err) => {
  console.error("[conversion-lab] failed to start", err);
  process.exit(1);
});
