"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n/context";
import type { WoodEntry } from "@/lib/woodLibrary";

export function WoodCard({ entry }: { entry: WoodEntry }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const name = ar ? entry.name_ar : entry.name;
  const tagline = ar ? entry.tagline_ar : entry.tagline;
  const sub = ar ? entry.localName_ar || entry.botanical : entry.botanical;

  return (
    <Link
      href={`/wood-library/${entry.slug}`}
      data-cursor="hover"
      className="group block overflow-hidden rounded-lg border border-ink/10 bg-bone-2/40 transition-colors hover:border-copper/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bone-2">
        <Image
          src={entry.image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="px-4 py-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-xl leading-tight text-ink">{name}</h3>
          {sub && (
            <span className="shrink-0 font-mono text-[11px] italic text-ink-soft">
              {sub}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm leading-snug text-ink-soft">{tagline}</p>
      </div>
    </Link>
  );
}
