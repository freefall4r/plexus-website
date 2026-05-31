"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n/context";

export function ShopHeader() {
  const { t } = useLang();
  return (
    <header className="relative px-5 pt-36 md:px-10 md:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] bg-[radial-gradient(70%_70%_at_30%_0%,#efe6d6,transparent)]" />
      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <p className="overline text-amber">PLEXUS · {t("nav.shop")}</p>
          <h1 className="mt-4 font-display text-6xl leading-[0.9] md:text-8xl">{t("shop.title")}</h1>
          <p className="mt-5 max-w-xl text-ink-soft md:text-lg">{t("shop.sub")}</p>
        </Reveal>
      </div>
    </header>
  );
}
