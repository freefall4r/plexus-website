import { NextResponse } from "next/server";
import { checkPasscode, startSession } from "@/lib/admin/auth";
import { checkRate, clientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Throttle login attempts per IP (reuse the global limiter, tight window).
export async function POST(req: Request) {
  const key = `admin-login:${clientKey(req)}`;
  // allow a handful of tries before locking out
  const rate = checkRate(key, Date.now());
  if (!rate.ok) {
    return NextResponse.json(
      { error: "too_many_attempts", resetAt: rate.resetAt },
      { status: 429 }
    );
  }
  let passcode = "";
  try {
    const body = (await req.json()) as { passcode?: string };
    passcode = (body.passcode || "").toString();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!checkPasscode(passcode)) {
    return NextResponse.json({ error: "wrong_passcode" }, { status: 401 });
  }
  await startSession();
  return NextResponse.json({ ok: true });
}
