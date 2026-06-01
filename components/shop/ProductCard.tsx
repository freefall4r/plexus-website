"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CatalogueProduct } from "@/lib/catalogue";
import { ProductMedia } from "./ProductMedia";
import { useLang } from "@/lib/i18n/context";
import { currency } from "@/lib/config";

export function ProductCard({ product, index = 0 }: { product: CatalogueProduct; index?: number }) {
  const { lang, t, num } = useLang();
  const name = lang === "ar" ? product.name_ar : product.name;
  const blurb = lang === "ar" ? product.blurb_ar : product.blurb;
  const wood = lang === "ar" ? product.wood_ar : product.wood;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group block transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
        data-cursor="hover"
      >
        <div className="relative aspect-square overflow-hidden rounded-none bg-bone-2 transition-shadow duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_24px_60px_-24px_rgba(31,27,20,0.45)]">
          <div className="absolute inset-0 transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-hover:brightness-[1.04]">
            <ProductMedia product={product} alt={name} className="h-full w-full" />
          </div>
          {product.featured && (
            <span className="absolute left-3 top-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
              <span className="h-1.5 w-1.5 rounded-full bg-copper" aria-hidden />
              Featured
            </span>
          )}
          <span className="absolute bottom-3 ltr:right-3 rtl:left-3 translate-y-2 rounded-sm bg-bone/90 px-3 py-1 font-mono text-xs text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {t("shop.madeToOrder")}
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-light leading-tight text-ink">{name}</h3>
            <p className="mt-0.5 truncate text-sm text-ink-soft">{blurb}</p>
          </div>
          <div className="shrink-0 text-right rtl:text-left">
            <p className="font-mono text-sm text-ink">
              {currency.symbol} {num(product.price)}
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">{wood}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
