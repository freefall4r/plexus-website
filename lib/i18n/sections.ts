// Bilingual copy for the redesigned marketing sections (homepage + About).
// Usage in a client component:
//   const { lang } = useLang();
//   const c = sectionCopy.hero[lang];
// (Shop, Custom Studio, nav and footer already go through dict.ts.)

import type { Lang } from "./dict";

type L<T> = Record<Lang, T>;

export const sectionCopy = {
  hero: {
    en: {
      eyebrow: "Plexus Workshop — Amman, Jordan",
      line1: "Wood,",
      line2: "made personal.",
      sub: "Handmade furniture, sculptural objects, and timber research — shaped in Amman by an engineer who reads the grain.",
      cta: "See your idea in 3D",
      link: "Explore the work",
      materials: "Wood · Stone · Copper · Limewash",
    },
    ar: {
      eyebrow: "Plexus Workshop — عمّان، الأردن",
      line1: "الخشب،",
      line2: "بلمسة شخصية.",
      sub: "أثاث وقطع نحتية مصنوعة باليد، وأبحاث في الأخشاب — تُصاغ في عمّان على يد مهندس يقرأ عروق الخشب.",
      cta: "شاهد فكرتك ثلاثية الأبعاد",
      link: "تصفّح أعمالنا",
      materials: "خشب · حجر · نحاس · جير",
    },
  },
  philosophy: {
    en: {
      eyebrow: "Our nature",
      heading: "Live a slow, natural life. We make the things that hold it.",
      p1: "Plexus grows from a simple belief: the objects around you should be honest, tactile, and alive. Solid wood, stone, copper, limewash — materials that age into something better.",
      p2: "Every piece is shaped by hand in Amman, chosen for its grain, and built to outlive trends — and us.",
      caption: "Arbutus — copper bark, the colour we build around.",
    },
    ar: {
      eyebrow: "طبيعتنا",
      heading: "عِش حياةً هادئة وطبيعية. ونحن نصنع ما يحتضنها.",
      p1: "ينبع بليكسس من قناعة بسيطة: الأشياء من حولك ينبغي أن تكون صادقة، ملموسة، وحيّة. خشب صلب، حجر، نحاس، جير — موادّ تزداد جمالًا مع مرور الزمن.",
      p2: "كل قطعة تُشكَّل يدويًا في عمّان، وتُنتقى لعروقها، وتُصنع لتعيش أطول من الموضات — وأطول منّا.",
      caption: "القَطلَب — لحاؤه النحاسي، اللون الذي نبني حوله.",
    },
  },
  work: {
    en: {
      eyebrow: "Furniture & objects",
      heading: "Made to be lived with.",
      cta: "See the full collection",
      items: [
        { name: "Climber's Hangboard", material: "CNC-carved solid maple" },
        { name: "Reclaimed Pallet Bench", material: "Laminated reclaimed pine, steel legs" },
        { name: "Oak Dining Table", material: "Solid oak, hand-finished" },
        { name: "Radiator Cover & Shelves", material: "Dark-stained pine, fitted install" },
        { name: "Object Console", material: "Solid oak" },
        { name: "Side Table", material: "Solid oak" },
        { name: "Branch Rack", material: "Found wood, hand-finished" },
        { name: "Cabinet Bar", material: "Oak, brass-lit" },
      ],
    },
    ar: {
      eyebrow: "أثاث وقطع",
      heading: "صُنعت لتُعاش.",
      cta: "شاهد المجموعة كاملة",
      items: [
        { name: "لوح تسلّق", material: "قيقب صلب محفور CNC" },
        { name: "مقعد من خشب مستصلَح", material: "صنوبر مستصلَح مصفّح، أرجل فولاذ" },
        { name: "طاولة طعام بلوط", material: "بلوط صلب، تشطيب يدوي" },
        { name: "غطاء مدفأة ورفوف", material: "صنوبر داكن، تركيب مُفصّل" },
        { name: "كونسول", material: "بلوط صلب" },
        { name: "طاولة جانبية", material: "بلوط صلب" },
        { name: "علّاقة الغصن", material: "خشب طبيعي، يُصقل يدويًا" },
        { name: "خزانة بار", material: "بلوط بإضاءة نحاسية" },
      ],
    },
  },
  custom: {
    en: {
      eyebrow: "The Plexus Studio — first of its kind",
      heading: "Send a photo. See it in 3D. Hold it in wood.",
      sub: "Our studio turns your idea — a sketch, a photo, a thing you saw in a dream — into a textured 3D model you can spin, refine, and approve. Then we hand-carve it in solid wood. No other workshop does this.",
      steps: [
        { n: "01", title: "Show us", body: "Upload a photo, or describe the piece in your own words." },
        { n: "02", title: "See it", body: "Watch it become a real-time 3D model. Turn it, tweak it, make it yours." },
        { n: "03", title: "Hold it", body: "We hand-make the approved design in solid wood, in Amman." },
      ],
      cta: "Try the studio",
    },
    ar: {
      eyebrow: "استوديو بليكسس — الأول من نوعه",
      heading: "أرسل صورة. شاهدها ثلاثية الأبعاد. اقتنِها خشبًا.",
      sub: "يحوّل استوديونا فكرتك — رسمًا، صورة، أو شيئًا رأيته في حلم — إلى نموذج ثلاثي الأبعاد بملمسٍ واقعي يمكنك تدويره وتعديله واعتماده. ثم ننحته يدويًا من خشب صلب. لا ورشة أخرى تفعل هذا.",
      steps: [
        { n: "01", title: "أرِنا", body: "ارفع صورة، أو صِف القطعة بكلماتك الخاصة." },
        { n: "02", title: "شاهدها", body: "راقبها تتحوّل إلى نموذج ثلاثي الأبعاد لحظيًا. أدِرها، عدّلها، اجعلها لك." },
        { n: "03", title: "اقتنِها", body: "نصنع التصميم المعتمد يدويًا من خشب صلب، في عمّان." },
      ],
      cta: "جرّب الاستوديو",
    },
  },
  research: {
    en: {
      eyebrow: "Wood research & engineering",
      heading: "We understand timber before we shape it.",
      intro: "Plexus is led by a timber-industry engineer trained at the University of Sopron, Hungary — one of the world's oldest schools of forestry and wood science. Alongside the furniture, we offer the technical side of wood:",
      services: [
        { term: "Wood testing", desc: "moisture, density, strength and durability." },
        { term: "Sample testing & grading", desc: "species identification and quality classification." },
        { term: "Prototype creation", desc: "turning concepts into tested, buildable pieces." },
        { term: "Material research", desc: "choosing and engineering the right timber for the job." },
      ],
      closing: "Trained at Sopron. Built for the long life of wood.",
      link: "Discuss a project",
    },
    ar: {
      eyebrow: "أبحاث وهندسة الأخشاب",
      heading: "نفهم الخشب قبل أن نُشكّله.",
      intro: "يقود بليكسس مهندس في صناعة الأخشاب تدرّب في جامعة شوبرون بالمجر — إحدى أعرق مدارس علوم الغابات والأخشاب في العالم. وإلى جانب الأثاث، نقدّم الجانب التقني للخشب:",
      services: [
        { term: "فحص الأخشاب", desc: "الرطوبة، الكثافة، المتانة، والديمومة." },
        { term: "فحص العيّنات وتصنيفها", desc: "تحديد النوع وتصنيف الجودة." },
        { term: "صناعة النماذج الأولية", desc: "تحويل الأفكار إلى قطع مُختبَرة قابلة للتنفيذ." },
        { term: "أبحاث المواد", desc: "اختيار وهندسة الخشب المناسب للمهمة." },
      ],
      closing: "تدرّب في شوبرون. مبنيّ لعُمر الخشب الطويل.",
      link: "ناقش مشروعك",
    },
  },
  craft: {
    en: {
      eyebrow: "The craft",
      statement: "Raw timber becomes furniture meant to outlive us.",
      overlay: "Mortise and tenon. No shortcuts.",
      steps: [
        { n: "01", title: "Chosen", body: "Timber selected for grain, moisture and character." },
        { n: "02", title: "Cut", body: "Joinery cut and fitted by hand on the bench in Amman." },
        { n: "03", title: "Finished", body: "Oiled and waxed by hand — natural, food-safe, made to be touched." },
      ],
    },
    ar: {
      eyebrow: "الحِرفة",
      statement: "الخشب الخام يصير أثاثًا يعيش أطول منّا.",
      overlay: "نقر ولسان. دون اختصارات.",
      steps: [
        { n: "01", title: "مُختار", body: "خشب يُنتقى لعروقه ورطوبته وطبعه." },
        { n: "02", title: "مقطوع", body: "وصلات تُقطع وتُركّب يدويًا على طاولة العمل في عمّان." },
        { n: "03", title: "مُنجَز", body: "يُزيّت ويُشمّع يدويًا — طبيعي، آمن للطعام، صُنع ليُلمَس." },
      ],
    },
  },
  contact: {
    en: {
      eyebrow: "Commissions",
      heading: "Bring us something to make.",
      p: "One chair or a whole room, a tested prototype or a sculptural object — tell us what you're imagining. We reply personally.",
      button: "Message us on WhatsApp",
      whatsappMsg: "Hi Plexus, I'd like to talk about a piece.",
      phone: "Phone",
      email: "Email",
      instagram: "Instagram",
      workshop: "Workshop",
    },
    ar: {
      eyebrow: "طلبات خاصة",
      heading: "أحضِر لنا شيئًا لنصنعه.",
      p: "كرسيّ واحد أو غرفة كاملة، نموذج مُختبَر أو قطعة نحتية — أخبِرنا بما تتخيّله. نردّ عليك شخصيًا.",
      button: "راسِلنا على واتساب",
      whatsappMsg: "مرحبًا بليكسس، أودّ التحدّث بشأن قطعة.",
      phone: "هاتف",
      email: "بريد",
      instagram: "إنستغرام",
      workshop: "الورشة",
    },
  },
  about: {
    en: {
      eyebrow: "The Workshop",
      h1: "Made by hand, understood by science.",
      lead: "Plexus is a wood workshop in Amman, Jordan — where furniture and sculptural objects are shaped by hand from solid timber, stone, copper and limewash. We make things meant to age well and outlive us.",
      makerEyebrow: "The maker",
      makerHeading: "Trained at Sopron.",
      makerBody: "Plexus is led by a timber-industry engineer trained at the University of Sopron, Hungary — one of the world's oldest schools of forestry and wood science. That training sits behind everything we make: we choose, test and understand timber before a single cut.",
      doEyebrow: "What we do",
      track1Heading: "Furniture & objects",
      track1Body: "Bespoke furniture and sculptural pieces in solid wood — and a first-of-its-kind studio that turns your photo into a 3D model, then into a real, hand-carved piece.",
      track2Heading: "Wood research & engineering",
      track2Body: "Wood testing, sample testing & grading, prototype creation, and material research — the technical side of timber, for makers and projects that need it.",
      marks: "Trained at Sopron · Made in Amman · Solid wood, by hand",
      contactEyebrow: "Say hello",
      contactHeading: "Bring us something to make.",
      whatsappMsg: "Hi Plexus, I'd like to talk about a piece.",
    },
    ar: {
      eyebrow: "الورشة",
      h1: "يُصنع باليد، ويُفهم بالعِلم.",
      lead: "بليكسس ورشة أخشاب في عمّان، الأردن — حيث تُشكَّل قطع الأثاث والقطع النحتية يدويًا من خشب صلب وحجر ونحاس وجير. نصنع أشياء تتعتّق بجمال وتعيش أطول منّا.",
      makerEyebrow: "الصانع",
      makerHeading: "تدرّب في شوبرون.",
      makerBody: "يقود بليكسس مهندس في صناعة الأخشاب تدرّب في جامعة شوبرون بالمجر — إحدى أعرق مدارس علوم الغابات والأخشاب في العالم. هذا التكوين يقف خلف كل ما نصنعه: نختار الخشب ونفحصه ونفهمه قبل أوّل قطع.",
      doEyebrow: "ماذا نقدّم",
      track1Heading: "أثاث وقطع",
      track1Body: "أثاث وقطع نحتية حسب الطلب من خشب صلب — واستوديو هو الأول من نوعه يحوّل صورتك إلى نموذج ثلاثي الأبعاد، ثم إلى قطعة حقيقية منحوتة باليد.",
      track2Heading: "أبحاث وهندسة الأخشاب",
      track2Body: "فحص الأخشاب، فحص العيّنات وتصنيفها، صناعة النماذج، وأبحاث المواد — الجانب التقني للخشب، للصُنّاع والمشاريع التي تحتاجه.",
      marks: "تدرّب في شوبرون · صُنع في عمّان · خشب صلب، باليد",
      contactEyebrow: "تواصل معنا",
      contactHeading: "أحضِر لنا شيئًا لنصنعه.",
      whatsappMsg: "مرحبًا بليكسس، أودّ التحدّث بشأن قطعة.",
    },
  },
} satisfies Record<string, L<unknown>>;
