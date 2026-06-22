"use client";

import Link from "next/link";
import { brand, contact, waLink, mailLink, igLink } from "@/lib/config";
import { useLang } from "@/lib/i18n/context";
import type { DictKey } from "@/lib/i18n/dict";

const links: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/shop", key: "nav.shop" },
  { href: "/custom", key: "nav.custom" },
  { href: "/live", key: "nav.live" },
  { href: "/about", key: "nav.about" },
];

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative z-10 overflow-hidden bg-walnut-deep text-bone">
      <div className="mx-auto max-w-[1500px] px-5 pb-10 pt-20 md:px-10 md:pt-28">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="overline text-amber">{t("footer.over")}</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.02] md:text-6xl">
              {t("footer.cta")}
              <span className="text-amber"> {t("footer.cta2")}</span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink(`Hi ${brand.name}, I'd like to talk about a piece.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-amber px-6 py-3 text-sm font-medium text-walnut-deep transition-transform hover:-translate-y-0.5"
              >
                {t("cta.whatsapp")}
              </a>
              <a
                href={mailLink(`${brand.name} enquiry`, "Hi, I'd like to ask about ")}
                className="rounded-full border border-bone/30 px-6 py-3 text-sm transition-colors hover:border-bone"
              >
                {contact.email}
              </a>
            </div>
          </div>

          <div>
            <p className="overline text-bone/50">{t("footer.explore")}</p>
            <ul className="mt-5 space-y-3">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-bone/80 transition-colors hover:text-amber"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="overline text-bone/50">{t("footer.find")}</p>
            <ul className="mt-5 space-y-3 text-bone/80">
              <li>{contact.addressLine}</li>
              <li>
                <a href={`tel:${contact.phoneTel}`} className="transition-colors hover:text-amber">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={igLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-amber"
                >
                  Instagram @{contact.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 select-none">
          <p className="font-display text-[18vw] leading-[0.8] tracking-tighter text-bone/[0.06] md:text-[15vw]">
            {brand.name}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-bone/10 pt-6 text-xs text-bone/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.full}. {t("footer.rights")}
          </p>
          <p className="font-mono">{t("hero.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
