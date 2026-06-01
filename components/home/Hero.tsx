"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/context";

export function Hero() {
  const { t, lang } = useLang();

  const line1 = lang === "ar" ? "نبني بالأرض" : "We build with earth,";
  const line2 = lang === "ar" ? "والخشب، والنيّة." : "wood & intention.";

  return (
    <section className="relative flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        {/* golden-ratio split: content ≈ 1 : φ negative space on wide screens */}
        <div className="max-w-[62%] py-32 md:max-w-[58%] md:py-40">
          <p
            className="px-reveal overline text-clay"
            style={{ animationDelay: "0.1s" }}
          >
            {lang === "ar"
              ? "نجارة وبناء طبيعي — عمّان"
              : "Natural building & woodwork — Amman"}
          </p>

          <h1
            className="px-reveal mt-7 font-display text-ink t-4"
            style={{ animationDelay: "0.22s" }}
          >
            <span className="block">{line1}</span>
            <span className="block italic text-walnut">{line2}</span>
          </h1>

          <p
            className="px-reveal mt-9 max-w-md text-ink-soft t-1"
            style={{ animationDelay: "0.4s" }}
          >
            {lang === "ar"
              ? "مواد عضوية — طين، قش، حجر، رخام، وخشب — مصاغة بنِسب الذهب."
              : "Organic materials — mud, straw, stone, marble & wood — shaped on the golden ratio."}
          </p>

          <div
            className="px-reveal mt-12 flex flex-wrap items-center gap-x-10 gap-y-4"
            style={{ animationDelay: "0.6s" }}
          >
            <Link
              href="/custom"
              className="group inline-flex items-center gap-3 text-ink transition-colors hover:text-clay"
            >
              <span className="t-sm uppercase tracking-[0.18em]">{t("cta.render")}</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/shop"
              className="t-sm uppercase tracking-[0.18em] text-ink-soft underline-offset-8 transition-colors hover:text-ink hover:underline"
            >
              {t("cta.browse")}
            </Link>
          </div>
        </div>
      </div>

      {/* quiet baseline coordinates — editorial, low-key */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto flex max-w-[1400px] items-center justify-between px-6 text-ink-soft/60 md:px-12">
        <span className="font-mono text-[11px] tracking-[0.25em]">31.95°N / 35.93°E</span>
        <span className="font-mono text-[11px] tracking-[0.25em]">φ · 1.618</span>
      </div>
    </section>
  );
}
