import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isLoggedIn } from "@/lib/admin/auth";
import { getAllDocs, saveDoc, nextNumber } from "@/lib/docs/store";
import type { BizDoc, DocType } from "@/lib/docs/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: DocType[] = ["invoice", "quote", "receipt", "delivery"];

export async function GET() {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ documents: await getAllDocs() });
  } catch (e) {
    return NextResponse.json({ error: "read_failed", detail: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Partial<BizDoc>;
  try {
    body = (await req.json()) as Partial<BizDoc>;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const type = (TYPES.includes(body.type as DocType) ? body.type : "invoice") as DocType;
  const now = new Date().toISOString();
  const date = body.date || now.slice(0, 10);
  const id = body.id || randomUUID();
  const number = body.number || (await nextNumber(type, date));

  const doc: BizDoc = {
    id,
    type,
    number,
    clientName: body.clientName || "",
    clientPhone: body.clientPhone || "",
    clientNote: body.clientNote || "",
    date,
    validity: body.validity || "",
    dueDate: body.dueDate || "",
    leadTime: body.leadTime || "",
    items: (body.items || []).map((l) => ({
      id: l.id || randomUUID().slice(0, 8),
      desc: l.desc || "",
      sub: l.sub || "",
      qty: Number(l.qty) || 0,
      unit: Number(l.unit) || 0,
    })),
    taxPct: Number(body.taxPct) || 0,
    notes: body.notes || "",
    terms: body.terms || "",
    status: body.status || "draft",
    currency: body.currency || "JD",
    linkedBuild: body.linkedBuild || "",
    createdAt: body.createdAt || now,
    updatedAt: now,
  };
  try {
    await saveDoc(doc);
    return NextResponse.json({ ok: true, document: doc });
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }
}
