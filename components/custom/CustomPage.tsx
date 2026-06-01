"use client";

import dynamic from "next/dynamic";
import { CustomStudio } from "./CustomStudio";
import { useLang } from "@/lib/i18n/context";
import type { DictKey } from "@/lib/i18n/dict";

const StudioHero3D = dynamic(
  () => import("./StudioHero3D").then((m) => m.StudioHero3D),
  { ssr: false, loading: () => null }
);

const steps: { n: string; t: DictKey; b: DictKey }[] = [
  { n: "01", t: "studio.drop", b: "studio.hint" },
  { n: "02", t: "studio.generating", b: "studio.stage.texture" },
  { n: "03", t: "studio.ar", b: "studio.arHint" },
];

export function CustomPage() {
  const { t, lang } = useLang();

  return (
    <div className="relative bg-walnut-deep text-bone">
      {/* ===== HERO (pinned, scroll-driven gem) ===== */}
      <section className="relative h-[185vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(120%_110%_at_60%_25%,rgba(42,36,26,1)_0%,rgba(31,27,20,1)_55%,rgba(20,17,12,1)_100%)]" />

          {/* the scroll-animated 3D gem */}
          <div className="absolute inset-0 md:left-[38%]">
            <StudioHero3D />
          </div>
          {/* warm copper gem glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_72%_45%,rgba(156,91,44,0.18),transparent_65%)]" />
          {/* left scrim for text */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(20,17,12,0.95)] via-[rgba(20,17,12,0.7)] to-transparent md:via-[rgba(20,17,12,0.3)] md:to-transparent" />

          <div className="relative mx-auto flex h-screen max-w-[1500px] flex-col justify-center px-5 pt-32 pb-16 md:px-10">
            <p className="px-reveal overline text-copper" style={{ animationDelay: "0.1s" }}>
              {t("studio.over")}
            </p>
            <h1 className="mt-5 max-w-2xl font-display font-light text-bone">
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="px-clip block text-[15vw] leading-[0.9] tracking-[-0.03em] md:text-[8.5rem]" style={{ animationDelay: "0.25s" }}>
                  {lang === "ar" ? "استوديو" : "The 3D"}
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="px-clip block text-[15vw] italic leading-[0.9] tracking-[-0.03em] text-copper md:text-[8.5rem]" style={{ animationDelay: "0.37s" }}>
                  {lang === "ar" ? "الأبعاد" : "Studio"}
                </span>
              </span>
            </h1>
            <p className="px-reveal mt-6 max-w-md text-bone/70 md:text-lg" style={{ animationDelay: "0.6s" }}>
              {t("studio.sub")}
            </p>
            <a
              href="#studio"
              className="group px-reveal mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-copper px-7 py-3.5 text-sm font-medium tracking-wide text-bone transition-colors hover:bg-copper-bright"
              style={{ animationDelay: "0.75s" }}
            >
              {t("teaser.cta")}
              <span className="transition-transform duration-300 group-hover:translate-y-1">
                ↓
              </span>
            </a>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-walnut-deep to-transparent" />
        </div>
      </section>

      {/* ===== STUDIO ===== */}
      <section id="studio" className="relative mx-auto max-w-3xl scroll-mt-24 px-5 pb-12 pt-8">
        <CustomStudio />
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative mx-auto max-w-5xl px-5 pb-28 pt-8">
        <p className="overline mb-12 text-copper">{lang === "ar" ? "كيف يعمل" : "How it works"}</p>
        <div className="grid gap-x-12 gap-y-12 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-walnut-deep">
              <span className="block font-display text-[clamp(2.6rem,2rem+2vw,3.6rem)] font-light leading-none text-copper">
                {s.n}
              </span>
              <div className="mt-6 h-px w-full bg-copper/40" />
              <h3 className="mt-6 font-display text-2xl font-light leading-tight text-bone">{t(s.t)}</h3>
              <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-bone/60">{t(s.b)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
