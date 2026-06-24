import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import {
  newOrderToken,
  uploadOrderFile,
  createFabricationOrder,
} from "@/lib/fabrication/store";
import { notifyNewOrder } from "@/lib/fabrication/notify";
import {
  isService,
  isAcceptedFile,
  MAX_FILE_BYTES,
  MAX_FILES,
} from "@/lib/fabrication/options";
import type {
  FabricationOrder,
  FabricationFile,
  FabricationSource,
} from "@/lib/fabrication/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Creates a fabrication order: writes the doc (status:"new"), uploads files to
// Storage, fires the WhatsApp ping, returns the tracking token. All Firebase
// access is server-side. If Firebase isn't configured yet, returns 503 so the
// client can fall back to a WhatsApp hand-off.
export async function POST(req: Request) {
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

  const service = str("service");
  if (!isService(service)) {
    return NextResponse.json({ error: "bad_service" }, { status: 400 });
  }
  const source: FabricationSource = str("source") === "template" ? "template" : "custom";
  const templateId = str("templateId") || null;

  const name = str("name");
  const whatsapp = str("whatsapp");
  const email = str("email");
  if (!name || (!whatsapp && !email)) {
    return NextResponse.json({ error: "missing_contact" }, { status: 400 });
  }

  const quantityRaw = parseInt(str("quantity"), 10);
  const quantity = Number.isFinite(quantityRaw) && quantityRaw > 0 ? quantityRaw : 1;

  const lang = str("lang") === "ar" ? "ar" : "en";

  // Files
  const incoming = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (incoming.length > MAX_FILES) {
    return NextResponse.json({ error: "too_many_files" }, { status: 400 });
  }
  for (const f of incoming) {
    if (f.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "file_too_large" }, { status: 413 });
    }
    if (!isAcceptedFile(f.name)) {
      return NextResponse.json({ error: "file_type_not_allowed" }, { status: 415 });
    }
  }

  const token = newOrderToken();

  let files: FabricationFile[] = [];
  try {
    files = await Promise.all(incoming.map((f) => uploadOrderFile(token, f)));
  } catch (e) {
    return NextResponse.json({ error: "upload_failed", detail: String(e) }, { status: 500 });
  }

  const order: Omit<FabricationOrder, "status" | "quote" | "createdAt" | "updatedAt"> = {
    service,
    source,
    templateId,
    specs: {
      material: str("material"),
      thickness: str("thickness"),
      dimensions: str("dimensions"),
      quantity,
      finish: str("finish"),
      notes: str("notes"),
    },
    files,
    contact: { name, whatsapp, email },
    lang,
  };

  try {
    await createFabricationOrder(token, order);
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }

  // Best-effort notification — never blocks the order.
  notifyNewOrder(
    { ...order, status: "new", quote: null, createdAt: "", updatedAt: "" },
    token
  ).catch(() => {});

  return NextResponse.json({ ok: true, token });
}
