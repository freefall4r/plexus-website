"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  COMPLEXITY_OPTIONS,
  DRAWN_BY_OPTIONS,
  JOB_CODE_MEANINGS,
  JOB_CODE_OPTIONS,
  MATERIAL_OPTIONS,
  STATUS_OPTIONS,
  type ChubComplexity,
  type ChubDrawnBy,
  type ChubFile,
  type ChubJobCode,
  type ChubMaterial,
  type ChubOrderView,
  type ChubStatus,
} from "@/lib/chub/types";
import { CHUB_PASSCODE_HEADER, isValidChubPasscode } from "@/lib/chub/auth";

const SESSION_KEY = "chub-pass";
const DRAFT_KEY = "chub-draft";

// Capitalize the first letter of the field and the first letter after each
// sentence-ending ". "/"! "/"? " — as-you-type, no other casing is touched
// (never forces mid-word or mid-sentence casing). Length-preserving so the
// cursor position in a controlled input isn't disturbed.
function capitalizeSentences(text: string): string {
  if (!text) return text;
  let result = text.replace(/^(\s*)([a-z])/, (_m, ws: string, c: string) => ws + c.toUpperCase());
  result = result.replace(/([.!?]\s+)([a-z])/g, (_m, sep: string, c: string) => sep + c.toUpperCase());
  return result;
}

// ───────────────────────── Gate ─────────────────────────

function Gate({ onUnlock }: { onUnlock: (pass: string) => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isValidChubPasscode(code)) {
      setErr("");
      onUnlock(code);
    } else {
      setErr("That code didn't match.");
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm text-center">
        <p className="overline text-amber">C Hub × Plexus</p>
        <h1 className="mt-3 font-display text-4xl leading-tight">Job Sheet</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Enter the shared access code to open the job order sheet.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            autoFocus
            placeholder="Access code"
            className="w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-center text-lg tracking-wide outline-none focus:border-amber"
          />
          <button
            type="submit"
            disabled={!code}
            className="w-full rounded-xl bg-ink px-4 py-3 font-medium text-bone transition active:scale-[0.98] disabled:opacity-50"
          >
            Open job sheet
          </button>
          {err && <p className="text-sm text-red-500">{err}</p>}
        </form>
      </div>
    </div>
  );
}

// ───────────────────────── Order form (create + edit) ─────────────────────────

type FormState = {
  clientName: string;
  jobType: string;
  materials: ChubMaterial[];
  materialsOther: string;
  color: string;
  width: string;
  depth: string;
  height: string;
  specs: string;
  cadNeeded: boolean;
  drawnBy: ChubDrawnBy;
  jobCode: ChubJobCode;
  jobCodeCustom: string;
  complexity: ChubComplexity;
  deadline: string; // "" or "YYYY-MM-DD"
  urgent: boolean;
  notes: string;
  suggestedPriceJOD: string;
};

const EMPTY_FORM: FormState = {
  clientName: "",
  jobType: "",
  materials: [],
  materialsOther: "",
  color: "",
  width: "",
  depth: "",
  height: "",
  specs: "",
  cadNeeded: false,
  drawnBy: "N/A",
  jobCode: "M1",
  jobCodeCustom: "",
  complexity: "quick",
  deadline: "",
  urgent: false,
  notes: "",
  suggestedPriceJOD: "",
};

function formFromOrder(o: ChubOrderView): FormState {
  return {
    clientName: o.clientName ?? "",
    jobType: o.jobType ?? "",
    materials: o.materials ?? [],
    materialsOther: o.materialsOther ?? "",
    color: o.color ?? "",
    width: o.width == null ? "" : String(o.width),
    depth: o.depth == null ? "" : String(o.depth),
    height: o.height == null ? "" : String(o.height),
    specs: o.specs ?? "",
    cadNeeded: Boolean(o.cadNeeded),
    drawnBy: o.drawnBy ?? "N/A",
    jobCode: o.jobCode ?? "M1",
    jobCodeCustom: o.jobCodeCustom ?? "",
    complexity: o.complexity ?? "quick",
    deadline: o.deadline ?? "",
    urgent: Boolean(o.urgent),
    notes: o.notes ?? "",
    suggestedPriceJOD: o.suggestedPriceJOD == null ? "" : String(o.suggestedPriceJOD),
  };
}

// Restore a saved draft on first load, if there is one. Lazy useState
// initializer so it only runs once, client-side, before the first paint —
// not on every tab switch (the form no longer unmounts on tab switch, see
// ChubApp below, but this also covers a fresh page load after a reload).
// Only used in "create" mode — editing an existing order always starts from
// that order's real data (see formFromOrder), never a stray draft.
function loadDraft(): FormState {
  if (typeof window === "undefined") return EMPTY_FORM;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_FORM;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_FORM, ...parsed };
  } catch {
    return EMPTY_FORM;
  }
}

function OrderForm({
  pass,
  editing,
  onSaved,
  onCancel,
}: {
  pass: string;
  editing?: ChubOrderView | null;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => (editing ? formFromOrder(editing) : loadDraft()));
  const [existingFiles, setExistingFiles] = useState<ChubFile[]>(editing?.files ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safety net for real browser-tab switches, reloads, dropped connections —
  // debounce-save every field to localStorage as the user types. Only in
  // create mode; editing an existing order shouldn't pollute (or be
  // overwritten by) the "new order" draft.
  useEffect(() => {
    if (editing) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const isEmpty = JSON.stringify(form) === JSON.stringify(EMPTY_FORM);
        if (isEmpty) {
          localStorage.removeItem(DRAFT_KEY);
        } else {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
        }
      } catch {
        /* ignore (private browsing / quota) */
      }
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [form, editing]);

  function toggleMaterial(m: ChubMaterial) {
    setForm((f) => ({
      ...f,
      materials: f.materials.includes(m)
        ? f.materials.filter((x) => x !== m)
        : [...f.materials, m],
    }));
  }

  // Files never pass through our own API — a Vercel serverless function body
  // caps out around 4.5 MB, too small for a real phone photo or 3D file.
  // Instead: sign a per-file upload URL, PUT the bytes straight to Storage,
  // then finalize (a small JSON call) before attaching the file list to the
  // order. See app/api/chub/uploads/route.ts.
  async function uploadNewFiles(orderId: string): Promise<{ files: ChubFile[]; failed: string[] }> {
    if (newFiles.length === 0) return { files: [], failed: [] };

    setMsg({ kind: "ok", text: `Uploading ${newFiles.length} file(s)…` });

    const signRes = await fetch("/api/chub/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
      body: JSON.stringify({
        orderId,
        files: newFiles.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      }),
    });
    if (!signRes.ok) {
      return { files: [], failed: newFiles.map((f) => f.name) };
    }
    const { uploads } = (await signRes.json()) as {
      uploads: { name: string; objectPath: string; token: string; uploadUrl: string; contentType: string }[];
    };

    const toFinalize: { objectPath: string; token: string; name: string; sizeKB: number; type: string }[] = [];
    const failed: string[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const slot = uploads[i];
      try {
        const putRes = await fetch(slot.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": slot.contentType },
          body: file,
        });
        if (!putRes.ok) {
          failed.push(file.name);
          continue;
        }
        toFinalize.push({
          objectPath: slot.objectPath,
          token: slot.token,
          name: file.name,
          sizeKB: Math.round(file.size / 1024),
          type: file.type || "",
        });
      } catch {
        failed.push(file.name);
      }
    }

    if (toFinalize.length === 0) return { files: [], failed };

    const finalizeRes = await fetch("/api/chub/uploads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
      body: JSON.stringify({ files: toFinalize }),
    });
    if (!finalizeRes.ok) {
      return { files: [], failed: [...failed, ...toFinalize.map((f) => f.name)] };
    }
    const finalizeData = (await finalizeRes.json()) as { files: ChubFile[]; failed: string[] };
    return { files: finalizeData.files, failed: [...failed, ...(finalizeData.failed || [])] };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientName.trim() || !form.jobType.trim()) {
      setMsg({ kind: "err", text: "Client name and job type are required." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const orderId = editing ? editing.id : crypto.randomUUID();
      const { files: uploadedFiles, failed: failedFiles } = await uploadNewFiles(orderId);
      const finalFiles = [...existingFiles, ...uploadedFiles];

      const payload = {
        clientName: form.clientName.trim(),
        jobType: form.jobType.trim(),
        materials: form.materials,
        materialsOther: form.materialsOther,
        color: form.color,
        width: form.width,
        depth: form.depth,
        height: form.height,
        specs: form.specs,
        cadNeeded: form.cadNeeded,
        drawnBy: form.drawnBy,
        jobCode: form.jobCode,
        jobCodeCustom: form.jobCodeCustom,
        complexity: form.complexity,
        deadline: form.deadline,
        urgent: form.urgent,
        notes: form.notes,
        suggestedPriceJOD: form.suggestedPriceJOD,
        files: finalFiles,
      };

      const res = editing
        ? await fetch(`/api/chub/orders/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/chub/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
            body: JSON.stringify({ id: orderId, ...payload }),
          });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error || "Something went wrong — try again." });
        return;
      }
      const failedNote = failedFiles.length
        ? ` (${failedFiles.length} file(s) failed to upload: ${failedFiles.join(", ")})`
        : "";
      setMsg({ kind: "ok", text: `${editing ? "Order updated" : "Order created"}.${failedNote}` });

      if (!editing) {
        setForm(EMPTY_FORM);
        setNewFiles([]);
        if (saveTimer.current) clearTimeout(saveTimer.current);
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
      }
      onSaved();
    } catch {
      setMsg({ kind: "err", text: "Network error — try again." });
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-[15px] outline-none focus:border-amber";
  const labelCls = "mb-1.5 block text-sm font-medium text-ink";

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-6 pb-10">
      <div>
        <label className={labelCls}>Client name *</label>
        <input
          className={inputCls}
          value={form.clientName}
          onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className={labelCls}>Job type *</label>
        <input
          className={inputCls}
          value={form.jobType}
          onChange={(e) => setForm((f) => ({ ...f, jobType: capitalizeSentences(e.target.value) }))}
          placeholder="e.g. custom console, mashrabiya panel…"
          required
        />
      </div>

      <div>
        <label className={labelCls}>Materials involved</label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {MATERIAL_OPTIONS.map((m) => (
            <label key={m.value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.materials.includes(m.value)}
                onChange={() => toggleMaterial(m.value)}
                className="h-4 w-4 rounded border-ink/30 accent-amber"
              />
              {m.label}
            </label>
          ))}
        </div>
        {form.materials.includes("other") && (
          <input
            className={`${inputCls} mt-2`}
            value={form.materialsOther}
            onChange={(e) => setForm((f) => ({ ...f, materialsOther: e.target.value }))}
            placeholder="Describe the other material"
          />
        )}
      </div>

      <div>
        <label className={labelCls}>Color / finish</label>
        <input
          className={inputCls}
          value={form.color}
          onChange={(e) => setForm((f) => ({ ...f, color: capitalizeSentences(e.target.value) }))}
          placeholder="e.g. walnut natural, black stain, brass polished"
        />
      </div>

      <div>
        <label className={labelCls}>Dimensions (cm)</label>
        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            min={0}
            step="0.1"
            inputMode="decimal"
            className={inputCls}
            value={form.width}
            onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
            placeholder="Width"
          />
          <input
            type="number"
            min={0}
            step="0.1"
            inputMode="decimal"
            className={inputCls}
            value={form.depth}
            onChange={(e) => setForm((f) => ({ ...f, depth: e.target.value }))}
            placeholder="Depth"
          />
          <input
            type="number"
            min={0}
            step="0.1"
            inputMode="decimal"
            className={inputCls}
            value={form.height}
            onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
            placeholder="Height"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Other specs / notes</label>
        <textarea
          className={`${inputCls} min-h-[90px] resize-y`}
          value={form.specs}
          onChange={(e) => setForm((f) => ({ ...f, specs: capitalizeSentences(e.target.value) }))}
          placeholder="Anything not covered above — construction details, references, constraints…"
        />
      </div>

      <div>
        <label className={labelCls}>CAD needed?</label>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="cadNeeded"
              checked={form.cadNeeded === true}
              onChange={() => setForm((f) => ({ ...f, cadNeeded: true }))}
              className="h-4 w-4 accent-amber"
            />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="cadNeeded"
              checked={form.cadNeeded === false}
              onChange={() => setForm((f) => ({ ...f, cadNeeded: false }))}
              className="h-4 w-4 accent-amber"
            />
            No
          </label>
        </div>
      </div>

      <div>
        <label className={labelCls}>Who&apos;s drawing the model</label>
        <select
          className={inputCls}
          value={form.drawnBy}
          onChange={(e) => setForm((f) => ({ ...f, drawnBy: e.target.value as ChubDrawnBy }))}
        >
          {DRAWN_BY_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Job code</label>
        <select
          className={inputCls}
          value={form.jobCode}
          onChange={(e) => setForm((f) => ({ ...f, jobCode: e.target.value as ChubJobCode }))}
        >
          {JOB_CODE_OPTIONS.map((code) => (
            <option key={code} value={code}>
              {code} — {JOB_CODE_MEANINGS[code]}
            </option>
          ))}
        </select>
        <p className="mt-2 space-y-0.5 text-xs text-ink-soft">
          {JOB_CODE_OPTIONS.map((code) => (
            <span key={code} className="block">
              <span className="font-medium text-ink">{code}</span> — {JOB_CODE_MEANINGS[code]}
            </span>
          ))}
        </p>
        {form.jobCode === "Custom" && (
          <input
            className={`${inputCls} mt-2`}
            value={form.jobCodeCustom}
            onChange={(e) => setForm((f) => ({ ...f, jobCodeCustom: capitalizeSentences(e.target.value) }))}
            placeholder="Describe the arrangement, e.g. 70/30 split, C Hub handles finishing only"
          />
        )}
      </div>

      <div>
        <label className={labelCls}>How fast can Layth knock this out?</label>
        <div className="space-y-2 text-sm">
          {COMPLEXITY_OPTIONS.map((c) => (
            <label key={c.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="complexity"
                checked={form.complexity === c.value}
                onChange={() => setForm((f) => ({ ...f, complexity: c.value }))}
                className="h-4 w-4 accent-amber"
              />
              {c.formLabel}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>Deadline</label>
        <input
          type="date"
          className={inputCls}
          value={form.deadline}
          onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
        />
      </div>

      <div>
        <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={form.urgent}
            onChange={(e) => setForm((f) => ({ ...f, urgent: e.target.checked }))}
            className="h-4 w-4 rounded border-ink/30 accent-red-600"
          />
          Mark as urgent — Layth should notice this immediately in the list
        </label>
      </div>

      <div>
        <label className={labelCls}>Suggested price (optional, JOD)</label>
        <input
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          className={inputCls}
          value={form.suggestedPriceJOD}
          onChange={(e) => setForm((f) => ({ ...f, suggestedPriceJOD: e.target.value }))}
          placeholder="Your own target price — Layth's quote is separate"
        />
      </div>

      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          className={`${inputCls} min-h-[80px] resize-y`}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: capitalizeSentences(e.target.value) }))}
        />
      </div>

      <div>
        <label className={labelCls}>Files — photos, drawings, 3D files (.stl, .skp, .obj, .3dm…)</label>
        {existingFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {existingFiles.map((f) => (
              <span
                key={f.url}
                className="flex items-center gap-1.5 rounded-lg border border-ink/15 bg-white/60 px-2.5 py-1.5 text-xs text-ink-soft"
              >
                {f.name}
                <button
                  type="button"
                  onClick={() => setExistingFiles((prev) => prev.filter((x) => x.url !== f.url))}
                  className="ml-1 text-ink-soft hover:text-red-600"
                  aria-label={`Remove ${f.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
          className="w-full rounded-xl border border-dashed border-ink/25 bg-white/40 px-4 py-3 text-sm"
        />
        {newFiles.length > 0 && (
          <p className="mt-1.5 text-xs text-ink-soft">
            {newFiles.length} new file(s) selected: {newFiles.map((f) => f.name).join(", ")}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="flex-1 rounded-xl bg-ink px-4 py-3 font-medium text-bone transition active:scale-[0.98] disabled:opacity-50"
        >
          {busy ? (editing ? "Saving…" : "Creating…") : editing ? "Save changes" : "Create order"}
        </button>
        {editing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-ink/15 px-4 py-3 font-medium text-ink-soft transition hover:bg-ink/5"
          >
            Cancel
          </button>
        )}
      </div>

      {msg && (
        <p className={`text-sm ${msg.kind === "ok" ? "text-sage" : "text-red-500"}`}>{msg.text}</p>
      )}
    </form>
  );
}

// ───────────────────────── Job List ─────────────────────────

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function parseDateOnly(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function fmtDeadline(iso: string): string {
  const d = parseDateOnly(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en", { month: "short", day: "numeric" });
}

function isOverdue(iso: string): boolean {
  const d = parseDateOnly(iso);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

function fmtDims(o: ChubOrderView): string | null {
  const parts = [o.width, o.depth, o.height].filter((v): v is number => v != null);
  if (parts.length === 0) return null;
  return `${parts.join(" × ")} cm`;
}

// Photos vs. 3D/CAD/other files — Layth wants photos visible immediately
// (to eyeball and price a job on his phone), 3D files can stay tucked under
// Details. `type` is usually set (uploaded via a browser file input) but
// fall back to the extension in case it's ever empty.
const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|heic|heif|bmp|avif)$/i;
function isImageFile(f: ChubFile): boolean {
  if (f.type) return f.type.startsWith("image/");
  return IMAGE_EXT_RE.test(f.name);
}

function OrderCard({
  order,
  pass,
  onChanged,
  onEdit,
}: {
  order: ChubOrderView;
  pass: string;
  onChanged: (id: string, patch: Partial<ChubOrderView>) => void;
  onEdit: (order: ChubOrderView) => void;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ChubStatus>(order.status);
  const [price, setPrice] = useState<string>(order.priceJOD == null ? "" : String(order.priceJOD));
  const [saving, setSaving] = useState<"status" | "price" | null>(null);

  // Layth's own fields — inline-editable straight from this card, separate
  // from anahata's Notes/Deadline (same split as suggestedPriceJOD/priceJOD
  // above). Save-on-blur, same UX as the price field.
  const [laythNotes, setLaythNotes] = useState<string>(order.laythNotes ?? "");
  const [laythLeadTime, setLaythLeadTime] = useState<string>(order.laythLeadTime ?? "");
  const [savingLayth, setSavingLayth] = useState<"notes" | "leadTime" | null>(null);

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/chub/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
      body: JSON.stringify(body),
    });
    return res.ok;
  }

  async function onStatusChange(v: ChubStatus) {
    setStatus(v);
    setSaving("status");
    const ok = await patch({ status: v });
    setSaving(null);
    if (ok) onChanged(order.id, { status: v });
    else setStatus(order.status);
  }

  async function commitPrice() {
    const trimmed = price.trim();
    const n = trimmed === "" ? null : Number(trimmed);
    if (n !== null && (!Number.isFinite(n) || n < 0)) {
      setPrice(order.priceJOD == null ? "" : String(order.priceJOD));
      return;
    }
    if (n === order.priceJOD) return;
    setSaving("price");
    const ok = await patch({ priceJOD: n });
    setSaving(null);
    if (ok) onChanged(order.id, { priceJOD: n });
    else setPrice(order.priceJOD == null ? "" : String(order.priceJOD));
  }

  async function commitLaythLeadTime() {
    if (laythLeadTime === (order.laythLeadTime ?? "")) return;
    setSavingLayth("leadTime");
    const ok = await patch({ laythLeadTime });
    setSavingLayth(null);
    if (ok) onChanged(order.id, { laythLeadTime });
    else setLaythLeadTime(order.laythLeadTime ?? "");
  }

  async function commitLaythNotes() {
    if (laythNotes === (order.laythNotes ?? "")) return;
    setSavingLayth("notes");
    const ok = await patch({ laythNotes });
    setSavingLayth(null);
    if (ok) onChanged(order.id, { laythNotes });
    else setLaythNotes(order.laythNotes ?? "");
  }

  // Older orders (created before this field existed) won't have `complexity`
  // set on the Firestore doc at all — default those to "quick" rather than
  // showing a blank/"undefined" badge on a real, already-in-progress job.
  const complexityValue: ChubComplexity = order.complexity ?? "quick";
  const complexityMeta =
    COMPLEXITY_OPTIONS.find((c) => c.value === complexityValue) ?? COMPLEXITY_OPTIONS[0];
  const overdue = order.deadline ? isOverdue(order.deadline) && order.status !== "Done" : false;
  const dims = fmtDims(order);
  const imageFiles = order.files.filter(isImageFile);
  const otherFiles = order.files.filter((f) => !isImageFile(f));

  // Left-border accent + card tint: urgent wins (red), otherwise a quiet
  // green/amber tint keyed to complexity so Layth can tell "quick" vs
  // "needs calc" from color alone while scanning, before reading anything.
  const accentCls = order.urgent
    ? "border-l-4 border-l-red-500 border-red-200 bg-red-50/40"
    : complexityValue === "complex"
      ? "border-l-4 border-l-amber-400 border-ink/10 bg-white/50"
      : "border-l-4 border-l-green-400 border-ink/10 bg-white/50";

  return (
    <div className={`rounded-2xl border p-4 ${accentCls}`}>
      {order.urgent && (
        <div className="-mx-4 -mt-4 mb-3 rounded-t-2xl bg-red-600 px-4 py-1.5 text-center text-xs font-bold uppercase tracking-wider text-white">
          ⚠ Urgent
        </div>
      )}

      {/* Headline — what the job IS first, then who it's for */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-xl leading-tight text-ink">{order.jobType}</p>
          <p className="truncate text-sm text-ink-soft">
            {order.clientName}
            {order.color && <span> · {order.color}</span>}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="rounded-full bg-amber/15 px-2.5 py-1 text-xs font-medium text-amber">
            {order.jobCode}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              complexityValue === "complex" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
            }`}
          >
            {complexityMeta.badge}
          </span>
        </div>
      </div>

      {/* Mini photo preview — visible even collapsed, so Layth can tell a
          job has reference photos without tapping in at all. Each thumbnail
          links straight to the full image, same as the expanded grid below —
          no need to open Details just to see a photo full-size. */}
      {imageFiles.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5">
          {imageFiles.slice(0, 5).map((f) => (
            <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.url}
                alt=""
                className="h-9 w-9 rounded-md border border-ink/10 object-cover hover:border-amber"
              />
            </a>
          ))}
          {imageFiles.length > 5 && (
            <span className="text-xs text-ink-soft">+{imageFiles.length - 5}</span>
          )}
        </div>
      )}

      {/* Act-on-this info: deadline chip + created date */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {order.deadline && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              overdue ? "bg-red-100 text-red-700" : "bg-ink/8 text-ink-soft"
            }`}
          >
            Due {fmtDeadline(order.deadline)}
          </span>
        )}
        <span className="text-xs text-ink-soft">{fmtDate(order.createdAt)}</span>
      </div>

      {/* Status + price — the block Layth actually acts on */}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3 rounded-xl bg-ink/5 p-3">
        <div>
          <label className="mb-1 block text-xs text-ink-soft">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ChubStatus)}
            disabled={saving === "status"}
            className="rounded-lg border border-ink/15 bg-white/80 px-2.5 py-1.5 text-sm outline-none focus:border-amber disabled:opacity-60"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="text-right">
          {order.suggestedPriceJOD != null && (
            <p className="text-xs text-ink-soft">Suggested: {order.suggestedPriceJOD} JOD</p>
          )}
          <div className="mt-0.5 flex items-center justify-end gap-1.5">
            <label className="text-xs text-ink-soft">Quoted</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={commitPrice}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              disabled={saving === "price"}
              placeholder="—"
              className="w-24 rounded-lg border border-amber/40 bg-white px-2.5 py-1.5 text-lg font-semibold text-ink outline-none focus:border-amber disabled:opacity-60"
            />
            <span className="text-xs text-ink-soft">JOD</span>
          </div>
        </div>
        {saving && <span className="text-xs text-ink-soft">Saving…</span>}
      </div>

      {/* Layth's own fields — visually distinct (sage, not the ink-gray of
          the block above) so it's obvious whose input is whose, same idea as
          Suggested vs Quoted price. Inline from the card, no need to open
          Edit just to jot a lead time or a note. */}
      <div className="mt-3 rounded-xl border border-sage/30 bg-sage/10 p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage">Layth's notes &amp; lead time</p>
          {savingLayth && <span className="text-xs text-ink-soft">Saving…</span>}
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <label className="shrink-0 text-xs text-ink-soft">Lead time</label>
          <input
            type="text"
            value={laythLeadTime}
            onChange={(e) => setLaythLeadTime(e.target.value)}
            onBlur={commitLaythLeadTime}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            disabled={savingLayth === "leadTime"}
            placeholder="e.g. 3–4 days"
            className="min-w-0 flex-1 rounded-lg border border-sage/40 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-sage disabled:opacity-60"
          />
        </div>
        <textarea
          value={laythNotes}
          onChange={(e) => setLaythNotes(e.target.value)}
          onBlur={commitLaythNotes}
          disabled={savingLayth === "notes"}
          placeholder="Material availability, concerns, questions…"
          className="mt-1.5 min-h-[56px] w-full resize-y rounded-lg border border-sage/40 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-sage disabled:opacity-60"
        />
      </div>

      {/* Reference info — quieter, behind the toggle */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-ink-soft hover:text-ink">
          {open ? "Hide details ▴" : "Details ▾"}
        </button>
        <button type="button" onClick={() => onEdit(order)} className="font-medium text-amber hover:underline">
          Edit
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t border-ink/10 pt-4 text-sm">
          {/* Photos first — the thing Layth actually wants the instant he
              taps in, before any of the reference text below. */}
          {imageFiles.length > 0 && (
            <div>
              <span className="mb-1.5 block font-medium text-ink">Photos</span>
              <div className="flex flex-wrap gap-2">
                {imageFiles.map((f) => (
                  <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.url}
                      alt={f.name}
                      className="h-20 w-20 rounded-lg border border-ink/10 object-cover hover:border-amber"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="font-medium text-ink">Materials: </span>
            <span className="text-ink-soft">
              {order.materials.length
                ? order.materials
                    .map((m) => (m === "other" && order.materialsOther ? `Other (${order.materialsOther})` : m))
                    .join(", ")
                : "—"}
            </span>
          </div>
          {dims && (
            <div>
              <span className="font-medium text-ink">Dimensions: </span>
              <span className="text-ink-soft">{dims}</span>
            </div>
          )}
          <div>
            <span className="font-medium text-ink">Other specs / notes: </span>
            <span className="whitespace-pre-wrap text-ink-soft">{order.specs || "—"}</span>
          </div>
          <div>
            <span className="font-medium text-ink">CAD needed: </span>
            <span className="text-ink-soft">{order.cadNeeded ? "Yes" : "No"}</span>
            <span className="ml-4 font-medium text-ink">Drawn by: </span>
            <span className="text-ink-soft">{order.drawnBy}</span>
          </div>
          <div>
            <span className="font-medium text-ink">Job code meaning: </span>
            <span className="text-ink-soft">
              {order.jobCode === "Custom" && order.jobCodeCustom
                ? order.jobCodeCustom
                : JOB_CODE_MEANINGS[order.jobCode]}
            </span>
          </div>
          <div>
            <span className="font-medium text-ink">Notes: </span>
            <span className="whitespace-pre-wrap text-ink-soft">{order.notes || "—"}</span>
          </div>
          {otherFiles.length > 0 && (
            <div>
              <span className="font-medium text-ink">3D / CAD files: </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {otherFiles.map((f) => (
                  <a
                    key={f.url}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-ink/15 bg-white/60 px-2.5 py-1.5 text-xs text-ink-soft hover:border-amber hover:text-ink"
                  >
                    {f.name} ({f.sizeKB} KB)
                  </a>
                ))}
              </div>
            </div>
          )}
          {order.files.length === 0 && (
            <div>
              <span className="font-medium text-ink">Files: </span>
              <span className="text-ink-soft">none</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function JobList({
  pass,
  onEdit,
}: {
  pass: string;
  onEdit: (order: ChubOrderView) => void;
}) {
  const [orders, setOrders] = useState<ChubOrderView[] | null>(null);
  const [err, setErr] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/chub/orders", {
        headers: { [CHUB_PASSCODE_HEADER]: pass },
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error === "storage_not_configured" ? "Storage isn't configured yet." : "Couldn't load orders.");
        setOrders([]);
        return;
      }
      setErr("");
      setOrders(data.orders || []);
    } catch {
      setErr("Network error loading orders.");
      setOrders([]);
    } finally {
      setRefreshing(false);
    }
  }, [pass]);

  useEffect(() => {
    load();
  }, [load]);

  function onChanged(id: string, patch: Partial<ChubOrderView>) {
    setOrders((prev) => (prev ? prev.map((o) => (o.id === id ? { ...o, ...patch } : o)) : prev));
  }

  if (orders === null) {
    return <p className="text-center text-sm text-ink-soft">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-3 pb-10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">{orders.length} order(s)</p>
        <button
          type="button"
          onClick={load}
          disabled={refreshing}
          className="text-sm text-amber hover:underline disabled:opacity-60"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      {orders.length === 0 && !err && (
        <p className="text-center text-sm text-ink-soft">No orders yet.</p>
      )}
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} pass={pass} onChanged={onChanged} onEdit={onEdit} />
      ))}
    </div>
  );
}

// ───────────────────────── App ─────────────────────────

export function ChubApp() {
  const [pass, setPass] = useState<string | null>(null);
  const [tab, setTab] = useState<"new" | "list">("new");
  const [listKey, setListKey] = useState(0);
  const [editingOrder, setEditingOrder] = useState<ChubOrderView | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null;
    if (saved && isValidChubPasscode(saved)) setPass(saved);
  }, []);

  const unlock = useCallback((p: string) => {
    setPass(p);
    try {
      sessionStorage.setItem(SESSION_KEY, p);
    } catch {
      /* ignore */
    }
  }, []);

  const tabs = useMemo(
    () => [
      { id: "new" as const, label: "New Order" },
      { id: "list" as const, label: "Job List" },
    ],
    []
  );

  function handleSaved() {
    setEditingOrder(null);
    setListKey((k) => k + 1);
    setTab("list");
  }

  if (!pass) return <Gate onUnlock={unlock} />;

  return (
    <div className="min-h-screen px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto max-w-xl">
        <p className="overline text-amber">C Hub × Plexus</p>
        <h1 className="mt-2 font-display text-3xl leading-tight md:text-4xl">Job Sheet</h1>

        {editingOrder ? (
          <>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-ink-soft">
                Editing — <span className="font-medium text-ink">{editingOrder.clientName}</span>
              </p>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="text-sm text-amber hover:underline"
              >
                Cancel
              </button>
            </div>
            <div className="mt-6">
              <OrderForm
                key={editingOrder.id}
                pass={pass}
                editing={editingOrder}
                onSaved={handleSaved}
                onCancel={() => setEditingOrder(null)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 flex gap-2 rounded-xl bg-white/40 p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    tab === t.id ? "bg-ink text-bone" : "text-ink-soft"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Both tabs stay mounted — only visibility toggles. Conditionally
                rendering used to unmount the form on every switch to Job
                List, wiping whatever was typed. CSS-only hide keeps its
                state alive across tab switches. */}
            <div className="mt-8">
              <div className={tab === "new" ? "" : "hidden"}>
                <OrderForm key="new" pass={pass} onSaved={handleSaved} />
              </div>
              <div className={tab === "list" ? "" : "hidden"}>
                <JobList key={listKey} pass={pass} onEdit={(o) => setEditingOrder(o)} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
