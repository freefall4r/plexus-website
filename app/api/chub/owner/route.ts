// ── /api/chub/owner — unlock, check, or drop C Hub owner mode ──
// See lib/chub/owner.ts for why this exists as its own session rather than
// reading the /plexusadmin cookie. Every method also requires the ordinary
// C Hub passcode header, so this is not a public endpoint anyone can throw
// admin-passcode guesses at.

import { NextResponse } from "next/server";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { checkOwnerPasscode, startOwnerSession, endOwnerSession, isOwner } from "@/lib/chub/owner";
import { checkRate, clientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function inChub(req: Request): boolean {
  return isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER));
}

// GET — is this browser already in owner mode?
export async function GET(req: Request) {
  if (!inChub(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ owner: await isOwner() });
}

// POST { passcode } — unlock owner mode for 30 days on this device.
export async function POST(req: Request) {
  if (!inChub(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // Same throttle as /api/admin/login — this route accepts the same passcode,
  // so it must not be the softer door into it.
  const rate = checkRate(`chub-owner:${clientKey(req)}`, Date.now());
  if (!rate.ok) {
    return NextResponse.json({ error: "too_many_attempts", resetAt: rate.resetAt }, { status: 429 });
  }
  let body: { passcode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!checkOwnerPasscode((body.passcode || "").toString())) {
    return NextResponse.json({ owner: false, error: "wrong_passcode" }, { status: 401 });
  }
  await startOwnerSession();
  return NextResponse.json({ owner: true });
}

// DELETE — lock owner mode again (e.g. before handing the phone over).
export async function DELETE(req: Request) {
  if (!inChub(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await endOwnerSession();
  return NextResponse.json({ owner: false });
}
