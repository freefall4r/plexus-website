"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { useLang } from "@/lib/i18n/context";
import { sectionCopy } from "@/lib/i18n/sections";
import type { HomeContent } from "@/lib/home";

/** Layout metadata for each editorial slot — kept independent of the image
 *  source so it can be reused (cycled) for any number of Sanity items. */
type Layout = {
  /** col-span + offset utilities, applied at md+ for the magazine layout */
  span: string;
  /** aspect ratio of the image frame */
  aspect: string;
  /** image sizes attribute */
  sizes: string;
  /** stagger delay for the Reveal */
  delay: number;
};

const layoutPattern: Layout[] = [
  {
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 768px) 40vw, 50vw",
    delay: 0,
  },
  {
    span: "md:col-span-7 md:mt-20",
    aspect: "aspect-[16/11]",
    sizes: "(min-width: 768px) 56vw, 50vw",
    delay: 0.08,
  },
  {
    span: "md:col-span-7",
    aspect: "aspect-[3/2]",
    sizes: "(min-width: 768px) 56vw, 50vw",
    delay: 0,
  },
  {
    span: "md:col-span-5 md:mt-24",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 768px) 40vw, 50vw",
    delay: 0.08,
  },
  {
    span: "md:col-span-6",
    aspect: "aspect-[5/4]",
    sizes: "(min-width: 768px) 48vw, 50vw",
    delay: 0,
  },
  {
    span: "md:col-span-4 md:mt-16",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 768px) 32vw, 50vw",
    delay: 0.08,
  },
  {
    span: "md:col-span-5",
    aspect: "aspect-[3/4]",
    sizes: "(min-width: 768px) 40vw, 50vw",
    delay: 0,
  },
  {
    span: "md:col-span-7 md:mt-20",
    aspect: "aspect-[16/11]",
    sizes: "(min-width: 768px) 56vw, 50vw",
    delay: 0.08,
  },
];

/** Default tiles — the local images paired with the first eight layout slots. */
const defaultImages: string[] = [
  "/brand/hangers.jpg",
  "/brand/bench-sage.jpg",
  "/brand/table-stone.jpg",
  "/brand/relief.jpg",
  "/brand/console.jpg",
  "/brand/side-table.jpg",
  "/brand/branch-rack.jpg",
  "/brand/bar.jpg",
];

type Tile = { src: string; name: string; material: string; layout: Layout };

function renderTile(tile: Tile, key: string) {
  const { layout } = tile;
  return (
    <Reveal key={key} delay={layout.delay} className={layout.span}>
      <figure className="group">
        <div
          className={`relative ${layout.aspect} overflow-hidden rounded-sm bg-sand transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-24px_rgba(31,27,20,0.45)]`}
        >
          <Image
            src={tile.src}
            alt={tile.name}
            fill
            sizes={layout.sizes}
            className="object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] group-hover:brightness-[1.04]"
          />
        </div>
        <figcaption className="mt-4">
          <h3 className="font-display text-[clamp(1.25rem,1.1rem+0.5vw,1.6rem)] font-light leading-tight text-ink">
            {tile.name}
          </h3>
          <p className="overline mt-1.5 text-ink-soft">{tile.material}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function WorkGrid({ content }: { content?: HomeContent["work"] }) {
  const { lang } = useLang();
  const c = sectionCopy.work[lang];

  const sanityItems = content?.items?.filter((it) => it.image);

  const tiles: Tile[] =
    sanityItems && sanityItems.length > 0
      ? sanityItems.map((it, index) => ({
          src: it.image as string,
          name: it.name?.[lang] || "",
          material: it.material?.[lang] || "",
          layout: layoutPattern[index % layoutPattern.length],
        }))
      : defaultImages.map((src, index) => ({
          src,
          name: c.items[index].name,
          material: c.items[index].material,
          layout: layoutPattern[index],
        }));

  return (
    <section className="py-24 md:py-32 bg-bone-2">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal>
          <header className="max-w-[26ch]">
            <span className="overline text-copper">
              {content?.eyebrow?.[lang] || c.eyebrow}
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,1.8rem+3vw,4.4rem)] font-light leading-[1.02] tracking-[-0.02em] text-ink">
              {content?.heading?.[lang] || c.heading}
            </h2>
          </header>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-24 md:grid-cols-12 md:gap-x-8 md:gap-y-6">
          {tiles.map((tile, index) => renderTile(tile, `${tile.name}-${index}`))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-20 flex justify-end md:mt-28">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm tracking-wide text-ink transition-colors hover:text-copper"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                {c.cta}
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                {lang === "ar" ? "←" : "→"}
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
