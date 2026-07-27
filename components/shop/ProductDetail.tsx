"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "@/lib/products";
import type { CatalogueProduct } from "@/lib/catalogue";
import { ProductMedia } from "./ProductMedia";
import { ProductGallery } from "./ProductGallery";
import { ProductCard } from "./ProductCard";
import { EngravingOption } from "./EngravingOption";
import { AddToCart } from "@/components/cart/AddToCart";
import { useLang } from "@/lib/i18n/context";
import { brand, currency, waLink, mailLink } from "@/lib/config";
import { isEngravable, type Engraving } from "@/lib/engraving";

export function ProductDetail({
  product,
  related,
}: {
  product: CatalogueProduct;
  related: CatalogueProduct[];
}) {
  const { t, lang, num } = useLang();
  const [engraveOn, setEngraveOn] = useState(false);
  const [engraving, setEngraving] = useState<Engraving>({ text: "", style: "clean" });
  const name = lang === "ar" ? product.name_ar : product.name;
  const desc = lang === "ar" ? product.description_ar : product.description;
  const wood = lang === "ar" ? product.wood_ar : product.wood;
  const cat = categories.find((c) => c.key === product.category);
  const catLabel = cat ? (lang === "ar" ? cat.label_ar : cat.label) : product.category;

  const isSold = product.tags?.includes("sold") ?? false;
  const engravable = isEngravable(product) && !isSold;
  const activeEngraving =
    engravable && engraveOn && engraving.text.trim()
      ? { ...engraving, text: engraving.text.trim() }
      : undefined;
  const photos = [product.imageUrl, ...(product.galleryUrls ?? [])].filter(Boolean) as string[];
  const soldLabel = lang === "ar" ? "تم البيع" : "Sold";
  const soldNote =
    lang === "ar"
      ? "قطعة فريدة — هذه القطعة بيعت. يمكن طلب قطعة مشابهة."
      : "One of a kind — this piece is sold. A similar piece can be commissioned.";

  const orderMsg = isSold
    ? lang === "ar"
      ? `مرحبًا ${brand.name}، رأيت «${product.name_ar}» (بيعت). هل يمكنكم صنع قطعة مشابهة لي؟`
      : `Hi ${brand.name}, I saw the "${product.name}" (now sold). Could you make a similar piece for me?`
    : lang === "ar"
      ? `مرحبًا ${brand.name}، أنا مهتم بـ «${product.name_ar}» (${currency.symbol} ${product.price}). هل يمكننا الحديث عن الطلب؟`
      : `Hi ${brand.name}, I'm interested in the "${product.name}" (${currency.symbol} ${product.price}). Can we talk about ordering it?`;

  const specs: { label: string; value: string }[] = [
    { label: t("pd.wood"), value: wood },
    { label: t("pd.dims"), value: product.dimensions },
    { label: t("pd.category"), value: catLabel },
    { label: t("pd.lead"), value: t("pd.leadVal") },
  ];

  return (
    <div className="px-5 pb-28 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto max-w-[1500px]">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <span className="transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">←</span>
          {t("nav.shop")}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24"
          >
            <div className="relative">
              {photos.length > 0 ? (
                <ProductGallery images={photos} alt={name} />
              ) : (
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-bone-2">
                  <ProductMedia product={product} alt={name} className="h-full w-full" />
                </div>
              )}
              {isSold ? (
                <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-bone">
                  {soldLabel}
                </span>
              ) : product.featured ? (
                <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 font-mono text-[11px] tracking-widest text-bone">
                  ★ {t("shop.sort.featured")}
                </span>
              ) : null}
            </div>
          </motion.div>

          {/* info */}
          <div className="lg:py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <p className="overline text-amber">{catLabel}</p>
              <h1 className="mt-3 font-display text-5xl leading-[0.95] md:text-7xl">{name}</h1>
              <div className="mt-4 flex items-center gap-3">
                <p className={`font-mono text-2xl ${isSold ? "text-ink-soft line-through" : ""}`}>
                  {currency.symbol} {num(product.price)}
                </p>
                {isSold && (
                  <span className="rounded-full bg-ink/85 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-bone">
                    {soldLabel}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                {isSold ? soldNote : t("shop.madeToOrder")}
              </p>

              <p className="mt-7 max-w-prose leading-relaxed text-ink-soft md:text-lg">{desc}</p>

              {/* specs */}
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10">
                {specs.map((s) => (
                  <div key={s.label} className="bg-bone p-4">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
                      {s.label}
                    </dt>
                    <dd className="mt-1 text-sm">{s.value}</dd>
                  </div>
                ))}
              </dl>

              {/* engraving */}
              {engravable && (
                <EngravingOption
                  enabled={engraveOn}
                  engraving={engraving}
                  onToggle={setEngraveOn}
                  onChange={setEngraving}
                />
              )}

              {/* order */}
              <div className="mt-8 flex flex-wrap gap-3">
                {!isSold && (
                  <AddToCart
                    slug={product.slug}
                    name={product.name}
                    name_ar={product.name_ar}
                    price={product.price}
                    image={product.imageUrl}
                    engraving={activeEngraving}
                  />
                )}
                <a
                  href={waLink(orderMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    isSold
                      ? "rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-amber"
                      : "rounded-full border border-ink/25 px-7 py-3.5 text-sm transition-colors hover:border-ink"
                  }
                >
                  {isSold
                    ? lang === "ar"
                      ? "اطلب قطعة مشابهة"
                      : "Commission a similar piece"
                    : lang === "ar"
                      ? "اسأل عبر واتساب"
                      : "Ask on WhatsApp"}
                </a>
                <a
                  href={mailLink(`${brand.name} — ${product.name}`, orderMsg)}
                  className="rounded-full border border-ink/25 px-7 py-3.5 text-sm transition-colors hover:border-ink"
                >
                  {t("pd.email")}
                </a>
              </div>

              <div className="mt-6 rounded-2xl border border-amber/30 bg-amber/[0.07] p-5">
                <p className="text-sm text-ink-soft">
                  {t("pd.customNote")}{" "}
                  <Link href="/custom" className="font-medium text-clay underline-offset-4 hover:underline">
                    {t("teaser.cta")} →
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="mb-10 font-display text-3xl md:text-4xl">{t("pd.related")}</h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-7">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
