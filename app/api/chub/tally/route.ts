// ── /api/chub/tally — the settlement ledger between anahata and Layth ──
// Two columns of "who took what / who paid whom" with optional JOD amounts
// and a running balance. Shared passcode by design: this is THEIR money
// between each other, not client pricing or Plexus margin — the one money
// surface on C Hub that both sides are meant to see.

import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { getChubTally, addChubTallyEntry, removeChubTallyEntry, settleChubTally } from "@/lib/chub/store";
import type { ChubTallyKind, ChubTallySide } from "@/lib/chub/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TEXT = 500;
const MAX_ENTRIES = 500;
const SIDES = new Set<ChubTallySide>(["anahata", "layth"]);
const KINDS = new Set<ChubTallyKind>(["took", "paid"]);

function auth(req: Request): boolean {
  return isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER));
}

export async function GET(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }
  try {
    return NextResponse.json(await getChubTally());
  } catch (e) {
    return NextResponse.json({ error: "read_failed", detail: String(e) }, { status: 500 });
  }
}

// { add: { side, kind, text, amountJOD } } | { remove: { id } } | { settle: true }
export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    if ("add" in body) {
      const raw =
        (body.add as { side?: string; kind?: string; text?: string; amountJOD?: unknown } | null) ||
        {};
      const side = (raw.side || "").toString();
      const kind = (raw.kind || "").toString();
      const text = (raw.text || "").toString().trim().slice(0, MAX_TEXT);
      if (!SIDES.has(side as ChubTallySide)) {
        return NextResponse.json({ error: "bad_side" }, { status: 400 });
      }
      if (!KINDS.has(kind as ChubTallyKind)) {
        return NextResponse.json({ error: "bad_kind" }, { status: 400 });
      }
      if (!text) return NextResponse.json({ error: "missing_text" }, { status: 400 });
      // Amount is optional (null = note only, not counted in the balance) —
      // but a present-yet-garbage amount is rejected rather than silently
      // dropped, so a typo never quietly becomes an uncounted entry.
      let amountJOD: number | null = null;
      if (raw.amountJOD !== null && raw.amountJOD !== undefined && raw.amountJOD !== "") {
        const n = Number(raw.amountJOD);
        if (!Number.isFinite(n) || n < 0) {
          return NextResponse.json({ error: "bad_amount" }, { status: 400 });
        }
        amountJOD = n;
      }
      const existing = await getChubTally();
      if (existing.entries.length >= MAX_ENTRIES) {
        return NextResponse.json({ error: "too_many_entries" }, { status: 400 });
      }
      const entry = await addChubTallyEntry({
        side: side as ChubTallySide,
        kind: kind as ChubTallyKind,
        text,
        amountJOD,
      });
      return NextResponse.json({ ok: true, entry });
    }

    if ("remove" in body) {
      const raw = (body.remove as { id?: string } | null) || {};
      const id = (raw.id || "").toString();
      if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
      const ok = await removeChubTallyEntry(id);
      if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    if ("settle" in body) {
      const period = await settleChubTally();
      if (!period) return NextResponse.json({ error: "nothing_to_settle" }, { status: 400 });
      return NextResponse.json({ ok: true, period });
    }

    return NextResponse.json({ error: "unknown_action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }
}
