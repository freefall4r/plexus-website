import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { createChubOrder, listChubOrders, newChubOrderId, uploadChubFile } from "@/lib/chub/store";
import { MATERIAL_OPTIONS, DRAWN_BY_OPTIONS, JOB_CODE_OPTIONS } from "@/lib/chub/types";
import type { ChubDrawnBy, ChubFile, ChubJobCode, ChubMaterial, ChubOrder } from "@/lib/chub/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 50_000_000; // 50 MB per file
const MAX_FILES = 20;

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

// POST /api/chub/orders — create a new job order (multipart/form-data).
// Uploads files to Storage under chub/<orderId>/. Gracefully degrades: if a
// file upload fails (e.g. Storage/Blaze not enabled yet), the order still
// saves without that file, and the response reports which files failed.
export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const str = (k: string) => (form.get(k) || "").toString().trim();

  const clientName = str("clientName");
  const jobType = str("jobType");
  if (!clientName || !jobType) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }

  const materialsRaw = form.getAll("materials").map((v) => v.toString());
  const validMaterialValues = new Set(MATERIAL_OPTIONS.map((m) => m.value));
  const materials = materialsRaw.filter((m): m is ChubMaterial =>
    validMaterialValues.has(m as ChubMaterial)
  );

  const drawnByRaw = str("drawnBy");
  const drawnBy: ChubDrawnBy = DRAWN_BY_OPTIONS.includes(drawnByRaw as ChubDrawnBy)
    ? (drawnByRaw as ChubDrawnBy)
    : "N/A";

  const jobCodeRaw = str("jobCode");
  const jobCode: ChubJobCode = JOB_CODE_OPTIONS.includes(jobCodeRaw as ChubJobCode)
    ? (jobCodeRaw as ChubJobCode)
    : "M1";

  // Files
  const incoming = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (incoming.length > MAX_FILES) {
    return NextResponse.json({ error: "too_many_files" }, { status: 400 });
  }
  for (const f of incoming) {
    if (f.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "file_too_large", detail: f.name }, { status: 413 });
    }
  }

  const id = newChubOrderId();

  const files: ChubFile[] = [];
  const failedFiles: string[] = [];
  for (const f of incoming) {
    try {
      files.push(await uploadChubFile(id, f));
    } catch {
      failedFiles.push(f.name);
    }
  }

  const order: Omit<ChubOrder, "status" | "priceJOD" | "createdAt" | "updatedAt"> = {
    clientName,
    jobType,
    materials,
    materialsOther: str("materialsOther"),
    specs: str("specs"),
    cadNeeded: str("cadNeeded") === "true",
    drawnBy,
    jobCode,
    notes: str("notes"),
    files,
  };

  try {
    await createChubOrder(id, order);
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id, failedFiles });
}
