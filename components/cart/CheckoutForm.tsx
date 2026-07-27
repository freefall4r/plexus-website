"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, lineId } from "@/lib/cart";
import { useLang } from "@/lib/i18n/context";
import { brand, contact, currency, waLink } from "@/lib/config";
import { engravingStyleLabel } from "@/lib/engraving";

export function CheckoutForm() {
  const { items, total, clear } = useCart();
  const { lang, num } = useLang();
  const ar = lang === "ar";
  const [f, setF] = useState({ name: "", phone: "", city: "", address: "", notes: "" });
  const [sent, setSent] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const valid = f.name.trim() && f.phone.trim() && f.address.trim();

  const placeOrder = () => {
    const lines = items
      .map((i) => {
        let line = `• ${i.qty}× ${i.name}${i.madeToOrder ? " (made to order)" : ""} — ${currency.symbol} ${i.price * i.qty}`;
        if (i.engraving)
          line += `\n   ✒️ Engraving (${engravingStyleLabel(i.engraving.style, false)}): "${i.engraving.text}"`;
        return line;
      })
      .join("\n");
    const msg =
      `🛒 *New order — ${brand.full}*\n\n` +
      `${lines}\n\n` +
      `*Total: ${currency.symbol} ${total}* (Cash on Delivery)\n\n` +
      `*Name:* ${f.name}\n*Phone:* ${f.phone}\n*City:* ${f.city}\n*Address:* ${f.address}` +
      (f.notes ? `\n*Notes:* ${f.notes}` : "");
    window.open(waLink(msg), "_blank");
    clear();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-[600px] py-16 text-center">
        <p className="font-display text-5xl text-amber">✓</p>
        <h1 className="mt-5 font-display text-3xl md:text-4xl">
          {ar ? "تم إرسال طلبك" : "Your order is on its way"}
        </h1>
        <p className="mt-4 text-ink-soft">
          {ar
            ? "فتحنا واتساب بتفاصيل طلبك — أرسل الرسالة لنا وسنؤكّدها ونرتّب التوصيل والدفع عند الاستلام."
            : "We've opened WhatsApp with your order — just send us the message and we'll confirm it and arrange delivery (cash on delivery)."}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {ar ? "لم يُفتح واتساب؟" : "WhatsApp didn't open?"}{" "}
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-clay underline">
            {ar ? "راسلنا هنا" : "Message us here"}
          </a>
        </p>
        <Link href="/shop" className="mt-8 inline-block rounded-full border border-ink/25 px-6 py-3 text-sm hover:border-ink">
          {ar ? "متابعة التسوّق" : "Keep shopping"}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[600px] py-16 text-center">
        <h1 className="font-display text-3xl">{ar ? "سلّتك فارغة" : "Your cart is empty"}</h1>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm text-bone hover:bg-amber hover:text-[#160e07]">
          {ar ? "تصفّح المتجر" : "Browse the shop"}
        </Link>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-ink/15 bg-bone px-4 py-3 text-ink outline-none transition-colors focus:border-amber";

  return (
    <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2 md:gap-16">
      {/* form */}
      <div>
        <h1 className="font-display text-4xl md:text-5xl">{ar ? "إتمام الطلب" : "Checkout"}</h1>
        <p className="mt-3 text-ink-soft">
          {ar
            ? "الدفع نقدًا عند الاستلام. نؤكّد طلبك عبر واتساب."
            : "Cash on delivery. We confirm your order over WhatsApp."}
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <input className={field} placeholder={ar ? "الاسم *" : "Full name *"} value={f.name} onChange={set("name")} />
          <input className={field} placeholder={ar ? "رقم الهاتف *" : "Phone number *"} value={f.phone} onChange={set("phone")} inputMode="tel" />
          <input className={field} placeholder={ar ? "المدينة" : "City"} value={f.city} onChange={set("city")} />
          <textarea className={field} rows={3} placeholder={ar ? "العنوان بالتفصيل *" : "Delivery address *"} value={f.address} onChange={set("address")} />
          <textarea className={field} rows={2} placeholder={ar ? "ملاحظات (اختياري)" : "Notes (optional)"} value={f.notes} onChange={set("notes")} />
        </div>
        <button
          onClick={placeOrder}
          disabled={!valid}
          className="mt-7 w-full rounded-full bg-copper px-7 py-4 text-sm font-medium text-bone transition-colors hover:bg-copper-bright disabled:cursor-not-allowed disabled:opacity-40"
        >
          {ar ? "تأكيد الطلب — الدفع عند الاستلام" : "Place order — Cash on Delivery"}
        </button>
        <p className="mt-3 text-center text-xs text-ink-soft">
          {ar ? "بالضغط ستُفتح محادثة واتساب بطلبك." : "This opens a WhatsApp chat with your order."}
        </p>
      </div>

      {/* summary */}
      <div className="md:pt-2">
        <div className="rounded-2xl border border-ink/10 bg-bone-2/40 p-6">
          <h2 className="font-display text-xl">{ar ? "ملخّص الطلب" : "Order summary"}</h2>
          <div className="mt-4 divide-y divide-ink/10">
            {items.map((i) => (
              <div key={lineId(i)} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="font-display">{ar ? i.name_ar || i.name : i.name}</p>
                  <p className="text-sm text-ink-soft">
                    {ar ? "الكمية" : "Qty"}: {i.qty}
                    {i.madeToOrder && (ar ? " · حسب الطلب" : " · made to order")}
                  </p>
                  {i.engraving && (
                    <p className="text-sm text-copper" dir="auto">
                      ✒️ {ar ? "نقش" : "Engraving"}: “{i.engraving.text}” ·{" "}
                      {engravingStyleLabel(i.engraving.style, ar)}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-mono text-sm">{currency.symbol} {num(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 text-lg">
            <span>{ar ? "المجموع" : "Total"}</span>
            <span className="font-mono">{currency.symbol} {num(total)}</span>
          </div>
          <p className="mt-3 text-xs text-ink-soft">{ar ? "الدفع عند الاستلام" : "Paid in cash on delivery"}</p>
        </div>
      </div>
    </div>
  );
}
