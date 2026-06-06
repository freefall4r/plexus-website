"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import { contact, igLink } from "@/lib/config";

/** "On Instagram" — handle + follow button + a grid of real workshop photos
 *  linking to the profile. A curated grid (not a live feed), so it's honest and
 *  needs no third-party widget. Swap the tile images anytime in public/. */
const TILES = [
  "/brand/hero-carved.jpg",
  "/work/rosequartz-oak.jpg",
  "/brand/console.jpg",
  "/work/topographic-oak.jpg",
  "/brand/table-stone.jpg",
  "/work/faceted-oak-table.jpg",
];

export function InstagramFollow() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const href = igLink();

  return (
    <section className="px-5 py-24 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="overline text-amber">{ar ? "تابعنا" : "Follow along"}</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.02] md:text-6xl">
              {ar ? "على إنستغرام" : "On Instagram"}
            </h2>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-lg text-ink-soft transition-colors hover:text-copper"
            >
              @{contact.instagram}
            </a>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-amber hover:text-[#160e07]"
          >
            {ar ? "تابعنا على إنستغرام" : "Follow on Instagram"}
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {TILES.map((src, i) => (
            <motion.a
              key={src}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${contact.instagram} on Instagram`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-bone-2"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/15" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
