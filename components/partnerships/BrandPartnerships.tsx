"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import { brand, waLink, mailLink } from "@/lib/config";

/** Brand Partnerships — B2B / white-label service page.
 *  Businesses commission Plexus to design, prototype and produce custom wood
 *  products branded as their own. Bilingual copy is inlined (EN/AR) and the
 *  page sits inside SiteChrome's .grain wrapper, so the limewash flows through. */
export function BrandPartnerships() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const T = (en: string, arr: string) => (ar ? arr : en);

  const waMsg = ar
    ? `مرحبًا ${brand.name}، أودّ التحدث عن شراكة لصناعة منتج خشبي يحمل علامة عملي.`
    : `Hi ${brand.name}, I'd like to talk about a brand partnership / white-label wood product for my business.`;
  const mailSubject = `${brand.full} — ${T("Brand partnership enquiry", "استفسار عن شراكة علامة")}`;

  const uses = [
    {
      en: ["Cafés & restaurants", "Branded boards, trays, coasters and menu holders that carry your name to every table."],
      ar: ["المقاهي والمطاعم", "ألواح وصواني وحوامل قوائم تحمل اسمك إلى كل طاولة."],
    },
    {
      en: ["Hotels & hospitality", "Room accents, amenity trays and signage in honest solid wood."],
      ar: ["الفنادق والضيافة", "لمسات للغرف وصواني ولافتات من خشبٍ صلب صادق."],
    },
    {
      en: ["Corporate gifts", "Engraved keepsakes, desk pieces and gift sets your clients keep."],
      ar: ["هدايا الشركات", "قطع محفورة وقطع مكتبية وأطقم هدايا يحتفظ بها عملاؤك."],
    },
    {
      en: ["Retail & white-label", "A full product line, made to your spec and sold under your brand."],
      ar: ["التجزئة والعلامة البيضاء", "خط منتجات كامل يُصنع وفق مواصفاتك ويُباع تحت علامتك."],
    },
  ];

  const steps = [
    {
      en: ["Brief & sample", "Bring a product idea — or just a logo and a use. We listen, sketch, and quote."],
      ar: ["الفكرة والعيّنة", "أحضر فكرة منتج — أو شعارًا واستخدامًا فقط. نستمع ونرسم ونقدّم عرض السعر."],
    },
    {
      en: ["Prototype", "A real piece in your hands to approve before anything is produced in quantity."],
      ar: ["النموذج الأولي", "قطعة حقيقية بين يديك للموافقة قبل الإنتاج بأي كمية."],
    },
    {
      en: ["Production", "Made by hand to a consistent spec, at the quantity you need."],
      ar: ["الإنتاج", "تُصنع يدويًا بمواصفةٍ ثابتة وبالكمية التي تحتاجها."],
    },
    {
      en: ["Your brand", "Logo engraving, finish and packaging — the finished object is yours."],
      ar: ["علامتك", "حفر الشعار والتشطيب والتغليف — القطعة النهائية لك."],
    },
  ];

  const why = [
    { en: ["Sopron-trained engineer", "Led by a timber-industry engineer trained in Sopron."], ar: ["مهندس من سوبرون", "بقيادة مهندس صناعات خشبية تدرّب في سوبرون."] },
    { en: ["In-house, end to end", "Design, prototype, build and finish — all under one roof."], ar: ["كل شيء داخليًا", "التصميم والنموذج والصناعة والتشطيب — تحت سقفٍ واحد."] },
    { en: ["Flexible quantities", "From a small first batch to a full production run."], ar: ["كميات مرنة", "من دفعة أولى صغيرة إلى إنتاجٍ كامل."] },
    { en: ["Made in Amman", "Honest solid wood, crafted in Jordan."], ar: ["صُنع في عمّان", "خشبٌ صلب صادق، مصنوع في الأردن."] },
  ];

  return (
    <div className="px-5 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1500px]">
        {/* hero */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="overline text-amber">{T("For brands & businesses", "للعلامات والشركات")}</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
            {T("Brand Partnerships", "شراكات العلامات")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            {T(
              "We design, prototype, and craft custom wood products — branded as your own. From logo-engraved spoons to a full retail line, made by hand in Amman.",
              "نصمّم ونصنع منتجات خشبية مخصّصة تحمل علامتك أنت — من ملاعق محفورة بشعارك إلى خطّ منتجاتٍ كامل، مصنوعة يدويًا في عمّان."
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-amber hover:text-[#160e07]"
            >
              {T("Start a project", "ابدأ مشروعًا")}
            </a>
            <a
              href={mailLink(mailSubject, waMsg)}
              className="rounded-full border border-ink/25 px-7 py-3.5 text-sm transition-colors hover:border-ink"
            >
              {T("Email us", "راسلنا")}
            </a>
          </div>
        </motion.section>

        {/* intro line */}
        <section className="mt-24 max-w-3xl border-t border-ink/10 pt-10">
          <p className="font-display text-2xl leading-snug text-ink md:text-3xl">
            {T(
              "Plexus works quietly behind other brands. Bring us an idea — or just a logo and a use — and we take it from sketch to a finished, branded object you can sell, gift, or stock.",
              "تعمل بلِكسس بهدوء خلف علاماتٍ أخرى. أحضر لنا فكرة — أو حتى شعارًا واستخدامًا — ونأخذها من الرسم إلى قطعةٍ نهائية تحمل علامتك، تبيعها أو تهديها أو تعرضها."
            )}
          </p>
        </section>

        {/* use cases */}
        <section className="mt-20">
          <p className="overline text-ink-soft">{T("What we make for you", "ما نصنعه لك")}</p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {uses.map((u, i) => {
              const [title, body] = ar ? u.ar : u.en;
              return (
                <div key={i} className="bg-bone p-7 md:p-9">
                  <h3 className="font-display text-xl text-ink md:text-2xl">{title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* process */}
        <section className="mt-24">
          <p className="overline text-ink-soft">{T("How it works", "كيف تجري الأمور")}</p>
          <div className="mt-8 grid gap-10 md:grid-cols-4 md:gap-8">
            {steps.map((s, i) => {
              const [title, body] = ar ? s.ar : s.en;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-mono text-sm text-amber">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-xl text-ink">{title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{body}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* why plexus */}
        <section className="mt-24">
          <p className="overline text-ink-soft">{T("Why Plexus", "لماذا بلِكسس")}</p>
          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {why.map((w, i) => {
              const [title, body] = ar ? w.ar : w.en;
              return (
                <div key={i} className="flex gap-4 border-t border-ink/10 pt-6">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden />
                  <div>
                    <h3 className="font-display text-lg text-ink">{title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-soft">{body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 rounded-3xl bg-walnut-deep px-7 py-14 text-bone md:px-14 md:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight md:text-5xl">
              {T("Have a product in mind?", "لديك منتج في بالك؟")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-bone/70">
              {T(
                "Tell us what you'd like to make and the quantity you're thinking of. We'll come back with ideas, a sample plan, and a price.",
                "أخبرنا بما تودّ صناعته والكمية التي تفكّر بها. سنعود إليك بأفكار وخطّة عيّنة وسعر."
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-bone px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-amber hover:text-[#160e07]"
              >
                {T("Start a project on WhatsApp", "ابدأ مشروعًا عبر واتساب")}
              </a>
              <a
                href={mailLink(mailSubject, waMsg)}
                className="rounded-full border border-bone/30 px-7 py-3.5 text-sm transition-colors hover:border-bone"
              >
                {T("Email us", "راسلنا")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
