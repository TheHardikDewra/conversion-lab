/**
 * Vercel entry point. Bundled into api/index.js at build time.
 *
 * It is bundled rather than shipped as source because this package is ESM,
 * and Vercel's Node builder transpiles without bundling: Node's ESM resolver
 * then rejects extensionless relative imports at runtime. Pre-bundling means
 * the function has no local imports left to resolve, which also matches how
 * the Replit server is built.
 *
 * Storage caveat: without DATABASE_URL every cold start gets a fresh
 * in-memory store re-seeded from server/seed.ts, so the sample reports are
 * always present but an audit you run yourself lives only as long as that
 * instance. Set DATABASE_URL to persist. On Replit the process is long-lived,
 * so this does not apply there.
 */
import { createApp } from "./app";

export default createApp();
