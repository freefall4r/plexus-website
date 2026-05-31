"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n/context";

export function CustomTeaser() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden py-24 text-bone md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_25%_50%,rgba(12,8,5,0.88),rgba(12,8,5,0.35)_65%,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_35%,rgba(200,119,46,0.18),transparent_70%)]" />
      <div className="mx-auto grid max-w-[1500px] items-center gap-14 px-5 md:grid-cols-2 md:px-10">
        <div>
          <Reveal>
            <p className="overline text-amber">{t("teaser.over")}</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.04] md:text-7xl">
              {t("teaser.title")}
            </h2>
            <p className="mt-6 max-w-md text-bone/70 md:text-lg">{t("teaser.body")}</p>
            <Link
              href="/custom"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3 text-sm font-medium text-walnut-deep transition-transform hover:-translate-y-0.5"
            >
              {t("teaser.cta")}
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <div className="relative">
          <PhotoToModel />
        </div>
      </div>
    </section>
  );
}

// Animated "photo → 3D" graphic, pure CSS/SVG + framer.
function PhotoToModel() {
  return (
    <div className="relative mx-auto flex h-[340px] w-full max-w-md items-center justify-center gap-6">
      {/* photo */}
      <motion.div
        initial={{ opacity: 0, x: -20, rotate: -6 }}
        whileInView={{ opacity: 1, x: 0, rotate: -6 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-40 w-32 shrink-0 rounded-lg border border-bone/20 bg-walnut-deep/60 p-2 shadow-2xl backdrop-blur"
      >
        <div className="h-full w-full rounded bg-[radial-gradient(circle_at_40%_35%,#9a6a38,#3a2412)]" />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-bone px-2 py-0.5 font-mono text-[9px] text-ink">
          .jpg
        </div>
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-2xl text-amber"
      >
        →
      </motion.span>

      {/* rotating wireframe cube */}
      <div className="relative h-40 w-40 shrink-0" style={{ perspective: "600px" }}>
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: 360, rotateX: 18 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          {[
            "rotateY(0deg) translateZ(70px)",
            "rotateY(90deg) translateZ(70px)",
            "rotateY(180deg) translateZ(70px)",
            "rotateY(270deg) translateZ(70px)",
            "rotateX(90deg) translateZ(70px)",
            "rotateX(-90deg) translateZ(70px)",
          ].map((tf, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 border border-amber/50 bg-amber/[0.06]"
              style={{ transform: tf }}
            />
          ))}
        </motion.div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber px-2 py-0.5 font-mono text-[9px] text-walnut-deep">
          .glb
        </div>
      </div>
    </div>
  );
}
