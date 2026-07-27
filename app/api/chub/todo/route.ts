// ── /api/chub/todo — the shared to-do checklist ──
// One list for the whole board, readable and writable by anyone with the
// C Hub passcode — "visit Muthanna" level items between anahata and Layth.
// Not owner-gated: nothing about pricing or margin lives here.

import { NextResponse, after } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { sendChubPush } from "@/lib/chub/push";
import { getChubTodo, addChubTodoItem, toggleChubTodoItem, removeChubTodoItem } from "@/lib/chub/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TEXT = 500;
const MAX_ITEMS = 300;

function auth(req: Request): boolean {
  return isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER));
}

export async function GET(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }
  try {
    return NextResponse.json(await getChubTodo());
  } catch (e) {
    return NextResponse.json({ error: "read_failed", detail: String(e) }, { status: 500 });
  }
}

// Action-style POST, same shape as the WIP actions on the orders route:
// { add: { text } } | { toggle: { id, done } } | { remove: { id } }.
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
      const raw = (body.add as { text?: string } | null) || {};
      const text = (raw.text || "").toString().trim().slice(0, MAX_TEXT);
      if (!text) return NextResponse.json({ error: "missing_text" }, { status: 400 });
      const existing = await getChubTodo();
      if (existing.items.length >= MAX_ITEMS) {
        return NextResponse.json({ error: "too_many_items" }, { status: 400 });
      }
      const item = await addChubTodoItem(text);
      // Ping every subscribed device — after() runs once the response is
      // sent and sendChubPush swallows its own errors, so the notification
      // can never slow down or break the save (same pattern as new-job).
      after(() =>
        sendChubPush({
          title: "📝 New to-do on C Hub",
          body: text,
          url: "/chub",
        })
      );
      return NextResponse.json({ ok: true, item });
    }

    if ("toggle" in body) {
      const raw = (body.toggle as { id?: string; done?: boolean } | null) || {};
      const id = (raw.id || "").toString();
      if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
      const result = await toggleChubTodoItem(id, Boolean(raw.done));
      if (!result) return NextResponse.json({ error: "not_found" }, { status: 404 });
      return NextResponse.json({ ok: true, doneAt: result.doneAt });
    }

    if ("remove" in body) {
      const raw = (body.remove as { id?: string } | null) || {};
      const id = (raw.id || "").toString();
      if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
      const ok = await removeChubTodoItem(id);
      if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "unknown_action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }
}
