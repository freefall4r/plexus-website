"use client";

import { useLang } from "@/lib/i18n/context";

/** FAQ — answers from anahata (delivery: all Jordan; lead time 2–4 wks; deposit
 *  then balance; international on request). Emits FAQPage JSON-LD (English) for
 *  Google rich results. Edit answers here. */
const FAQS = [
  {
    q_en: "Can you make a custom piece from my idea or a photo?",
    q_ar: "هل تصنعون قطعة مخصّصة من فكرتي أو من صورة؟",
    a_en:
      "Yes — that's exactly what we do. Send a sketch, a photo, or a piece you saw somewhere, and our 3D studio renders it so you can see it before we build it. Then we make it by hand in solid wood.",
    a_ar:
      "نعم، هذا تحديدًا ما نقوم به. أرسِل رسمة أو صورة أو قطعة أعجبتك، ويُظهرها استوديو الأبعاد الثلاثية لتراها قبل أن نصنعها، ثم نصنعها يدويًا من الخشب الصلب.",
  },
  {
    q_en: "How long does a custom piece take?",
    q_ar: "كم تستغرق القطعة المخصّصة؟",
    a_en:
      "Most pieces are ready in about 2–4 weeks. Larger or more complex commissions can take a little longer — we confirm the exact timeline when we quote your order.",
    a_ar:
      "معظم القطع جاهزة خلال 2–4 أسابيع تقريبًا. القطع الأكبر أو الأعقد قد تستغرق وقتًا أطول قليلًا — ونؤكّد المدة بدقّة عند تسعير طلبك.",
  },
  {
    q_en: "Do you deliver?",
    q_ar: "هل توصّلون؟",
    a_en:
      "Yes — we deliver across all of Jordan. International shipping is available on request; we'll quote it separately for your piece.",
    a_ar:
      "نعم، نوصّل إلى جميع أنحاء الأردن. والشحن الدولي متاح عند الطلب، ونحدّد كلفته بشكل منفصل لقطعتك.",
  },
  {
    q_en: "How does payment work?",
    q_ar: "كيف تتم عملية الدفع؟",
    a_en:
      "A deposit gets your piece into production, with the balance due on completion and delivery. We agree everything clearly before any work begins.",
    a_ar:
      "دفعة مقدّمة لبدء تنفيذ قطعتك، والمبلغ المتبقّي عند الإنجاز والتسليم. نتّفق على كل التفاصيل بوضوح قبل بدء أي عمل.",
  },
  {
    q_en: "What woods and materials do you use?",
    q_ar: "ما الأخشاب والمواد التي تستخدمونها؟",
    a_en:
      "Solid hardwoods — walnut, oak, olive and cherry — often paired with stone, copper or brass. Pieces are finished with natural oils that deepen and age beautifully over time.",
    a_ar:
      "أخشاب صلبة: جوز، بلوط، زيتون وكرز، غالبًا مع الحجر أو النحاس أو البرونز. تُشطّب القطع بزيوت طبيعية يزداد عمقها وجمالها مع الوقت.",
  },
  {
    q_en: "Do you make products for businesses or under our own brand?",
    q_ar: "هل تصنعون منتجات للأعمال أو تحت علامتنا الخاصة؟",
    a_en:
      "Yes — through our Brand Partnerships service we produce custom, logo-engraved pieces (boards, trays, gifts and more) for cafés, hotels and brands to sell or gift under their own name.",
    a_ar:
      "نعم، عبر خدمة «شراكات العلامات» نصنع قطعًا مخصّصة محفورة بشعاركم (ألواح، صواني، هدايا وغيرها) للمقاهي والفنادق والعلامات لبيعها أو إهدائها باسمها.",
  },
];

export function Faq() {
  const { lang } = useLang();
  const ar = lang === "ar";

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q_en,
      acceptedAnswer: { "@type": "Answer", text: f.a_en },
    })),
  };

  return (
    <section className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[900px]">
        <p className="overline text-amber">{ar ? "الأسئلة الشائعة" : "FAQ"}</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.02] md:text-6xl">
          {ar ? "أسئلة متكرّرة" : "Common questions"}
        </h2>

        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {FAQS.map((f, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-ink [&::-webkit-details-marker]:hidden md:text-xl">
                <span>{ar ? f.q_ar : f.q_en}</span>
                <span className="shrink-0 text-2xl font-light text-copper transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[72ch] leading-relaxed text-ink-soft">
                {ar ? f.a_ar : f.a_en}
              </p>
            </details>
          ))}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
