import { NextResponse } from "next/server";
import { getPortal } from "@/lib/live/store";
import { checkRate, clientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Client portal unlock: POST { passcode } -> the build's progress, or 401.
// Throttled per IP so portal codes can't be brute-forced.
export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const rate = checkRate(`portal:${slug}:${clientKey(req)}`, Date.now());
  if (!rate.ok) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
  }
  let passcode = "";
  try {
    const body = (await req.json()) as { passcode?: string };
    passcode = (body.passcode || "").toString();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const portal = await getPortal(slug, passcode);
  if (!portal) return NextResponse.json({ error: "wrong_passcode" }, { status: 401 });
  return NextResponse.json({ portal });
}
