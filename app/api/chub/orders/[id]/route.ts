import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import {
  updateChubOrder,
  startChubWip,
  updateChubWipFields,
  addChubMaterialLogEntry,
  addChubProcessLogEntry,
  toggleChubProcessLogEntry,
} from "@/lib/chub/store";
import {
  STATUS_OPTIONS,
  COMPLEXITY_OPTIONS,
  MATERIAL_OPTIONS,
  DRAWN_BY_OPTIONS,
  JOB_CODE_OPTIONS,
  WIP_BOARD_OPTIONS,
} from "@/lib/chub/types";
import type {
  ChubComplexity,
  ChubDrawnBy,
  ChubFile,
  ChubJobCode,
  ChubPatch,
  ChubStatus,
  ChubWip,
  ChubWipBoard,
} from "@/lib/chub/types";
import { isChubFile, numOrNull, dateOrNull, MAX_FILES } from "@/lib/chub/validate";

const WIP_BOARD_VALUES = new Set(WIP_BOARD_OPTIONS.map((b) => b.value));

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

  // ── Work-In-Progress actions — each is its own store call (dedicated
  // dot-path Firestore writes), kept separate from the generic field-patch
  // below so a materials-log append can never clobber the process log (or
  // vice versa) — see lib/chub/store.ts for the field-path discipline. Each
  // returns early; a request only ever carries one of these OR the generic
  // patch fields below, never both.
  if ("wipStart" in body) {
    const raw = (body.wipStart as { board?: string } | null) || {};
    const board = String(raw.board || "");
    if (!WIP_BOARD_VALUES.has(board as ChubWipBoard)) {
      return NextResponse.json({ error: "bad_wip_board" }, { status: 400 });
    }
    const wip = await startChubWip(id, board as ChubWipBoard);
    if (!wip) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, wip });
  }

  if ("wipField" in body) {
    const raw = (body.wipField as Record<string, unknown> | null) || {};
    const patch: Partial<Pick<ChubWip, "active" | "board" | "startDate" | "liveLink">> = {};
    if ("active" in raw) patch.active = Boolean(raw.active);
    if ("board" in raw) {
      const v = raw.board === null ? null : String(raw.board);
      if (v !== null && !WIP_BOARD_VALUES.has(v as ChubWipBoard)) {
        return NextResponse.json({ error: "bad_wip_board" }, { status: 400 });
      }
      patch.board = v as ChubWipBoard | null;
    }
    if ("startDate" in raw) patch.startDate = dateOrNull(raw.startDate);
    if ("liveLink" in raw) {
      const v = (raw.liveLink == null ? "" : String(raw.liveLink)).trim();
      patch.liveLink = v === "" ? null : v;
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "empty_wip_patch" }, { status: 400 });
    }
    const ok = await updateChubWipFields(id, patch);
    if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  if ("wipAddMaterial" in body) {
    const raw = (body.wipAddMaterial as { text?: string; buyer?: string } | null) || {};
    const text = (raw.text || "").toString().trim();
    if (!text) return NextResponse.json({ error: "missing_text" }, { status: 400 });
    const buyer = (raw.buyer || "").toString().trim();
    const entry = await addChubMaterialLogEntry(id, { text, buyer });
    if (!entry) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, entry });
  }

  if ("wipAddProcess" in body) {
    const raw = (body.wipAddProcess as { text?: string; who?: string } | null) || {};
    const text = (raw.text || "").toString().trim();
    if (!text) return NextResponse.json({ error: "missing_text" }, { status: 400 });
    const who = (raw.who || "").toString().trim();
    const entry = await addChubProcessLogEntry(id, { text, who });
    if (!entry) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, entry });
  }

  if ("wipToggleProcess" in body) {
    const raw = (body.wipToggleProcess as { entryId?: string; done?: boolean } | null) || {};
    const entryId = (raw.entryId || "").toString();
    if (!entryId) return NextResponse.json({ error: "missing_entry_id" }, { status: 400 });
    const ok = await toggleChubProcessLogEntry(id, entryId, Boolean(raw.done));
    if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
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
