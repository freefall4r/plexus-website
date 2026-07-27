"use client";

import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n/context";
import { isInStock } from "@/lib/stock";
import { ENGRAVING_FEE, type Engraving } from "@/lib/engraving";

type Props = {
  slug: string;
  name: string;
  name_ar?: string;
  price: number;
  image?: string;
  variant?: "primary" | "card";
  engraving?: Engraving; // set when the buyer filled the engraving option
};

export function AddToCart({ slug, name, name_ar, price, image, variant = "primary", engraving }: Props) {
  const { add } = useCart();
  const { lang } = useLang();
  const ar = lang === "ar";
  const stock = isInStock(slug);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      slug,
      name,
      name_ar,
      price: engraving ? price + ENGRAVING_FEE : price,
      image,
      madeToOrder: !stock,
      engraving,
    });
  };

  if (variant === "card") {
    return (
      <button
        onClick={handle}
        aria-label={ar ? "أضف إلى السلة" : "Add to cart"}
        className="rounded-full border border-ink/20 bg-bone/90 px-3 py-1.5 font-mono text-xs text-ink backdrop-blur transition-colors hover:border-ink hover:bg-ink hover:text-bone"
      >
        + {ar ? "أضف" : "Add"}
      </button>
    );
  }

  return (
    <button
      onClick={handle}
      className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-amber hover:text-[#160e07]"
    >
      {stock
        ? ar
          ? "أضف إلى السلة"
          : "Add to cart"
        : ar
          ? "اطلب هذه القطعة"
          : "Order this piece"}
    </button>
  );
}
