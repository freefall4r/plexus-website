import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

const services = [
  {
    term: "Wood testing",
    desc: "moisture, density, strength and durability.",
  },
  {
    term: "Sample testing & grading",
    desc: "species identification and quality classification.",
  },
  {
    term: "Prototype creation",
    desc: "turning concepts into tested, buildable pieces.",
  },
  {
    term: "Material research",
    desc: "choosing and engineering the right timber for the job.",
  },
] as const;

export function Research() {
  return (
    <section className="py-24 md:py-32 bg-bone">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          {/* Text column */}
          <div className="md:col-span-6 lg:col-span-5">
            <Reveal>
              <span className="overline text-sage">
                Wood research &amp; engineering
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2rem,1.5rem+2.6vw,3.4rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
                We understand timber before we shape it.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-[52ch] text-[clamp(1.02rem,0.96rem+0.3vw,1.18rem)] leading-relaxed text-ink-soft">
                Plexus is led by a timber-industry engineer trained at the
                University of Sopron, Hungary — one of the world&apos;s oldest
                schools of forestry and wood science. Alongside the furniture,
                we offer the technical side of wood:
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-9 space-y-5">
                {services.map((s) => (
                  <div key={s.term} className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-2 w-2 shrink-0 bg-sage"
                    />
                    <div className="text-[clamp(1rem,0.96rem+0.2vw,1.1rem)] leading-relaxed">
                      <dt className="inline font-semibold text-ink">
                        {s.term}
                      </dt>
                      <dd className="inline text-ink-soft">
                        {" "}
                        — {s.desc}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-10 max-w-[40ch] font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.6rem)] font-light leading-snug text-sage">
                Trained at Sopron. Built for the long life of wood.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <Link
                href="/custom"
                className="group mt-8 inline-flex items-center gap-2 text-sm tracking-wide text-ink transition-colors hover:text-sage"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                  Discuss a project
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          {/* Image column */}
          <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
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
      </div>
    </section>
  );
}
