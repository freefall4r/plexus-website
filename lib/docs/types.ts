// ── Plexus business documents (invoice / offer / receipt / delivery note) ──
// Stored in Firestore `documents`. Rendered as branded PDFs in the Plexus house
// style and shared from /plexusadmin. Money is in JD by default.

export type DocType = "invoice" | "quote" | "receipt" | "delivery";
export type DocStatus = "draft" | "sent" | "paid";

export type LineItem = {
  id: string;
  desc: string;     // item / work description
  sub?: string;     // optional sub-note (wood, finish…)
  qty: number;
  unit: number;     // unit price (0 for delivery notes)
};

export type BizDoc = {
  id: string;             // also the doc number's storage id
  type: DocType;
  number: string;         // e.g. PLX-INV-2606-01
  clientName: string;
  clientPhone: string;    // for the WhatsApp share
  clientNote: string;     // optional address / project line
  date: string;           // ISO yyyy-mm-dd
  validity: string;       // quotes: "30 days"
  dueDate: string;        // invoices: due date / terms
  leadTime: string;       // quotes: production lead time
  items: LineItem[];
  taxPct: number;         // 0 = no tax
  notes: string;          // free notes / payment instructions
  terms: string;          // terms text
  status: DocStatus;
  currency: string;       // "JD"
  linkedBuild: string;    // optional /live project slug
  createdAt: string;
  updatedAt: string;
};

export const DOC_LABEL: Record<DocType, string> = {
  invoice: "Invoice",
  quote: "Quotation",
  receipt: "Receipt",
  delivery: "Delivery Note",
};

export const DOC_PREFIX: Record<DocType, string> = {
  invoice: "INV",
  quote: "Q",
  receipt: "RCT",
  delivery: "DN",
};

// money helpers
export const lineTotal = (l: LineItem) => (Number(l.qty) || 0) * (Number(l.unit) || 0);
export const subtotal = (d: Pick<BizDoc, "items">) =>
  (d.items || []).reduce((s, l) => s + lineTotal(l), 0);
export const taxAmount = (d: Pick<BizDoc, "items" | "taxPct">) =>
  subtotal(d) * ((Number(d.taxPct) || 0) / 100);
export const grandTotal = (d: Pick<BizDoc, "items" | "taxPct">) =>
  subtotal(d) + taxAmount(d);

export const money = (n: number, currency = "JD") =>
  `${currency} ${(Math.round(n * 1000) / 1000).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })}`;
