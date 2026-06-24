"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import { brand, waLink } from "@/lib/config";
import type { PortalView, StageStatus } from "@/lib/live/types";

const STATUS_DOT: Record<StageStatus, string> = {
  done: "#22c55e",
  doing: "#f59e0b",
  todo: "#9ca3af",
};

export function PortalGate({ slug }: { slug: string }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const T = (en: string, arr: string) => (ar ? arr : en);

  const [code, setCode] = useState("");
  const [portal, setPortal] = useState<PortalView | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`/api/live/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.portal) {
        setPortal(data.portal as PortalView);
        return;
      }
      setErr(
        res.status === 429
          ? T("Too many tries — wait a moment.", "محاولات كثيرة — انتظر قليلاً.")
          : T("That code didn't match.", "الرمز غير صحيح.")
      );
    } catch {
      setErr(T("Network error.", "خطأ في الشبكة."));
    } finally {
      setBusy(false);
    }
  }

  // ---------- gate ----------
  if (!portal) {
    return (
      <div className="grain flex min-h-screen flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm text-center">
          <p className="overline text-amber">{T("Private build page", "صفحة بناء خاصة")}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight">
            {T("Watch your piece", "تابع قطعتك")}
          </h1>
          <p className="mt-3 text-sm text-ink-soft">
            {T(
              "Enter the access code we sent you to follow your commission.",
              "أدخل رمز الدخول الذي أرسلناه لك لمتابعة طلبك."
            )}
          </p>
          <form onSubmit={unlock} className="mt-7 space-y-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoFocus
              placeholder={T("Access code", "رمز الدخول")}
              className="w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-amber"
            />
            <button
              type="submit"
              disabled={busy || !code}
              className="w-full rounded-xl bg-ink px-4 py-3 font-medium text-bone transition active:scale-[0.98] disabled:opacity-50"
            >
              {busy ? T("Checking…", "جارٍ التحقق…") : T("Open my build", "افتح صفحتي")}
            </button>
            {err && <p className="text-sm text-red-500">{err}</p>}
          </form>
        </div>
      </div>
    );
  }

  // ---------- unlocked view ----------
  const p = portal;
  const stages = p.stages || [];
  const messages = p.messages || [];

  return (
    <div className="grain min-h-screen px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="overline text-amber">{T("Your commission", "طلبك")}</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.02] md:text-6xl">{p.title}</h1>
          {p.location && <p className="mt-2 text-ink-soft">{p.location}</p>}

          {/* hero */}
          {p.hero && (
            <div
              className="mt-6 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ink/5 bg-cover bg-center"
              style={{ backgroundImage: `url(${p.hero})` }}
            />
          )}

          {/* progress */}
          <div className="mt-8">
            <div className="flex items-end justify-between">
              <span className="text-sm text-ink-soft">{T("Progress", "التقدّم")}</span>
              <span className="font-display text-3xl" style={{ color: p.accent }}>
                {p.pct}%
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${p.pct}%`, background: p.accent }}
              />
            </div>
            {(p.now || p.nowProgress) && (
              <p className="mt-3 text-sm text-ink-soft">
                <span className="font-medium text-ink">{p.now}</span>
                {p.nowProgress ? ` · ${p.nowProgress}` : ""}
              </p>
            )}
          </div>

          {/* stage timeline */}
          {stages.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl">{T("Stages", "المراحل")}</h2>
              <ol className="mt-4 space-y-4">
                {stages.map((s) => (
                  <li key={s.id} className="flex gap-3">
                    <span
                      className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                      style={{ background: STATUS_DOT[s.status] }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={s.status === "todo" ? "text-ink-soft" : "font-medium"}>
                          {s.name}
                        </span>
                        {s.status === "doing" && (
                          <span className="rounded bg-amber/15 px-1.5 py-0.5 text-[10px] text-amber">
                            {T("now", "الآن")}
                          </span>
                        )}
                      </div>
                      {s.note && <p className="text-sm text-ink-soft">{s.note}</p>}
                      {s.photos && s.photos.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {s.photos.map((url) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={url}
                              src={url}
                              alt=""
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* updates */}
          {messages.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl">{T("Updates", "تحديثات")}</h2>
              <div className="mt-4 space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className="rounded-xl border border-ink/10 bg-white/50 p-4">
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.text}</p>
                    {m.photos && m.photos.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.photos.map((url) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={url} src={url} alt="" className="h-24 w-24 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                    <p className="mt-2 text-xs text-ink-soft">
                      {new Date(m.date).toLocaleDateString(ar ? "ar" : "en", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* contact */}
          <a
            href={waLink(
              ar
                ? `مرحبًا ${brand.name}، عندي سؤال عن قطعتي (${p.title}).`
                : `Hi ${brand.name}, I have a question about my piece (${p.title}).`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-flex rounded-xl border border-ink/15 px-5 py-3 text-sm font-medium transition hover:bg-ink hover:text-bone"
          >
            {T("Ask about my build", "اسأل عن قطعتي")}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
