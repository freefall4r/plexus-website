"use client";

import Image from "next/image";
import { Reveal } from "@/components/redesign/Reveal";
import { useLang } from "@/lib/i18n/context";
import { sectionCopy } from "@/lib/i18n/sections";

export function Philosophy() {
  const { lang } = useLang();
  const c = sectionCopy.philosophy[lang];
  return (
    <section className="pt-10 pb-24 md:pt-14 md:pb-32 bg-bone">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-16 lg:gap-24">
          {/* Image — tall, large, offset to one side */}
          <Reveal className="md:col-span-5 lg:col-span-5" y={20}>
            <figure className="md:mr-auto md:max-w-[440px]">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src="/brand/arbutus.jpg"
                  alt={c.caption}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 t-sm text-ink-soft">
                {c.caption}
              </figcaption>
            </figure>
          </Reveal>

          {/* Text — air, asymmetry, pushed right */}
          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <Reveal>
              <span className="overline text-copper">{c.eyebrow}</span>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-6 max-w-[18ch] font-display t-3 font-light text-ink">
                {c.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-8 max-w-[46ch] text-ink-soft leading-relaxed">
                {c.p1}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-6 max-w-[46ch] text-ink-soft leading-relaxed">
                {c.p2}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
