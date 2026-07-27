"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import { showcasePieces } from "@/lib/showcase";

/** The Showcase — an editorial gallery of selected one-off pieces.
 *  Light limewash look, no pricing anywhere; each card opens the piece's page
 *  (NAWAH opens its own standalone presentation). */
export function ShowcaseGallery() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const T = (en: string, arr: string) => (ar ? arr : en);

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
          <p className="overline text-amber">{T("Selected works", "أعمال مختارة")}</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
            {T("The Showcase", "المَعرض")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            {T(
              "One-off pieces and commissions from the workshop — designed, engineered and made in Amman. Press a piece to step closer.",
              "قطع فريدة وأعمال بتكليف من الورشة — صُمّمت وهُندست وصُنعت في عمّان. اضغط على أي قطعة لتقترب منها."
            )}
          </p>
        </motion.section>

        {/* grid */}
        <section className="mt-16 grid gap-10 sm:grid-cols-2 md:mt-20">
          {showcasePieces.map((p, i) => {
            const href = p.externalHref ?? `/showcase/${p.slug}`;
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={href} data-cursor="hover" className="group block">
                  <div className="overflow-hidden rounded-2xl border border-ink/10 bg-ink/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.card}
                      alt={p.name.en}
                      loading={i < 2 ? "eager" : "lazy"}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-2xl leading-tight md:text-3xl">
                      {ar ? p.name.ar : p.name.en}
                    </h2>
                    <span
                      aria-hidden
                      className="shrink-0 font-mono text-xs tracking-widest text-ink-soft transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    >
                      →
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink-soft">{ar ? p.line.ar : p.line.en}</p>
                </Link>
              </motion.div>
            );
          })}
        </section>

        {/* commission strip */}
        <section className="mt-24 border-t border-ink/10 pt-10">
          <p className="max-w-2xl font-display text-2xl leading-snug md:text-3xl">
            {T(
              "Every piece here started as a conversation. Bring yours.",
              "كل قطعة هنا بدأت بحديث. أحضر فكرتك."
            )}
          </p>
          <Link
            href="/custom"
            className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-amber hover:text-[#160e07]"
          >
            {T("Commission a piece", "اطلب قطعتك الخاصة")}
          </Link>
        </section>
      </div>
    </div>
  );
}
