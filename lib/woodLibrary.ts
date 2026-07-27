// Plexus Workshop — The Wood Library
// A bilingual (EN/AR) wood-education reference, hand-authored by a
// Sopron-trained timber-industry engineer. All data is hand-written —
// no external imports — so the section renders even with no CMS/network.
//
// Two kinds of content live here:
//   - Explainer  : a longer teaching article (Hardwood vs Softwood, Engineered wood)
//   - WoodEntry  : one wood / sheet material (oak, walnut, plywood, MDF, …)
//
// Sanity can later supplement/override this via lib/woodCatalogue.ts.

export type WoodCategoryKey = "hardwood" | "softwood" | "engineered";

/** A single fact row. Numbers (hardness, density) are universal, so value_ar
 *  is optional — when omitted the English value is shown in both languages. */
export type Fact = {
  label: string;
  label_ar: string;
  value: string;
  value_ar?: string;
};

export type WoodEntry = {
  slug: string;
  category: WoodCategoryKey;
  name: string;
  name_ar: string;
  /** Local Jordanian trade name, where it differs (e.g. "أبلكاش", "لاتيه"). */
  localName_ar?: string;
  /** Botanical / Latin name, for solid woods. */
  botanical?: string;
  /** Image under /public/wood-library/ — falls back gracefully if missing. */
  image: string;
  /** One short descriptor shown on the card (e.g. "Hard · stable"). */
  tagline: string;
  tagline_ar: string;
  /** 1–2 sentence overview. */
  intro: string;
  intro_ar: string;
  facts: Fact[];
  uses: string[];
  uses_ar: string[];
  watchOut: string;
  watchOut_ar: string;
  /** The engineer's personal take — the part no competitor can copy. */
  notes: string;
  notes_ar: string;
};

export type ExplainerSection = {
  heading: string;
  heading_ar: string;
  body: string;
  body_ar: string;
};

export type Explainer = {
  slug: string;
  title: string;
  title_ar: string;
  image: string;
  /** Short summary for the card + meta description. */
  summary: string;
  summary_ar: string;
  sections: ExplainerSection[];
};

/** A dated journal article — same shape as an Explainer plus a date.
 *  Data lives in content/wood-articles/*.json (see lib/woodArticles.ts);
 *  the type lives here so client components can import it without fs. */
export type WoodArticle = Explainer & {
  /** ISO date, e.g. "2026-07-27". Newest first on the index. */
  date: string;
};

// ───────────────────────────────────────────────────────────────────────────
// EXPLAINERS
// ───────────────────────────────────────────────────────────────────────────

export const explainers: Explainer[] = [
  {
    slug: "hardwood-vs-softwood",
    title: "Hardwood vs Softwood — the difference everyone gets wrong",
    title_ar: "الخشب الصلب مقابل الخشب اللين — الفرق الذي يخطئ فيه الجميع",
    image: "/wood-library/explainer-hardwood-softwood.jpg",
    summary:
      "It is not about how hard the wood feels. It is about the tree. Here is what really separates hardwood from softwood — and which to choose for a home in Jordan.",
    summary_ar:
      "الأمر لا يتعلق بمدى صلابة الخشب عند لمسه، بل بنوع الشجرة. إليك ما يفرّق فعلاً بين الخشب الصلب واللين — وأيّهما تختار لبيتك في الأردن.",
    sections: [
      {
        heading: "It is about the tree, not the hardness",
        heading_ar: "الأمر يتعلق بالشجرة، لا بالصلابة",
        body: "The names mislead almost everyone. \"Hardwood\" and \"softwood\" do not describe how hard the wood is — they describe the tree it came from. Hardwoods come from broadleaf trees that drop their leaves (oak, walnut, beech, ash). Softwoods come from conifers — evergreens with needles and cones (pine, spruce, cedar). It is a botanical label, not a hardness test.",
        body_ar: "الاسم يخدع الجميع تقريباً. \"الصلب\" و\"اللين\" لا يصفان مدى صلابة الخشب، بل يصفان نوع الشجرة التي أتى منها. الخشب الصلب يأتي من الأشجار عريضة الأوراق التي تتساقط أوراقها (البلوط، الجوز، الزان، الدردار). أما اللين فيأتي من الأشجار الصنوبرية دائمة الخضرة ذات الإبر والمخاريط (الصنوبر، التنوب، الأرز). إنه تصنيف نباتي، وليس اختبار صلابة.",
      },
      {
        heading: "The exception that proves it",
        heading_ar: "الاستثناء الذي يثبت القاعدة",
        body: "Balsa wood — the lightest, softest wood you can buy, the one used in model planes — is technically a hardwood. Yew, hard and springy enough that medieval bows were carved from it, is a softwood. So the label tells you the botany, not the strength. That is exactly why a real wood library lists the actual numbers instead.",
        body_ar: "خشب البلسا — أخفّ وأطرى خشب يمكن شراؤه، المستخدم في نماذج الطائرات — هو نباتياً خشب صلب. أما خشب الطقسوس، الصلب والمرن لدرجة أن الأقواس في العصور الوسطى كانت تُنحت منه، فهو خشب لين. إذاً الاسم يخبرك بالتصنيف النباتي لا بالقوة. ولهذا السبب بالذات تذكر مكتبة الأخشاب الحقيقية الأرقام الفعلية بدلاً من ذلك.",
      },
      {
        heading: "What actually matters for your furniture",
        heading_ar: "ما يهمّ فعلاً لأثاثك",
        body: "Four properties decide how a wood behaves: density (heavier usually means tougher and longer-lasting), Janka hardness (resistance to dents and scratches), dimensional stability (how much it swells and shrinks with humidity), and grain (its look and how it works under a tool). When someone tells you a wood is \"good\", ask which of these they mean — they rarely point the same way.",
        body_ar: "أربع خصائص تحدد سلوك الخشب: الكثافة (الأثقل عادةً أمتن وأطول عمراً)، صلابة جانكا (مقاومة الخدوش والنقر)، الثبات البُعدي (مقدار تمدّده وانكماشه مع الرطوبة)، والعروق (مظهره وكيفية تشغيله تحت الأداة). عندما يقول لك أحدهم إن خشباً ما \"جيد\"، اسأله أيّ خاصية يقصد — فهي نادراً ما تشير إلى الاتجاه نفسه.",
      },
      {
        heading: "Which should you choose in Jordan?",
        heading_ar: "أيّهما تختار في الأردن؟",
        body: "For furniture meant to last generations and take daily wear — dining tables, chairs, floors — choose a hardwood like oak, walnut or beech. For lighter, cheaper, paint-grade work, or anything outdoors, a softwood like pine or naturally weather-resistant cedar makes sense. One local truth: Jordan's dry summers and sharp humidity swings make solid wood move. A good maker acclimatises the timber and designs the joinery to let it breathe — which is half of why solid-wood furniture either lasts or cracks.",
        body_ar: "للأثاث الذي يُراد له أن يدوم لأجيال ويتحمّل الاستخدام اليومي — طاولات الطعام، الكراسي، الأرضيات — اختر خشباً صلباً كالبلوط أو الجوز أو الزان. أما للأعمال الأخفّ والأرخص أو المُعدّة للدهان، أو لأي شيء خارجي، فالخشب اللين كالصنوبر أو الأرز المقاوم للعوامل الجوية بطبيعته هو الخيار المنطقي. وحقيقة محلية واحدة: صيف الأردن الجاف وتقلّبات الرطوبة الحادة تجعل الخشب الطبيعي يتحرّك. الصانع الجيد يُؤقلم الخشب ويصمّم الوصلات لتترك له مجالاً للتنفّس — وهذا نصف السبب في أن أثاث الخشب الطبيعي إمّا يدوم أو يتشقّق.",
      },
    ],
  },
  {
    slug: "engineered-wood-explained",
    title: "Engineered wood, explained — plywood, latte, MDF & HDF",
    title_ar: "الأخشاب المصنّعة بوضوح — أبلكاش، لاتيه، MDF وHDF",
    image: "/wood-library/explainer-engineered.jpg",
    summary:
      "أبلكاش، لاتيه, MDF, HDF — you hear these words at every carpenter, but what are you really paying for? A plain-language guide to engineered wood and where each one is the smart choice.",
    summary_ar:
      "أبلكاش، لاتيه، MDF، HDF — تسمع هذه الكلمات عند كل نجّار، لكن ما الذي تدفع ثمنه فعلاً؟ دليل بلغة بسيطة للأخشاب المصنّعة وأين يكون كلٌّ منها الخيار الذكي.",
    sections: [
      {
        heading: "Why engineered wood exists",
        heading_ar: "لماذا وُجدت الأخشاب المصنّعة",
        body: "Solid wood is beautiful but it moves, it warps, it is limited in width, and a wide solid board is expensive. Engineered boards were invented to fix exactly that: by breaking wood down into veneers, strips or fibres and gluing it back together, you get large, flat, stable sheets at a fraction of the cost — and far more predictable behaviour. They are not \"fake wood\". They are wood, re-engineered for a specific job.",
        body_ar: "الخشب الطبيعي جميل لكنه يتحرّك ويتقوّس ومحدود العرض، واللوح الطبيعي العريض باهظ الثمن. وُجدت الألواح المصنّعة لحلّ هذا بالضبط: بتفكيك الخشب إلى قشور أو شرائح أو ألياف ثم لصقها من جديد، تحصل على ألواح كبيرة ومستوية وثابتة بجزء بسيط من الكلفة — وبسلوك أكثر قابلية للتنبؤ. إنها ليست \"خشباً مزيّفاً\"، بل خشب أُعيدت هندسته لمهمّة محدّدة.",
      },
      {
        heading: "Plywood (أبلكاش) — strong and light",
        heading_ar: "أبلكاش — قوي وخفيف",
        body: "Plywood is built from thin layers of real wood veneer glued with their grain crossing at right angles, layer over layer. That cross-grain trick is what makes it so strong and stable for its weight — it resists splitting and barely moves. It is the workhorse for cabinets, drawer boxes, curved forms and structural work. Buy by grade: cheap plywood can hide voids inside; marine and birch plywood are the premium end.",
        body_ar: "الأبلكاش مصنوع من طبقات رقيقة من قشرة الخشب الحقيقي تُلصق بحيث تتقاطع عروقها بزوايا قائمة، طبقة فوق طبقة. حيلة تعاكُس العروق هذه هي ما يمنحه قوته وثباته العاليين بالنسبة لوزنه — يقاوم الانشقاق ولا يكاد يتحرّك. وهو حصان العمل للخزائن وصناديق الأدراج والأشكال المنحنية والأعمال الإنشائية. اشترِه حسب الجودة: الأبلكاش الرخيص قد يخفي فجوات داخله، أما أبلكاش البحري والبتولا فهما الفئة الفاخرة.",
      },
      {
        heading: "Blockboard / Latte (لاتيه) — rigid for long spans",
        heading_ar: "لاتيه — صلابة للمسافات الطويلة",
        body: "Blockboard has a core of solid wood strips standing side by side, sandwiched between two veneers. That core makes it light yet very rigid along its length, so it resists sagging — which is why it is the classic choice for long shelves, doors, and table tops. Its weakness is the edge: the strip ends do not hold screws or fine edge detail as well as plywood, so edges are usually banded or framed.",
        body_ar: "اللاتيه له قلب من شرائح خشب طبيعي متجاورة، محصور بين قشرتين. هذا القلب يجعله خفيفاً ومع ذلك صلباً جداً على طوله، فيقاوم التهدّل — ولهذا فهو الخيار الكلاسيكي للرفوف الطويلة والأبواب وأسطح الطاولات. ضعفه في الحافة: نهايات الشرائح لا تمسك البراغي أو التفاصيل الدقيقة كالأبلكاش، لذا تُغلّف الحواف أو تُؤطّر عادةً.",
      },
      {
        heading: "MDF & HDF — smooth, for paint and detail",
        heading_ar: "MDF وHDF — ناعمان، للدهان والتفاصيل",
        body: "MDF (medium-density fibreboard) is wood ground to fine fibre and pressed with resin into a perfectly smooth, grain-free board. It has no direction, so it routes and CNC-carves into crisp detail and takes paint like glass — the go-to for painted doors, panelling and shaped work. HDF is the same idea pressed denser and harder; it is what sits under laminate flooring and inside moulded door skins. Both are heavy, both hold screws poorly on the edge, and both must be kept dry.",
        body_ar: "الـ MDF (لوح ليفي متوسط الكثافة) هو خشب مطحون إلى ألياف دقيقة ومكبوس بالراتنج إلى لوح أملس تماماً وخالٍ من العروق. لا اتجاه له، لذا يُفرَز ويُنحت على الـ CNC بتفاصيل حادّة ويتقبّل الدهان كالزجاج — وهو الخيار الأول للأبواب المدهونة والتكسيات والأعمال المشكّلة. أما الـ HDF فهو الفكرة نفسها مكبوسة بكثافة وصلابة أعلى؛ وهو ما يوجد تحت أرضيات اللامينيت وداخل قشور الأبواب المصبوبة. كلاهما ثقيل، وكلاهما يمسك البراغي بضعف عند الحافة، وكلاهما يجب أن يبقى جافاً.",
      },
      {
        heading: "Chipboard (خشب مضغوط) — cheapest, know its limits",
        heading_ar: "الخشب المضغوط — الأرخص، اعرف حدوده",
        body: "Chipboard (particle board) is wood chips and sawdust bound with glue — the cheapest board there is. Wrapped in melamine it becomes the white/wood-look flat-pack furniture everyone owns. Used dry, flat and well-supported it is perfectly fine. But it is weak, holds screws poorly, and the moment water gets in it swells permanently and never recovers. Never put it under a sink.",
        body_ar: "الخشب المضغوط (لوح الحبيبات) هو رقائق خشب ونشارة مربوطة بالغراء — أرخص الألواح على الإطلاق. وعند تغليفه بالميلامين يصبح أثاث الفلات-باك بمظهر الأبيض أو الخشب الذي يملكه الجميع. واستخدامه جافاً ومستوياً ومدعوماً جيداً لا بأس به إطلاقاً. لكنه ضعيف، يمسك البراغي بضعف، وفي اللحظة التي يدخله الماء ينتفخ بشكل دائم ولا يتعافى أبداً. لا تضعه تحت المغسلة أبداً.",
      },
      {
        heading: "The honest rule",
        heading_ar: "القاعدة الصادقة",
        body: "There is no \"best\" board — only the right board for the job. Plywood when you need strength and screw-holding; blockboard for long rigid spans; MDF for smooth painted detail; HDF for hard wearing surfaces; chipboard for cheap, dry, flat work. And one enemy unites them all: moisture. Seal the edges, keep them dry, and engineered wood will outlast your expectations.",
        body_ar: "لا يوجد لوح \"أفضل\" — بل اللوح المناسب للمهمّة فقط. الأبلكاش حين تحتاج القوة وإمساك البراغي؛ واللاتيه للمسافات الطويلة الصلبة؛ والـ MDF للتفاصيل المدهونة الناعمة؛ والـ HDF للأسطح عالية التحمّل؛ والمضغوط للأعمال الرخيصة الجافة المستوية. وعدوّ واحد يجمعها كلها: الرطوبة. اعزل الحواف وأبقِها جافة، وستعيش الأخشاب المصنّعة أطول ممّا تتوقّع.",
      },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────
// WOOD ENTRIES
// ───────────────────────────────────────────────────────────────────────────

export const woodEntries: WoodEntry[] = [
  // ── HARDWOODS ──────────────────────────────────────────────────────────
  {
    slug: "oak",
    category: "hardwood",
    name: "Oak",
    name_ar: "البلوط",
    botanical: "Quercus",
    image: "/wood-library/oak.jpg",
    tagline: "Hard · open grain · classic",
    tagline_ar: "صلب · عروق مفتوحة · كلاسيكي",
    intro:
      "The benchmark hardwood — strong, hard-wearing and instantly recognisable by its bold open grain. Oak has built furniture, floors and ships for a thousand years for one reason: it lasts.",
    intro_ar:
      "الخشب الصلب المرجعي — قوي، يتحمّل الاستعمال، ويُعرف فوراً من عروقه المفتوحة الجريئة. بنى البلوط الأثاث والأرضيات والسفن لألف عام لسبب واحد: إنه يدوم.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~1,350 lbf", value_ar: "~1,350 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~700 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Moderate", value_ar: "متوسط" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Good", value_ar: "جيدة" },
    ],
    uses: ["Dining tables & chairs", "Flooring", "Cabinets & joinery", "Staircases"],
    uses_ar: ["طاولات وكراسي الطعام", "الأرضيات", "الخزائن والنجارة", "الأدراج"],
    watchOut:
      "Its high tannin content reacts with iron and water to leave black stains — keep steel away from damp oak, and use the right fixings.",
    watchOut_ar:
      "محتواه العالي من التانين يتفاعل مع الحديد والماء فيترك بقعاً سوداء — أبعد الفولاذ عن البلوط الرطب، واستخدم التثبيتات المناسبة.",
    notes:
      "If a client is unsure, I often start them on oak. It forgives daily life, it ages with dignity, and white oak in particular handles Jordan's humidity swings better than most. The open grain is part of its character — fill it for a glassy finish, or leave it for an honest, tactile surface.",
    notes_ar:
      "إذا كان العميل متردداً، أبدأ به غالباً على البلوط. يسامح الحياة اليومية، يتقدّم في العمر بكرامة، والبلوط الأبيض تحديداً يتحمّل تقلّبات رطوبة الأردن أفضل من معظم الأخشاب. عروقه المفتوحة جزء من شخصيته — املأها لتشطيب زجاجي، أو اتركها لسطح صادق ملموس.",
  },
  {
    slug: "walnut",
    category: "hardwood",
    name: "Walnut",
    name_ar: "الجوز",
    botanical: "Juglans",
    image: "/wood-library/walnut.jpg",
    tagline: "Rich · stable · premium",
    tagline_ar: "غني · ثابت · فاخر",
    intro:
      "The luxury hardwood. Deep chocolate-brown with flowing grain, walnut is prized for fine furniture — and it happens to be one of the most stable and pleasant woods to work.",
    intro_ar:
      "خشب الفخامة. بلونه البنّي الشوكولاتي العميق وعروقه المتدفّقة، يُثمَّن الجوز للأثاث الراقي — وهو صدفةً من أكثر الأخشاب ثباتاً ومتعةً في التشغيل.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~1,010 lbf", value_ar: "~1,010 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~640 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Excellent", value_ar: "ممتاز" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Excellent", value_ar: "ممتازة" },
    ],
    uses: ["Heirloom furniture", "Tabletops & desks", "Carving & detail work", "Veneer"],
    uses_ar: ["أثاث يُورَّث", "أسطح الطاولات والمكاتب", "النحت والأعمال الدقيقة", "القشرة"],
    watchOut:
      "Real walnut is costly and its colour can lighten under strong sunlight over years — beware cheaper woods stained to imitate it.",
    watchOut_ar:
      "الجوز الحقيقي مكلف ولونه قد يفتح تحت أشعة الشمس القوية عبر السنين — احذر الأخشاب الأرخص المصبوغة لتقليده.",
    notes:
      "Walnut is the wood I reach for when a piece needs to feel special. It cuts like butter, takes a finish beautifully, and stays put through seasons — exactly what you want for a table you will keep for life. It earns its price.",
    notes_ar:
      "الجوز هو الخشب الذي ألجأ إليه حين تحتاج القطعة أن تبدو مميزة. يُقطَع كالزبدة، يتقبّل التشطيب بجمال، ويبقى ثابتاً عبر الفصول — تماماً ما تريده لطاولة ستحتفظ بها مدى الحياة. إنه يستحقّ ثمنه.",
  },
  {
    slug: "beech",
    category: "hardwood",
    name: "Beech",
    name_ar: "الزان",
    botanical: "Fagus",
    image: "/wood-library/beech.jpg",
    tagline: "Hard · pale · workhorse",
    tagline_ar: "صلب · فاتح · عملي",
    intro:
      "Pale, fine-grained and very hard, beech is the dependable workhorse of European furniture — strong, affordable, and excellent for steam-bending into curves.",
    intro_ar:
      "فاتح اللون، ناعم العروق وصلب جداً، الزان هو حصان العمل الموثوق في الأثاث الأوروبي — قوي، اقتصادي، وممتاز للثني بالبخار إلى منحنيات.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~1,300 lbf", value_ar: "~1,300 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~720 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Low — moves a lot", value_ar: "منخفض — يتحرّك كثيراً" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Good", value_ar: "جيدة" },
    ],
    uses: ["Chairs & stools", "Bent / curved parts", "Toys & kitchenware", "Workbenches"],
    uses_ar: ["الكراسي والمقاعد", "الأجزاء المنحنية", "الألعاب وأدوات المطبخ", "طاولات العمل"],
    watchOut:
      "Beech is restless — it swells and shrinks more than most woods with humidity, so it needs dry, stable conditions and sound construction.",
    watchOut_ar:
      "الزان قلِق — يتمدّد وينكمش مع الرطوبة أكثر من معظم الأخشاب، لذا يحتاج إلى ظروف جافة ثابتة وبناء سليم.",
    notes:
      "Beech gives you hardwood strength without hardwood prices, which is why so many classic chairs are made from it. Just respect its movement: I keep it for interior pieces in controlled rooms, never somewhere damp or sun-baked.",
    notes_ar:
      "يمنحك الزان قوة الخشب الصلب دون أسعاره، ولهذا يُصنع منه كثير من الكراسي الكلاسيكية. فقط احترم حركته: أبقيه للقطع الداخلية في غرف مضبوطة، لا في مكان رطب أو تحرقه الشمس.",
  },
  {
    slug: "ash",
    category: "hardwood",
    name: "Ash",
    name_ar: "الدردار",
    botanical: "Fraxinus",
    image: "/wood-library/ash.jpg",
    tagline: "Tough · springy · bold grain",
    tagline_ar: "متين · مرن · عروق جريئة",
    intro:
      "Tough and elastic with a bold straight grain, ash is the wood behind tool handles, sports gear and bentwood furniture — it absorbs shock without breaking.",
    intro_ar:
      "متين ومرن بعروق مستقيمة جريئة، الدردار هو الخشب وراء مقابض الأدوات والمعدات الرياضية وأثاث الخشب المثني — يمتصّ الصدمات دون أن يكسر.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~1,320 lbf", value_ar: "~1,320 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~670 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Moderate", value_ar: "متوسط" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Good · bends well", value_ar: "جيدة · ينثني جيداً" },
    ],
    uses: ["Tool & axe handles", "Chairs & frames", "Steam-bent forms", "Flooring"],
    uses_ar: ["مقابض الأدوات والفؤوس", "الكراسي والهياكل", "الأشكال المثنية بالبخار", "الأرضيات"],
    watchOut:
      "Ash is not naturally durable outdoors and is prized by wood-boring insects — keep it indoors and finished.",
    watchOut_ar:
      "الدردار ليس متيناً بطبيعته في الخارج وتفضّله الحشرات الحفّارة — أبقِه داخلياً ومُشطَّباً.",
    notes:
      "I love ash for anything that has to flex and survive — its springy toughness is unique. It also looks a lot like oak at a friendlier price, with a cleaner, more uniform grain that photographs beautifully.",
    notes_ar:
      "أحبّ الدردار لأي شيء عليه أن ينثني وينجو — متانته المرنة فريدة. كما أنه يشبه البلوط كثيراً بسعر ألطف، بعروق أنظف وأكثر انتظاماً تظهر جميلة في الصور.",
  },
  {
    slug: "cherry",
    category: "hardwood",
    name: "Cherry",
    name_ar: "الكرز",
    botanical: "Prunus",
    image: "/wood-library/cherry.jpg",
    tagline: "Warm · smooth · ages richly",
    tagline_ar: "دافئ · ناعم · يتعتّق بغنى",
    intro:
      "A refined, satiny hardwood that starts pinkish-brown and deepens to a warm reddish glow over years of light. Cherry is a joy to work and a favourite for fine furniture.",
    intro_ar:
      "خشب صلب راقٍ حريري يبدأ بلون بنّي وردي ويتعمّق إلى توهّج أحمر دافئ عبر سنوات من الضوء. الكرز متعة في التشغيل ومفضّل للأثاث الراقي.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~950 lbf", value_ar: "~950 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~560 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Good", value_ar: "جيد" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Excellent", value_ar: "ممتازة" },
    ],
    uses: ["Fine furniture", "Cabinetry", "Turned & carved objects", "Trim & detail"],
    uses_ar: ["الأثاث الراقي", "الخزائن", "الأشياء المخروطة والمنحوتة", "الزخارف والتفاصيل"],
    watchOut:
      "Cherry darkens noticeably with sunlight, so anything left on top (a vase, a book) can leave a permanent lighter patch early on.",
    watchOut_ar:
      "يغمق الكرز بوضوح مع ضوء الشمس، لذا أي شيء يُترك فوقه (مزهرية، كتاب) قد يترك بقعة أفتح دائمة في وقت مبكر.",
    notes:
      "Cherry rewards patience. It looks modest when new, then matures into one of the most beautiful surfaces in woodworking. I tell clients to let it bask evenly in light for the first months so it colours uniformly.",
    notes_ar:
      "الكرز يكافئ الصبر. يبدو متواضعاً وهو جديد، ثم ينضج إلى واحد من أجمل الأسطح في النجارة. أنصح العملاء بتركه يتعرّض للضوء بالتساوي في الأشهر الأولى ليتلوّن بانتظام.",
  },
  {
    slug: "maple",
    category: "hardwood",
    name: "Maple",
    name_ar: "القيقب",
    botanical: "Acer",
    image: "/wood-library/maple.jpg",
    tagline: "Very hard · bright · fine grain",
    tagline_ar: "صلب جداً · ساطع · ناعم العروق",
    intro:
      "Bright, almost white and extremely hard-wearing, hard maple is the surface of bowling lanes and butcher blocks. Its fine, near-invisible grain gives a clean, modern look.",
    intro_ar:
      "ساطع، يكاد يكون أبيض وعالي التحمّل للغاية، القيقب الصلب هو سطح مضامير البولينغ وألواح التقطيع. عروقه الدقيقة شبه الخفيّة تمنح مظهراً نظيفاً عصرياً.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~1,450 lbf", value_ar: "~1,450 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~705 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Moderate", value_ar: "متوسط" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Moderate", value_ar: "متوسطة" },
    ],
    uses: ["Worktops & butcher blocks", "Flooring", "Kitchenware", "Modern furniture"],
    uses_ar: ["أسطح العمل وألواح التقطيع", "الأرضيات", "أدوات المطبخ", "الأثاث العصري"],
    watchOut:
      "Its density makes maple prone to scorching from blades and to blotchy, uneven staining — it asks for sharp tools and a careful finishing schedule.",
    watchOut_ar:
      "كثافته تجعل القيقب عرضةً للاحتراق من الشفرات وللصبغ المتبقّع غير المتساوي — يتطلّب أدوات حادّة وبرنامج تشطيب دقيق.",
    notes:
      "When a client wants a light, crisp, contemporary feel, maple is my answer — it stays pale and clean where oak reads traditional. It is hard on tools and fussy to stain, so we usually keep it natural or near-natural.",
    notes_ar:
      "حين يريد العميل إحساساً فاتحاً نقياً عصرياً، يكون القيقب جوابي — يبقى فاتحاً ونظيفاً حيث يبدو البلوط تقليدياً. إنه قاسٍ على الأدوات وصعب الصبغ، لذا نُبقيه عادةً طبيعياً أو قريباً من الطبيعي.",
  },
  {
    slug: "birch",
    category: "hardwood",
    name: "Birch",
    name_ar: "البتولا",
    botanical: "Betula",
    image: "/wood-library/birch.jpg",
    tagline: "Pale · even · great value",
    tagline_ar: "فاتح · متجانس · قيمة ممتازة",
    intro:
      "A pale, even-grained hardwood that offers a lot of strength for the money. You will meet birch most often as the core of the very best plywood.",
    intro_ar:
      "خشب صلب فاتح متجانس العروق يقدّم قوةً كبيرة مقابل المال. ستلتقي بالبتولا غالباً كقلبٍ لأفضل أنواع الأبلكاش.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~1,260 lbf", value_ar: "~1,260 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~640 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Moderate", value_ar: "متوسط" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Good", value_ar: "جيدة" },
    ],
    uses: ["Premium plywood", "Cabinets & shelving", "Turned objects", "Toys"],
    uses_ar: ["الأبلكاش الفاخر", "الخزائن والرفوف", "الأشياء المخروطة", "الألعاب"],
    watchOut:
      "Birch is not durable outdoors and, like maple, can stain blotchily — it is happiest indoors with a clear or light finish.",
    watchOut_ar:
      "البتولا ليست متينة في الخارج، ومثل القيقب قد تُصبغ بشكل متبقّع — أسعد حالاتها داخلياً بتشطيب شفّاف أو فاتح.",
    notes:
      "Birch is the quiet value pick. Solid birch gives clean, modern furniture at a sensible price, and Baltic birch plywood — all those thin, void-free layers — is some of the finest sheet material we use in the workshop.",
    notes_ar:
      "البتولا هي الخيار الهادئ ذو القيمة. البتولا الصلبة تمنح أثاثاً عصرياً نظيفاً بسعر معقول، وأبلكاش البتولا البلطيقي — بكل تلك الطبقات الرقيقة الخالية من الفجوات — من أجود ألواح الصفائح التي نستخدمها في الورشة.",
  },

  // ── SOFTWOODS ──────────────────────────────────────────────────────────
  {
    slug: "pine",
    category: "softwood",
    name: "Pine",
    name_ar: "الصنوبر",
    botanical: "Pinus",
    image: "/wood-library/pine.jpg",
    tagline: "Light · cheap · easy to work",
    tagline_ar: "خفيف · رخيص · سهل التشغيل",
    intro:
      "The world's most common softwood — light, inexpensive and friendly to work, with a warm honey tone and characterful knots. The natural starting point for affordable and rustic furniture.",
    intro_ar:
      "أكثر الأخشاب اللينة شيوعاً في العالم — خفيف، غير مكلف، وودود في التشغيل، بلون عسلي دافئ وعقد ذات طابع. نقطة الانطلاق الطبيعية للأثاث الاقتصادي والريفي.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~420 lbf", value_ar: "~420 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~430 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Moderate", value_ar: "متوسط" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Very easy", value_ar: "سهلة جداً" },
    ],
    uses: ["Affordable & rustic furniture", "Shelving & framing", "Panelling", "Paint-grade work"],
    uses_ar: ["الأثاث الاقتصادي والريفي", "الرفوف والهياكل", "التكسيات", "الأعمال المُعدّة للدهان"],
    watchOut:
      "Pine dents and scratches easily and its knots can ooze resin and move — it is soft, so treat it as a casual rather than a heirloom wood.",
    watchOut_ar:
      "الصنوبر ينخدش ويُنقَر بسهولة، وعقده قد تُفرز الراتنج وتتحرّك — إنه طري، لذا تعامل معه كخشب عَفَوي لا كخشب يُورَّث.",
    notes:
      "Pine gets unfair scorn. It is honest, sustainable and lovely for relaxed, rustic or painted pieces — and it is the best wood to learn on. Just set expectations: it will pick up the marks of a life lived, which some people love and others do not.",
    notes_ar:
      "يتلقّى الصنوبر ازدراءً غير عادل. إنه صادق ومستدام وجميل للقطع المريحة أو الريفية أو المدهونة — وهو أفضل خشب للتعلّم عليه. فقط اضبط التوقّعات: سيلتقط آثار الحياة المُعاشة، وهو ما يحبّه البعض ولا يحبّه آخرون.",
  },
  {
    slug: "spruce",
    category: "softwood",
    name: "Spruce",
    name_ar: "التنوب",
    botanical: "Picea",
    image: "/wood-library/spruce.jpg",
    tagline: "Light · strong-for-weight",
    tagline_ar: "خفيف · قوي بالنسبة لوزنه",
    intro:
      "Pale, light and remarkably strong for its weight, spruce is the backbone of construction timber — and, chosen carefully, the soundboard of fine guitars and violins.",
    intro_ar:
      "فاتح، خفيف، وقوي بشكل لافت بالنسبة لوزنه، التنوب هو العمود الفقري لأخشاب البناء — وعند اختياره بعناية، لوح الصوت في الغيتارات والكمانات الفاخرة.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~380 lbf", value_ar: "~380 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~430 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Moderate", value_ar: "متوسط" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Easy", value_ar: "سهلة" },
    ],
    uses: ["Construction & framing", "Shelving", "Crates & packaging", "Musical instruments"],
    uses_ar: ["البناء والهياكل", "الرفوف", "الصناديق والتغليف", "الآلات الموسيقية"],
    watchOut:
      "Soft and not naturally weather-resistant — spruce needs protection from moisture and is easily dented, so it is more a structural than a fine-furniture wood.",
    watchOut_ar:
      "طري وغير مقاوم للعوامل الجوية بطبيعته — يحتاج التنوب إلى حماية من الرطوبة ويُنقَر بسهولة، لذا فهو خشب إنشائي أكثر منه خشب أثاث راقٍ.",
    notes:
      "Spruce is all about strength-to-weight. I would not build a dining table from it, but for hidden structure, light frames and anywhere weight matters, it earns its place — and its tight, even grain can be genuinely beautiful.",
    notes_ar:
      "التنوب يدور كله حول نسبة القوة إلى الوزن. لن أبني منه طاولة طعام، لكن للبُنى المخفية والهياكل الخفيفة وأي مكان يهمّ فيه الوزن، فإنه يستحقّ مكانه — وعروقه الضيّقة المتجانسة قد تكون جميلة حقاً.",
  },
  {
    slug: "cedar",
    category: "softwood",
    name: "Cedar",
    name_ar: "الأرز",
    botanical: "Cedrus / Thuja",
    image: "/wood-library/cedar.jpg",
    tagline: "Aromatic · rot-resistant · outdoor",
    tagline_ar: "عطري · مقاوم للتعفّن · خارجي",
    intro:
      "Light, aromatic and naturally resistant to rot and insects, cedar is the softwood of choice for the outdoors — cladding, garden furniture, and the lining of wardrobes and chests.",
    intro_ar:
      "خفيف، عطري، ومقاوم بطبيعته للتعفّن والحشرات، الأرز هو الخشب اللين المفضّل للأماكن الخارجية — التكسيات وأثاث الحدائق وتبطين الخزائن والصناديق.",
    facts: [
      { label: "Janka hardness", label_ar: "صلابة جانكا", value: "~350 lbf", value_ar: "~350 رطل-قوة" },
      { label: "Density", label_ar: "الكثافة", value: "~370 kg/m³" },
      { label: "Stability", label_ar: "الثبات", value: "Very good", value_ar: "جيد جداً" },
      { label: "Workability", label_ar: "سهولة التشغيل", value: "Easy", value_ar: "سهلة" },
    ],
    uses: ["Outdoor & garden furniture", "Cladding & decking", "Wardrobe & chest lining", "Saunas"],
    uses_ar: ["الأثاث الخارجي وأثاث الحدائق", "التكسيات والأسطح الخشبية", "تبطين الخزائن والصناديق", "الساونا"],
    watchOut:
      "Cedar is soft and dents easily, and its natural oils can interfere with some glues and finishes — lovely outdoors, less suited to high-wear surfaces.",
    watchOut_ar:
      "الأرز طري ويُنقَر بسهولة، وزيوته الطبيعية قد تتعارض مع بعض أنواع الغراء والتشطيب — رائع في الخارج، أقل ملاءمةً للأسطح كثيرة الاستعمال.",
    notes:
      "Cedar earns its keep where other woods rot: outdoors and in damp air. Its scent also naturally repels moths, which is why I line drawers and wardrobes with it. Just keep it off surfaces that take a beating — it is soft.",
    notes_ar:
      "يثبت الأرز جدارته حيث تتعفّن الأخشاب الأخرى: في الخارج وفي الهواء الرطب. كما أن رائحته تطرد العثّ طبيعياً، ولهذا أُبطّن به الأدراج والخزائن. فقط أبقِه بعيداً عن الأسطح التي تتعرّض للضرب — فهو طري.",
  },

  // ── ENGINEERED ───────────────────────────────────────────────────────────
  {
    slug: "plywood",
    category: "engineered",
    name: "Plywood",
    name_ar: "أبلكاش",
    localName_ar: "أبلكاش / خشب رقائقي",
    image: "/wood-library/plywood.jpg",
    tagline: "Strong · light · stable",
    tagline_ar: "قوي · خفيف · ثابت",
    intro:
      "Thin layers of real wood veneer glued with their grain crossing at right angles. That cross-grain build makes plywood exceptionally strong and stable for its weight — the all-rounder of engineered boards.",
    intro_ar:
      "طبقات رقيقة من قشرة الخشب الحقيقي تُلصق بتقاطع عروقها بزوايا قائمة. هذا البناء المتعاكس يجعل الأبلكاش قوياً وثابتاً بشكل استثنائي بالنسبة لوزنه — اللوح متعدّد الاستعمالات بين الألواح المصنّعة.",
    facts: [
      { label: "Made of", label_ar: "مصنوع من", value: "Cross-glued wood veneers", value_ar: "قشور خشب ملصقة متعاكسة" },
      { label: "Thicknesses", label_ar: "السماكات", value: "4–25 mm+" },
      { label: "Strength", label_ar: "القوة", value: "High", value_ar: "عالية" },
      { label: "Screw hold (face)", label_ar: "إمساك البراغي (الوجه)", value: "Good", value_ar: "جيد" },
    ],
    uses: ["Cabinets & drawer boxes", "Curved & structural work", "Shelving", "Sub-floors"],
    uses_ar: ["الخزائن وصناديق الأدراج", "الأعمال المنحنية والإنشائية", "الرفوف", "الأرضيات التحتية"],
    watchOut:
      "Quality varies enormously — cheap plywood can hide internal voids and warp. Exposed edges show the layers and need banding; only marine/exterior grades tolerate damp.",
    watchOut_ar:
      "تتفاوت الجودة بشكل هائل — الأبلكاش الرخيص قد يخفي فجوات داخلية ويتقوّس. الحواف المكشوفة تُظهر الطبقات وتحتاج تغليفاً؛ والأنواع البحرية/الخارجية فقط تتحمّل الرطوبة.",
    notes:
      "Good plywood is one of the most useful materials in the workshop — strong, stable and quick. I spend the money on quality sheets (birch ply especially): the cheap stuff with hidden voids will betray you exactly where you can't see it.",
    notes_ar:
      "الأبلكاش الجيد من أكثر المواد فائدةً في الورشة — قوي وثابت وسريع. أدفع ثمن الألواح الجيدة (وخاصة أبلكاش البتولا): الرخيص ذو الفجوات المخفية سيخذلك في المكان الذي لا تراه بالضبط.",
  },
  {
    slug: "blockboard",
    category: "engineered",
    name: "Blockboard (Latte)",
    name_ar: "لاتيه",
    localName_ar: "لاتيه / خشب لاتيه",
    image: "/wood-library/blockboard.jpg",
    tagline: "Rigid · light · long spans",
    tagline_ar: "صلب · خفيف · مسافات طويلة",
    intro:
      "A core of solid wood strips standing side by side, sandwiched between two veneers. The strip core makes blockboard light yet very rigid along its length — the classic choice for long shelves, doors and table tops.",
    intro_ar:
      "قلب من شرائح خشب طبيعي متجاورة، محصور بين قشرتين. قلب الشرائح يجعل اللاتيه خفيفاً ومع ذلك صلباً جداً على طوله — الخيار الكلاسيكي للرفوف الطويلة والأبواب وأسطح الطاولات.",
    facts: [
      { label: "Made of", label_ar: "مصنوع من", value: "Solid-strip core + veneer", value_ar: "قلب شرائح صلبة + قشرة" },
      { label: "Thicknesses", label_ar: "السماكات", value: "16–30 mm" },
      { label: "Rigidity", label_ar: "الصلابة", value: "High (along length)", value_ar: "عالية (على الطول)" },
      { label: "Weight", label_ar: "الوزن", value: "Light", value_ar: "خفيف" },
    ],
    uses: ["Long shelves", "Doors", "Table & desk tops", "Wardrobes"],
    uses_ar: ["الرفوف الطويلة", "الأبواب", "أسطح الطاولات والمكاتب", "خزائن الملابس"],
    watchOut:
      "The edges are its weak point — the strip ends hold screws and fine detail poorly, and cheap boards can have gaps in the core that telegraph through the surface. Edges should be banded or framed.",
    watchOut_ar:
      "الحواف هي نقطة ضعفه — نهايات الشرائح تمسك البراغي والتفاصيل الدقيقة بضعف، والألواح الرخيصة قد تحوي فجوات في القلب تظهر عبر السطح. ينبغي تغليف الحواف أو تأطيرها.",
    notes:
      "When a client needs a long shelf or a door that stays flat and doesn't weigh a ton, blockboard is often the right answer over plywood or solid wood. Just design for its edges — that is where it needs help.",
    notes_ar:
      "حين يحتاج العميل رفّاً طويلاً أو باباً يبقى مستوياً ولا يزن طنّاً، يكون اللاتيه غالباً الجواب الصحيح بدل الأبلكاش أو الخشب الطبيعي. فقط صمّم لحوافّه — فهناك يحتاج المساعدة.",
  },
  {
    slug: "mdf",
    category: "engineered",
    name: "MDF",
    name_ar: "إم دي إف",
    localName_ar: "MDF / لوح ليفي متوسط الكثافة",
    image: "/wood-library/mdf.jpg",
    tagline: "Smooth · grain-free · paint & CNC",
    tagline_ar: "أملس · بلا عروق · للدهان والـ CNC",
    intro:
      "Wood ground to fine fibre and pressed with resin into a perfectly smooth, grain-free board. With no grain and no direction, MDF routes and CNC-carves into crisp detail and takes paint like glass.",
    intro_ar:
      "خشب مطحون إلى ألياف دقيقة ومكبوس بالراتنج إلى لوح أملس تماماً خالٍ من العروق. بلا عروق وبلا اتجاه، يُفرَز الـ MDF ويُنحت على الـ CNC بتفاصيل حادّة ويتقبّل الدهان كالزجاج.",
    facts: [
      { label: "Made of", label_ar: "مصنوع من", value: "Fine wood fibre + resin", value_ar: "ألياف خشب دقيقة + راتنج" },
      { label: "Surface", label_ar: "السطح", value: "Very smooth, no grain", value_ar: "أملس جداً، بلا عروق" },
      { label: "Best for", label_ar: "الأفضل لـ", value: "Paint & routed detail", value_ar: "الدهان والتفاصيل المفروزة" },
      { label: "Weight", label_ar: "الوزن", value: "Heavy", value_ar: "ثقيل" },
    ],
    uses: ["Painted doors & panels", "CNC-cut & routed detail", "Wall panelling", "Speaker boxes"],
    uses_ar: ["الأبواب والألواح المدهونة", "التفاصيل المقطوعة والمفروزة بالـ CNC", "تكسية الجدران", "صناديق السماعات"],
    watchOut:
      "MDF hates water — it swells permanently if it gets wet — holds screws poorly on the edge, and its fine dust needs a proper mask. Never use it anywhere damp.",
    watchOut_ar:
      "الـ MDF يكره الماء — ينتفخ بشكل دائم إذا ابتلّ — يمسك البراغي بضعف عند الحافة، وغباره الناعم يستلزم كمامة مناسبة. لا تستخدمه أبداً في مكان رطب.",
    notes:
      "For anything painted with crisp, modern detail — doors, panelling, shaped fronts — nothing beats MDF for a flawless finish, and it CNC-machines beautifully. But I keep it far from kitchens and bathrooms: one leak and it is finished.",
    notes_ar:
      "لأي شيء مدهون بتفاصيل حادّة عصرية — الأبواب والتكسيات والواجهات المشكّلة — لا شيء يتفوّق على الـ MDF في التشطيب المثالي، وهو يُشغَّل على الـ CNC بجمال. لكنني أُبقيه بعيداً عن المطابخ والحمّامات: تسريب واحد وينتهي أمره.",
  },
  {
    slug: "hdf",
    category: "engineered",
    name: "HDF",
    name_ar: "إتش دي إف",
    localName_ar: "HDF / لوح ليفي عالي الكثافة",
    image: "/wood-library/hdf.jpg",
    tagline: "Denser · harder · hard-wearing",
    tagline_ar: "أكثف · أصلب · عالي التحمّل",
    intro:
      "The same fibre idea as MDF, but pressed far denser and harder. HDF is the tough, smooth board hiding under laminate flooring and inside moulded door skins, where surfaces must take wear.",
    intro_ar:
      "الفكرة الليفية نفسها كالـ MDF، لكن مكبوسة بكثافة وصلابة أعلى بكثير. الـ HDF هو اللوح المتين الأملس المختبئ تحت أرضيات اللامينيت وداخل قشور الأبواب المصبوبة، حيث يجب أن تتحمّل الأسطح الاستعمال.",
    facts: [
      { label: "Made of", label_ar: "مصنوع من", value: "Dense wood fibre + resin", value_ar: "ألياف خشب كثيفة + راتنج" },
      { label: "Density", label_ar: "الكثافة", value: "Higher than MDF", value_ar: "أعلى من الـ MDF" },
      { label: "Surface", label_ar: "السطح", value: "Hard & very smooth", value_ar: "صلب وأملس جداً" },
      { label: "Best for", label_ar: "الأفضل لـ", value: "Wear surfaces", value_ar: "الأسطح كثيرة الاستعمال" },
    ],
    uses: ["Laminate flooring cores", "Door skins", "Hard-wearing panels", "Backing boards"],
    uses_ar: ["نوى أرضيات اللامينيت", "قشور الأبواب", "الألواح عالية التحمّل", "ألواح الظهر"],
    watchOut:
      "Harder and heavier than MDF and just as water-sensitive — it still swells if it gets wet. Its density also makes it tougher on tools.",
    watchOut_ar:
      "أصلب وأثقل من الـ MDF وحسّاس للماء بالقدر نفسه — لا يزال ينتفخ إذا ابتلّ. كثافته تجعله أقسى على الأدوات أيضاً.",
    notes:
      "Think of HDF as MDF's tougher sibling: you meet it as the hard-wearing core of good laminate flooring and quality door skins. Same rule applies though — keep it dry, and it will give you a hard, smooth, durable surface.",
    notes_ar:
      "اعتبر الـ HDF الشقيق الأمتن للـ MDF: تلتقي به كقلب عالي التحمّل لأرضيات اللامينيت الجيدة وقشور الأبواب ذات الجودة. لكن القاعدة نفسها تنطبق — أبقِه جافاً، وسيمنحك سطحاً صلباً أملس متيناً.",
  },
  {
    slug: "chipboard",
    category: "engineered",
    name: "Chipboard",
    name_ar: "الخشب المضغوط",
    localName_ar: "خشب مضغوط / لوح حبيبي",
    image: "/wood-library/chipboard.jpg",
    tagline: "Cheapest · flat-pack · keep dry",
    tagline_ar: "الأرخص · فلات-باك · أبقِه جافاً",
    intro:
      "Wood chips and sawdust bound with glue and pressed flat — the cheapest board there is. Wrapped in melamine, it becomes the white and wood-look flat-pack furniture in almost every home.",
    intro_ar:
      "رقائق خشب ونشارة مربوطة بالغراء ومكبوسة مستويةً — أرخص الألواح على الإطلاق. وعند تغليفه بالميلامين، يصبح أثاث الفلات-باك بمظهر الأبيض والخشب في كل بيت تقريباً.",
    facts: [
      { label: "Made of", label_ar: "مصنوع من", value: "Wood chips + glue", value_ar: "رقائق خشب + غراء" },
      { label: "Cost", label_ar: "الكلفة", value: "Lowest", value_ar: "الأدنى" },
      { label: "Strength", label_ar: "القوة", value: "Low", value_ar: "منخفضة" },
      { label: "Screw hold", label_ar: "إمساك البراغي", value: "Poor", value_ar: "ضعيف" },
    ],
    uses: ["Flat-pack furniture", "Melamine cabinets", "Cheap shelving (supported)", "Worktop cores"],
    uses_ar: ["أثاث الفلات-باك", "خزائن الميلامين", "الرفوف الرخيصة (المدعومة)", "نوى أسطح العمل"],
    watchOut:
      "The weakest board: it sags under load, strips its screws easily, and the instant water reaches it, it swells and crumbles for good. Never put it under a sink or anywhere damp.",
    watchOut_ar:
      "أضعف الألواح: يتهدّل تحت الحِمل، تنفلت براغيه بسهولة، وفي اللحظة التي يصله الماء ينتفخ ويتفتّت إلى الأبد. لا تضعه أبداً تحت المغسلة أو في أي مكان رطب.",
    notes:
      "Chipboard is honest about what it is: cheap, light, flat-pack material. Used dry, flat and well-supported it does its job. I am simply blunt with clients about its limits — it is not built to last, and water is its end.",
    notes_ar:
      "الخشب المضغوط صادق بشأن ماهيّته: مادة رخيصة خفيفة للفلات-باك. واستخدامه جافاً ومستوياً ومدعوماً جيداً يؤدّي غرضه. أنا فقط أكون صريحاً مع العملاء حول حدوده — لم يُصنع ليدوم، والماء هو نهايته.",
  },
];

// ───────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<
  WoodCategoryKey,
  { en: string; ar: string; blurb_en: string; blurb_ar: string }
> = {
  hardwood: {
    en: "Hardwoods",
    ar: "الأخشاب الصلبة",
    blurb_en: "From broadleaf trees — strong, lasting, the woods of heirloom furniture.",
    blurb_ar: "من الأشجار عريضة الأوراق — قوية، دائمة، أخشاب الأثاث الذي يُورَّث.",
  },
  softwood: {
    en: "Softwoods",
    ar: "الأخشاب اللينة",
    blurb_en: "From conifers — light, affordable, easy to work, great outdoors.",
    blurb_ar: "من الأشجار الصنوبرية — خفيفة، اقتصادية، سهلة التشغيل، رائعة في الخارج.",
  },
  engineered: {
    en: "Engineered Wood",
    ar: "الأخشاب المصنّعة",
    blurb_en: "Veneers, strips and fibres re-engineered into large, stable, affordable sheets.",
    blurb_ar: "قشور وشرائح وألياف أُعيدت هندستها إلى ألواح كبيرة ثابتة اقتصادية.",
  },
};

export const CATEGORY_ORDER: WoodCategoryKey[] = ["hardwood", "softwood", "engineered"];

export function entriesByCategory(cat: WoodCategoryKey): WoodEntry[] {
  return woodEntries.filter((e) => e.category === cat);
}

export function getWoodEntry(slug: string): WoodEntry | undefined {
  return woodEntries.find((e) => e.slug === slug);
}

export function getExplainer(slug: string): Explainer | undefined {
  return explainers.find((e) => e.slug === slug);
}

/** Every library slug, for sitemap + static params. */
export function allLibrarySlugs(): string[] {
  return [...explainers.map((e) => e.slug), ...woodEntries.map((e) => e.slug)];
}
