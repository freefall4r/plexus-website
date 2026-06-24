"use client";

import type { Project } from "@/lib/live/types";
import { type BizDoc, type DocType, grandTotal, money, DOC_LABEL } from "@/lib/docs/types";

export function HomeView({
  projects,
  docs,
  onNewBuild,
  onNewDoc,
  onNav,
}: {
  projects: Project[];
  docs: BizDoc[];
  onNewBuild: () => void;
  onNewDoc: (t: DocType) => void;
  onNav: (tab: "builds" | "docs") => void;
}) {
  const liveBuilds = projects.filter((p) => p.visible).length;
  const unpaid = docs.filter((d) => d.type === "invoice" && d.status !== "paid");
  const outstanding = unpaid.reduce((s, d) => s + grandTotal(d), 0);

  return (
    <div className="space-y-5">
      {/* stats */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNav("builds")} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-left active:scale-[0.98]">
          <div className="font-display text-3xl text-amber-400">{projects.length}</div>
          <div className="text-xs text-neutral-400">builds · {liveBuilds} live</div>
        </button>
        <button onClick={() => onNav("docs")} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-left active:scale-[0.98]">
          <div className="font-display text-3xl text-amber-400">{docs.length}</div>
          <div className="text-xs text-neutral-400">documents</div>
        </button>
      </div>

      {/* outstanding */}
      <button onClick={() => onNav("docs")} className="block w-full rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-left active:scale-[0.98]">
        <div className="text-xs uppercase tracking-wide text-neutral-500">Outstanding (unpaid invoices)</div>
        <div className="mt-1 font-display text-2xl" style={{ color: outstanding > 0 ? "#f59e0b" : "#22c55e" }}>
          {money(outstanding)}
        </div>
        <div className="text-xs text-neutral-500">{unpaid.length} invoice{unpaid.length === 1 ? "" : "s"} awaiting payment</div>
      </button>

      {/* quick actions */}
      <div>
        <div className="mb-2 text-xs uppercase tracking-wide text-neutral-500">Create</div>
        <div className="grid grid-cols-2 gap-2">
          <Action label="＋ Invoice" onClick={() => onNewDoc("invoice")} />
          <Action label="＋ Offer" onClick={() => onNewDoc("quote")} />
          <Action label="＋ Receipt" onClick={() => onNewDoc("receipt")} />
          <Action label="＋ Delivery note" onClick={() => onNewDoc("delivery")} />
          <Action label="＋ Build page" onClick={onNewBuild} full />
        </div>
      </div>

      {/* recent docs */}
      {docs.length > 0 && (
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-neutral-500">Recent documents</div>
          <div className="space-y-2">
            {docs.slice(0, 4).map((d) => (
              <button
                key={d.id}
                onClick={() => onNav("docs")}
                className="flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-left active:scale-[0.99]"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm">{d.clientName || "—"}</div>
                  <div className="text-xs text-neutral-500">{DOC_LABEL[d.type]} · {d.number}</div>
                </div>
                {d.type !== "delivery" && <span className="text-xs text-amber-400">{money(grandTotal(d), d.currency)}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Action({ label, onClick, full }: { label: string; onClick: () => void; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm active:scale-95 ${full ? "col-span-2 text-amber-400" : ""}`}
    >
      {label}
    </button>
  );
}
