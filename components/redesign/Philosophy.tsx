import Image from "next/image";
import { Reveal } from "@/components/redesign/Reveal";

export function Philosophy() {
  return (
    <section className="py-24 md:py-32 bg-bone">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16 lg:gap-24">
          {/* Image — tall, large, offset to one side */}
          <Reveal className="md:col-span-5 lg:col-span-5" y={20}>
            <figure className="md:mr-auto md:max-w-[440px]">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src="/brand/arbutus.jpg"
                  alt="Arbutus tree with peeling copper-coloured bark"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 t-sm text-ink-soft">
                Arbutus — copper bark, the colour we build around.
              </figcaption>
            </figure>
          </Reveal>

          {/* Text — air, asymmetry, pushed right */}
          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <Reveal>
              <span className="overline text-copper">Our nature</span>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-6 max-w-[18ch] font-display t-3 font-light text-ink">
                Live a slow, natural life. We make the things that hold it.
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-8 max-w-[46ch] text-ink-soft leading-relaxed">
                Plexus grows from a simple belief: the objects around you should
                be honest, tactile, and alive. Solid wood, stone, copper,
                limewash — materials that age into something better.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-6 max-w-[46ch] text-ink-soft leading-relaxed">
                Every piece is shaped by hand in Amman, chosen for its grain, and
                built to outlive trends — and us.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
