"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroRedesign() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-walnut-deep text-bone">
      {/* full-bleed hand-carved texture */}
      <Image
        src="/brand/hero.jpg"
        alt="Warm afternoon light through a wooden window onto a handmade wood counter and stools"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_42%]"
      />
      {/* warm legibility wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(31,27,20,0.5) 0%, rgba(31,27,20,0.05) 30%, rgba(31,27,20,0.12) 55%, rgba(31,27,20,0.8) 100%), linear-gradient(90deg, rgba(31,27,20,0.62) 0%, rgba(31,27,20,0.12) 46%, rgba(31,27,20,0) 72%)",
        }}
      />

      {/* content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-end px-5 pb-20 pt-32 md:px-10 md:pb-28">
        <motion.span
          className="overline text-bone/70"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          Plexus Workshop — Amman, Jordan
        </motion.span>

        <motion.h1
          className="mt-5 max-w-[16ch] font-display text-[clamp(3rem,2.2rem+5vw,7rem)] font-light leading-[0.95] tracking-[-0.02em]"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.08, ease }}
        >
          Wood, made personal.
        </motion.h1>

        <motion.p
          className="mt-7 max-w-[52ch] text-[clamp(1.05rem,0.98rem+0.4vw,1.3rem)] leading-relaxed text-bone/85"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease }}
        >
          Handmade furniture and sculptural objects in solid wood — from a
          workshop that understands timber down to the grain.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease }}
        >
          <Link
            href="/custom"
            className="group inline-flex items-center gap-2 rounded-full bg-copper px-7 py-3.5 text-sm font-medium tracking-wide text-bone transition-colors hover:bg-copper-bright"
          >
            See your idea in 3D
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-bone/90"
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
              Explore the work
            </span>
          </Link>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div
          className="h-9 w-px bg-bone/40"
          animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
