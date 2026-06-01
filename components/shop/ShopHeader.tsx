"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n/context";

export function ShopHeader() {
  const { t } = useLang();
  return (
    <header className="relative px-5 pt-36 md:px-10 md:pt-44">
      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <p className="overline text-copper">PLEXUS · {t("nav.shop")}</p>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,2rem+4vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
            {t("shop.title")}
          </h1>
          <p className="mt-7 max-w-[52ch] text-[clamp(1.05rem,0.98rem+0.4vw,1.3rem)] leading-relaxed text-ink-soft">
            {t("shop.sub")}
          </p>
        </Reveal>
      </div>
    </header>
  );
}
