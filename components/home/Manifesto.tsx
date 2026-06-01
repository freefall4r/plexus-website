"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { useLang } from "@/lib/i18n/context";

export function Manifesto() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });
  const words = t("manifesto.body").split(" ");

  return (
    <section className="relative py-32 md:py-52">
      {/* soft limewash wash so the text stays readable over the 3D */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_50%,rgba(246,242,234,0.92),rgba(246,242,234,0.55)_60%,transparent)]" />
      <div className="relative mx-auto max-w-5xl px-5 md:px-10">
        <p className="overline mb-10 text-clay">{t("manifesto.over")}</p>
        <h2
          ref={ref}
          className="font-display text-3xl leading-[1.18] tracking-tight text-ink md:text-[2.9rem] md:leading-[1.25]"
        >
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {w}
              </Word>
            );
          })}
        </h2>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}
