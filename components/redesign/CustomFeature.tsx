"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    n: "01",
    title: "Show us",
    line: "Upload a photo, or describe the piece in your own words.",
  },
  {
    n: "02",
    title: "See it",
    line: "Watch it become a real-time 3D model. Turn it, tweak it, make it yours.",
  },
  {
    n: "03",
    title: "Hold it",
    line: "We hand-make the approved design in solid wood, in Amman.",
  },
];

export function CustomFeature() {
  return (
    <section className="py-28 md:py-40 bg-walnut-deep text-bone">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal>
          <span className="overline text-copper">
            The Plexus Studio — first of its kind
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-[18ch] font-display font-light leading-tight tracking-[-0.02em] text-[clamp(2.4rem,1.8rem+3vw,4.5rem)]">
            Send a photo. See it in 3D. Hold it in wood.
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-7 max-w-[60ch] text-[clamp(1.05rem,0.98rem+0.4vw,1.25rem)] leading-relaxed text-bone/80">
            Our studio turns your idea — a sketch, a photo, a thing you saw in a
            dream — into a textured 3D model you can spin, refine, and approve.
            Then we hand-carve it in solid wood. No other workshop does this.
          </p>
        </Reveal>

        {/* Steps */}
        <div className="mt-20 grid gap-x-12 gap-y-14 md:mt-28 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={0.1 + i * 0.12}>
              <div className="group">
                <span className="block font-display text-[clamp(2.6rem,2rem+2vw,3.6rem)] font-light leading-none text-copper">
                  {step.n}
                </span>

                {/* copper hairline */}
                <div className="relative mt-6 h-px w-full bg-copper/40">
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 left-0 block bg-copper-bright"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 1.1, delay: 0.3 + i * 0.12, ease }}
                  />
                </div>

                <h3 className="mt-6 font-display text-2xl font-light leading-tight">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[34ch] leading-relaxed text-bone/70">
                  {step.line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.2} className="mt-20 md:mt-28">
          <Link
            href="/custom"
            className="group inline-flex items-center gap-2 rounded-full bg-copper px-8 py-4 text-sm font-medium tracking-wide text-bone transition-colors hover:bg-copper-bright"
          >
            Try the studio
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
