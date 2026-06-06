"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import { sectionCopy } from "@/lib/i18n/sections";
import { reviews } from "@/lib/config";
import type { HomeContent } from "@/lib/home";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Deterministic flowing "contour" lines — echoes the hand-carved topographic
 * wood panel and the timber-engineer identity. Computed once at module load
 * (no Math.random, so SSR and client markup match).
 */
function buildContours() {
  const W = 1440;
  const N = 9;
  const lines: string[] = [];
  for (let i = 0; i < N; i++) {
    const base = 130 + (i * 640) / (N - 1);
    const amp = 24 + (i % 3) * 11;
    const freq = 0.0042 + (i % 2) * 0.0012;
    const phase = i * 0.9;
    let d = "";
    for (let x = -40; x <= W + 40; x += 22) {
      const y =
        base +
        amp * Math.sin(x * freq + phase) +
        11 * Math.sin(x * 0.0017 + phase * 1.7);
      d += `${x === -40 ? "M" : "L"} ${x} ${y.toFixed(1)} `;
    }
    lines.push(d.trim());
  }
  return lines;
}
const LINES = buildContours();

export function HeroRedesign({ content }: { content?: HomeContent["hero"] }) {
  const { lang } = useLang();
  const c = sectionCopy.hero[lang];
  const eyebrow = content?.eyebrow?.[lang] || c.eyebrow;
  const line1 = content?.line1?.[lang] || c.line1;
  const line2 = content?.line2?.[lang] || c.line2;
  const sub = content?.sub?.[lang] || c.sub;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const driftY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contourFade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-bone"
    >
      {/* animated topographic contours (draw themselves) */}
      <motion.svg
        aria-hidden
        style={{ y: driftY, opacity: contourFade }}
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {LINES.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="var(--color-copper)"
            strokeWidth={1.1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.16 }}
            transition={{
              pathLength: { duration: 2.2, delay: 0.25 + i * 0.12, ease },
              opacity: { duration: 1, delay: 0.25 + i * 0.12 },
            }}
          />
        ))}
      </motion.svg>

      {/* soft light pool so the type stays crisp */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 65% at 18% 42%, rgba(244,239,230,0.72) 0%, rgba(244,239,230,0) 60%)",
        }}
      />

      <motion.div
        style={{ y: driftY }}
        className="relative z-10 mx-auto w-full max-w-[1500px] px-5 md:px-10"
      >
        <motion.span
          className="overline text-ink-soft"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {eyebrow}
        </motion.span>

        <h1 className="mt-6 font-display text-[clamp(2.6rem,1.8rem+4.4vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
          {[line1, line2].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.15 + i * 0.12, ease }}
              >
                {i === 1 ? (
                  <>
                    {line2.slice(0, -1)}
                    <span className="text-copper">{line2.slice(-1)}</span>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="mt-9 h-px w-full max-w-[300px] origin-left bg-ink/25"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5, ease }}
        />

        <motion.p
          className="mt-8 max-w-[50ch] text-[clamp(1.05rem,0.98rem+0.4vw,1.3rem)] leading-relaxed text-ink-soft"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease }}
        >
          {sub}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.68, ease }}
        >
          <Link
            href="/custom"
            className="group inline-flex items-center gap-2 rounded-full bg-copper px-7 py-3.5 text-sm font-medium tracking-wide text-bone transition-colors hover:bg-copper-bright"
          >
            {c.cta}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              {lang === "ar" ? "←" : "→"}
            </span>
          </Link>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-ink"
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
              {c.link}
            </span>
          </Link>
        </motion.div>

        <motion.a
          href={reviews.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-9 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-copper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.82 }}
        >
          <span className="tracking-tight text-amber" aria-hidden>★★★★★</span>
          <span className="font-semibold text-ink">{reviews.rating.toFixed(1)}</span>
          <span>·</span>
          <span>
            {lang === "ar"
              ? `${reviews.count} تقييم على Google`
              : `${reviews.count} reviews on Google`}
          </span>
        </motion.a>

        <motion.div
          className="mt-12 overline text-ink-soft/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.95 }}
        >
          {c.materials}
        </motion.div>
      </motion.div>
    </section>
  );
}
