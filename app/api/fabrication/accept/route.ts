import { NextResponse } from "next/server";
import { acceptQuote } from "@/lib/fabrication/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Client accepts a quote from their tracking link: quoted → confirmed.
// The token (= order id) is the only secret needed; knowing it means the client
// owns that order. This is the only post-creation write the website makes.
export async function POST(req: Request) {
  let token = "";
  try {
    const body = await req.json();
    token = (body?.token || "").toString();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }
  const ok = await acceptQuote(token);
  if (!ok) {
    return NextResponse.json({ error: "not_acceptable" }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
