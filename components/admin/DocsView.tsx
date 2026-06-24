"use client";

import { useState } from "react";
import {
  type BizDoc,
  type DocType,
  type LineItem,
  DOC_LABEL,
  grandTotal,
  money,
} from "@/lib/docs/types";

const inputCls =
  "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm outline-none focus:border-amber-500";

function rid() {
  return Math.random().toString(36).slice(2, 9);
}
function blankDoc(type: DocType): BizDoc {
  const now = new Date().toISOString();
  return {
    id: "",
    type,
    number: "",
    clientName: "",
    clientPhone: "",
    clientNote: "",
    date: now.slice(0, 10),
    validity: type === "quote" ? "30 days" : "",
    dueDate: "",
    leadTime: "",
    items: [{ id: rid(), desc: "", sub: "", qty: 1, unit: 0 }],
    taxPct: 0,
    notes: "",
    terms:
      type === "quote"
        ? "50% deposit to begin, balance on delivery."
        : type === "invoice"
          ? "Payment on delivery."
          : "",
    status: type === "receipt" ? "paid" : "draft",
    currency: "JD",
    linkedBuild: "",
    createdAt: now,
    updatedAt: now,
  };
}

const STATUS_COLOR: Record<string, string> = {
  draft: "#9ca3af",
  sent: "#f59e0b",
  paid: "#22c55e",
};

export function DocsView({
  docs,
  firebaseReady,
  flash,
  onChange,
  startNew,
}: {
  docs: BizDoc[];
  firebaseReady: boolean;
  flash: (m: string) => void;
  onChange: (docs: BizDoc[]) => void;
  startNew?: DocType | null;
}) {
  const [draft, setDraft] = useState<BizDoc | null>(
    startNew ? blankDoc(startNew) : null
  );
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!draft) return;
    if (!draft.clientName.trim()) return flash("Add a client name");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "save failed");
      const saved = data.document as BizDoc;
      onChange([saved, ...docs.filter((d) => d.id !== saved.id)]);
      setDraft(saved); // keep open so they can Open/print
      flash(`Saved ${saved.number}`);
    } catch (e) {
      flash("Save failed: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this document?")) return;
    await fetch(`/api/admin/documents/${id}`, { method: "DELETE" });
    onChange(docs.filter((d) => d.id !== id));
    setDraft(null);
    flash("Deleted");
  }

  // ---------- list ----------
  if (!draft) {
    return (
      <div>
        {!firebaseReady && (
          <p className="mb-3 rounded-lg border border-amber-700/40 bg-amber-950/40 p-3 text-sm text-amber-300">
            Firebase not connected — documents won&apos;t save yet.
          </p>
        )}
        <div className="mb-3 grid grid-cols-2 gap-2">
          {(["invoice", "quote", "receipt", "delivery"] as DocType[]).map((t) => (
            <button
              key={t}
              onClick={() => setDraft(blankDoc(t))}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm active:scale-95"
            >
              ＋ {DOC_LABEL[t]}
            </button>
          ))}
        </div>
        {docs.length === 0 && (
          <p className="mt-8 text-center text-sm text-neutral-500">
            No documents yet. Make an invoice, offer, receipt or delivery note above.
          </p>
        )}
        <div className="space-y-2">
          {docs.map((d) => (
            <button
              key={d.id}
              onClick={() => setDraft(structuredClone(d))}
              className="flex w-full items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-left active:scale-[0.99]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{d.clientName || "—"}</span>
                  <span
                    className="shrink-0 rounded px-1.5 py-0.5 text-[10px]"
                    style={{ background: STATUS_COLOR[d.status] + "22", color: STATUS_COLOR[d.status] }}
                  >
                    {d.status}
                  </span>
                </div>
                <div className="truncate text-xs text-neutral-500">
                  {DOC_LABEL[d.type]} · {d.number}
                </div>
              </div>
              {d.type !== "delivery" && (
                <div className="text-xs tabular-nums text-amber-400">
                  {money(grandTotal(d), d.currency)}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------- editor ----------
  const d = draft;
  const set = (patch: Partial<BizDoc>) => setDraft({ ...d, ...patch });
  const setItem = (id: string, patch: Partial<LineItem>) =>
    set({ items: d.items.map((l) => (l.id === id ? { ...l, ...patch } : l)) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setDraft(null)} className="text-sm text-neutral-400">
          ‹ Back
        </button>
        <div className="flex items-center gap-2">
          {d.id && (
            <a
              href={`/plexusadmin/doc/${d.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-amber-400"
            >
              Open / Print
            </a>
          )}
          {d.id && (
            <button onClick={() => remove(d.id)} className="px-2 py-2 text-sm text-red-400">
              Delete
            </button>
          )}
          <button
            onClick={save}
            disabled={busy}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-950 active:scale-95 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="text-xs uppercase tracking-wide text-neutral-500">
        {DOC_LABEL[d.type]} {d.number && `· ${d.number}`}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Client name">
          <input value={d.clientName} onChange={(e) => set({ clientName: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Client WhatsApp">
          <input value={d.clientPhone} onChange={(e) => set({ clientPhone: e.target.value })} placeholder="9627…" className={inputCls} />
        </Field>
      </div>
      <Field label="Reference / project (optional)">
        <input value={d.clientNote} onChange={(e) => set({ clientNote: e.target.value })} className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <input type="date" value={d.date} onChange={(e) => set({ date: e.target.value })} className={inputCls} />
        </Field>
        {d.type === "quote" && (
          <Field label="Valid for">
            <input value={d.validity} onChange={(e) => set({ validity: e.target.value })} className={inputCls} />
          </Field>
        )}
        {d.type === "invoice" && (
          <Field label="Payment due">
            <input value={d.dueDate} onChange={(e) => set({ dueDate: e.target.value })} placeholder="On delivery" className={inputCls} />
          </Field>
        )}
        {d.type === "quote" && (
          <Field label="Lead time">
            <input value={d.leadTime} onChange={(e) => set({ leadTime: e.target.value })} placeholder="2–3 weeks" className={inputCls} />
          </Field>
        )}
      </div>

      {/* line items */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-sm font-semibold text-neutral-300">
          {d.type === "delivery" ? "Items" : "Line items"}
        </h3>
        <button
          onClick={() => set({ items: [...d.items, { id: rid(), desc: "", sub: "", qty: 1, unit: 0 }] })}
          className="text-sm text-amber-400"
        >
          ＋ Item
        </button>
      </div>
      <div className="space-y-2">
        {d.items.map((l) => (
          <div key={l.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
            <div className="flex gap-2">
              <input
                value={l.desc}
                onChange={(e) => setItem(l.id, { desc: e.target.value })}
                placeholder="Description"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              <button onClick={() => set({ items: d.items.filter((x) => x.id !== l.id) })} className="text-neutral-600">
                ✕
              </button>
            </div>
            <input
              value={l.sub}
              onChange={(e) => setItem(l.id, { sub: e.target.value })}
              placeholder="note (wood, finish…)"
              className="mt-1 w-full bg-transparent text-xs text-neutral-400 outline-none"
            />
            <div className="mt-2 flex items-center gap-2 text-sm">
              <label className="text-xs text-neutral-500">Qty</label>
              <input
                type="number"
                value={l.qty}
                onChange={(e) => setItem(l.id, { qty: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-800 bg-neutral-950 px-2 py-1"
              />
              {d.type !== "delivery" && (
                <>
                  <label className="ml-2 text-xs text-neutral-500">Unit {d.currency}</label>
                  <input
                    type="number"
                    value={l.unit}
                    onChange={(e) => setItem(l.id, { unit: Number(e.target.value) })}
                    className="w-24 rounded border border-neutral-800 bg-neutral-950 px-2 py-1"
                  />
                  <span className="ml-auto text-xs text-amber-400">
                    {money(l.qty * l.unit, d.currency)}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {d.type !== "delivery" && (
        <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-3">
          <span className="text-sm text-neutral-400">Total</span>
          <span className="font-semibold text-amber-400">{money(grandTotal(d), d.currency)}</span>
        </div>
      )}

      <Field label="Terms (optional)">
        <textarea value={d.terms} onChange={(e) => set({ terms: e.target.value })} rows={2} className={inputCls} />
      </Field>
      <Field label="Notes (optional)">
        <textarea value={d.notes} onChange={(e) => set({ notes: e.target.value })} rows={2} className={inputCls} />
      </Field>

      {/* status */}
      <div className="flex gap-2 pb-24">
        {(["draft", "sent", "paid"] as const).map((s) => (
          <button
            key={s}
            onClick={() => set({ status: s })}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
              d.status === s ? "border-amber-500 text-amber-400" : "border-neutral-800 text-neutral-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
