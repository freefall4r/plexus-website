// ── /api/chub/board — the shared board scratchpad ──
// One note for the whole job list, readable and writable by anyone with the
// C Hub passcode (it's Layth's board as much as anahata's — the point is that
// he can leave comments across jobs). Not owner-gated: nothing about pricing
// or margin lives here.

import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { getChubBoardNotes, setChubBoardNotes } from "@/lib/chub/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A generous ceiling — it's a scratchpad, not a document store. Guards against
// a runaway paste blowing up the Firestore document size limit (1 MiB).
const MAX_CHARS = 20000;

function auth(req: Request): boolean {
  return isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER));
}

export async function GET(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }
  try {
    return NextResponse.json(await getChubBoardNotes());
  } catch (e) {
    return NextResponse.json({ error: "read_failed", detail: String(e) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }
  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const text = (body.text ?? "").toString();
  if (text.length > MAX_CHARS) {
    return NextResponse.json({ error: "too_long" }, { status: 400 });
  }
  try {
    return NextResponse.json(await setChubBoardNotes(text));
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }
}
