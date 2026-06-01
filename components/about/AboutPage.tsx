"use client";

import Image from "next/image";
import { Reveal } from "@/components/redesign/Reveal";
import { contact, waLink, mailLink, igLink } from "@/lib/config";

const channels = [
  {
    label: "WhatsApp",
    value: contact.phoneDisplay,
    href: waLink("Hi Plexus, I'd like to talk about a piece."),
    external: true,
  },
  {
    label: "Email",
    value: contact.email,
    href: mailLink("Plexus enquiry", "Hi, "),
    external: false,
  },
  {
    label: "Instagram",
    value: `@${contact.instagram}`,
    href: igLink(),
    external: true,
  },
  {
    label: "Workshop",
    value: contact.addressLine,
    href: undefined,
    external: false,
  },
] as const;

export function AboutPage() {
  return (
    <div className="px-5 pb-28 pt-36 md:px-10 md:pt-44">
      <div className="mx-auto max-w-[1300px]">
        {/* 1 — Intro */}
        <section>
          <Reveal>
            <span className="overline text-ink-soft">The Workshop</span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(3rem,2.2rem+5vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
              Made by hand, understood by science.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-9 max-w-[58ch] text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] leading-relaxed text-ink-soft">
              Plexus is a wood workshop in Amman, Jordan — where furniture and
              sculptural objects are shaped by hand from solid timber, stone,
              copper and limewash. We make things meant to age well and outlive
              us.
            </p>
          </Reveal>
        </section>

        {/* Full-bleed-ish intro image */}
        <Reveal delay={0.1}>
          <div className="relative mt-16 aspect-[16/9] w-full overflow-hidden bg-sand md:mt-24">
            <Image
              src="/brand/hero-carved.jpg"
              alt="Detail of a hand-carved, dimpled wood panel catching raking light"
              fill
              sizes="(min-width: 1300px) 1300px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        {/* 2 — The maker (sage track, asymmetric) */}
        <section className="mt-28 md:mt-40">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-6 lg:col-span-5">
              <Reveal>
                <span className="overline text-sage">The maker</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-5 max-w-[12ch] font-display text-[clamp(2rem,1.5rem+2.6vw,3.4rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
                  Trained at Sopron.
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-7 max-w-[52ch] text-[clamp(1.02rem,0.96rem+0.3vw,1.18rem)] leading-relaxed text-ink-soft">
                  Plexus is led by a timber-industry engineer trained at the
                  University of Sopron, Hungary — one of the world&apos;s oldest
                  schools of forestry and wood science. That training sits
                  behind everything we make: we choose, test and understand
                  timber before a single cut.
                </p>
              </Reveal>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={0.1}>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
                  <Image
                    src="/brand/topography.jpg"
                    alt="Wood panel carved with topographic contour lines, like a map of the grain"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3 — What we do (two tracks) */}
        <section className="mt-28 md:mt-40">
          <Reveal>
            <span className="overline text-ink-soft">What we do</span>
          </Reveal>

          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
            {/* (a) Furniture & objects */}
            <Reveal delay={0.06}>
              <div className="border-t border-ink/15 pt-8">
                <h3 className="font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.4rem)] font-light leading-tight text-ink">
                  Furniture &amp; objects
                </h3>
                <p className="mt-6 max-w-[44ch] text-[clamp(1.02rem,0.96rem+0.3vw,1.15rem)] leading-relaxed text-ink-soft">
                  Bespoke furniture and sculptural pieces in solid wood — and a
                  first-of-its-kind studio that turns your photo into a 3D
                  model, then into a real, hand-carved piece.
                </p>
                <div className="relative mt-9 aspect-[5/4] w-full overflow-hidden bg-sand">
                  <Image
                    src="/brand/side-table.jpg"
                    alt="A solid-wood side table made by hand in the workshop"
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>

            {/* (b) Wood research & engineering (sage) */}
            <Reveal delay={0.14}>
              <div className="border-t border-sage/40 pt-8">
                <h3 className="font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.4rem)] font-light leading-tight text-sage">
                  Wood research &amp; engineering
                </h3>
                <p className="mt-6 max-w-[44ch] text-[clamp(1.02rem,0.96rem+0.3vw,1.15rem)] leading-relaxed text-ink-soft">
                  Wood testing, sample testing &amp; grading, prototype
                  creation, and material research — the technical side of
                  timber, for makers and projects that need it.
                </p>
                <div className="relative mt-9 aspect-[5/4] w-full overflow-hidden bg-sand">
                  <Image
                    src="/brand/arbutus.jpg"
                    alt="A copper-barked arbutus tree, the raw material behind the research"
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4 — Marks line */}
        <section className="mt-28 md:mt-40">
          <Reveal>
            <p className="overline text-ink-soft/70">
              Trained at Sopron · Made in Amman · Solid wood, by hand
            </p>
          </Reveal>
        </section>

        {/* 5 — Contact */}
        <section className="mt-20 md:mt-28">
          <div className="grid items-end gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-6">
              <Reveal>
                <span className="overline text-copper">Say hello</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2rem,1.5rem+2.6vw,3.4rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
                  Bring us something to make.
                </h2>
              </Reveal>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <dl className="border-t border-ink/15">
                {channels.map((c, i) => {
                  const row = (
                    <>
                      <dt className="overline text-ink-soft">{c.label}</dt>
                      <dd className="mt-2 text-[clamp(1.05rem,0.98rem+0.3vw,1.25rem)] text-ink transition-colors group-hover:text-copper">
                        {c.value}
                      </dd>
                    </>
                  );

                  return (
                    <Reveal key={c.label} delay={0.06 + i * 0.06}>
                      {c.href ? (
                        <a
                          href={c.href}
                          {...(c.external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                          className="group block border-b border-ink/15 py-6 transition-colors hover:border-copper"
                        >
                          {row}
                        </a>
                      ) : (
                        <div className="block border-b border-ink/15 py-6">
                          {row}
                        </div>
                      )}
                    </Reveal>
                  );
                })}
              </dl>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
