"use client";

import { useMemo, useState } from "react";
import {
  categories,
  collections,
  type WoodCategory,
  type Collection,
} from "@/lib/products";
import type { CatalogueProduct } from "@/lib/catalogue";
import { ProductCard } from "./ProductCard";
import { useLang } from "@/lib/i18n/context";

type Sort = "featured" | "priceAsc" | "priceDesc";

export function ShopClient({ items }: { items: CatalogueProduct[] }) {
  const { t, lang } = useLang();
  const [collection, setCollection] = useState<Collection | "all">("all");
  const [category, setCategory] = useState<WoodCategory | "all">("all");
  const [wood, setWood] = useState<string | "all">("all");
  const [sort, setSort] = useState<Sort>("featured");

  // woods actually present in the catalogue (for the filter dropdown)
  const woods = useMemo(
    () => Array.from(new Set(items.map((p) => p.wood).filter(Boolean))),
    [items]
  );

  const filtered = useMemo(() => {
    let list = items.filter((p) => {
      if (collection !== "all" && p.collection !== collection) return false;
      if (category !== "all" && p.category !== category) return false;
      if (wood !== "all" && p.wood !== wood) return false;
      return true;
    });
    list = [...list];
    if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [items, collection, category, wood, sort]);

  const clear = () => {
    setCollection("all");
    setCategory("all");
    setWood("all");
    setSort("featured");
  };

  return (
    <div>
      {/* filter bar */}
      <div className="sticky top-[60px] z-30 -mx-5 mb-10 border-y border-ink/10 bg-bone/85 px-5 py-3 backdrop-blur-md md:top-[68px] md:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-6 gap-y-3">
          {/* collection pills */}
          <div className="flex flex-wrap items-center gap-2">
            <Pill active={collection === "all"} onClick={() => setCollection("all")}>
              {t("shop.all")}
            </Pill>
            {collections.map((c) => (
              <Pill
                key={c.key}
                active={collection === c.key}
                onClick={() => setCollection(c.key)}
              >
                {lang === "ar" ? c.label_ar : c.label}
              </Pill>
            ))}
          </div>

          <div className="ms-auto flex flex-wrap items-center gap-3">
            <Select
              label={t("shop.filterCat")}
              value={category}
              onChange={(v) => setCategory(v as WoodCategory | "all")}
              options={[
                { value: "all", label: t("shop.all") },
                ...categories.map((c) => ({
                  value: c.key,
                  label: lang === "ar" ? c.label_ar : c.label,
                })),
              ]}
            />
            <Select
              label={t("shop.filterWood")}
              value={wood}
              onChange={setWood}
              options={[
                { value: "all", label: t("shop.all") },
                ...woods.map((w) => ({ value: w, label: w })),
              ]}
            />
            <Select
              label={t("shop.sort")}
              value={sort}
              onChange={(v) => setSort(v as Sort)}
              options={[
                { value: "featured", label: t("shop.sort.featured") },
                { value: "priceAsc", label: t("shop.sort.priceAsc") },
                { value: "priceDesc", label: t("shop.sort.priceDesc") },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px]">
        <p className="mb-6 font-mono text-xs text-ink-soft">
          {filtered.length} {t("shop.results")}
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-ink-soft">{t("shop.none")}</p>
            <button
              onClick={clear}
              data-cursor="hover"
              className="rounded-full border border-ink/25 px-5 py-2 text-sm hover:border-ink"
            >
              {t("shop.clear")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-7 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      data-cursor="hover"
      className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
        active ? "bg-ink text-bone" : "border border-ink/15 text-ink-soft hover:border-ink/40"
      }`}
    >
      {children}
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden font-mono text-[11px] uppercase tracking-widest text-ink-soft sm:inline">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-ink/20 bg-bone px-3 py-1.5 text-sm text-ink outline-none transition-colors hover:border-ink/40 focus:border-amber"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
