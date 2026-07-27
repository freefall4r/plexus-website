"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/redesign/Reveal";
import { useLang } from "@/lib/i18n/context";
import type { WoodArticle } from "@/lib/woodLibrary";

const COPY = {
  back: { en: "The Wood Library", ar: "مكتبة الأخشاب" },
  article: { en: "From the journal", ar: "من دفتر الورشة" },
  browse: { en: "Browse the woods", ar: "تصفّح الأخشاب" },
  browseCta: {
    en: "See every wood in the library",
    ar: "شاهد كل خشب في المكتبة",
  },
};

function formatDate(iso: string, ar: boolean): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(ar ? "ar-JO" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleDetail({ article }: { article: WoodArticle }) {
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
          <div className="mt-6 flex items-center gap-3">
            <span className="overline text-sage">{COPY.article[lang]}</span>
            <span className="text-xs tracking-wide text-ink-soft/70">
              {formatDate(article.date, ar)}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 font-display text-[clamp(2.1rem,1.6rem+2.6vw,3.4rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink">
            {ar ? article.title_ar : article.title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-[clamp(1.05rem,0.98rem+0.35vw,1.25rem)] leading-relaxed text-ink-soft">
            {ar ? article.summary_ar : article.summary}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-bone-2">
            <Image
              src={article.image}
              alt={ar ? article.title_ar : article.title}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        <div className="mt-12 space-y-12">
          {article.sections.map((s, i) => (
            <Reveal key={i} delay={0.03}>
              <section>
                <h2 className="font-display text-[clamp(1.4rem,1.2rem+0.9vw,1.9rem)] font-light leading-snug text-ink">
                  {ar ? s.heading_ar : s.heading}
                </h2>
                {(ar ? s.body_ar : s.body)
                  .split(/\n\s*\n/)
                  .filter((p) => p.trim().length > 0)
                  .map((p, j) => (
                    <p
                      key={j}
                      className="mt-4 text-[clamp(1.02rem,0.97rem+0.3vw,1.18rem)] leading-[1.8] text-ink-soft"
                    >
                      {p.trim()}
                    </p>
                  ))}
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
