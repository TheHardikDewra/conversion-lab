import express, { type Express } from "express";
import { registerRoutes } from "./routes";

/**
 * The Express app, with no opinion about how it gets served.
 *
 * server/index.ts wraps this in a long-lived listener for Replit and local
 * development. api/index.ts hands the same app to Vercel as a serverless
 * function. Keeping the two apart means the deployment target never leaks
 * into the application.
 */
export function createApp(): Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "256kb" }));

  app.get("/healthz", (_req, res) => res.json({ ok: true }));

  registerRoutes(app);

  return app;
}
