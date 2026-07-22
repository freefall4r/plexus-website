import { NextResponse, after } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { sendChubPush } from "@/lib/chub/push";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { createChubOrder, listChubOrders, newChubOrderId } from "@/lib/chub/store";
import { MATERIAL_OPTIONS, DRAWN_BY_OPTIONS, JOB_CODE_OPTIONS, COMPLEXITY_OPTIONS, EMPTY_WIP } from "@/lib/chub/types";
import type {
  ChubComplexity,
  ChubDrawnBy,
  ChubFile,
  ChubJobCode,
  ChubMaterial,
  ChubOrder,
} from "@/lib/chub/types";
import { isChubFile, numOrNull, dateOrNull, MAX_FILES } from "@/lib/chub/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  color?: string;
  width?: number | string | null;
  depth?: number | string | null;
  height?: number | string | null;
  specs?: string;
  cadNeeded?: boolean;
  drawnBy?: string;
  jobCode?: string;
  jobCodeCustom?: string;
  complexity?: string;
  deadline?: string | null;
  urgent?: boolean;
  notes?: string;
  suggestedPriceJOD?: number | string | null;
  files?: Partial<ChubFile>[];
};

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

  const complexityValues = new Set(COMPLEXITY_OPTIONS.map((c) => c.value));
  const complexityRaw = (body.complexity || "").toString();
  const complexity: ChubComplexity = complexityValues.has(complexityRaw as ChubComplexity)
    ? (complexityRaw as ChubComplexity)
    : "quick";

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
    color: (body.color || "").toString(),
    width: numOrNull(body.width),
    depth: numOrNull(body.depth),
    height: numOrNull(body.height),
    specs: (body.specs || "").toString(),
    cadNeeded: Boolean(body.cadNeeded),
    drawnBy,
    jobCode,
    jobCodeCustom: (body.jobCodeCustom || "").toString(),
    complexity,
    deadline: dateOrNull(body.deadline),
    urgent: Boolean(body.urgent),
    notes: (body.notes || "").toString(),
    suggestedPriceJOD: numOrNull(body.suggestedPriceJOD),
    // Layth's own fields aren't on the New Order form — he fills them in
    // inline from the Job List after the order exists — but default them
    // here so every doc always has the keys.
    laythNotes: "",
    laythLeadTime: "",
    files,
    // Production tracking starts inactive — a job is promoted into WIP
    // later via the "Start Work" button (app/api/chub/orders/[id]/route.ts
    // wipStart action), never at creation.
    wip: { ...EMPTY_WIP },
  };

  try {
    await createChubOrder(id, order);
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }

  // Ping every subscribed device (Layth's phone) — after() runs once the
  // response is sent, so the notification never slows down or breaks the
  // save itself. sendChubPush swallows its own errors.
  after(() =>
    sendChubPush({
      title: "New job on C Hub",
      body: `${clientName} — ${jobType}`,
      url: "/chub",
    })
  );

  return NextResponse.json({ ok: true, id });
}
