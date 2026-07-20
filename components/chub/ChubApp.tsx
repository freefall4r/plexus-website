"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DRAWN_BY_OPTIONS,
  JOB_CODE_MEANINGS,
  JOB_CODE_OPTIONS,
  MATERIAL_OPTIONS,
  STATUS_OPTIONS,
  type ChubDrawnBy,
  type ChubFile,
  type ChubJobCode,
  type ChubMaterial,
  type ChubOrderView,
  type ChubStatus,
} from "@/lib/chub/types";
import { CHUB_PASSCODE_HEADER, isValidChubPasscode } from "@/lib/chub/auth";

const SESSION_KEY = "chub-pass";

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

// ───────────────────────── New Order form ─────────────────────────

type FormState = {
  clientName: string;
  jobType: string;
  materials: ChubMaterial[];
  materialsOther: string;
  specs: string;
  cadNeeded: boolean;
  drawnBy: ChubDrawnBy;
  jobCode: ChubJobCode;
  jobCodeCustom: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  clientName: "",
  jobType: "",
  materials: [],
  materialsOther: "",
  specs: "",
  cadNeeded: false,
  drawnBy: "N/A",
  jobCode: "M1",
  jobCodeCustom: "",
  notes: "",
};

function NewOrderForm({
  pass,
  onCreated,
}: {
  pass: string;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

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
  async function uploadFiles(orderId: string): Promise<{ files: ChubFile[]; failed: string[] }> {
    if (files.length === 0) return { files: [], failed: [] };

    setMsg({ kind: "ok", text: `Uploading ${files.length} file(s)…` });

    const signRes = await fetch("/api/chub/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
      body: JSON.stringify({
        orderId,
        files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      }),
    });
    if (!signRes.ok) {
      return { files: [], failed: files.map((f) => f.name) };
    }
    const { uploads } = (await signRes.json()) as {
      uploads: { name: string; objectPath: string; token: string; uploadUrl: string; contentType: string }[];
    };

    const toFinalize: { objectPath: string; token: string; name: string; sizeKB: number; type: string }[] = [];
    const failed: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
      const orderId = crypto.randomUUID();
      const { files: uploadedFiles, failed: failedFiles } = await uploadFiles(orderId);

      const res = await fetch("/api/chub/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
        body: JSON.stringify({
          id: orderId,
          clientName: form.clientName.trim(),
          jobType: form.jobType.trim(),
          materials: form.materials,
          materialsOther: form.materialsOther,
          specs: form.specs,
          cadNeeded: form.cadNeeded,
          drawnBy: form.drawnBy,
          jobCode: form.jobCode,
          jobCodeCustom: form.jobCodeCustom,
          notes: form.notes,
          files: uploadedFiles,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error || "Something went wrong — try again." });
        return;
      }
      const failedNote = failedFiles.length
        ? ` (${failedFiles.length} file(s) failed to upload: ${failedFiles.join(", ")})`
        : "";
      setMsg({ kind: "ok", text: `Order created.${failedNote}` });
      setForm(EMPTY_FORM);
      setFiles([]);
      onCreated();
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
          onChange={(e) => setForm((f) => ({ ...f, jobType: e.target.value }))}
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
        <label className={labelCls}>Specs & dimensions</label>
        <textarea
          className={`${inputCls} min-h-[100px] resize-y`}
          value={form.specs}
          onChange={(e) => setForm((f) => ({ ...f, specs: e.target.value }))}
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
            onChange={(e) => setForm((f) => ({ ...f, jobCodeCustom: e.target.value }))}
            placeholder="Describe the arrangement, e.g. 70/30 split, C Hub handles finishing only"
          />
        )}
      </div>

      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          className={`${inputCls} min-h-[80px] resize-y`}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
      </div>

      <div>
        <label className={labelCls}>Files — photos, drawings, 3D files (.stl, .skp, .obj, .3dm…)</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="w-full rounded-xl border border-dashed border-ink/25 bg-white/40 px-4 py-3 text-sm"
        />
        {files.length > 0 && (
          <p className="mt-1.5 text-xs text-ink-soft">
            {files.length} file(s) selected: {files.map((f) => f.name).join(", ")}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-ink px-4 py-3 font-medium text-bone transition active:scale-[0.98] disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create order"}
      </button>

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

function OrderCard({
  order,
  pass,
  onChanged,
}: {
  order: ChubOrderView;
  pass: string;
  onChanged: (id: string, patch: Partial<ChubOrderView>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ChubStatus>(order.status);
  const [price, setPrice] = useState<string>(order.priceJOD == null ? "" : String(order.priceJOD));
  const [saving, setSaving] = useState<"status" | "price" | null>(null);

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

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/50 p-4">
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight">{order.clientName}</p>
            <p className="truncate text-sm text-ink-soft">{order.jobType}</p>
          </div>
          <span className="shrink-0 rounded-full bg-amber/15 px-2.5 py-1 text-xs font-medium text-amber">
            {order.jobCode}
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-soft">
          {order.jobCode === "Custom" && order.jobCodeCustom
            ? order.jobCodeCustom
            : JOB_CODE_MEANINGS[order.jobCode]}
        </p>
        <p className="mt-1 text-xs text-ink-soft">{fmtDate(order.createdAt)}</p>
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div>
          <label className="mr-1.5 text-xs text-ink-soft">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ChubStatus)}
            className="rounded-lg border border-ink/15 bg-white/70 px-2.5 py-1.5 text-sm outline-none focus:border-amber"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-1.5 text-xs text-ink-soft">Price (JOD)</label>
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
            placeholder="—"
            className="w-24 rounded-lg border border-ink/15 bg-white/70 px-2.5 py-1.5 text-sm outline-none focus:border-amber"
          />
        </div>
        {saving && <span className="text-xs text-ink-soft">Saving…</span>}
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-ink/10 pt-4 text-sm">
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
          <div>
            <span className="font-medium text-ink">Specs & dimensions: </span>
            <span className="whitespace-pre-wrap text-ink-soft">{order.specs || "—"}</span>
          </div>
          <div>
            <span className="font-medium text-ink">CAD needed: </span>
            <span className="text-ink-soft">{order.cadNeeded ? "Yes" : "No"}</span>
            <span className="ml-4 font-medium text-ink">Drawn by: </span>
            <span className="text-ink-soft">{order.drawnBy}</span>
          </div>
          <div>
            <span className="font-medium text-ink">Notes: </span>
            <span className="whitespace-pre-wrap text-ink-soft">{order.notes || "—"}</span>
          </div>
          <div>
            <span className="font-medium text-ink">Files: </span>
            {order.files.length === 0 ? (
              <span className="text-ink-soft">none</span>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {order.files.map((f) => (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function JobList({ pass }: { pass: string }) {
  const [orders, setOrders] = useState<ChubOrderView[] | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
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
        <button type="button" onClick={load} className="text-sm text-amber hover:underline">
          Refresh
        </button>
      </div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      {orders.length === 0 && !err && (
        <p className="text-center text-sm text-ink-soft">No orders yet.</p>
      )}
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} pass={pass} onChanged={onChanged} />
      ))}
    </div>
  );
}

// ───────────────────────── App ─────────────────────────

export function ChubApp() {
  const [pass, setPass] = useState<string | null>(null);
  const [tab, setTab] = useState<"new" | "list">("new");
  const [listKey, setListKey] = useState(0);

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

  if (!pass) return <Gate onUnlock={unlock} />;

  return (
    <div className="min-h-screen px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto max-w-xl">
        <p className="overline text-amber">C Hub × Plexus</p>
        <h1 className="mt-2 font-display text-3xl leading-tight md:text-4xl">Job Sheet</h1>

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

        <div className="mt-8">
          {tab === "new" ? (
            <NewOrderForm
              pass={pass}
              onCreated={() => {
                setListKey((k) => k + 1);
                setTab("list");
              }}
            />
          ) : (
            <JobList key={listKey} pass={pass} />
          )}
        </div>
      </div>
    </div>
  );
}
