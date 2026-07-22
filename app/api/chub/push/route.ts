import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import {
  deleteChubPushSubscription,
  isChubPushSubscription,
  isPushConfigured,
  saveChubPushSubscription,
} from "@/lib/chub/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function checkAuth(req: Request): boolean {
  return isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER));
}

// POST /api/chub/push — register this browser/device for new-job
// notifications. Sits behind the same passcode wall as every other chub
// route, so only anahata's and Layth's devices can subscribe themselves.
export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured() || !isPushConfigured()) {
    return NextResponse.json({ error: "push_not_configured" }, { status: 503 });
  }

  let body: { subscription?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!isChubPushSubscription(body.subscription)) {
    return NextResponse.json({ error: "bad_subscription" }, { status: 400 });
  }

  try {
    await saveChubPushSubscription(body.subscription, req.headers.get("user-agent") || "");
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

// DELETE /api/chub/push — unsubscribe this device (the bell toggled off).
export async function DELETE(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }

  let body: { endpoint?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (typeof body.endpoint !== "string" || !body.endpoint.startsWith("https://")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    await deleteChubPushSubscription(body.endpoint);
  } catch (e) {
    return NextResponse.json({ error: "delete_failed", detail: String(e) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
