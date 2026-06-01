"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand } from "@/lib/config";
import { useLang } from "@/lib/i18n/context";
import type { DictKey } from "@/lib/i18n/dict";

const items: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/shop", key: "nav.shop" },
  { href: "/custom", key: "nav.custom" },
  { href: "/about", key: "nav.about" },
];

export function Nav() {
  const pathname = usePathname();
  const { t, lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  // Pages with a dark hero use light chrome until the user scrolls past it.
  const darkHero = pathname === "/" || pathname === "/custom";
  const onDark = darkHero && !scrolled && !open;

  const LangToggle = (
    <button
      onClick={toggle}
      data-cursor="hover"
      aria-label="Switch language"
      className={`rounded-full border px-3 py-1.5 font-mono text-xs tracking-widest transition-colors ${
        onDark
          ? "border-bone/30 text-bone hover:border-bone hover:bg-bone/10"
          : "border-ink/20 hover:border-ink hover:bg-ink/5"
      }`}
    >
      {lang === "en" ? "العربية" : "EN"}
    </button>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "bg-bone/80 backdrop-blur-md border-b border-ink/10"
            : "bg-transparent border-b border-transparent"
        } ${onDark ? "text-bone" : "text-ink"}`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" className="group flex items-baseline gap-2" aria-label="Plexus Workshop home">
            <span className="font-display text-2xl leading-none tracking-tight md:text-3xl">
              {brand.name}
            </span>
            <span className={`overline transition-colors group-hover:text-amber ${onDark ? "text-bone/60" : "text-ink-soft"}`}>
              {brand.tag}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {items.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const idle = onDark ? "text-bone/70 hover:text-bone" : "text-ink-soft hover:text-ink";
              const on = onDark ? "text-bone" : "text-ink";
              return (
                <Link key={item.href} href={item.href} className="group relative text-sm tracking-wide">
                  <span className={`transition-colors ${active ? on : idle}`}>
                    {t(item.key)}
                  </span>
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-amber transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
            {LangToggle}
            <Link
              href="/custom"
              className={`rounded-full px-5 py-2 text-sm transition-colors hover:bg-amber hover:text-[#160e07] ${
                onDark ? "bg-bone text-ink" : "bg-ink text-bone"
              }`}
            >
              {t("nav.make")}
            </Link>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            {LangToggle}
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
              data-cursor="hover"
            >
              <span
                className={`h-px w-6 transition-transform duration-300 ${onDark ? "bg-bone" : "bg-ink"} ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-6 transition-transform duration-300 ${onDark ? "bg-bone" : "bg-ink"} ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-walnut-deep px-6 text-bone md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {items.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={item.href} className="font-display text-5xl leading-tight tracking-tight">
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
