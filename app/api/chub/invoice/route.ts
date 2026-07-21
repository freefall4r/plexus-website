// ── /api/chub/invoice — convert a job's accepted offer into an invoice ──
// Phase 2. Once a client has accepted the quotation created by
// /api/chub/offer, this turns that same quotation into a Plexus Invoice: it
// COPIES the quotation document (so any edits anahata made to the offer —
// price, line items, specs — carry straight over), flips it to type "invoice"
// with a fresh invoice number and invoice terms, saves it, and links it back
// onto the job. Owner-gated, same as the offer route.

import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { isOwner } from "@/lib/chub/owner";
import { getChubOrder, setChubInvoice } from "@/lib/chub/store";
import { getDoc, saveDoc, nextNumber } from "@/lib/docs/store";
import type { BizDoc } from "@/lib/docs/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function todayISODate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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

  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const orderId = (body.orderId || "").toString();
  if (!orderId) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const order = await getChubOrder(orderId);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Already invoiced → hand back the existing one unless it was deleted from
  // /plexusadmin, in which case fall through and make a fresh invoice.
  if (order.invoice?.docId) {
    const existing = await getDoc(order.invoice.docId);
    if (existing) {
      return NextResponse.json({ ok: true, existing: true, invoice: order.invoice });
    }
  }

  // Must have an offer first — an invoice is a converted quotation, not built
  // from scratch. If the source quotation was deleted, there's nothing to
  // convert; ask them to re-create the offer.
  if (!order.offer?.docId) {
    return NextResponse.json({ error: "no_offer_yet" }, { status: 400 });
  }
  const quote = await getDoc(order.offer.docId);
  if (!quote) {
    return NextResponse.json({ error: "offer_missing" }, { status: 400 });
  }

  const date = todayISODate();
  const id = randomUUID();
  const number = await nextNumber("invoice", date);
  const now = new Date().toISOString();

  const invoiceDoc: BizDoc = {
    ...quote, // carry over client, items, specs, image, subject, etc.
    id,
    type: "invoice",
    number,
    date,
    validity: "", // quotation-only field
    dueDate: quote.dueDate || "On delivery",
    terms: "Payment on delivery.",
    status: "draft", // a fresh unpaid invoice, regardless of the quote's status
    createdAt: now,
    updatedAt: now,
  };

  try {
    await saveDoc(invoiceDoc);
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }

  const invoice = { docId: id, number, createdAt: now };
  await setChubInvoice(orderId, invoice);

  return NextResponse.json({ ok: true, existing: false, invoice });
}
