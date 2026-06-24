"use client";

import { useState } from "react";
import type { Project, Stage, Message, StageStatus } from "@/lib/live/types";
import type { BizDoc, DocType } from "@/lib/docs/types";
import { HomeView } from "./HomeView";
import { DocsView } from "./DocsView";

// ---------- small helpers ----------
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}
function rid(): string {
  return Math.random().toString(36).slice(2, 9);
}
function genPasscode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}
function blankProject(): Project {
  const now = new Date().toISOString();
  return {
    slug: "",
    title: "",
    clientName: "",
    location: "Amman, Jordan",
    pct: 0,
    now: "",
    nowProgress: "",
    accent: "#9c5b2c",
    heroUrl: null,
    visible: false,
    passcode: genPasscode(),
    stages: [],
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

const STATUS_NEXT: Record<StageStatus, StageStatus> = {
  todo: "doing",
  doing: "done",
  done: "todo",
};
const STATUS_LABEL: Record<StageStatus, string> = {
  todo: "To do",
  doing: "In progress",
  done: "Done",
};
const STATUS_COLOR: Record<StageStatus, string> = {
  todo: "#6b7280",
  doing: "#f59e0b",
  done: "#22c55e",
};

export function AdminApp({
  initialProjects,
  initialDocs,
  firebaseReady,
}: {
  initialProjects: Project[];
  initialDocs: BizDoc[];
  firebaseReady: boolean;
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [docs, setDocs] = useState<BizDoc[]>(initialDocs);
  const [tab, setTab] = useState<"home" | "builds" | "docs">("home");
  const [docStart, setDocStart] = useState<DocType | null>(null);
  const [docNonce, setDocNonce] = useState(0);
  const [draft, setDraft] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  async function save() {
    if (!draft) return;
    const slug = draft.slug || slugify(draft.title);
    if (!draft.title.trim()) return flash("Add a title first");
    const body = { ...draft, slug };
    setBusy(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "save failed");
      setProjects((prev) => {
        const others = prev.filter((p) => p.slug !== data.project.slug);
        return [data.project, ...others];
      });
      setDraft(null);
      flash("Saved");
    } catch (e) {
      flash("Save failed: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(slug: string) {
    if (!confirm("Delete this project for good?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
      setDraft(null);
      flash("Deleted");
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhoto(file: File, slug: string): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slug", slug || "misc");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      flash("Upload failed: " + (data.error || res.status));
      return null;
    }
    return data.url as string;
  }

  // ---------- tabbed shell (home / builds / docs) ----------
  if (!draft) {
    const nav = (
      <BottomNav
        tab={tab}
        onTab={(t) => {
          setTab(t);
          if (t === "docs") setDocStart(null);
        }}
      />
    );
    return (
      <Shell onLogout={logout} toast={toast} nav={nav}>
        {tab === "home" && (
          <HomeView
            projects={projects}
            docs={docs}
            onNewBuild={() => setDraft(blankProject())}
            onNewDoc={(t) => {
              setDocStart(t);
              setDocNonce((n) => n + 1);
              setTab("docs");
            }}
            onNav={setTab}
          />
        )}
        {tab === "docs" && (
          <DocsView
            key={`docs-${docNonce}`}
            docs={docs}
            firebaseReady={firebaseReady}
            flash={flash}
            onChange={setDocs}
            startNew={docStart}
          />
        )}
        {tab === "builds" && (
          <>
            {!firebaseReady && (
              <div className="mb-4 rounded-xl border border-amber-700/40 bg-amber-950/40 p-3 text-sm text-amber-300">
                Firebase isn&apos;t connected yet — new builds won&apos;t save until the keys are added.
              </div>
            )}
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold">Builds</h1>
              <button
                onClick={() => setDraft(blankProject())}
                className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-neutral-950 active:scale-95"
              >
                ＋ New
              </button>
            </div>
            {projects.length === 0 && (
              <p className="mt-10 text-center text-sm text-neutral-500">
                No builds yet. Tap “＋ New” to create your first client build page.
              </p>
            )}
            <div className="space-y-3">
              {projects.map((p) => (
            <button
              key={p.slug}
              onClick={() => setDraft(structuredClone(p))}
              className="flex w-full items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-left active:scale-[0.99]"
            >
              <div
                className="h-12 w-12 shrink-0 rounded-lg bg-neutral-800 bg-cover bg-center"
                style={{ backgroundImage: p.heroUrl ? `url(${p.heroUrl})` : undefined }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{p.title || p.slug}</span>
                  {p.visible ? (
                    <span className="shrink-0 rounded bg-green-500/15 px-1.5 py-0.5 text-[10px] text-green-400">
                      LIVE
                    </span>
                  ) : (
                    <span className="shrink-0 rounded bg-neutral-700/40 px-1.5 py-0.5 text-[10px] text-neutral-400">
                      hidden
                    </span>
                  )}
                </div>
                <div className="truncate text-xs text-neutral-500">
                  {p.clientName || "—"} · {p.pct}%
                </div>
              </div>
              <div className="text-xs tabular-nums text-amber-400">{p.pct}%</div>
            </button>
              ))}
            </div>
          </>
        )}
      </Shell>
    );
  }

  // ---------- editor view ----------
  const d = draft;
  const set = (patch: Partial<Project>) => setDraft({ ...d, ...patch });

  return (
    <Shell
      onLogout={logout}
      toast={toast}
      top={
        <div className="flex items-center justify-between">
          <button onClick={() => setDraft(null)} className="text-sm text-neutral-400">
            ‹ Back
          </button>
          <div className="flex gap-2">
            {d.slug && (
              <button
                onClick={() => remove(d.slug)}
                className="rounded-lg px-3 py-2 text-sm text-red-400"
              >
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
      }
    >
      {/* hero */}
      <Field label="Hero photo">
        <PhotoButton
          current={d.heroUrl}
          onPick={async (file) => {
            const url = await uploadPhoto(file, d.slug || slugify(d.title));
            if (url) set({ heroUrl: url });
          }}
        />
      </Field>

      <Field label="Piece title (public)">
        <input
          value={d.title}
          onChange={(e) =>
            set({ title: e.target.value, slug: d.slug || slugify(e.target.value) })
          }
          placeholder="DJ & Vinyl Library"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Client name (private)">
          <input
            value={d.clientName}
            onChange={(e) => set({ clientName: e.target.value })}
            placeholder="Bahjat"
            className={inputCls}
          />
        </Field>
        <Field label="Location (public)">
          <input
            value={d.location}
            onChange={(e) => set({ location: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label={`Overall progress — ${d.pct}%`}>
        <input
          type="range"
          min={0}
          max={100}
          value={d.pct}
          onChange={(e) => set({ pct: Number(e.target.value) })}
          className="w-full accent-amber-500"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Now (headline)">
          <input
            value={d.now}
            onChange={(e) => set({ now: e.target.value })}
            placeholder="Cutting the birch"
            className={inputCls}
          />
        </Field>
        <Field label="Now (detail)">
          <input
            value={d.nowProgress}
            onChange={(e) => set({ nowProgress: e.target.value })}
            placeholder="Board 7 of 13"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Accent colour">
          <input
            type="color"
            value={d.accent}
            onChange={(e) => set({ accent: e.target.value })}
            className="h-11 w-full rounded-lg border border-neutral-800 bg-neutral-900"
          />
        </Field>
        <Field label="Client passcode">
          <div className="flex gap-2">
            <input
              value={d.passcode}
              onChange={(e) => set({ passcode: e.target.value })}
              className={inputCls}
            />
            <button
              onClick={() => set({ passcode: genPasscode() })}
              className="shrink-0 rounded-lg border border-neutral-700 px-3 text-sm text-neutral-300"
            >
              ↻
            </button>
          </div>
        </Field>
      </div>

      {/* visibility */}
      <button
        onClick={() => set({ visible: !d.visible })}
        className="mt-1 flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-3"
      >
        <span className="text-sm">Show on public /live page</span>
        <span
          className={`relative h-6 w-11 rounded-full transition ${
            d.visible ? "bg-green-500" : "bg-neutral-700"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
              d.visible ? "left-5" : "left-0.5"
            }`}
          />
        </span>
      </button>

      {/* client portal link */}
      {d.slug && (
        <div className="mt-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-neutral-400">
          Client link:{" "}
          <span className="text-amber-400">
            plexusworkshop.com/live/{d.slug}
          </span>{" "}
          · code <span className="text-neutral-200">{d.passcode}</span>
        </div>
      )}

      {/* stages */}
      <SectionTitle
        title="Build stages"
        action={
          <button
            onClick={() =>
              set({
                stages: [
                  ...d.stages,
                  { id: rid(), name: "", status: "todo", date: new Date().toISOString() },
                ],
              })
            }
            className="text-sm text-amber-400"
          >
            + Stage
          </button>
        }
      />
      <div className="space-y-2">
        {d.stages.map((s, i) => (
          <StageRow
            key={s.id}
            stage={s}
            onChange={(next) =>
              set({ stages: d.stages.map((x) => (x.id === s.id ? next : x)) })
            }
            onRemove={() => set({ stages: d.stages.filter((x) => x.id !== s.id) })}
            onUp={
              i > 0
                ? () => {
                    const arr = [...d.stages];
                    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                    set({ stages: arr });
                  }
                : undefined
            }
            onPhoto={async (file) => {
              const url = await uploadPhoto(file, d.slug || slugify(d.title));
              if (url)
                set({
                  stages: d.stages.map((x) =>
                    x.id === s.id ? { ...x, photos: [...(x.photos || []), url] } : x
                  ),
                });
            }}
          />
        ))}
      </div>

      {/* messages */}
      <SectionTitle
        title="Updates to client"
        action={
          <button
            onClick={() =>
              set({
                messages: [
                  { id: rid(), text: "", date: new Date().toISOString() },
                  ...d.messages,
                ],
              })
            }
            className="text-sm text-amber-400"
          >
            + Update
          </button>
        }
      />
      <div className="space-y-2 pb-24">
        {d.messages.map((m) => (
          <MessageRow
            key={m.id}
            msg={m}
            onChange={(next) =>
              set({ messages: d.messages.map((x) => (x.id === m.id ? next : x)) })
            }
            onRemove={() => set({ messages: d.messages.filter((x) => x.id !== m.id) })}
            onPhoto={async (file) => {
              const url = await uploadPhoto(file, d.slug || slugify(d.title));
              if (url)
                set({
                  messages: d.messages.map((x) =>
                    x.id === m.id ? { ...x, photos: [...(x.photos || []), url] } : x
                  ),
                });
            }}
          />
        ))}
      </div>
    </Shell>
  );
}

// ---------- presentational bits ----------
const inputCls =
  "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm outline-none focus:border-amber-500";

function Shell({
  children,
  onLogout,
  toast,
  top,
  nav,
}: {
  children: React.ReactNode;
  onLogout: () => void;
  toast: string;
  top?: React.ReactNode;
  nav?: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100dvh" }} className="bg-neutral-950 text-neutral-100">
      <div className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/90 px-4 py-3 backdrop-blur">
        {top || (
          <div className="flex items-center justify-between">
            <span className="font-semibold tracking-tight">Plexus Admin</span>
            <button onClick={onLogout} className="text-sm text-neutral-400">
              Log out
            </button>
          </div>
        )}
      </div>
      <div className={`mx-auto max-w-xl space-y-4 px-4 py-5 ${nav ? "pb-28" : ""}`}>
        {children}
      </div>
      {toast && (
        <div className={`fixed inset-x-0 z-30 flex justify-center ${nav ? "bottom-24" : "bottom-6"}`}>
          <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 shadow-lg">
            {toast}
          </div>
        </div>
      )}
      {nav}
    </div>
  );
}

function BottomNav({
  tab,
  onTab,
}: {
  tab: "home" | "builds" | "docs";
  onTab: (t: "home" | "builds" | "docs") => void;
}) {
  const items: [typeof tab, string][] = [
    ["home", "Home"],
    ["builds", "Builds"],
    ["docs", "Docs"],
  ];
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-xl">
        {items.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onTab(key)}
            className={`flex-1 py-3.5 text-sm font-medium ${
              tab === key ? "text-amber-400" : "text-neutral-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between pt-3">
      <h2 className="text-sm font-semibold text-neutral-300">{title}</h2>
      {action}
    </div>
  );
}

function PhotoButton({
  current,
  onPick,
}: {
  current: string | null;
  onPick: (file: File) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="block">
      <div
        className="flex h-32 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-900 bg-cover bg-center text-sm text-neutral-500"
        style={{ backgroundImage: current ? `url(${current})` : undefined }}
      >
        {!current && (busy ? "Uploading…" : "Tap to add a photo")}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          await onPick(f);
          setBusy(false);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function StageRow({
  stage,
  onChange,
  onRemove,
  onUp,
  onPhoto,
}: {
  stage: Stage;
  onChange: (s: Stage) => void;
  onRemove: () => void;
  onUp?: () => void;
  onPhoto: (file: File) => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange({ ...stage, status: STATUS_NEXT[stage.status] })}
          className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium"
          style={{ background: STATUS_COLOR[stage.status] + "22", color: STATUS_COLOR[stage.status] }}
        >
          {STATUS_LABEL[stage.status]}
        </button>
        <input
          value={stage.name}
          onChange={(e) => onChange({ ...stage, name: e.target.value })}
          placeholder="Stage name"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        {onUp && (
          <button onClick={onUp} className="px-1 text-neutral-500">
            ↑
          </button>
        )}
        <button onClick={onRemove} className="px-1 text-neutral-600">
          ✕
        </button>
      </div>
      <input
        value={stage.note || ""}
        onChange={(e) => onChange({ ...stage, note: e.target.value })}
        placeholder="note (optional)"
        className="mt-2 w-full bg-transparent text-xs text-neutral-400 outline-none"
      />
      <PhotoStrip photos={stage.photos} onAdd={onPhoto} onRemove={(url) =>
        onChange({ ...stage, photos: (stage.photos || []).filter((p) => p !== url) })
      } />
    </div>
  );
}

function MessageRow({
  msg,
  onChange,
  onRemove,
  onPhoto,
}: {
  msg: Message;
  onChange: (m: Message) => void;
  onRemove: () => void;
  onPhoto: (file: File) => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
      <div className="flex items-start gap-2">
        <textarea
          value={msg.text}
          onChange={(e) => onChange({ ...msg, text: e.target.value })}
          placeholder="Write an update the client will see…"
          rows={2}
          className="min-w-0 flex-1 resize-none bg-transparent text-sm outline-none"
        />
        <button onClick={onRemove} className="px-1 text-neutral-600">
          ✕
        </button>
      </div>
      <PhotoStrip photos={msg.photos} onAdd={onPhoto} onRemove={(url) =>
        onChange({ ...msg, photos: (msg.photos || []).filter((p) => p !== url) })
      } />
      <div className="mt-1 text-[10px] text-neutral-600">
        {new Date(msg.date).toLocaleDateString()}
      </div>
    </div>
  );
}

function PhotoStrip({
  photos,
  onAdd,
  onRemove,
}: {
  photos?: string[];
  onAdd: (file: File) => void;
  onRemove: (url: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {(photos || []).map((url) => (
        <div key={url} className="relative">
          <img src={url} alt="" className="h-14 w-14 rounded-lg object-cover" />
          <button
            onClick={() => onRemove(url)}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[10px] text-neutral-300"
          >
            ✕
          </button>
        </div>
      ))}
      <label className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-700 text-xl text-neutral-600">
        +
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onAdd(f);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
