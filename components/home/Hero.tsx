"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/lib/i18n/context";

export function Hero() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const wordY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const line1 = lang === "ar" ? "نصنع الخشب" : "We join wood";
  const line2 = lang === "ar" ? "بنيّة وصبر." : "with intention.";

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* atmosphere over the global 3D background (all click-through) */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_72%_38%,rgba(232,150,70,0.16),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_220px_60px_rgba(0,0,0,0.6)]" />
        {/* bottom scrim for headline legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0c0805] via-[#0c0805]/55 to-transparent" />

        {/* top corner editorial labels */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-5 pt-24 text-bone/50 md:px-10 md:pt-28">
          <span className="font-mono text-[11px] tracking-[0.25em]">
            [ {lang === "ar" ? "ورشة نجارة" : "WOODWORK STUDIO"} ]
          </span>
          <span className="hidden font-mono text-[11px] tracking-[0.25em] md:block">
            31.95°N / 35.93°E
          </span>
        </div>

        {/* right vertical caption */}
        <div className="pointer-events-none absolute end-5 top-1/2 hidden -translate-y-1/2 md:block">
          <p
            className="font-mono text-[11px] tracking-[0.4em] text-bone/40"
            style={{ writingMode: "vertical-rl" }}
          >
            {lang === "ar" ? "عمّان — الأردن" : "AMMAN — JORDAN"}
          </p>
        </div>

        {/* big wordmark, anchored bottom, slightly clipped */}
        <motion.div
          style={{ y: wordY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
        >
          <span className="translate-y-[14%] select-none font-display text-[28vw] font-light leading-[0.7] tracking-[-0.04em] text-bone/[0.07] md:text-[24vw]">
            PLEXUS
          </span>
        </motion.div>

        {/* main content — bottom-left editorial block */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="absolute inset-x-0 bottom-0 px-5 pb-20 md:px-10 md:pb-24"
        >
          <div className="max-w-3xl">
            <p className="px-reveal overline text-amber" style={{ animationDelay: "0.15s" }}>
              {lang === "ar" ? "أثاث وقطع نحتية حسب الطلب" : "Custom furniture & sculptural objects"}
            </p>

            <h1 className="mt-4 font-display text-bone drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
              <Line delay={0.28}>{line1}</Line>
              <Line delay={0.4} accent>
                {line2}
              </Line>
            </h1>

            <div
              className="px-reveal mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.7s" }}
            >
              <Link
                href="/custom"
                className="group inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-[#160e07] transition-transform hover:-translate-y-0.5"
              >
                {t("cta.render")}
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-bone/25 px-7 py-3.5 text-sm text-bone/90 transition-colors hover:border-bone hover:bg-bone/5"
              >
                {t("cta.browse")}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-7 end-5 z-10 hidden flex-col items-center gap-2 md:flex md:end-10"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
            {t("scroll.assemble")}
          </span>
          <span className="h-12 w-px overflow-hidden bg-bone/15">
            <motion.span
              className="block h-4 w-px bg-amber"
              animate={{ y: [0, 34, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function Line({
  children,
  delay = 0,
  accent = false,
}: {
  children: string;
  delay?: number;
  accent?: boolean;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span
        className={`px-clip text-[13vw] leading-[0.92] tracking-[-0.03em] md:text-[7.5rem] ${
          accent ? "italic text-amber" : ""
        }`}
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </span>
    </span>
  );
}
