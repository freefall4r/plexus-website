"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

// A figure with a quiet caption. Captions sit below in mono overline.
function Plate({
  src,
  alt,
  caption,
  meta,
  ratio = "aspect-[3/4]",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  caption: string;
  meta: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className="group">
      <div className={`relative ${ratio} w-full overflow-hidden rounded-sm bg-bone-2`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="text-ink">{caption}</span>
        <span className="overline shrink-0 text-ink-soft/70">{meta}</span>
      </figcaption>
    </figure>
  );
}

export function Gallery() {
  return (
    <section className="relative z-10 bg-bone py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-6 md:px-12">
        {/* header */}
        <Reveal className="mb-16 max-w-2xl md:mb-24">
          <p className="overline text-clay">Selected work</p>
          <h2 className="mt-5 font-display text-ink t-3">
            Solid wood &amp; stone,
            <span className="italic text-walnut"> shaped slowly.</span>
          </h2>
        </Reveal>

        {/* feature pair — golden-ratio split (φ : 1) */}
        <div className="grid gap-6 md:grid-cols-[1.618fr_1fr] md:gap-10">
          <Reveal>
            <Plate
              src="/work/oak-table-home.jpg"
              alt="Round oak dining table in an Amman home"
              caption="Round oak dining table"
              meta="Solid oak · Amman"
              ratio="aspect-[4/5]"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </Reveal>
          <Reveal delay={0.12}>
            <Plate
              src="/work/rosequartz-oak.jpg"
              alt="Rose quartz mounted on an olive-wood base"
              caption="Rose quartz on wood"
              meta="Stone + olive wood"
              ratio="aspect-[3/4]"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </Reveal>
        </div>
      </div>

      {/* full-bleed material band — oak grain */}
      <Reveal className="my-20 md:my-28">
        <div className="relative h-[42vh] min-h-[260px] w-full overflow-hidden md:h-[52vh]">
          <Image
            src="/work/oak-grain.jpg"
            alt="Close grain of solid oak, hand-oiled"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1320px] items-end justify-between px-6 pb-8 md:px-12 md:pb-12">
            <p className="font-display text-bone t-2 max-w-md leading-[1.05]">
              The material leads. We follow the grain.
            </p>
            <span className="overline hidden text-bone/70 md:block">Solid oak · hand-oiled</span>
          </div>
        </div>
      </Reveal>

      {/* three-up row */}
      <div className="mx-auto max-w-[1320px] px-6 md:px-12">
        <div className="grid gap-6 md:grid-cols-3 md:gap-10">
          <Reveal>
            <Plate
              src="/work/topographic-oak.jpg"
              alt="Topographic contour wall piece carved in oak"
              caption="Topographic wall piece"
              meta="Carved oak"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Plate
              src="/work/oak-table-stone.jpg"
              alt="Solid wood table against a Jordanian stone wall"
              caption="Outdoor oak table"
              meta="Wood + stone"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </Reveal>
          <Reveal delay={0.2}>
            <Plate
              src="/work/brass-cup.jpg"
              alt="Hammered brass cup beside a terracotta planter"
              caption="Hammered brass vessel"
              meta="Brass · terracotta"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
