"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import { copy, pick } from "@/lib/fabrication/copy";
import type {
  FabricationExample,
  FabricationTemplate,
} from "@/lib/fabrication/sanity";
import type { FabricationService } from "@/lib/fabrication/types";

export function FabricationLanding({
  examples,
  templates,
}: {
  examples: FabricationExample[];
  templates: FabricationTemplate[];
}) {
  const { lang } = useLang();
  const p = (b: { en: string; ar: string }) => pick(lang, b);
  const [tab, setTab] = useState<FabricationService>("cnc");

  const shown = examples.filter((e) => e.service === tab);

  return (
    <main className="bg-bone text-ink">
      {/* hero */}
      <section className="grain relative px-5 pt-32 pb-20 md:px-10 md:pt-44 md:pb-28">
        <div className="mx-auto max-w-[1100px]">
          <p className="overline text-copper">{p(copy.hero.over)}</p>
          <h1 className="mt-4 whitespace-pre-line font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            {p(copy.hero.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            {p(copy.hero.body)}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/fabrication/order"
              className="rounded-full bg-ink px-7 py-3.5 text-sm text-bone transition-colors hover:bg-copper"
            >
              {p(copy.hero.ctaCustom)}
            </Link>
            <a
              href="#ready"
              className="rounded-full border border-ink/20 px-7 py-3.5 text-sm transition-colors hover:border-ink hover:bg-ink/5"
            >
              {p(copy.hero.ctaTemplates)}
            </a>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="border-y border-ink/10 bg-sand/40 px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          <p className="overline text-copper">{p(copy.how.over)}</p>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              { t: copy.how.s1t, b: copy.how.s1b },
              { t: copy.how.s2t, b: copy.how.s2b },
              { t: copy.how.s3t, b: copy.how.s3b },
            ].map((s, i) => (
              <div key={i} className="relative">
                <span className="font-display text-5xl text-copper/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-2xl tracking-tight">{p(s.t)}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{p(s.b)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* examples gallery */}
      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="overline text-copper">{p(copy.examples.over)}</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
                {p(copy.examples.title)}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 rounded-full border border-ink/15 p-1">
              {([
                { id: "cnc", label: copy.examples.cnc },
                { id: "laser", label: copy.examples.laser },
                { id: "milling", label: copy.examples.milling },
              ] as const).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTab(s.id)}
                  className={`rounded-full px-5 py-2 text-sm transition-colors ${
                    tab === s.id ? "bg-ink text-bone" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {p(s.label)}
                </button>
              ))}
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="mt-12 text-ink-soft">{p(copy.examples.empty)}</p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((e) => (
                <motion.article
                  key={e.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="group overflow-hidden rounded-2xl border border-ink/10 bg-bone"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-stone/20">
                    {e.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.imageUrl}
                        alt={p({ en: e.title, ar: e.title_ar })}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl tracking-tight">
                      {p({ en: e.title, ar: e.title_ar })}
                    </h3>
                    {(e.material || e.material_ar) && (
                      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-copper">
                        {p({ en: e.material, ar: e.material_ar })}
                      </p>
                    )}
                    {(e.description || e.description_ar) && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        {p({ en: e.description, ar: e.description_ar })}
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="mt-12">
            <Link
              href="/fabrication/order"
              className="rounded-full bg-ink px-7 py-3.5 text-sm text-bone transition-colors hover:bg-copper"
            >
              {p(copy.hero.ctaCustom)}
            </Link>
          </div>
        </div>
      </section>

      {/* ready designs */}
      {templates.length > 0 && (
        <section id="ready" className="border-t border-ink/10 bg-sand/40 px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1300px]">
            <p className="overline text-copper">{p(copy.templates.over)}</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              {p(copy.templates.title)}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
              {p(copy.templates.body)}
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <article
                  key={t.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-bone"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-stone/20">
                    {t.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.imageUrl}
                        alt={p({ en: t.title, ar: t.title_ar })}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-xl tracking-tight">
                      {p({ en: t.title, ar: t.title_ar })}
                    </h3>
                    {(t.description || t.description_ar) && (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                        {p({ en: t.description, ar: t.description_ar })}
                      </p>
                    )}
                    <Link
                      href={`/fabrication/order?service=${t.service}&template=${t.slug}`}
                      className="mt-4 inline-block self-start rounded-full border border-ink/20 px-5 py-2.5 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-bone"
                    >
                      {p(copy.templates.order)}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
