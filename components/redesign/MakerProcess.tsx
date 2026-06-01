"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { useLang } from "@/lib/i18n/context";
import { sectionCopy } from "@/lib/i18n/sections";

export function MakerProcess() {
  const { lang } = useLang();
  const c = sectionCopy.craft[lang];

  return (
    <section className="py-24 md:py-32 bg-bone-2">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        {/* Eyebrow + oversized statement */}
        <Reveal>
          <span className="overline text-copper">{c.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-7 max-w-[18ch] font-display text-[clamp(2.1rem,1.5rem+2.8vw,4.2rem)] font-light leading-[1.02] tracking-[-0.02em] text-ink">
            {c.statement}
          </p>
        </Reveal>

        {/* Cinematic full-width texture band */}
        <Reveal delay={0.12}>
          <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden md:mt-16 md:aspect-[21/8]">
            <Image
              src="/brand/craft.jpg"
              alt="Hand tools and sawdust on a workbench in warm low light"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(31,27,20,0.45) 0%, rgba(31,27,20,0) 42%)",
              }}
            />
            <span className="absolute bottom-5 left-5 font-display text-lg italic text-bone/90 md:bottom-7 md:left-8 md:text-xl">
              {c.overlay}
            </span>
          </div>
        </Reveal>

        {/* Connected copper timeline */}
        <Reveal delay={0.1}>
          <div className="mt-16 h-px w-full bg-copper/25 md:mt-20" />
        </Reveal>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 md:gap-14">
          {c.steps.map((s, i) => (
            <Reveal key={s.n} delay={0.14 + i * 0.12}>
              <div className="pt-7">
                <div className="flex items-baseline gap-3">
                  <span aria-hidden className="-mt-px h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                  <span className="font-display text-4xl font-light leading-none text-copper">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl text-ink">{s.title}</h3>
                <p className="mt-2 max-w-[34ch] leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
