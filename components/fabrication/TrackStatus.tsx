"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n/context";
import { copy, pick } from "@/lib/fabrication/copy";
import { waLink } from "@/lib/config";
import type { FabricationTrackView, FabricationStatus } from "@/lib/fabrication/types";

const FLOW: FabricationStatus[] = [
  "new",
  "reviewing",
  "quoted",
  "confirmed",
  "in_production",
  "ready",
  "completed",
];

const LABELS: Record<FabricationStatus, keyof typeof copy.track> = {
  new: "st_new",
  reviewing: "st_reviewing",
  quoted: "st_quoted",
  confirmed: "st_confirmed",
  in_production: "st_in_production",
  ready: "st_ready",
  completed: "st_completed",
  declined: "st_declined",
  cancelled: "st_cancelled",
};

export function TrackStatus({ order }: { order: FabricationTrackView }) {
  const { lang } = useLang();
  const p = (b: { en: string; ar: string }) => pick(lang, b);

  const [status, setStatus] = useState<FabricationStatus>(order.status);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const idx = FLOW.indexOf(status);
  const terminal = status === "declined" || status === "cancelled";

  async function accept() {
    setAccepting(true);
    try {
      const res = await fetch("/api/fabrication/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: order.id }),
      });
      if (res.ok) {
        setStatus("confirmed");
        setAccepted(true);
      }
    } finally {
      setAccepting(false);
    }
  }

  const waMsg = `Plexus — about my fabrication order (${order.id}). `;

  return (
    <main className="grain min-h-screen bg-bone text-ink" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 md:pt-40">
        <p className="overline text-copper">{p(copy.track.over)}</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">
          {p(copy.track.greeting)} {order.contactName || ""}
        </h1>

        {/* status timeline */}
        {!terminal ? (
          <ol className="mt-10 space-y-0">
            {FLOW.map((s, i) => {
              const done = i < idx;
              const current = i === idx;
              return (
                <li key={s} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
                        done
                          ? "border-copper bg-copper text-bone"
                          : current
                          ? "border-copper text-copper"
                          : "border-ink/20 text-ink/30"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    {i < FLOW.length - 1 && (
                      <span className={`my-1 w-px flex-1 ${i < idx ? "bg-copper" : "bg-ink/15"}`} style={{ minHeight: 28 }} />
                    )}
                  </div>
                  <span className={`pt-0.5 pb-6 ${current ? "font-medium text-ink" : done ? "text-ink-soft" : "text-ink/40"}`}>
                    {p(copy.track[LABELS[s]] as { en: string; ar: string })}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-8 rounded-2xl border border-ink/10 bg-sand/40 p-5">
            {p(copy.track[LABELS[status]] as { en: string; ar: string })}
          </p>
        )}

        {/* quote */}
        {status === "quoted" && order.quote && !accepted && (
          <div className="mt-8 rounded-2xl border border-copper/30 bg-copper/5 p-6">
            <p className="overline text-copper">{p(copy.track.quoteTitle)}</p>
            <p className="mt-3 font-display text-4xl tracking-tight">
              {order.quote.amountJOD.toLocaleString(lang === "ar" ? "ar-JO" : "en-JO")} JOD
            </p>
            {order.quote.leadTimeDays > 0 && (
              <p className="mt-1 text-ink-soft">
                {p(copy.track.leadTime)}: {order.quote.leadTimeDays} {p(copy.track.days)}
              </p>
            )}
            {order.quote.message && <p className="mt-3 leading-relaxed text-ink-soft">{order.quote.message}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={accept}
                disabled={accepting}
                className="rounded-full bg-ink px-7 py-3 text-sm text-bone transition-colors hover:bg-copper disabled:opacity-60"
              >
                {accepting ? p(copy.track.accepting) : p(copy.track.accept)}
              </button>
              <a
                href={waLink(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink/20 px-7 py-3 text-sm transition-colors hover:border-ink hover:bg-ink/5"
              >
                {p(copy.track.discuss)}
              </a>
            </div>
          </div>
        )}

        {accepted && (
          <p className="mt-8 rounded-2xl border border-copper/30 bg-copper/5 p-5 text-copper">
            {p(copy.track.accepted)}
          </p>
        )}

        {(status === "new" || status === "reviewing") && (
          <p className="mt-8 leading-relaxed text-ink-soft">{p(copy.track.waitQuote)}</p>
        )}

        {/* order summary */}
        <div className="mt-10 rounded-2xl border border-ink/10 bg-sand/40 p-5 text-sm">
          <p className="overline text-copper">{p(copy.track.summary)}</p>
          <dl className="mt-3 space-y-1.5">
            <Row k={p(copy.track.over)} v={order.service.toUpperCase()} />
            <Row k="" v={[order.specs.material, order.specs.thickness].filter(Boolean).join(" · ")} />
            {order.specs.dimensions && <Row k="" v={order.specs.dimensions} />}
            <Row k={p(copy.track.files)} v={String(order.files.length)} />
          </dl>
        </div>

        <div className="mt-8">
          <a href={waLink(waMsg)} target="_blank" rel="noopener noreferrer" className="text-sm text-copper hover:underline">
            {p(copy.track.discuss)} →
          </a>
        </div>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  if (!v) return null;
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-soft">{k}</dt>
      <dd className="text-end font-medium">{v}</dd>
    </div>
  );
}

export function TrackNotFound() {
  const { lang } = useLang();
  const p = (b: { en: string; ar: string }) => pick(lang, b);
  return (
    <main className="grain min-h-screen bg-bone text-ink" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-2xl px-5 pt-40 pb-24 text-center">
        <h1 className="font-display text-4xl tracking-tight">{p(copy.track.notFound)}</h1>
        <p className="mt-4 text-ink-soft">{p(copy.track.notFoundBody)}</p>
        <a
          href={waLink("Plexus — about my fabrication order")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 text-sm text-bone transition-colors hover:bg-copper"
        >
          {p(copy.track.discuss)}
        </a>
      </div>
    </main>
  );
}
