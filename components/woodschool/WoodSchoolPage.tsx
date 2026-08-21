"use client";

// Plexus Wood School — the cohort landing page.
//
// Deliberately self-contained: all copy lives in the local COPY object rather
// than lib/i18n/dict.ts, and nothing outside app/wood-school + this folder is
// touched. That keeps the page mergeable while other work is in flight, and
// means a cohort's dates/price change in exactly one place — COHORT below.

import Image from "next/image";
import { Reveal } from "@/components/redesign/Reveal";
import { waLink } from "@/lib/config";
import { useLang } from "@/lib/i18n/context";

/** The only thing that changes between cohorts.
 *
 *  We deliberately do NOT advertise dates. People join the list; once a group of
 *  `seats` has formed we agree a weekend that actually suits them. Set `dates`
 *  the moment that weekend is fixed and both this page and the cohort page pick
 *  it up — until then every date-shaped hole on the site simply closes itself. */
export const COHORT = {
  number: "01",
  hours: "10:00 – 16:00",
  days: 4,
  weekends: 2,
  seats: 5,
  price: 200,
  fullPrice: 260,
  deposit: 100,
  dates: null as { en: string; ar: string } | null,
};

const COPY = {
  overline: { en: "Plexus Wood School", ar: "مدرسة الخشب" },
  heading: { en: "Four days, two teachers, and you will never look at a board the same way.", ar: "أربعة أيام، ومُعلِّمان، ولن تنظر إلى لوح الخشب بالطريقة نفسها بعدها." },
  intro: {
    en: "For makers, artists and anyone who wants to start working with wood properly. Four days across two weekends, inside a working production workshop. The first weekend you learn the material and how a piece is designed, from an engineer who studied wood. The second weekend you make it, with a carpenter who builds for a living.",
    ar: "للحرفيين والفنانين ولكل من يريد أن يبدأ العمل بالخشب كما يجب. أربعة أيام على مدى عطلتَي نهاية أسبوع، داخل ورشة إنتاج حقيقية. في الأولى تتعلّم المادة وكيف تُصمَّم القطعة، على يد مهندس درس الخشب. وفي الثانية تصنعها، مع نجّار يبني للعيش.",
  },
  book: { en: "Add me to the list", ar: "أضِفني إلى القائمة" },
  waMsg: {
    en: "Hi — I'd like to join the list for the Plexus Wood School.",
    ar: "مرحباً — أريد الانضمام إلى قائمة مدرسة الخشب.",
  },
  where: {
    en: `Four days over two weekends · ${COHORT.hours} · Plexus Workshop, Amman`,
    ar: `أربعة أيام على مدى عطلتَين · ${COHORT.hours} · ورشة بلكسس، عمّان`,
  },

  factSeats: { en: "seats only", ar: "مقاعد فقط" },
  factDays: { en: "full days", ar: "أيام كاملة" },
  factPrice: { en: "all included", ar: "شامل كل شيء" },
  factLevel: { en: "experience needed", ar: "خبرة مطلوبة" },
  none: { en: "None", ar: "لا شيء" },

  daysTitle: { en: "The two weekends", ar: "العطلتان" },
  wk1: { en: "Weekend one — the material, and the design", ar: "العطلة الأولى — المادة والتصميم" },
  wk1who: { en: "with the timber engineer", ar: "مع مهندس الأخشاب" },
  wk2: { en: "Weekend two — the shop, and the making", ar: "العطلة الثانية — الورشة والتنفيذ" },
  wk2who: { en: "with a working master carpenter", ar: "مع نجّار محترف" },
  gap: {
    en: "The week in between is deliberate: your glue-up cures properly, and you come back having thought about what you are making.",
    ar: "الأسبوع الفاصل مقصود: يجف الغراء كما يجب، وتعود وقد فكّرت في ما تصنعه.",
  },

  pieceTitle: { en: "You leave carrying this", ar: "تخرج حاملاً هذه" },
  teacher2Title: { en: "And who makes with you", ar: "ومن يصنع معك" },
  teacher2: {
    en: "The second weekend is led by a carpenter who builds for a living — machines, workshop etiquette, sharpening, and the working habits that no book teaches. You get the engineer and the craftsman, which is not a combination you will find twice in this city.",
    ar: "يقود العطلة الثانية نجّار يبني للعيش — الآلات، وآداب الورشة، والسنّ، وعادات العمل التي لا يعلّمها كتاب. تحصل على المهندس والحِرَفي معاً، وهي تركيبة لن تجدها مرتين في هذه المدينة.",
  },
  pieceBlurb: {
    en: "A 400 × 300 × 180 mm wall unit in solid hardwood with a plywood back and two shelves set deliberately off from each other. Small enough to finish properly, honest enough to teach everything — the joints, why the back is plywood and not solid wood, how a shelf carries load, and how a piece is fixed to a wall so it never moves again.",
    ar: "وحدة حائط ٤٠٠ × ٣٠٠ × ١٨٠ مم من الخشب الصلب، بظهر من الأبلكاش ورفّين غير متساويي الارتفاع عمداً. صغيرة بما يكفي لإنهائها كما يجب، وصادقة بما يكفي لتعليم كل شيء — الوصلات، ولماذا الظهر أبلكاش لا خشب صلب، وكيف يحمل الرف الحِمل، وكيف تُثبَّت القطعة على الحائط فلا تتحرك أبداً.",
  },

  includedTitle: { en: "Included — nothing further to buy", ar: "شامل — لا شيء آخر تشتريه" },
  teacherTitle: { en: "Who is teaching", ar: "من يُدرّس" },
  teacher: {
    en: "MSc in Timber Engineering, University of Sopron — with published and cited research on laminated veneer lumber and the structural use of underused species. Plexus Workshop is a solid-wood, CNC and laser fabrication shop in Amman doing custom and contract production for architects, designers and brands. The first weekend is his: what wood is, and how a piece gets designed before anyone cuts it.",
    ar: "ماجستير في هندسة الأخشاب من جامعة شوپرون — مع أبحاث منشورة ومُستشهَد بها في الخشب الرقائقي المصفّح والاستخدام الإنشائي للأنواع قليلة الاستعمال. ورشة بلكسس ورشة خشب صلب وتصنيع CNC وليزر في عمّان، تنفّذ إنتاجاً خاصاً وتعاقدياً لمعماريين ومصممين وعلامات تجارية. العطلة الأولى له: ما هو الخشب، وكيف تُصمَّم القطعة قبل أن يقصّ أحد شيئاً.",
  },

  howTitle: { en: "How it works", ar: "كيف تسير الأمور" },
  howBlurb: {
    en: "There are no fixed dates, and that is on purpose — a group of five is easier to suit than a calendar.",
    ar: "لا يوجد تاريخ ثابت، وهذا مقصود — من الأسهل أن نوافق خمسة أشخاص من أن نوافق التقويم.",
  },
  priceTitle: { en: "Seats & fee", ar: "المقاعد والرسوم" },
  founding: {
    en: `${COHORT.price} JD for this first group — the fee is ${COHORT.fullPrice} JD afterwards. Everything is included: your timber, tools, machine time, safety gear, the workbook and lunch both days.`,
    ar: `${COHORT.price} ديناراً لهذه المجموعة الأولى — والرسوم ${COHORT.fullPrice} ديناراً بعدها. كل شيء مشمول: الخشب والأدوات ووقت الآلات ومعدّات السلامة والكتيّب والغداء في اليومين.`,
  },
  reserve: {
    en: `Joining the list costs nothing and commits you to nothing. Once the weekend is agreed, ${COHORT.deposit} JD confirms your seat and the balance is paid on the first morning.`,
    ar: `الانضمام إلى القائمة مجاني ولا يلزمك بشيء. وبعد الاتفاق على العطلة، يؤكّد مبلغ ${COHORT.deposit} ديناراً مقعدك، ويُدفع الباقي صباح اليوم الأول.`,
  },
};

const D1 = [
  { en: "What wood actually is — cells, grain, and the three planes", ar: "ما هو الخشب فعلاً — الخلايا والعروق والمستويات الثلاثة" },
  { en: "The species in your hands, and the engineered boards", ar: "الأنواع بين يديك، والألواح المصنّعة" },
  { en: "Moisture and movement — why a piece splits in January", ar: "الرطوبة والحركة — لماذا تتشقق القطعة في كانون الثاني" },
  { en: "Buying wood in Amman — names, prices, the six checks", ar: "شراء الخشب في عمّان — الأسماء والأسعار والفحوصات الستة" },
  { en: "Your own finish sample set, made and labelled", ar: "مجموعة عيّنات الدهان الخاصة بك، تصنعها وتوسمها" },
];

const D2 = [
  { en: "Choosing the joint for the load it carries", ar: "اختيار الوصلة حسب الحِمل الذي تحمله" },
  { en: "Will it hold? Your shelf under real structural analysis", ar: "هل ستصمد؟ رفّك تحت تحليل إنشائي حقيقي" },
  { en: "Design approach — how a piece is actually designed", ar: "منهج التصميم — كيف تُصمَّم القطعة فعلاً" },
  { en: "Marking out — where accuracy is won or lost", ar: "التخطيط — حيث تُكسب الدقة أو تُفقد" },
  { en: "Logistics and costing — how a job moves through a shop", ar: "اللوجستيات والتكلفة — كيف يسير الطلب في الورشة" },
  { en: "Draw your own piece, and have it reviewed", ar: "ارسم قطعتك الخاصة، وتُراجَع معك" },
];

const D3 = [
  { en: "Workshop etiquette, ethics and safety", ar: "آداب الورشة وأخلاقيات العمل والسلامة" },
  { en: "Every machine, properly introduced", ar: "كل آلة، مع شرح كامل" },
  { en: "Sharpening — chisels and plane irons, by hand", ar: "السنّ — الأزاميل وشفرات الفارة، يدوياً" },
  { en: "Cut your own joinery, one at the machine at a time", ar: "تقص وصلاتك بنفسك، واحد على الآلة في كل مرة" },
  { en: "Dry fit, then glue up — it cures over the week", ar: "تركيب تجريبي ثم التغرية — وتجف خلال الأسبوع" },
];

const D4 = [
  { en: "Working a cured joint — scraper and block plane", ar: "العمل على وصلة جافة — المكشطة والفارة" },
  { en: "The shaped front edge", ar: "تشكيل الحافة الأمامية" },
  { en: "Sanding properly — the ladder, and why you stop at 220", ar: "الصقل الصحيح — التدرّج، ولماذا تتوقف عند ٢٢٠" },
  { en: "Mounting — four bosses, four bolts, into a real wall", ar: "التثبيت — أربع قواعد وأربعة مسامير، في حائط حقيقي" },
  { en: "The finish, on your own piece", ar: "الدهان، على قطعتك أنت" },
  { en: "What to buy first — your first ten tools, with prices", ar: "ماذا تشتري أولاً — أول عشر أدوات بأسعارها" },
];

const INCLUDED = [
  { en: "All your timber, the plywood back, glue, abrasives, fixings and finish", ar: "كل الخشب، وظهر الأبلكاش، والغراء، وورق الصنفرة، والتثبيتات، والدهان" },
  { en: "Your own labelled finish sample set — three finishes across three species", ar: "مجموعة عيّنات دهانات مُعلّمة باسمك — ثلاثة دهانات على ثلاثة أنواع" },
  { en: "A printed workbook in Arabic and English", ar: "كتيّب مطبوع بالعربية والإنجليزية" },
  { en: "A certificate signed on completion", ar: "شهادة موقّعة عند الإتمام" },
  { en: "All tools, machine time and safety equipment", ar: "كل الأدوات ووقت الآلات ومعدّات السلامة" },
  { en: "Lunch, all four days", ar: "الغداء، في الأيام الأربعة" },
];

export function WoodSchoolPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = (o: { en: string; ar: string }) => (ar ? o.ar : o.en);
  const book = waLink(t(COPY.waMsg));

  const facts = [
    { v: String(COHORT.days), k: t(COPY.factDays) },
    { v: String(COHORT.seats), k: t(COPY.factSeats) },
    { v: `${COHORT.price} JD`, k: t(COPY.factPrice) },
    { v: t(COPY.none), k: t(COPY.factLevel) },
  ];

  // The model, spelled out — without this the missing date reads as vagueness
  // rather than as the deliberate choice it is.
  const steps = [
    {
      n: "1",
      en: "Add your name to the list", ar: "أضِف اسمك إلى القائمة",
      den: "One message. It costs nothing and commits you to nothing.",
      dar: "رسالة واحدة. مجاناً ودون أي التزام.",
    },
    {
      n: "2",
      en: `We wait for ${COHORT.seats}`, ar: `ننتظر اكتمال ${COHORT.seats}`,
      den: "Five is the whole group. Small enough that everyone gets watched at the machine.",
      dar: "خمسة هم المجموعة كاملة — عدد يسمح بمتابعة كل شخص على الآلة.",
    },
    {
      n: "3",
      en: "We pick two weekends together", ar: "نختار عطلتَين معاً",
      den: "Once the five of you exist, we agree two weekends that actually suit you.",
      dar: "بعد اكتمال الخمسة، نتفق على عطلتَين تناسبكم فعلاً.",
    },
    {
      n: "4",
      en: `${COHORT.deposit} JD confirms your seat`, ar: `${COHORT.deposit} ديناراً تؤكّد مقعدك`,
      den: "Only once the date is set. The balance is paid on the first morning.",
      dar: "بعد تحديد الموعد فقط. ويُدفع الباقي صباح اليوم الأول.",
    },
  ];

  return (
    <main className="bg-[#f4efe6] text-[#2c271e]" dir={ar ? "rtl" : "ltr"}>
      {/* hero */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-14 sm:pt-32">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#9c5b2c]">
            {t(COPY.overline)}
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            {t(COPY.heading)}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#473826]">
            {t(COPY.intro)}
          </p>
          <p className="mt-6 text-sm font-semibold text-[#6b5d4a]">{t(COPY.where)}</p>
          <a
            href={book}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-[#2c271e] px-8 py-3.5 text-sm font-bold text-[#f4efe6] transition hover:bg-[#9c5b2c]"
          >
            {t(COPY.book)} →
          </a>
        </Reveal>
      </section>

      {/* facts */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map((f) => (
            <div
              key={f.k}
              className="rounded-lg border border-[#d9cbb3] bg-[#ece4d4] px-4 py-5 text-center"
            >
              <b className="block font-serif text-3xl leading-none text-[#9c5b2c]">
                {f.v}
              </b>
              <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b5d4a]">
                {f.k}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* how the list works — the model, before the curriculum */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <Reveal>
          <h2 className="font-serif text-3xl">{t(COPY.howTitle)}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#473826]">
            {t(COPY.howBlurb)}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st) => (
              <div
                key={st.n}
                className="rounded-lg border border-[#e3d9c7] bg-white p-5"
              >
                <span className="font-serif text-3xl leading-none text-[#c98f4e]">
                  {st.n}
                </span>
                <h3 className="mt-3 text-sm font-bold">{ar ? st.ar : st.en}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b5d4a]">
                  {ar ? st.dar : st.den}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* the two weekends */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <Reveal>
          <h2 className="font-serif text-3xl">{t(COPY.daysTitle)}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#473826]">
            {t(COPY.gap)}
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              { title: t(COPY.wk1), who: t(COPY.wk1who), days: [D1, D2] },
              { title: t(COPY.wk2), who: t(COPY.wk2who), days: [D3, D4] },
            ].map((wk, wi) => (
              <div
                key={wk.title}
                className="rounded-lg border border-[#e3d9c7] bg-white p-6"
              >
                <h3 className="font-serif text-xl">{wk.title}</h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#9c5b2c]">
                  {wk.who}
                </p>
                {wk.days.map((day, di) => (
                  <div key={di} className={di ? "mt-6" : "mt-5"}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#a8977c]">
                      {ar ? `اليوم ${wi * 2 + di + 1}` : `Day ${wi * 2 + di + 1}`}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {day.map((it) => (
                        <li
                          key={it.en}
                          className="flex gap-3 text-sm leading-relaxed text-[#473826]"
                        >
                          <span className="text-[#c98f4e]">—</span>
                          <span>{t(it)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* the piece */}
      <section className="bg-[#ece4d4] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="font-serif text-3xl">{t(COPY.pieceTitle)}</h2>
                <p className="mt-5 text-sm leading-relaxed text-[#473826]">
                  {t(COPY.pieceBlurb)}
                </p>
              </div>
              <Image
                src="/wood-school/unit.jpg"
                alt={ar ? "وحدة الحائط" : "The offset wall unit"}
                width={1400}
                height={1000}
                className="rounded-lg border border-[#d9cbb3] bg-[#f4efe6]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* included */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="font-serif text-3xl">{t(COPY.includedTitle)}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {INCLUDED.map((i) => (
              <div
                key={i.en}
                className="rounded-lg border border-[#e3d9c7] bg-white px-5 py-4 text-sm text-[#473826]"
              >
                {t(i)}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* teacher */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <Reveal>
          <div className="rounded-lg border border-[#e3d9c7] bg-white p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9c5b2c]">
              {t(COPY.teacherTitle)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#473826]">
              {t(COPY.teacher)}
            </p>
          </div>
          <div className="mt-4 rounded-lg border border-[#e3d9c7] bg-white p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9c5b2c]">
              {t(COPY.teacher2Title)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#473826]">
              {t(COPY.teacher2)}
            </p>
          </div>
        </Reveal>
      </section>

      {/* price + CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <Reveal>
          <div className="rounded-lg bg-[#2c271e] p-9 text-[#f4efe6]">
            <h2 className="font-serif text-3xl">{t(COPY.priceTitle)}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#d9cbb3]">
              {t(COPY.founding)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#d9cbb3]">
              {t(COPY.reserve)}
            </p>
            <a
              href={book}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block rounded-full bg-[#e8b57a] px-8 py-3.5 text-sm font-bold text-[#2c271e] transition hover:bg-[#f4efe6]"
            >
              {t(COPY.book)} →
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
