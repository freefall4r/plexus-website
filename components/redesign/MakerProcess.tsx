import Image from "next/image";
import { Reveal } from "./Reveal";

const steps = [
  {
    title: "Chosen",
    body: "Timber selected for grain, moisture and character.",
  },
  {
    title: "Cut",
    body: "Joinery cut and fitted by hand on the bench in Amman.",
  },
  {
    title: "Finished",
    body: "Oiled and waxed by hand — natural, food-safe, made to be touched.",
  },
];

export function MakerProcess() {
  return (
    <section className="py-24 md:py-32 bg-bone-2">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        {/* Pull-quote, full-width above */}
        <div className="max-w-[24ch] md:max-w-[30ch]">
          <Reveal>
            <span className="overline text-copper">The craft</span>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 font-display t-3 font-light tracking-[-0.015em] text-ink">
              Raw timber becomes furniture meant to outlive us.
            </p>
          </Reveal>
        </div>

        {/* Image beside the process steps */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:items-center md:gap-16 lg:gap-24">
          <Reveal delay={0.15} className="md:order-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
              <Image
                src="/brand/relief.jpg"
                alt="Detail of a hand-carved walnut relief panel"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="font-display text-[clamp(1.5rem,1.3rem+0.9vw,2rem)] font-light leading-tight text-ink">
                Mortise and tenon. No shortcuts.
              </h2>
            </Reveal>

            <ol className="mt-12 space-y-10">
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={0.12 + i * 0.12}>
                  <li className="flex items-baseline gap-6 border-t border-ink/10 pt-7">
                    <span className="font-mono text-sm text-ink-soft">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-normal text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-[40ch] leading-relaxed text-ink-soft">
                        {step.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
