import { Reveal } from "@/components/redesign/Reveal";
import { contact, waLink, igLink, mailLink } from "@/lib/config";

const linkClass =
  "text-ink transition-colors hover:text-copper focus-visible:text-copper";

export function ContactCommission() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-bone-2">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid gap-14 md:grid-cols-2 md:gap-16">
          {/* Left — invitation + WhatsApp CTA */}
          <Reveal>
            <span className="overline text-ink-soft">Commissions</span>

            <h2 className="mt-5 max-w-[15ch] font-display text-[clamp(2.4rem,1.9rem+2.6vw,4rem)] font-light leading-[1.02] tracking-[-0.02em] text-ink">
              Bring us something to make.
            </h2>

            <p className="mt-7 max-w-[46ch] text-[clamp(1.05rem,0.98rem+0.4vw,1.25rem)] leading-relaxed text-ink-soft">
              One chair or a whole room, a tested prototype or a sculptural
              object — tell us what you&apos;re imagining. We reply personally.
            </p>

            <a
              href={waLink("Hi Plexus, I'd like to talk about a piece.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-copper px-7 py-3.5 text-sm font-medium tracking-wide text-bone transition-colors hover:bg-copper-bright"
            >
              Message us on WhatsApp
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </Reveal>

          {/* Right — contact details */}
          <Reveal delay={0.1}>
            <dl className="flex flex-col gap-8 md:pt-2">
              <div>
                <dt className="overline text-ink-soft">Phone</dt>
                <dd className="mt-2 text-lg text-ink">
                  {contact.phoneDisplay}
                </dd>
              </div>

              <div>
                <dt className="overline text-ink-soft">Email</dt>
                <dd className="mt-2 text-lg">
                  <a
                    href={mailLink(
                      "Plexus enquiry",
                      "Hi, I'd like to ask about "
                    )}
                    className={linkClass}
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="overline text-ink-soft">Instagram</dt>
                <dd className="mt-2 text-lg">
                  <a
                    href={igLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    @{contact.instagram}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="overline text-ink-soft">Workshop</dt>
                <dd className="mt-2 text-lg text-ink">{contact.addressLine}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
