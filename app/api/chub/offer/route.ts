// ── /api/chub/offer — turn a priced C Hub job into a Plexus quotation ──
// Layth writes `priceJOD` on a job: that's what C Hub charges Plexus. This
// route takes that cost, applies anahata's margin, and creates a real
// Quotation in the normal documents system (Firestore `documents`, rendered
// at /plexusadmin/doc/<id>) prefilled from the job — client, piece, material,
// dimensions, lead time, photo. The job then keeps a pointer to that document
// so the card can link straight to it and a second press never duplicates it.
//
// Owner-gated (lib/chub/owner.ts): Layth has the C Hub passcode but not the
// admin one, so he can never reach the margin or the client-facing price.

import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { isOwner } from "@/lib/chub/owner";
import { getChubOrder, setChubOffer, setChubOfferSent } from "@/lib/chub/store";
import { MATERIAL_OPTIONS, type ChubOrderView } from "@/lib/chub/types";
import { getDoc, saveDoc, nextNumber } from "@/lib/docs/store";
import type { BizDoc, SpecRow } from "@/lib/docs/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MATERIAL_LABEL = new Map(MATERIAL_OPTIONS.map((m) => [m.value, m.label]));

function materialsText(o: ChubOrderView): string {
  const named = (o.materials || []).map((m) => (m === "other" ? "" : MATERIAL_LABEL.get(m) || m)).filter(Boolean);
  const other = (o.materialsOther || "").trim();
  return [...named, other].filter(Boolean).join(", ");
}

function dimsText(o: ChubOrderView): string {
  const parts = [o.width, o.depth, o.height].filter((n) => n != null && Number.isFinite(n));
  if (parts.length === 0) return "";
  return `${parts.join(" × ")} cm${parts.length === 3 ? " (W × D × H)" : ""}`;
}

const IMAGE_RE = /\.(jpe?g|png|webp|gif|heic|heif)$/i;
function firstImageUrl(o: ChubOrderView): string {
  const f = (o.files || []).find((x) => (x.type || "").startsWith("image/") || IMAGE_RE.test(x.name || ""));
  return f?.url || "";
}

function todayISODate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// PATCH { orderId, sent } — mark the quotation as sent to the client (or undo
// it). Owner-only like the rest of this route: anahata is the one who sends
// quotes. The resulting stage is visible to Layth, but setting it isn't his.
export async function PATCH(req: Request) {
  if (!isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!(await isOwner())) {
    return NextResponse.json({ error: "owner_only" }, { status: 403 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }
  let body: { orderId?: string; sent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const orderId = (body.orderId || "").toString();
  if (!orderId) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const sentAt = body.sent ? new Date().toISOString() : null;
  const ok = await setChubOfferSent(orderId, sentAt);
  if (!ok) return NextResponse.json({ error: "not_found_or_no_offer" }, { status: 400 });
  return NextResponse.json({ ok: true, sentAt });
}

export async function POST(req: Request) {
  if (!isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!(await isOwner())) {
    return NextResponse.json({ error: "owner_only" }, { status: 403 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }

  let body: { orderId?: string; marginPct?: number | string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const orderId = (body.orderId || "").toString();
  if (!orderId) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  // A margin can legitimately be 0 (sell at cost), but a missing or unparseable
  // one must NOT silently become 0 — that would quote the client at cost. It's
  // an error. A typo'd 4000% is clamped rather than quoted.
  // Guard the empty cases BEFORE Number(): Number(null) and Number("") are
  // both 0, which would sail through a plain isFinite check and quote the
  // client at cost.
  if (body.marginPct == null || body.marginPct === "") {
    return NextResponse.json({ error: "bad_margin" }, { status: 400 });
  }
  const marginRaw = Number(body.marginPct);
  if (!Number.isFinite(marginRaw) || marginRaw < 0) {
    return NextResponse.json({ error: "bad_margin" }, { status: 400 });
  }
  const marginPct = Math.min(marginRaw, 500);

  const order = await getChubOrder(orderId);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Already offered → hand back the existing document instead of making a
  // second one. If the document was deleted from /plexusadmin, fall through
  // and create a fresh one rather than linking to a dead id.
  if (order.offer?.docId) {
    const existing = await getDoc(order.offer.docId);
    if (existing) {
      return NextResponse.json({ ok: true, existing: true, offer: order.offer });
    }
  }

  if (order.priceJOD == null) {
    return NextResponse.json({ error: "no_price_yet" }, { status: 400 });
  }

  const clientPrice = Math.round(order.priceJOD * (1 + marginPct / 100));
  const date = todayISODate();
  const id = randomUUID();
  const number = await nextNumber("quote", date);
  const now = new Date().toISOString();

  const material = materialsText(order);
  const dims = dimsText(order);
  const specs: SpecRow[] = [];
  const addSpec = (label: string, value: string) => {
    if (value.trim()) specs.push({ id: randomUUID().slice(0, 8), label, value: value.trim() });
  };
  addSpec("Material", material);
  addSpec("Finish / colour", order.color || "");
  addSpec("Dimensions", dims);
  addSpec("Drawing", order.cadNeeded ? `CAD drawing — ${order.drawnBy}` : "");
  addSpec("Lead time", order.laythLeadTime || "");

  const doc: BizDoc = {
    id,
    type: "quote",
    number,
    clientName: order.clientName || "",
    clientPhone: "",
    clientNote: "",
    date,
    validity: "30 days",
    dueDate: "",
    leadTime: order.laythLeadTime || "",
    items: [
      {
        id: randomUUID().slice(0, 8),
        desc: order.jobType || "Custom piece",
        sub: [material, order.color, dims].filter(Boolean).join(" · "),
        qty: 1,
        unit: clientPrice,
      },
    ],
    taxPct: 0,
    notes: "",
    terms: "50% deposit to begin, balance on delivery.",
    status: "draft",
    currency: "JD",
    linkedBuild: "",
    createdAt: now,
    updatedAt: now,
    subject: order.jobType || "",
    orderType: "Custom commission",
    quantity: "1 piece",
    // The client's specs, not the workshop's internal notes — `specs` (the
    // job's free-text field) and Layth's notes stay inside C Hub on purpose.
    intro: "",
    imageUrl: firstImageUrl(order),
    imageCaption: "",
    imageTag: "BESPOKE",
    imageNote: "",
    specs,
    signature: true,
  };

  try {
    await saveDoc(doc);
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }

  const offer = {
    docId: id,
    number,
    priceJOD: clientPrice,
    costJOD: order.priceJOD,
    marginPct,
    createdAt: now,
  };
  await setChubOffer(orderId, offer);

  return NextResponse.json({ ok: true, existing: false, offer });
}
