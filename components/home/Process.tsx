"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import type { DictKey } from "@/lib/i18n/dict";

const steps: { n: string; t: DictKey; b: DictKey }[] = [
  { n: "01", t: "process.s1.t", b: "process.s1.b" },
  { n: "02", t: "process.s2.t", b: "process.s2.b" },
  { n: "03", t: "process.s3.t", b: "process.s3.b" },
  { n: "04", t: "process.s4.t", b: "process.s4.b" },
];

export function Process() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Pixel-based translate (avoids percentage-string MotionValues on style).
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setMaxX(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section ref={ref} className="relative h-[360vh] text-bone">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 flex w-full max-w-[1500px] items-end justify-between px-5 md:px-10">
          <div>
            <p className="overline text-amber">{t("process.over")}</p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">{t("process.title")}</h2>
          </div>
          <p className="hidden font-mono text-xs text-bone/40 md:block">04 →</p>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6 px-5 md:gap-10 md:px-10"
        >
          {steps.map((s) => (
            <article
              key={s.n}
              className="relative flex h-[58vh] w-[82vw] shrink-0 flex-col justify-between rounded-3xl border border-bone/10 bg-gradient-to-br from-[#241606]/85 to-[#0c0805]/92 p-8 backdrop-blur-md md:w-[44vw] md:p-12"
            >
              <span className="font-display text-7xl text-amber/80 md:text-8xl">{s.n}</span>
              <div>
                <h3 className="font-display text-3xl md:text-4xl">{t(s.t)}</h3>
                <p className="mt-4 max-w-md text-bone/70 md:text-lg">{t(s.b)}</p>
              </div>
              <div className="edge-line h-px w-full opacity-30" />
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
