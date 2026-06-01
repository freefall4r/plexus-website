"use client";

import type { CatalogueProduct } from "@/lib/catalogue";
import { ProductArt } from "./ProductArt";

/** Shows the real uploaded photo when a product has one (from Sanity),
 *  otherwise falls back to the generative art placeholder. */
export function ProductMedia({
  product,
  className,
  alt,
}: {
  product: CatalogueProduct;
  className?: string;
  alt?: string;
}) {
  if (product.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.imageUrl}
        alt={alt ?? product.name}
        loading="lazy"
        className={`h-full w-full object-cover ${className ?? ""}`}
      />
    );
  }
  const seed = parseInt(product.id.replace(/\D/g, ""), 10) || 1;
  return (
    <ProductArt
      artKey={product.artKey ?? "box"}
      wood={product.wood}
      seed={seed}
      className={`h-full w-full ${className ?? ""}`}
    />
  );
}
