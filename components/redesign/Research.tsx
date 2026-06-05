"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { useLang } from "@/lib/i18n/context";
import { sectionCopy } from "@/lib/i18n/sections";
import type { HomeContent } from "@/lib/home";

export function Research({ content }: { content?: HomeContent["research"] }) {
  const { lang } = useLang();
  const c = sectionCopy.research[lang];

  return (
    <section className="py-24 md:py-32 bg-bone">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          {/* Text column */}
          <div className="md:col-span-6 lg:col-span-5">
            <Reveal>
              <span className="overline text-sage">
                {content?.eyebrow?.[lang] || c.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2rem,1.5rem+2.6vw,3.4rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
                {content?.heading?.[lang] || c.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-[52ch] text-[clamp(1.02rem,0.96rem+0.3vw,1.18rem)] leading-relaxed text-ink-soft">
                {content?.intro?.[lang] || c.intro}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-9 space-y-5">
                {c.services.map((s) => (
                  <div key={s.term} className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-2 w-2 shrink-0 bg-sage"
                    />
                    <div className="text-[clamp(1rem,0.96rem+0.2vw,1.1rem)] leading-relaxed">
                      <dt className="inline font-semibold text-ink">
                        {s.term}
                      </dt>
                      <dd className="inline text-ink-soft">
                        {" "}
                        — {s.desc}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-10 max-w-[40ch] font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.6rem)] font-light leading-snug text-sage">
                {c.closing}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <Link
                href="/custom"
                className="group mt-8 inline-flex items-center gap-2 text-sm tracking-wide text-ink transition-colors hover:text-sage"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                  {c.link}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  {lang === "ar" ? "←" : "→"}
                </span>
              </Link>
            </Reveal>
          </div>

          {/* Image column */}
          <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src={content?.image || "/brand/topography.jpg"}
                  alt="Wood panel carved with topographic contour lines, like a map of the grain"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
