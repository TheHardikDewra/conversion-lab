import dns from "node:dns/promises";
import net from "node:net";

/**
 * Fetching a URL the user typed is the single most dangerous thing this app
 * does. Everything below exists to stop it becoming an SSRF proxy into
 * whatever private network it happens to be deployed on.
 */

const MAX_BYTES = 3_000_000; // 3 MB of HTML is already pathological
const TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 5;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 ConversionLab/1.0 " +
  "(+https://github.com/TheHardikDewra/conversion-lab)";

export class FetchError extends Error {
  constructor(
    message: string,
    readonly hint?: string,
  ) {
    super(message);
  }
}

/** True for anything that must never be reachable from a user-supplied URL. */
function isBlockedAddress(ip: string): boolean {
  const v = net.isIP(ip);
  if (v === 4) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 0) return true; //  0.0.0.0/8
    if (a === 10) return true; // 10.0.0.0/8      private
    if (a === 127) return true; // 127.0.0.0/8     loopback
    if (a === 169 && b === 254) return true; // link-local + cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a >= 224) return true; // multicast + reserved
    return false;
  }
  if (v === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::" || lower === "::1") return true;
    if (lower.startsWith("fe80")) return true; // link-local
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // ULA
    if (lower.startsWith("::ffff:")) return isBlockedAddress(lower.slice(7));
    return false;
  }
  return true;
}

async function assertPublicHost(hostname: string): Promise<void> {
  const bareHost = hostname.replace(/^\[|\]$/g, "");

  if (net.isIP(bareHost)) {
    if (isBlockedAddress(bareHost)) {
      throw new FetchError(
        "That address is not publicly reachable.",
        "Private, loopback, and link-local addresses are blocked on purpose.",
      );
    }
    return;
  }

  const lower = bareHost.toLowerCase();
  if (
    lower === "localhost" ||
    lower.endsWith(".localhost") ||
    lower.endsWith(".internal") ||
    lower.endsWith(".local")
  ) {
    throw new FetchError("That address is not publicly reachable.");
  }

  let records: { address: string }[];
  try {
    records = await dns.lookup(bareHost, { all: true });
  } catch {
    throw new FetchError(
      `Could not resolve ${bareHost}.`,
      "Check the spelling, or the site may be down.",
    );
  }

  if (records.some((r) => isBlockedAddress(r.address))) {
    throw new FetchError("That address resolves to a private network.");
  }
}

export type FetchedPage = {
  html: string;
  finalUrl: string;
  bytes: number;
  fetchMs: number;
  status: number;
};

/**
 * Follows redirects manually so every hop gets re-validated. `fetch` with
 * redirect:"follow" would happily walk from a public host to 169.254.169.254.
 */
export async function fetchPage(rawUrl: string): Promise<FetchedPage> {
  const started = Date.now();
  let current = rawUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    let parsed: URL;
    try {
      parsed = new URL(current);
    } catch {
      throw new FetchError("That is not a valid URL.");
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new FetchError("Only http and https URLs can be audited.");
    }

    await assertPublicHost(parsed.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(parsed.toString(), {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "user-agent": UA,
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "accept-language": "en-US,en;q=0.9",
        },
      });
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === "AbortError") {
        throw new FetchError(
          "The page took longer than 12 seconds to respond.",
          "Some sites throttle unknown clients. Try again or pick another URL.",
        );
      }
      throw new FetchError(
        `Could not reach ${parsed.hostname}.`,
        "The site may be down, or blocking automated requests.",
      );
    }
    clearTimeout(timer);

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) throw new FetchError("The site sent a redirect with no destination.");
      current = new URL(location, parsed).toString();
      continue;
    }

    if (res.status === 403 || res.status === 429) {
      throw new FetchError(
        `${parsed.hostname} blocked the request (${res.status}).`,
        "Sites behind aggressive bot protection cannot be audited. Try one of the samples.",
      );
    }

    if (!res.ok) {
      throw new FetchError(`${parsed.hostname} returned ${res.status}.`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      throw new FetchError(
        "That URL is not an HTML page.",
        `The server returned "${contentType.split(";")[0] || "an unknown type"}".`,
      );
    }

    // Stream so an enormous document cannot exhaust memory.
    const reader = res.body?.getReader();
    if (!reader) throw new FetchError("The response body was empty.");

    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BYTES) {
        await reader.cancel();
        break;
      }
      chunks.push(value);
    }

    const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
    return {
      html: buf.toString("utf8"),
      finalUrl: parsed.toString(),
      bytes,
      fetchMs: Date.now() - started,
      status: res.status,
    };
  }

  throw new FetchError("Too many redirects.");
}
