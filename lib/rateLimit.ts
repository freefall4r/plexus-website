// Tiny in-memory rate limiter (per-process). Good enough for a single-node
// deployment / local run. Swap for a KV store if scaled horizontally.

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

const MAX = parseInt(process.env.CUSTOM_RATE_MAX ?? "4", 10);
const WINDOW_MS =
  parseInt(process.env.CUSTOM_RATE_WINDOW_HOURS ?? "6", 10) * 60 * 60 * 1000;

export type RateResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRate(key: string, now: number): RateResult {
  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    const fresh = { count: 1, resetAt: now + WINDOW_MS };
    buckets.set(key, fresh);
    return { ok: true, remaining: MAX - 1, resetAt: fresh.resetAt };
  }
  if (entry.count >= MAX) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return { ok: true, remaining: MAX - entry.count, resetAt: entry.resetAt };
}

export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  return ip;
}
