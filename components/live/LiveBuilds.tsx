"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import { brand, waLink } from "@/lib/config";

export type LiveBuild = {
  slug: string;
  title: string;
  location: string;
  pct: number;
  now: string;
  nowProgress: string;
  hero: string | null;
  accent: string;
  updated: string;
};

/** Live Builds — public showcase of the "watch your piece being made" service.
 *  Each card links to a private, passcoded build portal (served as a static
 *  page under /live/<slug>). No client names appear here — only the piece,
 *  its location and live progress. Bilingual EN/AR, inside SiteChrome's grain. */
export function LiveBuilds({ builds }: { builds: LiveBuild[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const T = (en: string, arr: string) => (ar ? arr : en);

  const waMsg = ar
    ? `مرحبًا ${brand.name}، أودّ متابعة تصنيع قطعتي عبر صفحة البناء المباشر.`
    : `Hi ${brand.name}, I'd like a live build page to follow my commission.`;

  const how = [
    {
      en: ["We design it in 3D", "You approve an exact 3D model before a single board is cut."],
      ar: ["نصمّمها ثلاثية الأبعاد", "توافق على نموذجٍ ثلاثي الأبعاد دقيق قبل قطع أي لوح."],
    },
    {
      en: ["You get a private link", "A page just for you — open it any time with a simple access code."],
      ar: ["تحصل على رابط خاص", "صفحة لك وحدك — افتحها متى شئت برمز دخول بسيط."],
    },
    {
      en: ["Follow every stage", "Cutting, assembly, finishing — with photos and progress as it happens."],
      ar: ["تابع كل مرحلة", "القَص والتجميع والتشطيب — بالصور والتقدّم لحظة بلحظة."],
    },
  ];

  return (
    <div className="px-5 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1500px]">
        {/* hero */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="overline text-amber">
            {T("Live from the workshop", "مباشرة من الورشة")}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
            {T("Watch your piece being made", "تابع صناعة قطعتك")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            {T(
              "Commission a custom piece and we give you a private page to follow it being built in Amman — from the first 3D drawing to the day it's installed. No guessing, no waiting in the dark.",
              "اطلب قطعة مخصّصة ونمنحك صفحة خاصة لمتابعة صناعتها في عمّان — من أول رسم ثلاثي الأبعاد حتى يوم التركيب. بلا تخمين، وبلا انتظارٍ في الظلام."
            )}
          </p>
        </motion.section>

        {/* builds grid */}
        <section className="mt-16">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl md:text-3xl">
              {T("Builds in progress", "أعمال قيد التنفيذ")}
            </h2>
            {builds.length > 0 && (
              <span className="text-sm text-ink-soft">
                {builds.length}{" "}
                {builds.length === 1 ? T("build", "عمل") : T("builds", "أعمال")}
              </span>
            )}
          </div>

          {builds.length === 0 ? (
            <p className="mt-6 text-ink-soft">
              {T(
                "No live builds right now — yours could be the next one.",
                "لا توجد أعمال مباشرة حاليًا — قد تكون قطعتك التالية."
              )}
            </p>
          ) : (
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {builds.map((b, i) => (
                <motion.a
                  key={b.slug}
                  href={`/live/${b.slug}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  data-cursor="hover"
                  className="group block overflow-hidden rounded-2xl border border-ink/10 bg-bone-2/60 transition-colors hover:border-ink/25"
                >
                  <div
                    className="relative aspect-[4/3] bg-walnut-deep bg-cover bg-center"
                    style={b.hero ? { backgroundImage: `url('${b.hero}')` } : undefined}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-walnut-deep/85 via-walnut-deep/10 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-walnut-deep/70 px-3 py-1 font-mono text-[11px] tracking-widest text-bone backdrop-blur-sm">
                      {b.pct}%
                    </span>
                    <div className="absolute inset-x-3 bottom-3">
                      <div className="h-1.5 overflow-hidden rounded-full bg-bone/25">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${b.pct}%`, backgroundColor: b.accent }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-xl leading-tight">{b.title}</h3>
                    {b.location && (
                      <p className="mt-1 text-sm text-ink-soft">{b.location}</p>
                    )}
                    {b.now && (
                      <p className="mt-3 text-sm">
                        <span className="text-ink-soft">{T("Now: ", "الآن: ")}</span>
                        <span className="text-ink">{b.now}</span>
                        {b.nowProgress ? (
                          <span className="text-ink-soft"> · {b.nowProgress}</span>
                        ) : null}
                      </p>
                    )}
                    <div className="mt-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber">
                        {T("Open live page", "افتح الصفحة المباشرة")}
                        <span className="transition-transform group-hover:translate-x-1">
                          {ar ? "←" : "→"}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-ink-soft">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <rect x="4" y="11" width="16" height="9" rx="2" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                        {T("Access code", "رمز دخول")}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </section>

        {/* how it works */}
        <section className="mt-24">
          <h2 className="font-display text-2xl md:text-3xl">
            {T("How it works", "كيف تعمل")}
          </h2>
          <div className="mt-8 grid gap-7 md:grid-cols-3">
            {how.map((s, i) => (
              <div key={i} className="border-t border-ink/15 pt-5">
                <span className="font-mono text-sm text-amber">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-xl">{ar ? s.ar[0] : s.en[0]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {ar ? s.ar[1] : s.en[1]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 rounded-3xl bg-walnut-deep px-7 py-14 text-bone md:px-14">
          <h2 className="max-w-2xl font-display text-3xl leading-tight md:text-4xl">
            {T(
              "Commission a piece — and follow it all the way home.",
              "اطلب قطعة — وتابعها حتى تصل إلى بيتك."
            )}
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber px-6 py-3 text-sm font-medium text-[#160e07] transition-transform hover:scale-[1.02]"
            >
              {T("Start on WhatsApp", "ابدأ عبر واتساب")}
            </a>
            <a
              href="/custom"
              className="rounded-full border border-bone/30 px-6 py-3 text-sm text-bone transition-colors hover:bg-bone/10"
            >
              {T("Design it in 3D", "صمّمها ثلاثية الأبعاد")}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
