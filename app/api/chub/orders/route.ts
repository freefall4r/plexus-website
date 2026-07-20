import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { createChubOrder, listChubOrders, newChubOrderId } from "@/lib/chub/store";
import { MATERIAL_OPTIONS, DRAWN_BY_OPTIONS, JOB_CODE_OPTIONS } from "@/lib/chub/types";
import type { ChubDrawnBy, ChubFile, ChubJobCode, ChubMaterial, ChubOrder } from "@/lib/chub/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 20;
// Order ids may arrive client-generated (crypto.randomUUID(), from the
// upload-slot flow in app/api/chub/uploads/route.ts) so files can be
// uploaded straight to Storage before this doc exists.
const ID_RE = /^[a-zA-Z0-9-]{8,64}$/;

function checkAuth(req: Request): boolean {
  return isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER));
}

// GET /api/chub/orders — list all job orders, newest first.
export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured", orders: [] }, { status: 503 });
  }
  const orders = await listChubOrders();
  return NextResponse.json({ orders });
}

type OrderBody = {
  id?: string;
  clientName?: string;
  jobType?: string;
  materials?: string[];
  materialsOther?: string;
  specs?: string;
  cadNeeded?: boolean;
  drawnBy?: string;
  jobCode?: string;
  jobCodeCustom?: string;
  notes?: string;
  files?: Partial<ChubFile>[];
};

function isChubFile(f: Partial<ChubFile>): f is ChubFile {
  return (
    typeof f.name === "string" &&
    typeof f.url === "string" &&
    typeof f.sizeKB === "number" &&
    typeof f.type === "string"
  );
}

// POST /api/chub/orders — create a new job order. Plain JSON only — file
// bytes never pass through this route (or any Vercel function). Files are
// uploaded client-side straight to Storage first (app/api/chub/uploads),
// and this call just attaches the resulting { name, url, sizeKB, type }
// records to the order doc.
export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }

  let body: OrderBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const clientName = (body.clientName || "").toString().trim();
  const jobType = (body.jobType || "").toString().trim();
  if (!clientName || !jobType) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }

  const idRaw = (body.id || "").toString();
  const id = ID_RE.test(idRaw) ? idRaw : newChubOrderId();

  const validMaterialValues = new Set(MATERIAL_OPTIONS.map((m) => m.value));
  const materials = (Array.isArray(body.materials) ? body.materials : []).filter(
    (m): m is ChubMaterial => validMaterialValues.has(m as ChubMaterial)
  );

  const drawnByRaw = (body.drawnBy || "").toString();
  const drawnBy: ChubDrawnBy = DRAWN_BY_OPTIONS.includes(drawnByRaw as ChubDrawnBy)
    ? (drawnByRaw as ChubDrawnBy)
    : "N/A";

  const jobCodeRaw = (body.jobCode || "").toString();
  const jobCode: ChubJobCode = JOB_CODE_OPTIONS.includes(jobCodeRaw as ChubJobCode)
    ? (jobCodeRaw as ChubJobCode)
    : "M1";

  const filesRaw = Array.isArray(body.files) ? body.files : [];
  if (filesRaw.length > MAX_FILES) {
    return NextResponse.json({ error: "too_many_files" }, { status: 400 });
  }
  const files: ChubFile[] = filesRaw.filter(isChubFile);

  const order: Omit<ChubOrder, "status" | "priceJOD" | "createdAt" | "updatedAt"> = {
    clientName,
    jobType,
    materials,
    materialsOther: (body.materialsOther || "").toString(),
    specs: (body.specs || "").toString(),
    cadNeeded: Boolean(body.cadNeeded),
    drawnBy,
    jobCode,
    jobCodeCustom: (body.jobCodeCustom || "").toString(),
    notes: (body.notes || "").toString(),
    files,
  };

  try {
    await createChubOrder(id, order);
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id });
}
