"use client";

import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n/context";

export function Featured() {
  const { t } = useLang();
  const picks = products.filter((p) => p.featured).slice(0, 8);
  const list = picks.length >= 4 ? picks : products.slice(0, 8);

  return (
    <section className="relative z-10 rounded-[2.5rem] bg-bone py-24 shadow-[0_0_90px_-10px_rgba(0,0,0,0.55)] md:rounded-[4rem] md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="overline text-amber">{t("featured.over")}</p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">{t("featured.title")}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {t("cta.viewAll")}
              <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-7">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
