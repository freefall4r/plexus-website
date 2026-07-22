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

  // ── Alhambra-style presentation (all optional; sheet degrades gracefully) ──
  subject?: string;       // the piece / project title shown in the doc heading
  orderType?: string;     // e.g. "Custom commission", "Production run"
  quantity?: string;      // e.g. "1 piece", "1,000 pieces"
  intro?: string;         // opening paragraph under the meta row
  imageUrl?: string;      // optional visual-reference photo (uploaded)
  imageCaption?: string;  // bold caption under the image
  imageTag?: string;      // small copper tag on the image card, e.g. "BESPOKE"
  imageNote?: string;     // grey italic note under the image
  specs?: SpecRow[];      // optional specification grid
  signature?: boolean;    // show the client / Plexus signature block
};

export type SpecRow = { id: string; label: string; value: string };

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
