import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { updateChubOrder } from "@/lib/chub/store";
import {
  STATUS_OPTIONS,
  COMPLEXITY_OPTIONS,
  MATERIAL_OPTIONS,
  DRAWN_BY_OPTIONS,
  JOB_CODE_OPTIONS,
} from "@/lib/chub/types";
import type {
  ChubComplexity,
  ChubDrawnBy,
  ChubFile,
  ChubJobCode,
  ChubPatch,
  ChubStatus,
} from "@/lib/chub/types";
import { isChubFile, numOrNull, dateOrNull, MAX_FILES } from "@/lib/chub/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH /api/chub/orders/:id — inline edits (Status/Price from the card's
// quick controls) AND full-form edits (client name, job type, materials,
// specs, color, dimensions, CAD/drawn-by, job code, complexity, deadline,
// urgent, notes, suggested price, files — everything from the New Order
// form, opened in "edit mode" from the job's Edit button). Both anahata and
// Layth can edit any field — same shared trust as the rest of this tool, no
// role gate beyond the passcode. Only the fields present in the body are
// touched; anything else on the doc is left as-is.
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
  if ("suggestedPriceJOD" in body) patch.suggestedPriceJOD = numOrNull(body.suggestedPriceJOD);

  if ("clientName" in body) patch.clientName = String(body.clientName).trim();
  if ("jobType" in body) patch.jobType = String(body.jobType).trim();
  if ("specs" in body) patch.specs = String(body.specs);
  if ("notes" in body) patch.notes = String(body.notes);
  // Layth's own fields — inline-editable straight from the Job List card,
  // deliberately separate from anahata's notes/deadline above.
  if ("laythNotes" in body) patch.laythNotes = String(body.laythNotes);
  if ("laythLeadTime" in body) patch.laythLeadTime = String(body.laythLeadTime);
  if ("color" in body) patch.color = String(body.color);
  if ("width" in body) patch.width = numOrNull(body.width);
  if ("depth" in body) patch.depth = numOrNull(body.depth);
  if ("height" in body) patch.height = numOrNull(body.height);
  if ("cadNeeded" in body) patch.cadNeeded = Boolean(body.cadNeeded);
  if ("urgent" in body) patch.urgent = Boolean(body.urgent);
  if ("deadline" in body) patch.deadline = dateOrNull(body.deadline);

  if ("drawnBy" in body) {
    const v = String(body.drawnBy);
    if (!DRAWN_BY_OPTIONS.includes(v as ChubDrawnBy)) {
      return NextResponse.json({ error: "bad_drawn_by" }, { status: 400 });
    }
    patch.drawnBy = v as ChubDrawnBy;
  }
  if ("jobCode" in body) {
    const v = String(body.jobCode);
    if (!JOB_CODE_OPTIONS.includes(v as ChubJobCode)) {
      return NextResponse.json({ error: "bad_job_code" }, { status: 400 });
    }
    patch.jobCode = v as ChubJobCode;
  }
  if ("jobCodeCustom" in body) patch.jobCodeCustom = String(body.jobCodeCustom);

  if ("complexity" in body) {
    const v = String(body.complexity);
    const values = new Set(COMPLEXITY_OPTIONS.map((c) => c.value));
    if (!values.has(v as ChubComplexity)) {
      return NextResponse.json({ error: "bad_complexity" }, { status: 400 });
    }
    patch.complexity = v as ChubComplexity;
  }

  if ("materials" in body) {
    const validValues = new Set(MATERIAL_OPTIONS.map((m) => m.value));
    const raw = Array.isArray(body.materials) ? body.materials : [];
    patch.materials = raw.filter((m) => validValues.has(m as never)) as ChubPatch["materials"];
  }
  if ("materialsOther" in body) patch.materialsOther = String(body.materialsOther);

  if ("files" in body) {
    const raw = Array.isArray(body.files) ? (body.files as Partial<ChubFile>[]) : [];
    if (raw.length > MAX_FILES) {
      return NextResponse.json({ error: "too_many_files" }, { status: 400 });
    }
    patch.files = raw.filter(isChubFile);
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "empty_patch" }, { status: 400 });
  }

  const ok = await updateChubOrder(id, patch);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
