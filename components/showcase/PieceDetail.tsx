"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import { brand, waLink } from "@/lib/config";
import type { ShowcasePiece } from "@/lib/showcase";

/** One showcase piece — hero, story, facts strip, gallery, commission CTA.
 *  No pricing is shown anywhere by design. */
export function PieceDetail({ piece }: { piece: ShowcasePiece }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const T = (en: string, arr: string) => (ar ? arr : en);

  const waMsg = ar
    ? `مرحبًا ${brand.name}، أعجبتني قطعة «${piece.name.ar}» في المعرض — أودّ طلب قطعة مشابهة.`
    : `Hi ${brand.name}, I saw "${piece.name.en}" in your showcase — I'd like to commission a piece like it.`;

  return (
    <div className="px-5 pb-28 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1100px]">
        {/* back */}
        <Link
          href="/showcase"
          data-cursor="hover"
          className="font-mono text-xs tracking-widest text-ink-soft transition-colors hover:text-ink"
        >
          <span aria-hidden className="inline-block rtl:rotate-180">←</span>{" "}
          {T("The Showcase", "المَعرض")}
        </Link>

        {/* title */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-3xl"
        >
          <h1 className="font-display text-4xl leading-[1.02] md:text-6xl">
            {ar ? piece.name.ar : piece.name.en}
          </h1>
          <p className="mt-4 text-base text-ink-soft md:text-lg">
            {ar ? piece.line.ar : piece.line.en}
          </p>
        </motion.header>

        {/* hero image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 overflow-hidden rounded-2xl border border-ink/10 bg-ink/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={piece.hero} alt={piece.name.en} className="w-full object-cover" />
        </motion.div>

        {/* story + facts */}
        <section className="mt-12 grid gap-10 md:grid-cols-[1.6fr_1fr] md:gap-16">
          <p className="font-display text-2xl leading-snug md:text-3xl">
            {ar ? piece.story.ar : piece.story.en}
          </p>
          {piece.facts.length > 0 && (
            <ul className="space-y-3 self-start border-t border-ink/10 pt-5 md:border-t-0 md:border-s md:ps-8 md:pt-0">
              {piece.facts.map((f, i) => (
                <li key={i} className="text-sm leading-relaxed text-ink-soft">
                  {ar ? f.ar : f.en}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* gallery */}
        {(piece.gallery.length > 0 || piece.video) && (
          <section className="mt-16 grid gap-8 sm:grid-cols-2">
            {piece.gallery.map((g) => (
              <figure key={g.src}>
                <div className="overflow-hidden rounded-2xl border border-ink/10 bg-ink/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={ar ? g.caption.ar : g.caption.en} loading="lazy" className="w-full object-cover" />
                </div>
                <figcaption className="mt-3 font-mono text-xs tracking-wide text-ink-soft">
                  {ar ? g.caption.ar : g.caption.en}
                </figcaption>
              </figure>
            ))}
            {piece.video && (
              <figure>
                <div className="overflow-hidden rounded-2xl border border-ink/10 bg-ink/5">
                  <video
                    src={piece.video.src}
                    poster={piece.video.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-xs tracking-wide text-ink-soft">
                  {ar ? piece.video.caption.ar : piece.video.caption.en}
                </figcaption>
              </figure>
            )}
          </section>
        )}

        {/* commission CTA */}
        <section className="mt-20 rounded-2xl border border-ink/10 bg-ink/[0.03] p-8 md:p-12">
          <p className="max-w-2xl font-display text-2xl leading-snug md:text-3xl">
            {T(
              "Like this piece? We make one for you — in your wood, at your size.",
              "أعجبتك هذه القطعة؟ نصنع لك واحدة — بخشبك أنت، وبمقاسك أنت."
            )}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={waLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-amber hover:text-[#160e07]"
            >
              {T("Commission a piece like this", "اطلب قطعة مثلها")}
            </a>
            <Link
              href="/showcase"
              className="rounded-full border border-ink/25 px-7 py-3.5 text-sm transition-colors hover:border-ink"
            >
              {T("Back to the showcase", "العودة إلى المعرض")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
