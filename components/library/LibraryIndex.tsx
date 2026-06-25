"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/redesign/Reveal";
import { useLang } from "@/lib/i18n/context";
import { WoodCard } from "./WoodCard";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type WoodEntry,
  type Explainer,
} from "@/lib/woodLibrary";

const COPY = {
  overline: { en: "The Wood Library", ar: "مكتبة الأخشاب" },
  heading: {
    en: "Know your wood.",
    ar: "اعرف خشبك.",
  },
  intro: {
    en: "A working engineer's guide to the materials we build with — solid woods, the hardwood-vs-softwood truth, and the engineered boards (plywood, latte, MDF, HDF) you hear about at every carpenter. Plain language, real numbers.",
    ar: "دليل مهندس عملي للمواد التي نبني بها — الأخشاب الطبيعية، وحقيقة الصلب مقابل اللين، والألواح المصنّعة (أبلكاش، لاتيه، MDF، HDF) التي تسمع بها عند كل نجّار. لغة بسيطة وأرقام حقيقية.",
  },
  explainersTitle: { en: "Start here", ar: "ابدأ من هنا" },
  read: { en: "Read", ar: "اقرأ" },
};

export function LibraryIndex({
  entries,
  explainers,
}: {
  entries: WoodEntry[];
  explainers: Explainer[];
}) {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="grain pb-28 pt-32 md:pt-40">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        {/* Hero */}
        <header className="max-w-[60ch]">
          <Reveal>
            <span className="overline text-sage">{COPY.overline[lang]}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,1.8rem+3.2vw,4.4rem)] font-light leading-[1.02] tracking-[-0.02em] text-ink">
              {COPY.heading[lang]}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-[clamp(1.02rem,0.96rem+0.3vw,1.18rem)] leading-relaxed text-ink-soft">
              {COPY.intro[lang]}
            </p>
          </Reveal>
        </header>

        {/* Explainers */}
        <section className="mt-16 md:mt-24">
          <Reveal>
            <span className="overline text-copper">{COPY.explainersTitle[lang]}</span>
          </Reveal>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {explainers.map((ex, i) => (
              <Reveal key={ex.slug} delay={0.05 * i}>
                <Link
                  href={`/wood-library/${ex.slug}`}
                  data-cursor="hover"
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-bone-2/40 transition-colors hover:border-copper/40 md:flex-row"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-bone-2 md:aspect-auto md:w-2/5">
                    <Image
                      src={ex.image}
                      alt={ar ? ex.title_ar : ex.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-6 md:p-7">
                    <h2 className="font-display text-[clamp(1.3rem,1.1rem+0.8vw,1.7rem)] font-light leading-tight text-ink">
                      {ar ? ex.title_ar : ex.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {ar ? ex.summary_ar : ex.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm tracking-wide text-copper">
                      {COPY.read[lang]}
                      <span aria-hidden className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Category grids */}
        {CATEGORY_ORDER.map((cat) => {
          const list = entries.filter((e) => e.category === cat);
          if (list.length === 0) return null;
          const label = CATEGORY_LABELS[cat];
          return (
            <section key={cat} className="mt-16 md:mt-24">
              <Reveal>
                <h2 className="font-display text-[clamp(1.6rem,1.3rem+1.4vw,2.4rem)] font-light leading-tight text-ink">
                  {ar ? label.ar : label.en}
                </h2>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-2 max-w-[58ch] text-[clamp(0.98rem,0.94rem+0.2vw,1.08rem)] leading-relaxed text-ink-soft">
                  {ar ? label.blurb_ar : label.blurb_en}
                </p>
              </Reveal>
              <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {list.map((entry, i) => (
                  <Reveal key={entry.slug} delay={0.03 * i}>
                    <WoodCard entry={entry} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
