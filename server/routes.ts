import type { Express, Request, Response } from "express";
import { z } from "zod";
import {
  DEFAULT_WEIGHTS,
  CATEGORY_KEYS,
  CATEGORY_META,
  runAuditSchema,
  type Weights,
} from "@shared/schema";
import { getStorage } from "./storage";
import { runAudit, rescore, FetchError, RULE_COUNT } from "./analyzer/index";
import { aiAvailable } from "./analyzer/ai";

const weightsBody = z.object({
  weights: z.record(z.string(), z.number().min(0).max(60)),
});

function fail(res: Response, status: number, message: string, hint?: string) {
  return res.status(status).json({ message, hint });
}

export function registerRoutes(app: Express) {
  /** Everything the client needs to render correctly before it has any data. */
  app.get("/api/config", async (_req, res) => {
    const storage = await getStorage();
    res.json({
      aiEnabled: aiAvailable(),
      storage: storage.kind,
      ruleCount: RULE_COUNT,
      categories: CATEGORY_KEYS.map((key) => ({ key, ...CATEGORY_META[key] })),
      defaultWeights: DEFAULT_WEIGHTS,
    });
  });

  app.get("/api/audits", async (_req, res) => {
    const storage = await getStorage();
    res.json(await storage.listAudits());
  });

  app.get("/api/audits/:id", async (req, res) => {
    const storage = await getStorage();
    const audit = await storage.getAudit(req.params.id);
    if (!audit) return fail(res, 404, "That audit does not exist.");
    res.json(audit);
  });

  /** Public, unauthenticated, read-only. This is what a share link resolves to. */
  app.get("/api/shared/:token", async (req, res) => {
    const storage = await getStorage();
    const audit = await storage.getAuditByToken(req.params.token);
    if (!audit) return fail(res, 404, "That report link is not valid.");
    res.json(audit);
  });

  app.post("/api/audits", async (req, res) => {
    const parsed = runAuditSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 400, parsed.error.issues[0]?.message ?? "Invalid URL.");
    }

    const storage = await getStorage();
    const weights = await storage.getWeights();

    try {
      const { result, finalUrl } = await runAudit(parsed.data.url, weights);
      const audit = await storage.createAudit({
        url: parsed.data.url,
        finalUrl,
        pageTitle: result.extracted.title,
        result,
      });
      res.status(201).json(audit);
    } catch (err) {
      if (err instanceof FetchError) {
        return fail(res, 422, err.message, err.hint);
      }
      console.error("[audit] unexpected failure", err);
      return fail(res, 500, "The audit failed unexpectedly.");
    }
  });

  app.delete("/api/audits/:id", async (req, res) => {
    const storage = await getStorage();
    const audit = await storage.getAudit(req.params.id);
    if (!audit) return fail(res, 404, "That audit does not exist.");
    if (audit.isSample) {
      return fail(
        res,
        400,
        "Sample audits stay put.",
        "They are what a fresh remix of this template boots into.",
      );
    }
    await storage.deleteAudit(req.params.id);
    res.status(204).end();
  });

  app.get("/api/rubric", async (_req, res) => {
    const storage = await getStorage();
    res.json({ weights: await storage.getWeights(), defaults: DEFAULT_WEIGHTS });
  });

  /**
   * Changing weights re-scores every stored audit from its existing issues.
   * No page is fetched again - the findings are already on disk, only their
   * relative importance changed.
   */
  app.put("/api/rubric", async (req, res) => {
    const parsed = weightsBody.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, "Invalid weights.");

    const next = { ...DEFAULT_WEIGHTS } as Weights;
    for (const key of CATEGORY_KEYS) {
      const value = parsed.data.weights[key];
      if (typeof value === "number") next[key] = Math.round(value);
    }

    const total = CATEGORY_KEYS.reduce((sum, k) => sum + next[k], 0);
    if (total === 0) {
      return fail(res, 400, "At least one category needs a weight above zero.");
    }

    const storage = await getStorage();
    await storage.setWeights(next);

    const audits = await storage.listAudits();
    for (const audit of audits) {
      await storage.updateResult(audit.id, rescore(audit.result, next));
    }

    res.json({ weights: next, rescored: audits.length });
  });

  app.use("/api", (_req: Request, res: Response) =>
    fail(res, 404, "No such endpoint."),
  );
}
