"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import type { Testimonial } from "@/lib/testimonials";

/** Client testimonials. Renders nothing until real ones are added in /studio,
 *  so the site never shows an empty or fabricated reviews block. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const { lang } = useLang();
  if (!items?.length) return null;
  const ar = lang === "ar";

  return (
    <section className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1500px]">
        <p className="overline text-amber">{ar ? "آراء العملاء" : "Kind words"}</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.02] md:text-6xl">
          {ar ? "ماذا يقول عملاؤنا" : "What people say"}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {items.map((t, i) => {
            const quote = ar ? t.quote_ar || t.quote : t.quote;
            const name = ar ? t.name_ar || t.name : t.name;
            const role = ar ? t.role_ar || t.role : t.role;
            return (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col rounded-2xl border border-ink/10 bg-bone-2/40 p-7 md:p-8"
              >
                <span className="font-display text-4xl leading-none text-amber" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 leading-relaxed text-ink md:text-lg">
                  {quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-ink/10 pt-4">
                  <span className="font-display text-lg leading-tight">{name}</span>
                  {role && <span className="mt-0.5 block text-sm text-ink-soft">{role}</span>}
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
