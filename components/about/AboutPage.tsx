"use client";

import { motion } from "framer-motion";
import { Reveal, RevealText } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n/context";
import { products, woods } from "@/lib/products";
import { contact, waLink, mailLink, igLink } from "@/lib/config";

export function AboutPage() {
  const { t, num } = useLang();

  const stats = [
    { value: num(products.length), label: t("about.stat1") },
    { value: num(woods.length), label: t("about.stat2") },
    { value: "100%", label: t("about.stat3") },
  ];

  const channels = [
    { label: "WhatsApp", value: contact.phoneDisplay, href: waLink("Hi PLEXUS!") },
    { label: "Email", value: contact.email, href: mailLink("PLEXUS enquiry", "Hi, ") },
    { label: "Instagram", value: `@${contact.instagram}`, href: igLink() },
    { label: "Phone", value: contact.phoneDisplay, href: `tel:${contact.phoneTel}` },
  ];

  return (
    <div className="px-5 pb-28 pt-36 md:px-10 md:pt-44">
      <div className="mx-auto max-w-[1200px]">
        <p className="overline text-amber">{t("about.over")}</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] md:text-8xl">
          <RevealText text={t("about.title")} />
        </h1>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="leading-relaxed text-ink-soft md:text-lg">{t("about.body1")}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="leading-relaxed text-ink-soft md:text-lg">{t("about.body2")}</p>
          </Reveal>
        </div>

        {/* stats */}
        <div className="mt-20 grid grid-cols-3 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="bg-bone p-6 text-center md:p-10"
            >
              <p className="font-display text-5xl text-amber md:text-7xl">{s.value}</p>
              <p className="mt-2 text-xs text-ink-soft md:text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* contact */}
        <div className="mt-24">
          <h2 className="font-display text-3xl md:text-5xl">{t("about.values")}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-cursor="hover"
                className="group rounded-2xl border border-ink/10 bg-bone-2/50 p-6 transition-colors hover:border-amber hover:bg-amber/5"
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
                  {c.label}
                </p>
                <p className="mt-2 text-lg transition-colors group-hover:text-clay">{c.value}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
