import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { updateChubOrder } from "@/lib/chub/store";
import { STATUS_OPTIONS } from "@/lib/chub/types";
import type { ChubPatch, ChubStatus } from "@/lib/chub/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH /api/chub/orders/:id — inline edits (status, priceJOD, or any field).
// Used by both anahata and Layth from the job list — shared trust, no role gate
// beyond the passcode.
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }
  const { id } = await ctx.params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const patch: ChubPatch = {};

  if ("status" in body) {
    const s = String(body.status);
    if (!STATUS_OPTIONS.includes(s as ChubStatus)) {
      return NextResponse.json({ error: "bad_status" }, { status: 400 });
    }
    patch.status = s as ChubStatus;
  }
  if ("priceJOD" in body) {
    const raw = body.priceJOD;
    if (raw === null || raw === "") {
      patch.priceJOD = null;
    } else {
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) {
        return NextResponse.json({ error: "bad_price" }, { status: 400 });
      }
      patch.priceJOD = n;
    }
  }
  if ("clientName" in body) patch.clientName = String(body.clientName).trim();
  if ("jobType" in body) patch.jobType = String(body.jobType).trim();
  if ("specs" in body) patch.specs = String(body.specs);
  if ("notes" in body) patch.notes = String(body.notes);
  if ("cadNeeded" in body) patch.cadNeeded = Boolean(body.cadNeeded);
  if ("drawnBy" in body) patch.drawnBy = body.drawnBy as ChubPatch["drawnBy"];
  if ("jobCode" in body) patch.jobCode = body.jobCode as ChubPatch["jobCode"];
  if ("materials" in body) patch.materials = body.materials as ChubPatch["materials"];
  if ("materialsOther" in body) patch.materialsOther = String(body.materialsOther);

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "empty_patch" }, { status: 400 });
  }

  const ok = await updateChubOrder(id, patch);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
