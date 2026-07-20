// ── C Hub job sheet — small shared input-coercion helpers ──
// Used by both app/api/chub/orders/route.ts (create) and
// app/api/chub/orders/[id]/route.ts (inline-edit patch) so the same rules
// apply whichever route a field comes in through.

import type { ChubFile } from "./types";

export const MAX_FILES = 20;

export function isChubFile(f: Partial<ChubFile>): f is ChubFile {
  return (
    typeof f.name === "string" &&
    typeof f.url === "string" &&
    typeof f.sizeKB === "number" &&
    typeof f.type === "string"
  );
}

/** Non-negative number or null (empty/blank/invalid -> null). Used for
 *  width/depth/height (cm) and suggestedPriceJOD/priceJOD (JOD). */
export function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** A plain "YYYY-MM-DD" date string (from <input type="date">) or null. */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export function dateOrNull(v: unknown): string | null {
  const s = (v || "").toString().trim();
  return DATE_RE.test(s) ? s : null;
}
