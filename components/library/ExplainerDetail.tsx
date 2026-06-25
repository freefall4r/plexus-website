"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/redesign/Reveal";
import { useLang } from "@/lib/i18n/context";
import type { Explainer } from "@/lib/woodLibrary";

const COPY = {
  back: { en: "The Wood Library", ar: "مكتبة الأخشاب" },
  guide: { en: "Guide", ar: "دليل" },
  browse: { en: "Browse the woods", ar: "تصفّح الأخشاب" },
  browseCta: {
    en: "See every wood in the library",
    ar: "شاهد كل خشب في المكتبة",
  },
};

export function ExplainerDetail({ explainer }: { explainer: Explainer }) {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="grain pb-28 pt-28 md:pt-32">
      <article className="mx-auto max-w-[760px] px-5 md:px-8">
        <Link
          href="/wood-library"
          className="inline-flex items-center gap-2 text-sm tracking-wide text-ink-soft transition-colors hover:text-copper"
        >
          <span aria-hidden className="rtl:rotate-180">←</span>
          {COPY.back[lang]}
        </Link>

        <Reveal>
          <span className="mt-6 block overline text-sage">{COPY.guide[lang]}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 font-display text-[clamp(2.1rem,1.6rem+2.6vw,3.4rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink">
            {ar ? explainer.title_ar : explainer.title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-[clamp(1.05rem,0.98rem+0.35vw,1.25rem)] leading-relaxed text-ink-soft">
            {ar ? explainer.summary_ar : explainer.summary}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-bone-2">
            <Image
              src={explainer.image}
              alt={ar ? explainer.title_ar : explainer.title}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        <div className="mt-12 space-y-12">
          {explainer.sections.map((s, i) => (
            <Reveal key={i} delay={0.03}>
              <section>
                <h2 className="font-display text-[clamp(1.4rem,1.2rem+0.9vw,1.9rem)] font-light leading-snug text-ink">
                  {ar ? s.heading_ar : s.heading}
                </h2>
                <p className="mt-4 text-[clamp(1.02rem,0.97rem+0.3vw,1.18rem)] leading-[1.8] text-ink-soft">
                  {ar ? s.body_ar : s.body}
                </p>
              </section>
            </Reveal>
          ))}
        </div>

        <section className="mt-16 flex flex-col items-start gap-4 border-t border-ink/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[clamp(1.2rem,1.05rem+0.6vw,1.6rem)] font-light text-ink">
            {COPY.browseCta[lang]}
          </p>
          <Link
            href="/wood-library"
            className="shrink-0 rounded-full bg-ink px-6 py-2.5 text-sm text-bone transition-colors hover:bg-copper"
          >
            {COPY.browse[lang]}
          </Link>
        </section>
      </article>
    </div>
  );
}
