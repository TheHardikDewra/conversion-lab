import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  audits,
  rubricWeights,
  DEFAULT_WEIGHTS,
  CATEGORY_KEYS,
  type Audit,
  type AuditResult,
  type Weights,
} from "../shared/schema";
import { SEED_AUDITS } from "./seed";

/**
 * Two backends behind one interface.
 *
 * Without DATABASE_URL the app runs on an in-memory store seeded with real
 * audits, so a fresh remix boots into a populated product in about a second
 * with nothing to configure. Set DATABASE_URL and the identical interface is
 * served by Postgres instead, with the seed rows written once on first run.
 *
 * The point is that remixing costs nothing and graduating costs one env var.
 */

export interface Storage {
  readonly kind: "memory" | "postgres";
  listAudits(): Promise<Audit[]>;
  getAudit(id: string): Promise<Audit | undefined>;
  getAuditByToken(token: string): Promise<Audit | undefined>;
  createAudit(input: NewAudit): Promise<Audit>;
  updateResult(id: string, result: AuditResult): Promise<Audit | undefined>;
  deleteAudit(id: string): Promise<boolean>;
  getWeights(): Promise<Weights>;
  setWeights(weights: Weights): Promise<Weights>;
}

export type NewAudit = {
  url: string;
  finalUrl: string;
  pageTitle: string | null;
  result: AuditResult;
  isSample?: boolean;
};

const newId = () => nanoid(12);
const newToken = () => nanoid(22);

/* ==========================================================================
   IN-MEMORY
   ========================================================================== */

class MemoryStorage implements Storage {
  readonly kind = "memory" as const;
  private rows = new Map<string, Audit>();
  private weights: Weights = { ...DEFAULT_WEIGHTS };

  constructor() {
    for (const seed of SEED_AUDITS) {
      const row: Audit = {
        id: seed.id,
        shareToken: seed.shareToken,
        url: seed.url,
        finalUrl: seed.finalUrl,
        pageTitle: seed.pageTitle,
        score: seed.result.score,
        grade: seed.result.grade,
        engine: seed.result.engine,
        isSample: true,
        result: seed.result,
        createdAt: seed.createdAt,
      };
      this.rows.set(row.id, row);
    }
  }

  async listAudits() {
    return [...this.rows.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async getAudit(id: string) {
    return this.rows.get(id);
  }

  async getAuditByToken(token: string) {
    return [...this.rows.values()].find((r) => r.shareToken === token);
  }

  async createAudit(input: NewAudit) {
    const row: Audit = {
      id: newId(),
      shareToken: newToken(),
      url: input.url,
      finalUrl: input.finalUrl,
      pageTitle: input.pageTitle,
      score: input.result.score,
      grade: input.result.grade,
      engine: input.result.engine,
      isSample: input.isSample ?? false,
      result: input.result,
      createdAt: new Date().toISOString(),
    };
    this.rows.set(row.id, row);
    return row;
  }

  async updateResult(id: string, result: AuditResult) {
    const row = this.rows.get(id);
    if (!row) return undefined;
    const next: Audit = {
      ...row,
      result,
      score: result.score,
      grade: result.grade,
      engine: result.engine,
    };
    this.rows.set(id, next);
    return next;
  }

  async deleteAudit(id: string) {
    return this.rows.delete(id);
  }

  async getWeights() {
    return { ...this.weights };
  }

  async setWeights(weights: Weights) {
    this.weights = { ...weights };
    return { ...this.weights };
  }
}

/* ==========================================================================
   POSTGRES
   ========================================================================== */

type Db = Awaited<ReturnType<typeof connect>>;

async function connect() {
  const [{ Pool, neonConfig }, { drizzle }, ws] = await Promise.all([
    import("@neondatabase/serverless"),
    import("drizzle-orm/neon-serverless"),
    import("ws").then((m) => m.default),
  ]);
  neonConfig.webSocketConstructor = ws as never;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle(pool);
}

class PostgresStorage implements Storage {
  readonly kind = "postgres" as const;
  constructor(private db: Db) {}

  private toAudit(row: typeof audits.$inferSelect): Audit {
    return {
      id: row.id,
      shareToken: row.shareToken,
      url: row.url,
      finalUrl: row.finalUrl,
      pageTitle: row.pageTitle,
      score: row.score,
      grade: row.grade,
      engine: row.engine,
      isSample: row.isSample,
      result: row.result,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async listAudits() {
    const rows = await this.db.select().from(audits).orderBy(desc(audits.createdAt));
    return rows.map((r) => this.toAudit(r));
  }

  async getAudit(id: string) {
    const [row] = await this.db.select().from(audits).where(eq(audits.id, id));
    return row ? this.toAudit(row) : undefined;
  }

  async getAuditByToken(token: string) {
    const [row] = await this.db
      .select()
      .from(audits)
      .where(eq(audits.shareToken, token));
    return row ? this.toAudit(row) : undefined;
  }

  async createAudit(input: NewAudit) {
    const [row] = await this.db
      .insert(audits)
      .values({
        id: newId(),
        shareToken: newToken(),
        url: input.url,
        finalUrl: input.finalUrl,
        pageTitle: input.pageTitle,
        score: input.result.score,
        grade: input.result.grade,
        engine: input.result.engine,
        isSample: input.isSample ?? false,
        result: input.result,
      })
      .returning();
    return this.toAudit(row);
  }

  async updateResult(id: string, result: AuditResult) {
    const [row] = await this.db
      .update(audits)
      .set({
        result,
        score: result.score,
        grade: result.grade,
        engine: result.engine,
      })
      .where(eq(audits.id, id))
      .returning();
    return row ? this.toAudit(row) : undefined;
  }

  async deleteAudit(id: string) {
    const rows = await this.db.delete(audits).where(eq(audits.id, id)).returning();
    return rows.length > 0;
  }

  async getWeights() {
    const rows = await this.db.select().from(rubricWeights);
    if (!rows.length) return { ...DEFAULT_WEIGHTS };
    const out = { ...DEFAULT_WEIGHTS };
    for (const row of rows) {
      if ((CATEGORY_KEYS as readonly string[]).includes(row.key)) {
        out[row.key as keyof Weights] = row.weight;
      }
    }
    return out;
  }

  async setWeights(weights: Weights) {
    for (const key of CATEGORY_KEYS) {
      await this.db
        .insert(rubricWeights)
        .values({ key, weight: weights[key] })
        .onConflictDoUpdate({
          target: rubricWeights.key,
          set: { weight: weights[key] },
        });
    }
    return { ...weights };
  }

  /** Writes the sample audits once, so a fresh database is never an empty app. */
  async seedIfEmpty() {
    const existing = await this.db.select({ id: audits.id }).from(audits).limit(1);
    if (existing.length) return;
    for (const seed of SEED_AUDITS) {
      await this.db.insert(audits).values({
        id: seed.id,
        shareToken: seed.shareToken,
        url: seed.url,
        finalUrl: seed.finalUrl,
        pageTitle: seed.pageTitle,
        score: seed.result.score,
        grade: seed.result.grade,
        engine: seed.result.engine,
        isSample: true,
        result: seed.result,
        createdAt: new Date(seed.createdAt),
      });
    }
  }
}

/* ==========================================================================
   SELECTION
   ========================================================================== */

let cached: Storage | null = null;

export async function getStorage(): Promise<Storage> {
  if (cached) return cached;

  if (process.env.DATABASE_URL) {
    try {
      const db = await connect();
      const pg = new PostgresStorage(db);
      await pg.seedIfEmpty();
      cached = pg;
      console.log("[storage] postgres");
      return cached;
    } catch (err) {
      // A misconfigured database should not be the difference between a working
      // template and a blank screen.
      console.warn("[storage] postgres unavailable, using memory instead:", err);
    }
  }

  cached = new MemoryStorage();
  console.log("[storage] in-memory with sample data");
  return cached;
}
