"use client";

import Image from "next/image";
import { Reveal } from "@/components/redesign/Reveal";
import { contact, waLink, mailLink, igLink } from "@/lib/config";
import { useLang } from "@/lib/i18n/context";
import { sectionCopy } from "@/lib/i18n/sections";

export function AboutPage() {
  const { lang } = useLang();
  const c = sectionCopy.about[lang];

  const channels = [
    {
      label: "WhatsApp",
      value: contact.phoneDisplay,
      href: waLink(c.whatsappMsg),
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

  const ar = lang === "ar";
  const ic = "h-6 w-6";

  const caps = [
    {
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={ic}><path d="M3 21l4-1 11-11-3-3L4 17z" /><path d="M14 6l3 3" /></svg>),
      t: ["Hand joinery", "نجارة يدوية"],
      d: ["Mortise-and-tenon, carving and hand-finishing — the human hand at the centre of everything.", "نقر ولسان ونحت وتشطيب يدوي — اليد في قلب كل شيء."],
    },
    {
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={ic}><path d="M12 2v8" /><path d="M9 10h6l-3 5z" /><path d="M5 20h14" /></svg>),
      t: ["Laser cutting & engraving", "قصّ وحفر بالليزر"],
      d: ["Precise cuts and engraving — logos, Arabic calligraphy and intricate patterns in wood, leather and acrylic.", "قصّ وحفر دقيق — شعارات وخطّ عربي وزخارف معقّدة في الخشب والجلد والأكريليك."],
    },
    {
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={ic}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>),
      t: ["CNC machining", "تصنيع CNC"],
      d: ["Complex 3D forms and repeatable precision — relief panels, mashrabiya and production runs.", "أشكال ثلاثية الأبعاد معقّدة ودقّة قابلة للتكرار — ألواح نافرة ومشربية وإنتاج بكميات."],
    },
    {
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={ic}><path d="M4 8h16M4 12h16M4 16h16" /><path d="M7 8V6h10v2" /></svg>),
      t: ["3D printing", "طباعة ثلاثية الأبعاد"],
      d: ["Rapid prototypes, custom fittings and jigs — we test an idea before committing it to wood.", "نماذج أولية سريعة وتجهيزات وقوالب مخصّصة — نختبر الفكرة قبل تنفيذها بالخشب."],
    },
    {
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={ic}><path d="M5 7c3-3 11-3 14 0 2 2 1 6-2 7-2 1-2 4-5 4s-3-3-5-4c-3-1-4-5-2-7z" /></svg>),
      t: ["Leather station", "محطة الجلد"],
      d: ["Straps, upholstery and leather-and-wood goods, cut and stitched in-house.", "أحزمة وتنجيد وقطع من الجلد والخشب، تُقصّ وتُخاط داخليًا."],
    },
    {
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={ic}><path d="M3 21l9-9 6-6" /><circle cx="19" cy="5" r="1.5" /><path d="M16 8c-2 1-3 3-2 5" /></svg>),
      t: ["Sewing & upholstery", "خياطة وتنجيد"],
      d: ["Cushions, soft furnishings and finishing — the soft side of a hard-material shop.", "وسائد ومفروشات وتشطيبات — الجانب الناعم في ورشة المواد الصلبة."],
    },
    {
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={ic}><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="1.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" /></svg>),
      t: ["Milling", "نشر وتجهيز الخشب"],
      d: ["Dimensioning raw timber from the log and preparing custom profiles to spec.", "تقطيع الخشب الخام من الجذع وتحضير مقاطع مخصّصة حسب المواصفات."],
    },
    {
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={ic}><path d="M14 4l6 6-3 3-6-6z" /><path d="M11 7L4 14l-1 5 5-1 7-7" /></svg>),
      t: ["Metal forming", "تشكيل المعادن"],
      d: ["Brass, copper and steel — legs, frames, hardware and inlays, formed and finished here.", "نحاس وبرونز وفولاذ — أرجل وإطارات وملحقات وتطعيمات، تُشكَّل وتُنهى هنا."],
    },
    {
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={ic}><path d="M6 4h12l3 5-9 11L3 9z" /><path d="M3 9h18M9 4l3 16M15 4l-3 16" /></svg>),
      t: ["Granite & stone", "الجرانيت والحجر"],
      d: ["Stone tops, bases and inlays — wood-and-stone fusion most workshops can't touch.", "أسطح وقواعد وتطعيمات حجرية — دمج الخشب والحجر الذي يعجز عنه أكثر الورش."],
    },
  ];

  const services = [
    { t: ["Custom furniture & objects", "أثاث وقطع مخصّصة"], d: ["Designed and built to your space, in solid wood and mixed materials.", "تُصمَّم وتُبنى لمساحتك، من الخشب الصلب والمواد المختلطة."] },
    { t: ["Bespoke shelving & libraries", "رفوف ومكتبات حسب الطلب"], d: ["Floating shelves, freestanding bookcases and built-in libraries, made to measure.", "رفوف معلّقة ومكتبات قائمة ومكتبات مدمجة، تُصنع على المقاس."] },
    { t: ["Prototyping & product development", "النماذج وتطوير المنتجات"], d: ["From idea to 3D render to a working prototype — we develop products, not just pieces.", "من الفكرة إلى نموذج ثلاثي الأبعاد إلى نموذج عملي — نطوّر منتجات، لا قطعًا فقط."] },
    { t: ["Brand & white-label production", "إنتاج للعلامات والعلامة البيضاء"], d: ["Logo-engraved, branded goods produced for cafés, hotels and brands.", "منتجات محفورة بالشعار تُنتج للمقاهي والفنادق والعلامات."] },
    { t: ["Laser engraving, signage & wall art", "حفر وليزر، لافتات وفنّ جداري"], d: ["Precision engraving, Arabic calligraphy, signage and decorative panels.", "حفر دقيق وخطّ عربي ولافتات وألواح زخرفية."] },
    { t: ["Mixed-material pieces", "قطع متعدّدة المواد"], d: ["Wood with metal, leather, glass or stone — fusions most workshops can't make.", "خشب مع معدن أو جلد أو زجاج أو حجر — دمجٌ يعجز عنه أكثر الورش."] },
    { t: ["Restoration & repair", "ترميم وإصلاح"], d: ["Bringing tired or broken wood pieces back to life — refinished and rebuilt.", "إعادة الحياة للقطع الخشبية المتعبة أو المكسورة — تُعاد تشطيبًا وبناءً."] },
  ];

  return (
    <div className="px-5 pb-28 pt-36 md:px-10 md:pt-44">
      <div className="mx-auto max-w-[1300px]">
        {/* 1 — Intro */}
        <section>
          <Reveal>
            <span className="overline text-ink-soft">{c.eyebrow}</span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(3rem,2.2rem+5vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
              {c.h1}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-9 max-w-[58ch] text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] leading-relaxed text-ink-soft">
              {c.lead}
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
                <span className="overline text-sage">{c.makerEyebrow}</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-5 max-w-[12ch] font-display text-[clamp(2rem,1.5rem+2.6vw,3.4rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
                  {c.makerHeading}
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-7 max-w-[52ch] text-[clamp(1.02rem,0.96rem+0.3vw,1.18rem)] leading-relaxed text-ink-soft">
                  {c.makerBody}
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
            <span className="overline text-ink-soft">{c.doEyebrow}</span>
          </Reveal>

          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
            {/* (a) Furniture & objects */}
            <Reveal delay={0.06}>
              <div className="border-t border-ink/15 pt-8">
                <h3 className="font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.4rem)] font-light leading-tight text-ink">
                  {c.track1Heading}
                </h3>
                <p className="mt-6 max-w-[44ch] text-[clamp(1.02rem,0.96rem+0.3vw,1.15rem)] leading-relaxed text-ink-soft">
                  {c.track1Body}
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
                  {c.track2Heading}
                </h3>
                <p className="mt-6 max-w-[44ch] text-[clamp(1.02rem,0.96rem+0.3vw,1.15rem)] leading-relaxed text-ink-soft">
                  {c.track2Body}
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

        {/* 3.5 — Inside the workshop (capabilities) */}
        <section className="mt-28 md:mt-40">
          <Reveal>
            <span className="overline text-ink-soft">{ar ? "داخل الورشة" : "Inside the workshop"}</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 max-w-[18ch] font-display text-[clamp(2rem,1.5rem+2.6vw,3.4rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
              {ar ? "ليست مجرّد أيادٍ — بل أرضية تصنيع كاملة" : "Not just hands — a full fabrication floor"}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[60ch] text-[clamp(1.02rem,0.96rem+0.3vw,1.18rem)] leading-relaxed text-ink-soft">
              {ar
                ? "من الرسم إلى القطعة النهائية — خشب ومعدن وجلد وحجر، تُجمَع باليد وبالآلة، كلها تحت سقف واحد في عمّان."
                : "From a sketch to a finished object — wood, metal, leather and stone, joined by hand and by machine, all under one roof in Amman."}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {caps.map((cap, i) => (
              <Reveal key={i} delay={0.03 * i}>
                <div className="border-t border-ink/10 pt-5">
                  <span className="text-copper">{cap.icon}</span>
                  <h3 className="mt-4 font-display text-xl text-ink">{ar ? cap.t[1] : cap.t[0]}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{ar ? cap.d[1] : cap.d[0]}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="relative mt-16 aspect-[16/9] w-full overflow-hidden bg-sand">
              <Image
                src="/brand/workshop-fabrication.jpg"
                alt="A multi-material piece from Plexus — solid walnut with cast resin and copper, joining wood, stone-like material and metal in one object"
                fill
                sizes="(min-width: 1300px) 1300px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </section>

        {/* 3.6 — Services */}
        <section className="mt-28 md:mt-40">
          <Reveal>
            <span className="overline text-ink-soft">{ar ? "خدماتنا" : "Services"}</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 max-w-[16ch] font-display text-[clamp(2rem,1.5rem+2.6vw,3.4rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
              {ar ? "ما يمكننا صنعه لك" : "What we can make for you"}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={i} delay={0.03 * i}>
                <div className="h-full rounded-2xl border border-ink/10 bg-bone-2/40 p-6 md:p-7">
                  <h3 className="font-display text-xl leading-tight text-ink">{ar ? s.t[1] : s.t[0]}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{ar ? s.d[1] : s.d[0]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4 — Marks line */}
        <section className="mt-28 md:mt-40">
          <Reveal>
            <p className="overline text-ink-soft/70">{c.marks}</p>
          </Reveal>
        </section>

        {/* 5 — Contact */}
        <section className="mt-20 md:mt-28">
          <div className="grid items-end gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-6">
              <Reveal>
                <span className="overline text-copper">{c.contactEyebrow}</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2rem,1.5rem+2.6vw,3.4rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
                  {c.contactHeading}
                </h2>
              </Reveal>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <dl className="border-t border-ink/15">
                {channels.map((ch, i) => {
                  const row = (
                    <>
                      <dt className="overline text-ink-soft">{ch.label}</dt>
                      <dd className="mt-2 text-[clamp(1.05rem,0.98rem+0.3vw,1.25rem)] text-ink transition-colors group-hover:text-copper">
                        {ch.value}
                      </dd>
                    </>
                  );

                  return (
                    <Reveal key={ch.label} delay={0.06 + i * 0.06}>
                      {ch.href ? (
                        <a
                          href={ch.href}
                          {...(ch.external
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
