// ── On-Demand Fabrication — UI copy (EN/AR) ──
// Kept in the fabrication module (not the global dict) to keep the shared
// lib/i18n/dict.ts edit tiny. Access as copy.hero.title[lang].

import type { Lang } from "@/lib/i18n/dict";

type Bi = { en: string; ar: string };
export const pick = (lang: Lang, b: Bi) => b[lang];

export const copy = {
  meta: {
    title: {
      en: "On-Demand CNC & Laser Cutting — Plexus Workshop",
      ar: "قص CNC وليزر عند الطلب — بلِكسس",
    },
    desc: {
      en: "Send your design or pick a ready one — get it CNC-routed or laser-cut in Amman. Upload files, an engineer quotes you, we make it.",
      ar: "أرسل تصميمك أو اختر تصميمًا جاهزًا — واحصل على قصّ CNC أو ليزر في عمّان. ارفع ملفاتك، يسعّرها مهندس، ثم نصنعها.",
    },
  },

  hero: {
    over: { en: "On-demand fabrication", ar: "تصنيع عند الطلب" },
    title: { en: "CNC, laser & milling,\non your terms.", ar: "قصّ CNC وليزر وخراطة،\nكما تريد." },
    body: {
      en: "Bring your own files or start from a ready design. Cut, engrave or turn it in wood and more — a workshop engineer sends you a quote. No minimums, no commitment to start.",
      ar: "أحضر ملفاتك أو ابدأ من تصميم جاهز. قصّ، حفر، أو خراطة في الخشب وغيره — ويرسل لك مهندس الورشة عرض سعر. دون حد أدنى ودون التزام للبدء.",
    },
    ctaCustom: { en: "Start a custom order", ar: "ابدأ طلبًا مخصّصًا" },
    ctaTemplates: { en: "Browse ready designs", ar: "تصفّح التصاميم الجاهزة" },
  },

  how: {
    over: { en: "How it works", ar: "كيف تعمل" },
    s1t: { en: "Send your idea", ar: "أرسل فكرتك" },
    s1b: {
      en: "Upload your files (DXF, SVG, PDF, STEP…) or pick a ready design, then set material, thickness and quantity.",
      ar: "ارفع ملفاتك (DXF، SVG، PDF، STEP…) أو اختر تصميمًا جاهزًا، ثم حدّد المادة والسماكة والكمية.",
    },
    s2t: { en: "We quote it", ar: "نسعّرها" },
    s2b: {
      en: "An engineer reviews your order and sends a price and lead time — usually within 24 hours.",
      ar: "يراجع مهندس طلبك ويرسل السعر ومدة التنفيذ — عادةً خلال 24 ساعة.",
    },
    s3t: { en: "We make it", ar: "نصنعها" },
    s3b: {
      en: "Approve the quote and we cut, finish and hand it over — tracked from your private link.",
      ar: "وافق على العرض، فنقصّ ونشطّب ونسلّم — مع متابعة من رابطك الخاص.",
    },
  },

  examples: {
    over: { en: "What you can make", ar: "ما الذي يمكنك صنعه" },
    title: { en: "Examples from the workshop", ar: "أمثلة من الورشة" },
    cnc: { en: "CNC routing", ar: "قصّ CNC" },
    laser: { en: "Laser cutting", ar: "قصّ ليزر" },
    milling: { en: "Milling & turning", ar: "خراطة وتفريز" },
    empty: {
      en: "Examples are being added. Start an order and tell us what you need.",
      ar: "تُضاف الأمثلة قريبًا. ابدأ طلبًا وأخبرنا بما تحتاج.",
    },
  },

  templates: {
    over: { en: "Ready designs", ar: "تصاميم جاهزة" },
    title: { en: "Order a proven design", ar: "اطلب تصميمًا جاهزًا" },
    body: {
      en: "Pick one of our ready designs — like lids and trays — and we tailor the material and size to you. Price quoted per order.",
      ar: "اختر أحد تصاميمنا الجاهزة — كالأغطية والصواني — ونخصّص لك المادة والمقاس. يُسعّر كل طلب على حدة.",
    },
    order: { en: "Order this", ar: "اطلب هذا" },
  },

  wizard: {
    title: { en: "Start your order", ar: "ابدأ طلبك" },
    step: { en: "Step", ar: "خطوة" },
    of: { en: "of", ar: "من" },
    next: { en: "Continue", ar: "متابعة" },
    back: { en: "Back", ar: "رجوع" },
    submit: { en: "Submit order", ar: "إرسال الطلب" },
    submitting: { en: "Sending…", ar: "جارٍ الإرسال…" },

    // step 1 — service + start point
    s1title: { en: "What do you need cut?", ar: "ما الذي تريد قصّه؟" },
    cnc: { en: "CNC routing", ar: "قصّ CNC" },
    cncHint: { en: "Thicker wood, panels, 3D-milled parts", ar: "خشب أسمك، ألواح، أجزاء محفورة" },
    laser: { en: "Laser cutting", ar: "قصّ ليزر" },
    laserHint: { en: "Fine, precise cuts & engraving in thin sheets", ar: "قصّ دقيق وحفر في الألواح الرقيقة" },
    milling: { en: "Milling & turning", ar: "خراطة وتفريز" },
    millingHint: { en: "Turned & milled solids — bowls, cups, candle holders", ar: "قطع مخروطة من الخشب الصلب — أوعية، أكواب، حاملات شموع" },
    start: { en: "Where do you start?", ar: "من أين تبدأ؟" },
    custom: { en: "My own design", ar: "تصميمي الخاص" },
    customHint: { en: "Upload your files", ar: "ارفع ملفاتك" },
    template: { en: "A ready design", ar: "تصميم جاهز" },
    templateHint: { en: "Pick one and we tailor it", ar: "اختر واحدًا ونخصّصه" },

    // step 2 — specs
    s2title: { en: "Material & details", ar: "المادة والتفاصيل" },
    material: { en: "Material", ar: "المادة" },
    thickness: { en: "Thickness", ar: "السماكة" },
    stock: { en: "Stock / blank size", ar: "حجم الكتلة الخشبية" },
    dimensions: { en: "Size / dimensions", ar: "المقاس / الأبعاد" },
    dimsPh: { en: 'e.g. 400 × 300 mm, or describe it', ar: "مثال: ٤٠٠ × ٣٠٠ مم، أو صِف المقاس" },
    quantity: { en: "Quantity", ar: "الكمية" },
    finish: { en: "Finish", ar: "التشطيب" },
    notes: { en: "Notes", ar: "ملاحظات" },
    notesPh: { en: "Anything we should know — deadline, colour, special requests…", ar: "أي شيء يهمّنا معرفته — الموعد، اللون، طلبات خاصة…" },
    choose: { en: "Choose…", ar: "اختر…" },

    // step 3 — files
    s3title: { en: "Your files", ar: "ملفاتك" },
    drop: { en: "Drop files here, or click to choose", ar: "أفلت الملفات هنا، أو انقر للاختيار" },
    fileHint: { en: "DXF, SVG, AI, PDF, STEP/STP, JPG, PNG · up to 50 MB each", ar: "DXF، SVG، AI، PDF، STEP، JPG، PNG · حتى 50 ميجابايت للملف" },
    optionalFiles: { en: "Optional if you picked a ready design.", ar: "اختياري إن اخترت تصميمًا جاهزًا." },
    remove: { en: "Remove", ar: "إزالة" },

    // step 4 — contact
    s4title: { en: "How can we reach you?", ar: "كيف نتواصل معك؟" },
    name: { en: "Name", ar: "الاسم" },
    whatsapp: { en: "WhatsApp number", ar: "رقم واتساب" },
    email: { en: "Email", ar: "البريد الإلكتروني" },
    contactNote: { en: "We need at least a WhatsApp number or an email.", ar: "نحتاج رقم واتساب أو بريدًا إلكترونيًّا على الأقل." },
    review: { en: "Review", ar: "مراجعة" },

    // validation
    needService: { en: "Pick a service and a starting point.", ar: "اختر الخدمة ونقطة البداية." },
    needTemplate: { en: "Pick a ready design.", ar: "اختر تصميمًا جاهزًا." },
    needMaterial: { en: "Please choose a material.", ar: "يرجى اختيار المادة." },
    needContact: { en: "Add your name and a WhatsApp number or email.", ar: "أضف اسمك ورقم واتساب أو بريدًا إلكترونيًّا." },
    error: { en: "Something went wrong. Please try again.", ar: "حدث خطأ. حاول مرة أخرى." },

    // confirmation
    doneTitle: { en: "Order received", ar: "تم استلام الطلب" },
    doneBody: {
      en: "An engineer will contact you within 24 hours with a quote. Save your tracking link to follow the status:",
      ar: "سيتواصل معك مهندس خلال 24 ساعة بعرض السعر. احفظ رابط المتابعة لمعرفة الحالة:",
    },
    doneTrack: { en: "Open tracking page", ar: "افتح صفحة المتابعة" },
    copy: { en: "Copy link", ar: "نسخ الرابط" },
    copied: { en: "Copied!", ar: "تم النسخ!" },
    // WhatsApp fallback (before Firebase is connected)
    waFallbackTitle: { en: "Almost there — send on WhatsApp", ar: "خطوة أخيرة — أرسِل عبر واتساب" },
    waFallbackBody: {
      en: "Online ordering is being switched on. For now, tap below to send your order straight to the workshop on WhatsApp.",
      ar: "يجري تفعيل الطلب عبر الموقع. حاليًّا، اضغط أدناه لإرسال طلبك مباشرةً إلى الورشة عبر واتساب.",
    },
    waSend: { en: "Send on WhatsApp", ar: "أرسل عبر واتساب" },
  },

  track: {
    over: { en: "Order status", ar: "حالة الطلب" },
    notFound: { en: "We couldn't find that order.", ar: "تعذّر العثور على هذا الطلب." },
    notFoundBody: { en: "Check the link, or contact us on WhatsApp.", ar: "تأكد من الرابط، أو تواصل معنا عبر واتساب." },
    greeting: { en: "Hi", ar: "مرحبًا" },
    summary: { en: "Your order", ar: "طلبك" },
    quoteTitle: { en: "Your quote", ar: "عرض السعر" },
    leadTime: { en: "Lead time", ar: "مدة التنفيذ" },
    days: { en: "days", ar: "يوم" },
    accept: { en: "Accept quote", ar: "قبول العرض" },
    accepting: { en: "Confirming…", ar: "جارٍ التأكيد…" },
    accepted: { en: "Quote accepted — we'll start production. Thank you!", ar: "تم قبول العرض — سنبدأ التنفيذ. شكرًا لك!" },
    discuss: { en: "Discuss on WhatsApp", ar: "ناقش عبر واتساب" },
    files: { en: "Files", ar: "الملفات" },
    waitQuote: { en: "An engineer is preparing your quote. You'll hear from us soon.", ar: "يحضّر المهندس عرض سعرك. سنتواصل معك قريبًا." },
    // status labels
    st_new: { en: "Received", ar: "تم الاستلام" },
    st_reviewing: { en: "Under review", ar: "قيد المراجعة" },
    st_quoted: { en: "Quote ready", ar: "العرض جاهز" },
    st_confirmed: { en: "Confirmed", ar: "مؤكَّد" },
    st_in_production: { en: "In production", ar: "قيد التنفيذ" },
    st_ready: { en: "Ready", ar: "جاهز" },
    st_completed: { en: "Completed", ar: "مكتمل" },
    st_declined: { en: "Declined", ar: "مرفوض" },
    st_cancelled: { en: "Cancelled", ar: "ملغى" },
  },
} as const;
