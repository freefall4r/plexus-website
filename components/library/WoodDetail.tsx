"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/redesign/Reveal";
import { useLang } from "@/lib/i18n/context";
import { WoodCard } from "./WoodCard";
import { CATEGORY_LABELS, type WoodEntry } from "@/lib/woodLibrary";

const COPY = {
  back: { en: "The Wood Library", ar: "مكتبة الأخشاب" },
  facts: { en: "The facts", ar: "الأرقام" },
  uses: { en: "Best uses", ar: "أفضل الاستخدامات" },
  watchOut: { en: "Watch out for", ar: "انتبه إلى" },
  notes: { en: "Engineer's notes", ar: "ملاحظات المهندس" },
  related: { en: "More in the library", ar: "المزيد في المكتبة" },
  commission: {
    en: "Want a piece made in this wood?",
    ar: "تريد قطعة مصنوعة من هذا الخشب؟",
  },
  commissionCta: { en: "Talk to the workshop", ar: "تحدّث إلى الورشة" },
};

export function WoodDetail({
  entry,
  related,
}: {
  entry: WoodEntry;
  related: WoodEntry[];
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const name = ar ? entry.name_ar : entry.name;
  const sub = ar ? entry.localName_ar || entry.botanical : entry.botanical;
  const uses = ar ? entry.uses_ar : entry.uses;
  const catLabel = CATEGORY_LABELS[entry.category];

  return (
    <div className="grain pb-28 pt-28 md:pt-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        {/* Breadcrumb */}
        <Link
          href="/wood-library"
          className="inline-flex items-center gap-2 text-sm tracking-wide text-ink-soft transition-colors hover:text-copper"
        >
          <span aria-hidden className="rtl:rotate-180">←</span>
          {COPY.back[lang]}
        </Link>

        {/* Hero */}
        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bone-2">
              <Image
                src={entry.image}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
          <div className="flex flex-col justify-center">
            <Reveal>
              <span className="overline text-sage">
                {ar ? catLabel.ar : catLabel.en}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-3 font-display text-[clamp(2.2rem,1.7rem+2.6vw,3.6rem)] font-light leading-[1.03] tracking-[-0.02em] text-ink">
                {name}
              </h1>
            </Reveal>
            {sub && (
              <Reveal delay={0.08}>
                <p className="mt-1 font-mono text-sm italic text-ink-soft">{sub}</p>
              </Reveal>
            )}
            <Reveal delay={0.12}>
              <p className="mt-5 text-[clamp(1.02rem,0.96rem+0.3vw,1.15rem)] leading-relaxed text-ink-soft">
                {ar ? entry.intro_ar : entry.intro}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Facts */}
        <section className="mt-14 md:mt-20">
          <Reveal>
            <span className="overline text-copper">{COPY.facts[lang]}</span>
          </Reveal>
          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 md:grid-cols-4">
            {entry.facts.map((f) => (
              <div key={f.label} className="bg-bone p-5">
                <dt className="text-xs uppercase tracking-wider text-ink-soft">
                  {ar ? f.label_ar : f.label}
                </dt>
                <dd className="mt-1.5 font-display text-lg leading-tight text-ink">
                  {ar ? f.value_ar || f.value : f.value}
                </dd>
              </div>
            ))}
          </div>
        </section>

        {/* Uses + watch out */}
        <section className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <div>
              <h2 className="overline text-sage">{COPY.uses[lang]}</h2>
              <ul className="mt-4 space-y-3">
                {uses.map((u, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-soft">
                    <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 bg-sage" />
                    <span className="leading-relaxed">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div>
              <h2 className="overline text-copper">{COPY.watchOut[lang]}</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                {ar ? entry.watchOut_ar : entry.watchOut}
              </p>
            </div>
          </Reveal>
        </section>

        {/* Engineer's notes */}
        <section className="mt-12 md:mt-16">
          <Reveal>
            <div className="rounded-xl border border-copper/20 bg-bone-2/50 p-7 md:p-10">
              <div className="flex items-center gap-3">
                <span aria-hidden className="text-xl">🔧</span>
                <h2 className="overline text-copper">{COPY.notes[lang]}</h2>
              </div>
              <p className="mt-4 max-w-[62ch] font-display text-[clamp(1.15rem,1.02rem+0.5vw,1.5rem)] font-light leading-relaxed text-ink">
                {ar ? entry.notes_ar : entry.notes}
              </p>
            </div>
          </Reveal>
        </section>

        {/* Commission CTA */}
        <section className="mt-12 flex flex-col items-start gap-4 border-t border-ink/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[clamp(1.2rem,1.05rem+0.6vw,1.6rem)] font-light text-ink">
            {COPY.commission[lang]}
          </p>
          <Link
            href="/custom"
            className="shrink-0 rounded-full bg-ink px-6 py-2.5 text-sm text-bone transition-colors hover:bg-copper"
          >
            {COPY.commissionCta[lang]}
          </Link>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="font-display text-[clamp(1.4rem,1.2rem+1vw,2rem)] font-light text-ink">
              {COPY.related[lang]}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {related.map((e) => (
                <WoodCard key={e.slug} entry={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
