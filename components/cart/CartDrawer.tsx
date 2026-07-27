"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, lineId } from "@/lib/cart";
import { useLang } from "@/lib/i18n/context";
import { currency } from "@/lib/config";
import { engravingStyleLabel } from "@/lib/engraving";

export function CartDrawer() {
  const { items, total, count, setQty, remove, isOpen, close } = useCart();
  const { lang, num } = useLang();
  const ar = lang === "ar";
  const anyMTO = items.some((i) => i.madeToOrder);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-walnut-deep/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed inset-y-0 z-[71] flex w-full max-w-[420px] flex-col bg-bone shadow-2xl ltr:right-0 rtl:left-0"
            initial={{ x: ar ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: ar ? "-100%" : "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h2 className="font-display text-xl">
                {ar ? "سلّتك" : "Your cart"}{" "}
                <span className="text-ink-soft">({count})</span>
              </h2>
              <button onClick={close} aria-label="Close" className="text-2xl text-ink-soft hover:text-ink">
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-ink-soft">{ar ? "سلّتك فارغة." : "Your cart is empty."}</p>
                <Link
                  href="/shop"
                  onClick={close}
                  className="rounded-full border border-ink/25 px-5 py-2 text-sm hover:border-ink"
                >
                  {ar ? "تصفّح المتجر" : "Browse the shop"}
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {items.map((it) => (
                    <div key={lineId(it)} className="flex gap-3 border-b border-ink/10 py-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-bone-2">
                        {it.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={it.image} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-base leading-tight">
                          {ar ? it.name_ar || it.name : it.name}
                        </p>
                        {it.madeToOrder && (
                          <p className="mt-0.5 text-[11px] text-amber">
                            {ar ? "حسب الطلب · 2–4 أسابيع" : "Made to order · 2–4 wks"}
                          </p>
                        )}
                        {it.engraving && (
                          <p className="mt-0.5 truncate text-[11px] text-copper" dir="auto">
                            ✒️ {ar ? "نقش" : "Engraving"}: “{it.engraving.text}” ·{" "}
                            {engravingStyleLabel(it.engraving.style, ar)}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center rounded-full border border-ink/20">
                            <button
                              onClick={() => setQty(lineId(it), it.qty - 1)}
                              className="px-2.5 py-0.5 text-ink-soft hover:text-ink"
                              aria-label="−"
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] text-center font-mono text-sm">{it.qty}</span>
                            <button
                              onClick={() => setQty(lineId(it), it.qty + 1)}
                              className="px-2.5 py-0.5 text-ink-soft hover:text-ink"
                              aria-label="+"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => remove(lineId(it))}
                            className="text-xs text-ink-soft underline-offset-2 hover:text-clay hover:underline"
                          >
                            {ar ? "إزالة" : "Remove"}
                          </button>
                        </div>
                      </div>
                      <div className="shrink-0 text-right rtl:text-left font-mono text-sm">
                        {currency.symbol} {num(it.price * it.qty)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-ink/10 px-5 py-4">
                  {anyMTO && (
                    <p className="mb-3 text-xs text-ink-soft">
                      {ar
                        ? "تحتوي سلّتك على قطع تُصنع حسب الطلب — نؤكّد المدة والدفعة المقدّمة على واتساب."
                        : "Your cart has made-to-order pieces — we'll confirm timing & deposit on WhatsApp."}
                    </p>
                  )}
                  <div className="mb-4 flex items-center justify-between text-lg">
                    <span>{ar ? "المجموع" : "Subtotal"}</span>
                    <span className="font-mono">
                      {currency.symbol} {num(total)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="block rounded-full bg-copper px-6 py-3.5 text-center text-sm font-medium text-bone transition-colors hover:bg-copper-bright"
                  >
                    {ar ? "إتمام الطلب — الدفع عند الاستلام" : "Checkout — Cash on Delivery"}
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
