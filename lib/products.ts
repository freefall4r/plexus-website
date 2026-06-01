// Plexus Workshop — product catalogue
// A custom wood workshop in Amman, Jordan. Prices in Jordanian Dinar (JOD).
// All data is hand-authored. No external imports.

export type WoodCategory =
  | "seating"
  | "tables"
  | "desk"
  | "storage"
  | "lighting"
  | "decor"
  | "kitchenware"
  | "wall";

export type Collection = "objects" | "furniture";

export type ArtKey =
  | "chair"
  | "lounge"
  | "stool"
  | "bench"
  | "rocker"
  | "table"
  | "coffeeTable"
  | "sideTable"
  | "console"
  | "desk"
  | "shelf"
  | "cabinet"
  | "dresser"
  | "bed"
  | "nightstand"
  | "bowl"
  | "board"
  | "vase"
  | "utensil"
  | "wineRack"
  | "lamp"
  | "pendant"
  | "candle"
  | "mirror"
  | "clock"
  | "wallArt"
  | "frame"
  | "box"
  | "tray"
  | "organizer"
  | "plantStand"
  | "speaker";

export type Product = {
  id: string;
  slug: string;
  name: string;
  name_ar: string;
  category: WoodCategory;
  collection: Collection;
  wood: string;
  wood_ar: string;
  price: number;
  blurb: string;
  blurb_ar: string;
  description: string;
  description_ar: string;
  dimensions: string;
  artKey: ArtKey;
  tags: string[];
  featured?: boolean;
};

// ---------------------------------------------------------------------------
// Internal builder: keeps authoring terse while the exported array stays fully
// specified. We assign sequential ids and guarantee unique slugs.
// ---------------------------------------------------------------------------

type Draft = Omit<Product, "id" | "slug"> & { slug?: string };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function build(drafts: Draft[]): Product[] {
  const seen = new Map<string, number>();
  return drafts.map((d, i) => {
    let base = d.slug ?? slugify(d.name);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    if (count > 0) base = `${base}-${count + 1}`;
    const id = `p${String(i + 1).padStart(3, "0")}`;
    return {
      id,
      slug: base,
      name: d.name,
      name_ar: d.name_ar,
      category: d.category,
      collection: d.collection,
      wood: d.wood,
      wood_ar: d.wood_ar,
      price: d.price,
      blurb: d.blurb,
      blurb_ar: d.blurb_ar,
      description: d.description,
      description_ar: d.description_ar,
      dimensions: d.dimensions,
      artKey: d.artKey,
      tags: d.tags,
      ...(d.featured ? { featured: true } : {}),
    };
  });
}

// ---------------------------------------------------------------------------
// OBJECTS — 50
// ---------------------------------------------------------------------------

const objectDrafts: Draft[] = [
  {
    name: "Petra Serving Bowl",
    name_ar: "وعاء تقديم البتراء",
    category: "kitchenware",
    collection: "objects",
    wood: "Black Walnut",
    wood_ar: "جوز أسود",
    price: 95,
    blurb: "A turned hollow that pools light like still water.",
    blurb_ar: "تجويف مخروط يجمع الضوء كصفحة ماء ساكنة.",
    description:
      "Hand-turned from a single walnut blank, its interior swept smooth against the grain so chocolate streaks spiral inward. Finished with food-safe walnut oil and a hard-wax buff that warms under the palm.",
    description_ar:
      "مخروط يدويًا من قطعة جوز واحدة، صُقل جوفه ناعمًا عكس اتجاه العروق لتنساب خطوطه البنية الشوكولاتية حلزونيًا نحو القلب. مُنهى بزيت جوز آمن غذائيًا ولمسة شمع صلب تدفأ تحت الكف.",
    dimensions: "Ø 28 × 9 cm",
    artKey: "bowl",
    tags: ["hand-turned", "oil-finish", "food-safe"],
    featured: true,
  },
  {
    name: "Wadi Rum Ripple Bowl",
    name_ar: "وعاء تموّجات وادي رم",
    category: "kitchenware",
    collection: "objects",
    wood: "Olive",
    wood_ar: "زيتون",
    price: 78,
    blurb: "Carved ridges that catch the morning like dune sand.",
    blurb_ar: "حُزوز محفورة تلتقط ضوء الصباح كرمال الكثبان.",
    description:
      "Olive wood gouged in shallow facets so the dense, honeyed grain breaks into ripples across the rim. The undulating wall is sanded to silk and sealed with a mineral-oil and beeswax blend.",
    description_ar:
      "خشب زيتون محفور بأوجه ضحلة لتتكسّر عروقه الكثيفة العسلية تموّجاتٍ على طول الحافة. صُقل جداره المتموّج كالحرير وخُتم بمزيج من الزيت المعدني وشمع العسل.",
    dimensions: "Ø 24 × 7 cm",
    artKey: "bowl",
    tags: ["hand-carved", "olive", "faceted"],
  },
  {
    name: "Meridian Serving Board",
    name_ar: "لوح تقديم ميريديان",
    category: "kitchenware",
    collection: "objects",
    wood: "White Oak",
    wood_ar: "بلوط أبيض",
    price: 65,
    blurb: "A long oak plain with a river of juice groove.",
    blurb_ar: "سهلٌ بلوطيّ طويل يشقّه نهرٌ من أخدود العصارة.",
    description:
      "Quarter-sawn white oak planed flat then routed with a slow-curving juice channel that follows the medullary rays. Bevelled handholds and a butcher-block oil cure leave it ready for the table.",
    description_ar:
      "بلوط أبيض منشور ربعيًا ومسوّى مستويًا ثم حُفر فيه أخدود عصارة منحنٍ ببطء يتبع الأشعة النخاعية. مقابض مشطوفة ومعالجة بزيت ألواح التقطيع تتركه جاهزًا للمائدة.",
    dimensions: "55 × 22 × 3 cm",
    artKey: "board",
    tags: ["quarter-sawn", "juice-groove", "oil-finish"],
    featured: true,
  },
  {
    name: "Dana Cheese Slab",
    name_ar: "لوح جبن ضانا",
    category: "kitchenware",
    collection: "objects",
    wood: "Acacia",
    wood_ar: "أكاسيا/سنط",
    price: 48,
    blurb: "Live-edge acacia with a knife slot at the hip.",
    blurb_ar: "أكاسيا بحافة طبيعية وشقٌّ للسكين على جانبها.",
    description:
      "A live-edge acacia slab keeps its raw bark line on one flank while the surface is glassed smooth for soft cheeses. A discreet end slot cradles the paring knife.",
    description_ar:
      "لوح أكاسيا بحافة طبيعية يحتفظ بخط لحائه الخام على أحد جانبيه، بينما صُقل سطحه كالزجاج للأجبان الطرية. شقٌّ خفيٌّ في الطرف يحتضن سكين التقشير.",
    dimensions: "40 × 20 × 2.5 cm",
    artKey: "board",
    tags: ["live-edge", "acacia", "serving"],
  },
  {
    name: "Aqaba Coral Vase",
    name_ar: "مزهرية مرجان العقبة",
    category: "decor",
    collection: "objects",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 130,
    blurb: "A turned vessel that flares like a reef bloom.",
    blurb_ar: "وعاء مخروط يتفتّح كزهرة شعابٍ مرجانية.",
    description:
      "Cherry turned wet then dried slow so the lip curls organically, the rosy heartwood deepening as it cures. A hidden glass liner lets it hold cut stems without weeping.",
    description_ar:
      "خشب كرز خُرط رطبًا ثم جُفّف ببطء لتنثني حافته انثناءً طبيعيًا، فيغمق لُبّه الورديّ كلما تماسك. بطانة زجاجية خفية تتيح له احتضان السيقان المقطوفة دون رشحٍ للماء.",
    dimensions: "Ø 16 × 30 cm",
    artKey: "vase",
    tags: ["hand-turned", "cherry", "glass-liner"],
    featured: true,
  },
  {
    name: "Obelisk Bud Vase",
    name_ar: "مزهرية مسلّة لزهرة واحدة",
    category: "decor",
    collection: "objects",
    wood: "Maple",
    wood_ar: "قيقب",
    price: 42,
    blurb: "A pale spire bored for a single stem.",
    blurb_ar: "نُصُبٌ شاحبٌ مثقوب لساقٍ واحدة.",
    description:
      "Hard maple shaped into a tapering obelisk and drilled deep for one bloom. The near-white grain is left bare under a matte wax so it reads almost like cast plaster.",
    description_ar:
      "قيقب صلب نُحت مسلّةً مدبّبة وثُقب عميقًا لزهرة واحدة. عروقه القريبة من البياض تُركت عاريةً تحت شمعٍ مطفأ فبدا أقرب إلى الجصّ المصبوب.",
    dimensions: "Ø 6 × 24 cm",
    artKey: "vase",
    tags: ["maple", "minimal", "single-stem"],
  },
  {
    name: "Citadel Spice Carousel",
    name_ar: "برج بهارات القلعة الدوّار",
    category: "storage",
    collection: "objects",
    wood: "Beech",
    wood_ar: "زان",
    price: 88,
    blurb: "A turning tower of twelve magnetic spice wells.",
    blurb_ar: "برجٌ دوّار باثني عشر وعاء بهاراتٍ مغناطيسيّ.",
    description:
      "A beech column on a lazy-susan base carries twelve turned canisters, each held by a recessed magnet so they lift free with a soft click. The whole tower spins on a brass thrust bearing.",
    description_ar:
      "عمود من الزان فوق قاعدة دوّارة يحمل اثني عشر وعاءً مخروطًا، يثبّت كلٌّ منها مغناطيس غائر فترتفع بنقرةٍ ناعمة. يدور البرج كله على محملٍ نحاسيّ.",
    dimensions: "Ø 18 × 32 cm",
    artKey: "organizer",
    tags: ["beech", "magnetic", "rotating"],
  },
  {
    name: "Jerash Olive Spoon Set",
    name_ar: "طقم ملاعق زيتون جرش",
    category: "kitchenware",
    collection: "objects",
    wood: "Olive",
    wood_ar: "زيتون",
    price: 38,
    blurb: "Three carved spoons, each grain a small map.",
    blurb_ar: "ثلاث ملاعق محفورة، عروق كلٍّ منها خريطة صغيرة.",
    description:
      "Three cooking spoons hewn from olive offcuts, each handle following the limb's natural sweep. Knife-finished facets are left crisp then oiled, so no two are alike.",
    description_ar:
      "ثلاث ملاعق طهي نُحتت من بقايا الزيتون، يتبع مقبض كلٍّ منها انحناء الغصن الطبيعي. أوجهها المنهاة بالسكين تُركت حادة ثم زُيّتت، فلا تتشابه ملعقتان.",
    dimensions: "30–34 cm long",
    artKey: "utensil",
    tags: ["hand-carved", "olive", "set-of-3"],
  },
  {
    name: "Dead Sea Salt Cellar",
    name_ar: "وعاء ملح البحر الميت",
    category: "kitchenware",
    collection: "objects",
    wood: "Ash",
    wood_ar: "دردار",
    price: 28,
    blurb: "A pinch pot with a swivelling ash lid.",
    blurb_ar: "وعاء قرصةٍ بغطاء دردارٍ يدور حول محوره.",
    description:
      "A small ash cellar bored wide for a two-finger pinch, capped with a swivel lid that pivots on a single dowel. The pale grain is sealed against moisture with beeswax.",
    description_ar:
      "وعاء دردار صغير ثُقب واسعًا لقرصةٍ بإصبعين، يعلوه غطاء دوّار يرتكز على وتدٍ واحد. عروقه الشاحبة مختومة ضد الرطوبة بشمع العسل.",
    dimensions: "Ø 9 × 7 cm",
    artKey: "box",
    tags: ["ash", "swivel-lid", "kitchen"],
  },
  {
    name: "Amman Hills Coaster Quartet",
    name_ar: "رباعية حوامل أكواب تلال عمّان",
    category: "decor",
    collection: "objects",
    wood: "Black Walnut",
    wood_ar: "جوز أسود",
    price: 32,
    blurb: "Four discs that stack into a small dark hill.",
    blurb_ar: "أربعة أقراص تتراكم في هضبةٍ داكنة صغيرة.",
    description:
      "Four walnut discs turned with a faint dished face to trap rings, nesting into a turned cradle that reads as a single object on the shelf. Cork feet keep them silent.",
    description_ar:
      "أربعة أقراص جوز مخروطة بوجهٍ مقعّر خفيف يحبس حلقات الأكواب، تتداخل في حاملٍ مخروط فتبدو قطعةً واحدة على الرف. أقدامٌ من الفلّين تُبقيها صامتة.",
    dimensions: "Ø 10 × 1 cm each",
    artKey: "tray",
    tags: ["walnut", "set-of-4", "cork-backed"],
  },
  {
    name: "Petra Pendant Light",
    name_ar: "ثُريّا البتراء المعلّقة",
    category: "lighting",
    collection: "objects",
    wood: "White Oak",
    wood_ar: "بلوط أبيض",
    price: 165,
    blurb: "A slatted dome that throws rose-rock stripes.",
    blurb_ar: "قبّة مشرّحة تنثر خطوطًا كصخر البتراء الورديّ.",
    description:
      "Bent oak ribs are caged around a single warm bulb so light rakes out in soft vertical bands, echoing the fluted walls of the Siq. Suspended on a braided cloth cord with a brass canopy.",
    description_ar:
      "أضلاع بلوطٍ مثنيّة تحيط بمصباحٍ دافئ واحد لينساب الضوء أشرطةً رأسية ناعمة، تحاكي جدران السيق المحزّزة. معلّقة بسلكٍ قماشيّ مضفور بغطاءٍ نحاسيّ.",
    dimensions: "Ø 30 × 26 cm",
    artKey: "pendant",
    tags: ["bent-wood", "oak", "warm-light"],
    featured: true,
  },
  {
    name: "Lantern of Jerash Pendant",
    name_ar: "ثُريّا فانوس جرش",
    category: "lighting",
    collection: "objects",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 140,
    blurb: "A faceted cherry drum pierced with thin slots.",
    blurb_ar: "أسطوانة كرزٍ مضلّعة مثقوبة بشقوقٍ دقيقة.",
    description:
      "A cherry drum scored with fine vertical kerfs that bend light into a colonnade of shadows across the ceiling. Each kerf is hand-sawn then eased so the rim stays soft to the eye.",
    description_ar:
      "أسطوانة كرزٍ مشقوقة بحزوزٍ رأسية رفيعة تثني الضوء صفًّا من الظلال يمتدّ على السقف. كل حزٍّ منشورٌ يدويًا ثم ملطّفٌ لتبقى الحافة ناعمةً للعين.",
    dimensions: "Ø 26 × 22 cm",
    artKey: "pendant",
    tags: ["cherry", "kerf-cut", "pendant"],
  },
  {
    name: "Dune Table Lamp",
    name_ar: "مصباح طاولة الكثبان",
    category: "lighting",
    collection: "objects",
    wood: "Olive",
    wood_ar: "زيتون",
    price: 120,
    blurb: "A solid olive curve cradling a linen shade.",
    blurb_ar: "منحنى زيتونٍ صلب يحتضن أباجورةً كتّانية.",
    description:
      "An asymmetric olive base sculpted like a wind-blown crest carries a slim linen drum. The dense grain is rubbed to a low sheen so the lamp glows warm even unlit.",
    description_ar:
      "قاعدة زيتونٍ غير متماثلة نُحتت كقمّةٍ نحتتها الريح تحمل أسطوانة كتّانٍ نحيلة. عروقه الكثيفة مدلوكة إلى بريقٍ خافت فيتوهّج المصباح دفئًا حتى وهو مطفأ.",
    dimensions: "Ø 22 × 42 cm",
    artKey: "lamp",
    tags: ["olive", "linen-shade", "sculptural"],
  },
  {
    name: "Marsh Reed Floor Glow",
    name_ar: "مصباح أرضيّ بقصب المستنقع",
    category: "lighting",
    collection: "objects",
    wood: "Ash",
    wood_ar: "دردار",
    price: 175,
    blurb: "Tall ash reeds bound around a soft uplight.",
    blurb_ar: "قصبات دردارٍ عالية مربوطة حول ضوءٍ علويّ ناعم.",
    description:
      "Steam-bent ash rods are gathered like river reeds and lashed with waxed cord, washing the wall above in a quiet amber. A weighted oak foot keeps the bundle steady.",
    description_ar:
      "قضبان دردارٍ مثنيّة بالبخار جُمعت كقصب النهر ورُبطت بحبلٍ مشمّع، تغمر الجدار من فوقها بلون كهرمانٍ هادئ. قدمٌ بلوطية مثقّلة تُبقي الحزمة ثابتة.",
    dimensions: "Ø 24 × 120 cm",
    artKey: "lamp",
    tags: ["steam-bent", "ash", "uplight"],
  },
  {
    name: "Solstice Candle Trio",
    name_ar: "ثلاثية شمعدانات الانقلاب",
    category: "decor",
    collection: "objects",
    wood: "Maple",
    wood_ar: "قيقب",
    price: 36,
    blurb: "Three turned holders at climbing heights.",
    blurb_ar: "ثلاثة شمعدانات مخروطة بارتفاعاتٍ متصاعدة.",
    description:
      "Three maple spindles turned to stepped heights, brass cups sunk flush for tapers. Grouped they make a small skyline; apart they punctuate a shelf.",
    description_ar:
      "ثلاثة أعمدة قيقبٍ مخروطة بارتفاعاتٍ متدرّجة، بأكوابٍ نحاسية غائرة للشموع المدبّبة. مجتمعةً ترسم أفقًا صغيرًا، ومتفرّقةً تنثر إيقاعها على الرف.",
    dimensions: "8–18 cm tall",
    artKey: "candle",
    tags: ["maple", "brass-cup", "set-of-3"],
  },
  {
    name: "Ember Tealight Arc",
    name_ar: "قوس شموع الجمر",
    category: "decor",
    collection: "objects",
    wood: "Cedar",
    wood_ar: "أرز",
    price: 30,
    blurb: "A cedar crescent drilled for five flames.",
    blurb_ar: "هلال أرزٍ مثقوب لخمس شعلات.",
    description:
      "A length of fragrant cedar shaped into a low crescent and bored with five tealight wells, the wood breathing its resin scent as the wicks warm it. Felt feet protect the table.",
    description_ar:
      "قطعة أرزٍ عطريّ شُكّلت هلالًا منخفضًا وثُقبت بخمسة آبارٍ للشموع الصغيرة، فيتنفّس الخشب رائحة راتنجه كلما دفّأته الفتائل. أقدامٌ من اللبّاد تحمي الطاولة.",
    dimensions: "36 × 8 × 5 cm",
    artKey: "candle",
    tags: ["cedar", "aromatic", "tealight"],
  },
  {
    name: "Strata Wall Panel",
    name_ar: "لوحة جدار الطبقات",
    category: "wall",
    collection: "objects",
    wood: "Black Walnut",
    wood_ar: "جوز أسود",
    price: 210,
    blurb: "Stacked walnut strips in low relief, like sediment.",
    blurb_ar: "شرائح جوزٍ متراكمة بنحتٍ بارزٍ خفيف، كطبقات الرسوبيات.",
    description:
      "Dozens of walnut strips ripped to varied thickness and stacked into a shallow relief that ripples with light through the day. A cleat batten hangs it flush and invisible.",
    description_ar:
      "عشرات من شرائح الجوز نُشرت بسماكاتٍ متفاوتة ورُصّت في نحتٍ بارزٍ ضحل يتموّج مع الضوء على مدار اليوم. شريحة تثبيت خفية تعلّقها لاصقةً بالجدار دون أن تُرى.",
    dimensions: "80 × 50 × 4 cm",
    artKey: "wallArt",
    tags: ["walnut", "relief", "statement"],
    featured: true,
  },
  {
    name: "Wadi Topography Panel",
    name_ar: "لوحة تضاريس الوادي",
    category: "wall",
    collection: "objects",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 185,
    blurb: "Routed contour lines reading a desert valley.",
    blurb_ar: "خطوط كنتورٍ محفورة تقرأ واديًا صحراويًّا.",
    description:
      "A single oak board CNC-traced then hand-eased into concentric contours, mapping an imagined wadi in raised and recessed grain. Limed white to throw the lines into relief.",
    description_ar:
      "لوح بلوطٍ واحد رُسم آليًا ثم لُطّف يدويًا في خطوط كنتورٍ متراكزة، يرسم واديًا متخيّلًا بعروقٍ بارزة وغائرة. مُبيَّض بالكلس لإبراز الخطوط.",
    dimensions: "60 × 60 × 3 cm",
    artKey: "wallArt",
    tags: ["oak", "limed", "topographic"],
  },
  {
    name: "Halo Round Mirror",
    name_ar: "مرآة الهالة المستديرة",
    category: "wall",
    collection: "objects",
    wood: "Ash",
    wood_ar: "دردار",
    price: 155,
    blurb: "A steam-bent ash ring framing soft glass.",
    blurb_ar: "حلقة دردارٍ مثنيّة بالبخار تؤطّر زجاجًا ناعمًا.",
    description:
      "Ash steam-bent into a seamless ring, the join scarfed so the grain runs unbroken around the circle. A bevelled mirror floats inside on a hidden rebate.",
    description_ar:
      "دردار مثنيّ بالبخار في حلقةٍ بلا فواصل، وصلتها مشطوفة لتجري العروق متّصلةً حول الدائرة. مرآة مشطوفة الحواف تطفو في الداخل على مجرى خفيّ.",
    dimensions: "Ø 60 × 4 cm",
    artKey: "mirror",
    tags: ["steam-bent", "ash", "round"],
    featured: true,
  },
  {
    name: "Portal Arch Mirror",
    name_ar: "مرآة القوس البوّابة",
    category: "wall",
    collection: "objects",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 175,
    blurb: "An arched cherry surround, doorway-shaped.",
    blurb_ar: "إطار كرزٍ مقوّس على هيئة مدخل.",
    description:
      "A cherry frame shaped to a Levantine arch, its inner edge chamfered to draw the eye into the glass. Bookmatched stiles keep the rosy grain mirrored left to right.",
    description_ar:
      "إطار كرزٍ شُكّل قوسًا شاميًّا، حافته الداخلية مشطوفة لتجذب العين نحو الزجاج. قوائم متناظرة الفلق تُبقي العروق الوردية منعكسةً من اليمين إلى اليسار.",
    dimensions: "50 × 90 × 4 cm",
    artKey: "mirror",
    tags: ["cherry", "arched", "bookmatched"],
  },
  {
    name: "Meridian Wall Clock",
    name_ar: "ساعة جدار ميريديان",
    category: "wall",
    collection: "objects",
    wood: "White Oak",
    wood_ar: "بلوط أبيض",
    price: 95,
    blurb: "A bare oak disc, hours marked by inlaid brass.",
    blurb_ar: "قرص بلوطٍ عارٍ، تحدّد ساعاته بطُعومٍ نحاسية.",
    description:
      "A single oak round with twelve slim brass pins set for the hours, the silent sweep movement hidden behind. The face is left raw save a hard-wax seal that keeps the grain alive.",
    description_ar:
      "قرص بلوطٍ واحد بإثني عشر مسمارًا نحاسيًّا رفيعًا للساعات، وحركةٌ صامتة مخبّأة خلفه. تُرك وجهه خامًا إلا من ختم شمعٍ صلب يُبقي العروق حيّة.",
    dimensions: "Ø 32 × 3 cm",
    artKey: "clock",
    tags: ["oak", "brass-inlay", "silent"],
  },
  {
    name: "Sundial Desk Clock",
    name_ar: "ساعة مكتب المزولة",
    category: "decor",
    collection: "objects",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 68,
    blurb: "A wedge of walnut leaning like a gnomon.",
    blurb_ar: "إسفين جوزٍ مائل كعقرب المزولة.",
    description:
      "A solid walnut wedge cut at a shallow rake to hold a small face on its sloped cheek, reading like a desktop sundial. The end grain is polished to glass on the leaning face.",
    description_ar:
      "إسفين جوزٍ صلب قُطع بميلٍ خفيف ليحمل وجهًا صغيرًا على جانبه المنحدر، فيبدو كمزولةٍ على المكتب. عروق طرفه مصقولة كالزجاج على الوجه المائل.",
    dimensions: "14 × 10 × 9 cm",
    artKey: "clock",
    tags: ["walnut", "desk", "wedge"],
  },
  {
    name: "Apothecary Tea Box",
    name_ar: "صندوق شاي العطّار",
    category: "storage",
    collection: "objects",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 72,
    blurb: "Six lidded wells under a sliding cherry top.",
    blurb_ar: "ستة أحواضٍ بأغطية تحت غطاء كرزٍ منزلق.",
    description:
      "A cherry box divided into six compartments beneath a top that slides on waxed rabbets with a single satisfying glide. Each well is finger-jointed so the corners read as fine combs.",
    description_ar:
      "صندوق كرزٍ مقسّم إلى ستة أقسام تحت غطاءٍ ينزلق على مجارٍ مشمّعة بانسيابةٍ واحدة مُرضية. كل حوضٍ موصول بأصابع التعشيق فتبدو الزوايا أمشاطًا دقيقة.",
    dimensions: "30 × 20 × 8 cm",
    artKey: "box",
    tags: ["cherry", "finger-joint", "sliding-lid"],
  },
  {
    name: "Reliquary Jewelry Box",
    name_ar: "علبة مجوهرات الذخائر",
    category: "storage",
    collection: "objects",
    wood: "Olive",
    wood_ar: "زيتون",
    price: 110,
    blurb: "A lift-top olive casket lined in suede.",
    blurb_ar: "علبة زيتونٍ بغطاءٍ مرفوع مبطّنة بالشمواه.",
    description:
      "Olive burl resawn so the lid blazes with figure, hinged on a hidden brass barrel and lined in soft taupe suede. A lift-out tray hides a second tier below.",
    description_ar:
      "عقدة زيتونٍ أُعيد نشرها ليتوهّج الغطاء بزخارف العروق، مفصّل على أسطوانة نحاسٍ خفية ومبطّن بشمواهٍ رماديّ ناعم. صينية قابلة للرفع تُخفي طبقةً ثانية في الأسفل.",
    dimensions: "26 × 16 × 11 cm",
    artKey: "box",
    tags: ["olive-burl", "suede-lined", "two-tier"],
    featured: true,
  },
  {
    name: "Crossing Chess Set",
    name_ar: "طقم شطرنج المعبر",
    category: "decor",
    collection: "objects",
    wood: "Maple",
    wood_ar: "قيقب",
    price: 195,
    blurb: "Turned maple and walnut armies on an inlaid field.",
    blurb_ar: "جيشا قيقبٍ وجوزٍ مخروطان فوق رقعةٍ مطعّمة.",
    description:
      "Each piece is individually turned, the dark side in walnut and the light in maple, fielded on a board inlaid square by square. The board lifts to store the set within.",
    description_ar:
      "كل قطعةٍ مخروطة على حدة، الجيش الداكن من الجوز والفاتح من القيقب، على رقعةٍ مطعّمة مربّعًا تلو مربّع. ترتفع الرقعة لتخزين الطقم في داخلها.",
    dimensions: "40 × 40 × 6 cm",
    artKey: "box",
    tags: ["maple", "walnut", "hand-turned"],
  },
  {
    name: "Acoustic Bloom Speaker",
    name_ar: "مكبّر صوت تفتّح صوتيّ",
    category: "lighting",
    collection: "objects",
    wood: "Black Walnut",
    wood_ar: "جوز أسود",
    price: 220,
    blurb: "A passive walnut horn that blooms a phone's sound.",
    blurb_ar: "بوقُ جوزٍ سلبيّ يُفتّح صوت الهاتف.",
    description:
      "A walnut block hollowed into a flared horn that funnels and warms a phone's speaker with zero electronics. The internal chamber is hand-carved smooth so the sound feels rounder and fuller.",
    description_ar:
      "كتلة جوزٍ جُوّفت بوقًا متّسعًا يوجّه صوت مكبّر الهاتف ويدفّئه دون أيّ إلكترونيات. غُرفته الداخلية محفورة يدويًا ناعمةً ليبدو الصوت أكثر استدارةً وامتلاءً.",
    dimensions: "20 × 14 × 12 cm",
    artKey: "speaker",
    tags: ["walnut", "passive-amp", "carved"],
    featured: true,
  },
  {
    name: "Resonance Bookshelf Speaker",
    name_ar: "مكبّر صوت الرنين للرفّ",
    category: "decor",
    collection: "objects",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 200,
    blurb: "A cherry enclosure tuned like an instrument.",
    blurb_ar: "حاوية كرزٍ مضبوطة كآلةٍ موسيقية.",
    description:
      "A sealed cherry cabinet built with mitred corners and an internal brace, finished to feel like a small cello. The driver cutout is hand-chamfered so the cone breathes cleanly.",
    description_ar:
      "حاوية كرزٍ محكمة الإغلاق بزوايا مشطوفة ودعامةٍ داخلية، أُنهيت لتُحسَّ كتشيلو صغير. فتحة السمّاعة مشطوفة يدويًا ليتنفّس مخروطها بنقاء.",
    dimensions: "18 × 16 × 24 cm",
    artKey: "speaker",
    tags: ["cherry", "enclosure", "mitred"],
  },
  {
    name: "Dock & Dawn Phone Stand",
    name_ar: "حامل هاتف المرسى والفجر",
    category: "storage",
    collection: "objects",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 45,
    blurb: "A leaning oak cradle with a cable groove.",
    blurb_ar: "حامل بلوطٍ مائل بأخدودٍ للكابل.",
    description:
      "A wedge of oak slotted to hold a phone upright at reading angle, a routed groove leading the charging cable out the back. The leaning face is dished slightly so the screen sits proud.",
    description_ar:
      "إسفين بلوطٍ مشقوق ليحمل الهاتف منتصبًا بزاوية القراءة، وأخدودٌ محفور يخرج كابل الشحن من الخلف. وجهه المائل مقعّر قليلًا لتبرز الشاشة.",
    dimensions: "12 × 10 × 9 cm",
    artKey: "organizer",
    tags: ["oak", "phone-dock", "cable-groove"],
  },
  {
    name: "Compass Desk Organizer",
    name_ar: "منظّم مكتب البوصلة",
    category: "storage",
    collection: "objects",
    wood: "Beech",
    wood_ar: "زان",
    price: 58,
    blurb: "Angled beech wells for pens, cards and clips.",
    blurb_ar: "أحواض زانٍ مائلة للأقلام والبطاقات والمشابك.",
    description:
      "A solid beech block bored at canted angles so pens fan out like spokes, with a shallow tray milled for cards and a magnet pocket for clips. Felt base, soft to the desk.",
    description_ar:
      "كتلة زانٍ صلبة ثُقبت بزوايا مائلة لتتفرّع الأقلام كأسلاك العجلة، مع صينيةٍ ضحلة للبطاقات وجيبٍ مغناطيسيّ للمشابك. قاعدةٌ من اللبّاد ناعمةٌ على المكتب.",
    dimensions: "20 × 14 × 9 cm",
    artKey: "organizer",
    tags: ["beech", "desk", "fanned"],
  },
  {
    name: "Wayfarer Valet Tray",
    name_ar: "صينية مقتنيات المسافر",
    category: "storage",
    collection: "objects",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 52,
    blurb: "A carved walnut dish for keys, coins and watch.",
    blurb_ar: "طبق جوزٍ محفور للمفاتيح والنقود والساعة.",
    description:
      "A walnut block hollowed into a soft-bottomed tray with a raised lip, divided for keys on one side and a watch coil on the other. The carving tool marks are left faint and rubbed with oil.",
    description_ar:
      "كتلة جوزٍ جُوّفت صينيةً ناعمة القاع بحافةٍ مرتفعة، مقسّمة للمفاتيح في جانبٍ وملفّ ساعةٍ في الآخر. تُركت آثار أدوات الحفر باهتةً ودُلكت بالزيت.",
    dimensions: "24 × 16 × 4 cm",
    artKey: "tray",
    tags: ["walnut", "valet", "hand-carved"],
  },
  {
    name: "Threshold Key Ledge",
    name_ar: "رفّ مفاتيح العتبة",
    category: "wall",
    collection: "objects",
    wood: "Ash",
    wood_ar: "دردار",
    price: 40,
    blurb: "A small ash shelf with brass hooks beneath.",
    blurb_ar: "رفّ دردارٍ صغير بخطّافاتٍ نحاسية أسفله.",
    description:
      "A floating ash ledge with a lip to catch mail and three turned brass hooks below for keys. Hung on a French cleat so it sits tight to the wall with no visible fixings.",
    description_ar:
      "رفّ دردارٍ معلّق بحافةٍ تمسك البريد وثلاثة خطّافات نحاسٍ مخروطة أسفله للمفاتيح. معلّق على شريحة تثبيتٍ فرنسية فيلتصق بالجدار دون مثبّتاتٍ ظاهرة.",
    dimensions: "40 × 10 × 9 cm",
    artKey: "organizer",
    tags: ["ash", "entryway", "brass-hooks"],
  },
  {
    name: "Oasis Plant Pedestal",
    name_ar: "حامل نبات الواحة",
    category: "decor",
    collection: "objects",
    wood: "Teak",
    wood_ar: "ساج",
    price: 95,
    blurb: "A three-leg teak stand to lift a pot to the light.",
    blurb_ar: "حامل ساجٍ بثلاث قوائم يرفع الأصيص نحو الضوء.",
    description:
      "Three tapered teak legs splay from a turned collar to raise a single pot toward the window, the joinery wedged through-tenons sanded flush. Teak's own oils keep it glowing.",
    description_ar:
      "ثلاث قوائم ساجٍ مدبّبة تتفرّع من طوقٍ مخروط لترفع أصيصًا واحدًا نحو النافذة، بوصلات نقرٍ نافذة مُسفنّة مصقولة مستويةً. زيوت الساج الطبيعية تُبقيه متوهّجًا.",
    dimensions: "Ø 30 × 55 cm",
    artKey: "plantStand",
    tags: ["teak", "tripod", "plant"],
  },
  {
    name: "Terrace Tiered Plant Steps",
    name_ar: "مدرّجات نبات الشرفة",
    category: "decor",
    collection: "objects",
    wood: "Cedar",
    wood_ar: "أرز",
    price: 130,
    blurb: "Cedar steps climbing for a cascade of greenery.",
    blurb_ar: "درجات أرزٍ صاعدة لشلّالٍ من الخضرة.",
    description:
      "A staircase of cedar platforms that lifts a cluster of pots into a green cascade, the aromatic wood shrugging off the odd splash of water. Knock-down joinery lets it pack flat.",
    description_ar:
      "سلّمٌ من منصّات الأرز يرفع مجموعةً من الأصص في شلّالٍ أخضر، والخشب العطريّ لا يأبه برشّة ماءٍ عابرة. وصلاتٌ قابلة للفكّ تتيح حزمه مسطّحًا.",
    dimensions: "60 × 30 × 60 cm",
    artKey: "plantStand",
    tags: ["cedar", "tiered", "knock-down"],
  },
  {
    name: "Hearth Trivet Pair",
    name_ar: "زوج حاملات قدور الموقد",
    category: "kitchenware",
    collection: "objects",
    wood: "Acacia",
    wood_ar: "أكاسيا/سنط",
    price: 34,
    blurb: "Two interlocking acacia rings that part to grow.",
    blurb_ar: "حلقتا أكاسيا متشابكتان تتباعدان لتتّسعا.",
    description:
      "Two acacia rings, each a closed loop of mitred segments, that sit nested or pull apart to host a larger pot. Splined corners keep them flat under heat.",
    description_ar:
      "حلقتا أكاسيا، كلٌّ منهما حلقة مغلقة من قطعٍ مشطوفة، تتداخلان أو تتباعدان لاستقبال قدرٍ أكبر. زوايا مفنّنة تُبقيهما مستويتين تحت الحرارة.",
    dimensions: "Ø 20 & Ø 26 cm",
    artKey: "tray",
    tags: ["acacia", "trivet", "interlocking"],
  },
  {
    name: "Sentinel Bookends",
    name_ar: "ماسكا كتب الحارس",
    category: "decor",
    collection: "objects",
    wood: "Black Walnut",
    wood_ar: "جوز أسود",
    price: 60,
    blurb: "A pair of leaning walnut wedges with brass soles.",
    blurb_ar: "زوج إسفينَي جوزٍ مائلين بقاعدتين نحاسيتين.",
    description:
      "Two walnut wedges weighted with brass plates underfoot so a row of books leans into them without sliding. The leaning faces are bookmatched to mirror across the shelf.",
    description_ar:
      "إسفينا جوزٍ مثقّلان بصفائح نحاسٍ من الأسفل ليتّكئ عليهما صفّ الكتب دون انزلاق. وجهاهما المائلان متناظرا الفلق ليتعاكسا على طول الرف.",
    dimensions: "12 × 10 × 16 cm",
    artKey: "box",
    tags: ["walnut", "bookends", "brass-weighted"],
  },
  {
    name: "Smoke & Sand Incense Holder",
    name_ar: "حامل بخور الدخان والرمل",
    category: "decor",
    collection: "objects",
    wood: "Cedar",
    wood_ar: "أرز",
    price: 26,
    blurb: "A cedar boat to catch ash as a thread of smoke rises.",
    blurb_ar: "قارب أرزٍ يلتقط الرماد بينما يتصاعد خيط الدخان.",
    description:
      "A small cedar boat routed with a long ash channel and a single bored seat for the stick, the cedar scent mingling with the smoke. The hull underside is relieved so it floats off the surface.",
    description_ar:
      "قارب أرزٍ صغير حُفر بمجرى رمادٍ طويل ومقعدٍ مثقوب واحد للعود، فتمتزج رائحة الأرز بالدخان. خُفّف أسفل بدنه ليرتفع عن السطح.",
    dimensions: "26 × 6 × 3 cm",
    artKey: "tray",
    tags: ["cedar", "incense", "aromatic"],
  },
  {
    name: "Vintner's Wave Wine Rack",
    name_ar: "حامل نبيذ موجة الكرّام",
    category: "storage",
    collection: "objects",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 145,
    blurb: "A countertop oak wave cradling six bottles.",
    blurb_ar: "موجة بلوطٍ على الطاولة تحتضن ست زجاجات.",
    description:
      "An oak slab steam-bent into a low wave with six bored saddles that hold bottles at the perfect cellaring tilt. The bend is laminated from thin plies so it holds its curve for life.",
    description_ar:
      "لوح بلوطٍ ثُني بالبخار موجةً منخفضة بست حُجراتٍ مثقوبة تمسك الزجاجات بميل التخزين المثالي. الانحناء مصفّح من طبقاتٍ رقيقة فيحفظ انحناءه مدى الحياة.",
    dimensions: "60 × 24 × 18 cm",
    artKey: "wineRack",
    tags: ["oak", "bent-lamination", "6-bottle"],
  },
  {
    name: "Cellar Ladder Wine Tower",
    name_ar: "برج نبيذ سلّم القبو",
    category: "storage",
    collection: "objects",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 190,
    blurb: "A leaning walnut ladder stacking nine bottles.",
    blurb_ar: "سلّم جوزٍ مائل يصفّ تسع زجاجات.",
    description:
      "A slim walnut ladder that leans against the wall, each rung drilled to cradle a bottle by the neck so the labels face out. Rubber feet keep it from walking on tile.",
    description_ar:
      "سلّم جوزٍ نحيل يتّكئ على الجدار، كل درجةٍ مثقوبة لتحتضن زجاجةً من عنقها فتواجه الملصقات الخارج. أقدامٌ مطّاطية تمنعه من الانزلاق على البلاط.",
    dimensions: "40 × 20 × 130 cm",
    artKey: "wineRack",
    tags: ["walnut", "leaning", "9-bottle"],
    featured: true,
  },
  {
    name: "Frame of Dana",
    name_ar: "إطار ضانا",
    category: "wall",
    collection: "objects",
    wood: "Olive",
    wood_ar: "زيتون",
    price: 50,
    blurb: "A chunky olive frame, all figure and edge.",
    blurb_ar: "إطار زيتونٍ ضخم، كله زخارف عروقٍ وحافّة.",
    description:
      "A picture frame milled thick from olive so the wild grain becomes the artwork itself, rabbeted deep for a generous mat. Mitred and splined corners stay tight through dry summers.",
    description_ar:
      "إطار صورةٍ نُحت سميكًا من الزيتون لتغدو عروقه الجامحة هي اللوحة ذاتها، محزوزٌ عميقًا لحاشيةٍ سخيّة. زواياه المشطوفة المفنّنة تبقى محكمةً عبر صيفٍ جافّ.",
    dimensions: "30 × 40 × 4 cm",
    artKey: "frame",
    tags: ["olive", "splined", "thick-profile"],
  },
  {
    name: "Window Light Photo Frame",
    name_ar: "إطار صور ضوء النافذة",
    category: "decor",
    collection: "objects",
    wood: "Maple",
    wood_ar: "قيقب",
    price: 38,
    blurb: "A pale maple frame with a divided mullion.",
    blurb_ar: "إطار قيقبٍ شاحب بعارضةٍ تقسمه.",
    description:
      "A maple frame split by a slim central mullion so two photos read as panes of one window. The face is left bare under matte wax for a chalk-soft hand.",
    description_ar:
      "إطار قيقبٍ تقسمه عارضةٌ وسطى رفيعة فتبدو الصورتان لوحَي زجاجٍ لنافذةٍ واحدة. تُرك وجهه عاريًا تحت شمعٍ مطفأ بملمسٍ طباشيريّ ناعم.",
    dimensions: "25 × 30 × 3 cm",
    artKey: "frame",
    tags: ["maple", "double", "minimal"],
  },
  {
    name: "Caravan Magazine Sling",
    name_ar: "حمّالة مجلّات القافلة",
    category: "storage",
    collection: "objects",
    wood: "Beech",
    wood_ar: "زان",
    price: 85,
    blurb: "A beech A-frame slung with vegetable-tanned leather.",
    blurb_ar: "هيكل زانٍ على شكل حرفٍ معلّقٌ بجلدٍ مدبوغ نباتيًّا.",
    description:
      "Two beech A-frames bridged by a stretched leather sling that cradles magazines spine-up. The leather is laced through bored holes so it can be re-tensioned as it stretches.",
    description_ar:
      "هيكلا زانٍ على شكل حرف يربطهما حمّالة جلدٍ مشدودة تحتضن المجلّات بكعوبها لأعلى. الجلد مشدودٌ عبر ثقوبٍ فيمكن إعادة شدّه كلما تمدّد.",
    dimensions: "44 × 32 × 36 cm",
    artKey: "organizer",
    tags: ["beech", "leather-sling", "a-frame"],
  },
  {
    name: "Monolith Catchall",
    name_ar: "وعاء النصب أحاديّ الكتلة",
    category: "decor",
    collection: "objects",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 44,
    blurb: "A carved walnut crater for the day's small things.",
    blurb_ar: "فوّهة جوزٍ محفورة لأغراض اليوم الصغيرة.",
    description:
      "A solid walnut block with a single deep crater gouged into the top, the rim left thick and the bowl rubbed soft as river stone. It anchors a desk like a small dark planet.",
    description_ar:
      "كتلة جوزٍ صلبة بفوّهةٍ عميقة واحدة محفورة في أعلاها، تُركت حافتها سميكة ودُلك جوفها ناعمًا كحجر النهر. ترسو على المكتب ككوكبٍ داكنٍ صغير.",
    dimensions: "Ø 14 × 6 cm",
    artKey: "bowl",
    tags: ["walnut", "catchall", "sculptural"],
  },
  {
    name: "Fruit of Jordan Bowl",
    name_ar: "وعاء فاكهة الأردن",
    category: "kitchenware",
    collection: "objects",
    wood: "Ash",
    wood_ar: "دردار",
    price: 70,
    blurb: "A wide pierced ash bowl that breathes around fruit.",
    blurb_ar: "وعاء دردارٍ واسع مثقوب يتنفّس حول الفاكهة.",
    description:
      "A broad ash bowl pierced with a ring of slots so air moves around the fruit and keeps it longer. Turned thin and even, it lifts surprisingly light off the table.",
    description_ar:
      "وعاء دردارٍ عريض مثقوب بحلقةٍ من الشقوق ليتحرّك الهواء حول الفاكهة فتدوم أطول. مخروطٌ رقيقًا ومتساويًا، فيرتفع عن الطاولة خفيفًا على نحوٍ مفاجئ.",
    dimensions: "Ø 32 × 12 cm",
    artKey: "bowl",
    tags: ["ash", "pierced", "fruit"],
  },
  {
    name: "Quill Letter Tray",
    name_ar: "صينية رسائل الريشة",
    category: "storage",
    collection: "objects",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 48,
    blurb: "A two-tier cherry tray for the day's post.",
    blurb_ar: "صينية كرزٍ بطبقتين لبريد اليوم.",
    description:
      "Two stacked cherry trays on turned spacer posts, the upper for unopened mail and the lower for done. The trays are dovetailed at the corners so they read crisp from every angle.",
    description_ar:
      "صينيتا كرزٍ متراكمتان على أعمدةٍ فاصلة مخروطة، العليا للبريد غير المفتوح والسفلى للمنجَز. زواياهما موصولة بذيل الحمامة فتبدوان متقنتين من كل زاوية.",
    dimensions: "32 × 24 × 14 cm",
    artKey: "tray",
    tags: ["cherry", "dovetailed", "two-tier"],
  },
  {
    name: "Cairn Stacking Vessels",
    name_ar: "أوعية الركام المتراكمة",
    category: "decor",
    collection: "objects",
    wood: "Maple",
    wood_ar: "قيقب",
    price: 64,
    blurb: "Three turned forms that stack into a small cairn.",
    blurb_ar: "ثلاثة أشكالٍ مخروطة تتراكم في ركامٍ صغير.",
    description:
      "Three maple vessels turned to seat one atop the next, building a balanced cairn or scattering as individual holders. Each foot is recessed to grip the one below.",
    description_ar:
      "ثلاثة أوعية قيقبٍ مخروطة ليستقرّ كلٌّ منها فوق الآخر، فتبني ركامًا متّزنًا أو تتفرّق حواملَ منفردة. قاعدة كلٍّ غائرة لتمسك ما تحتها.",
    dimensions: "8–16 cm tall",
    artKey: "vase",
    tags: ["maple", "stacking", "set-of-3"],
  },
  {
    name: "Mihrab Wall Niche",
    name_ar: "حنية جدار المحراب",
    category: "wall",
    collection: "objects",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 115,
    blurb: "An arched walnut box-shelf for a single object.",
    blurb_ar: "رفّ صندوقيّ جوزٍ مقوّس لقطعةٍ واحدة.",
    description:
      "A deep walnut niche shaped to a pointed arch, made to frame one cherished object in soft shadow. The back panel is bookmatched so the figure radiates from the centre.",
    description_ar:
      "حنية جوزٍ عميقة شُكّلت قوسًا مدبّبًا، صُنعت لتؤطّر قطعةً عزيزة واحدة في ظلٍّ ناعم. لوحها الخلفي متناظر الفلق فتشعّ زخارف العروق من المركز.",
    dimensions: "30 × 45 × 12 cm",
    artKey: "shelf",
    tags: ["walnut", "niche", "arched"],
  },
  {
    name: "Mosaic Coaster Set",
    name_ar: "طقم حوامل أكواب الفسيفساء",
    category: "decor",
    collection: "objects",
    wood: "Teak",
    wood_ar: "ساج",
    price: 40,
    blurb: "Six teak tiles inlaid like a courtyard floor.",
    blurb_ar: "ستة بلاطات ساجٍ مطعّمة كأرضية فناء.",
    description:
      "Six teak coasters each inlaid with a small geometric motif in contrasting woods, nodding to courtyard mosaics. Sealed against rings and stored in a slim teak caddy.",
    description_ar:
      "ستة حوامل ساجٍ مطعّم كلٌّ منها بزخرفةٍ هندسية صغيرة من أخشابٍ متباينة، تحيّةً لفسيفساء الأفنية. مختومة ضد بقع الأكواب ومحفوظة في حاملٍ ساجٍ نحيل.",
    dimensions: "Ø 10 × 1 cm each",
    artKey: "tray",
    tags: ["teak", "inlay", "set-of-6"],
  },
  {
    name: "Bedouin Salt & Pepper Towers",
    name_ar: "برجا ملح وفلفل بدويّان",
    category: "kitchenware",
    collection: "objects",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 56,
    blurb: "A pair of tall cherry grinders with ceramic burrs.",
    blurb_ar: "زوج مطاحن كرزٍ طويلة بأقراص طحنٍ خزفية.",
    description:
      "Two slim cherry mills turned to a leaning silhouette, each fitted with an adjustable ceramic grinding mechanism. The crowns twist with a quiet, oiled resistance.",
    description_ar:
      "مطحنتا كرزٍ نحيلتان مخروطتان بظلٍّ مائل، زُوّدت كلٌّ منهما بآلية طحنٍ خزفية قابلة للضبط. تدور قمّتاهما بمقاومةٍ هادئة مزيّتة.",
    dimensions: "Ø 6 × 22 cm each",
    artKey: "utensil",
    tags: ["cherry", "grinder", "pair"],
  },
  {
    name: "Eclipse Pendant Cluster",
    name_ar: "عنقود ثُريّات الكسوف",
    category: "lighting",
    collection: "objects",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 215,
    blurb: "Three turned walnut shades hung at three heights.",
    blurb_ar: "ثلاثة أباجورات جوزٍ مخروطة معلّقة بثلاثة ارتفاعات.",
    description:
      "Three turned walnut domes drop at staggered lengths from a shared brass canopy, each shade hollowed thin so its rim glows when lit. A single object that reads as a small constellation.",
    description_ar:
      "ثلاث قِبابٍ جوزٍ مخروطة تتدلّى بأطوالٍ متفاوتة من غطاءٍ نحاسيّ مشترك، جُوّف كل أباجورٍ رقيقًا لتتوهّج حافته عند الإضاءة. قطعةٌ واحدة تبدو كوكبةً صغيرة.",
    dimensions: "Ø 40 spread × 70 cm drop",
    artKey: "pendant",
    tags: ["walnut", "cluster", "warm-light"],
    featured: true,
  },
  {
    name: "Loom Wall Hanging Frame",
    name_ar: "إطار تعليق منسوجات النول",
    category: "wall",
    collection: "objects",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 62,
    blurb: "An oak dowel-and-stretcher for weaving or textile.",
    blurb_ar: "قضيب وشدّاد بلوطٍ للنسيج أو المنسوجات.",
    description:
      "A turned oak top dowel and tensioned base bar hold a weaving or textile taut against the wall, the cord wrapped and pegged at the ends. Made to show off handwork, not hide it.",
    description_ar:
      "قضيب بلوطٍ علويّ مخروط وعارضة قاعدةٍ مشدودة يمسكان النسيج أو المنسوجة مشدودةً على الجدار، والحبل ملفوفٌ ومثبّتٌ بأوتادٍ عند الطرفين. صُنع ليُبرز العمل اليدوي لا ليُخفيه.",
    dimensions: "50 × 4 × 90 cm",
    artKey: "wallArt",
    tags: ["oak", "textile", "hanging"],
  },
  {
    name: "Tide Pool Catch Dish",
    name_ar: "طبق بِركة المدّ",
    category: "decor",
    collection: "objects",
    wood: "Olive",
    wood_ar: "زيتون",
    price: 46,
    blurb: "A shallow olive pool for rings and small stones.",
    blurb_ar: "بِركة زيتونٍ ضحلة للخواتم والحصى الصغير.",
    description:
      "A flat olive disc dished just enough to corral rings and worry-stones, the wild grain swirling like water under glass. A perfect bedside or windowsill companion.",
    description_ar:
      "قرص زيتونٍ مسطّح مقعّر بما يكفي لجمع الخواتم وحصى التسبيح، وعروقه الجامحة تدور كالماء تحت الزجاج. رفيقٌ مثاليّ لجانب السرير أو حافّة النافذة.",
    dimensions: "Ø 16 × 3 cm",
    artKey: "tray",
    tags: ["olive", "ring-dish", "bedside"],
  },
  {
    name: "Quanat Desk Caddy",
    name_ar: "مجرى كابلات القناة للمكتب",
    category: "storage",
    collection: "objects",
    wood: "Beech",
    wood_ar: "زان",
    price: 54,
    blurb: "A beech channel that runs cables out of sight.",
    blurb_ar: "مجرى زانٍ يخفي الكابلات عن الأنظار.",
    description:
      "A long beech channel with a lift-off lid that hides a power strip and tames cables along the desk's back edge. Bored ports let only the needed leads surface.",
    description_ar:
      "مجرى زانٍ طويل بغطاءٍ قابل للرفع يخفي مشترك الكهرباء ويروّض الكابلات على طول حافة المكتب الخلفية. منافذ مثقوبة لا تُظهر إلا الأسلاك المطلوبة.",
    dimensions: "44 × 10 × 8 cm",
    artKey: "organizer",
    tags: ["beech", "cable-management", "desk"],
  },
];

// ---------------------------------------------------------------------------
// FURNITURE — 50
// ---------------------------------------------------------------------------

const furnitureDrafts: Draft[] = [
  {
    name: "Dune Lounge Chair",
    name_ar: "كرسي استرخاء الكثبان",
    category: "seating",
    collection: "furniture",
    wood: "White Oak",
    wood_ar: "بلوط أبيض",
    price: 980,
    blurb: "A low oak sling that leans you into the afternoon.",
    blurb_ar: "أرجوحة بلوطٍ منخفضة تُسندك إلى عصرٍ هادئ.",
    description:
      "A steam-bent oak frame holds a saddle-leather sling at a deep, easy recline, the arms sweeping in one continuous curve. Every joint is a hand-cut mortise wedged and pinned for a lifetime of leaning.",
    description_ar:
      "هيكل بلوطٍ مثنيّ بالبخار يحمل أرجوحة جلد سرجٍ باتّكاءةٍ عميقة مريحة، وذراعاه ينسابان في منحنًى واحد متّصل. كل وصلةٍ نقرٌ محفور يدويًا مُسفنّ ومثبّت بوتدٍ ليدوم اتّكاءً مدى العمر.",
    dimensions: "72 × 84 × 78 cm",
    artKey: "lounge",
    tags: ["oak", "leather-sling", "steam-bent"],
    featured: true,
  },
  {
    name: "Wadi Lounge Chair",
    name_ar: "كرسي استرخاء الوادي",
    category: "seating",
    collection: "furniture",
    wood: "Black Walnut",
    wood_ar: "جوز أسود",
    price: 1150,
    blurb: "A sculpted walnut shell on splayed legs.",
    blurb_ar: "صدفة جوزٍ منحوتة على قوائم متباعدة.",
    description:
      "A carved walnut seat and back, scooped to the body, float on four splayed and tapered legs joined by hidden sliding dovetails. The arms are shaped from solid stock so the grain flows uninterrupted.",
    description_ar:
      "مقعدٌ وظهرٌ من الجوز محفوران على هيئة الجسد، يطفوان على أربع قوائم متباعدة مدبّبة موصولة بذيول حمامةٍ منزلقة خفية. شُكّل الذراعان من خشبٍ صلب فتجري العروق دون انقطاع.",
    dimensions: "70 × 76 × 80 cm",
    artKey: "lounge",
    tags: ["walnut", "carved", "sculptural"],
    featured: true,
  },
  {
    name: "Petra Dining Chair",
    name_ar: "كرسي طعام البتراء",
    category: "seating",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 320,
    blurb: "A light ash chair with a gently bowed back.",
    blurb_ar: "كرسي دردارٍ خفيف بظهرٍ منحنٍ برفق.",
    description:
      "An ash dining chair with a steam-bent crest rail that cups the spine and a hand-shaped saddle seat. Round mortise-and-tenon joinery keeps it light yet rigid through years of pulling up to the table.",
    description_ar:
      "كرسي طعامٍ من الدردار بعارضةٍ علوية مثنيّة بالبخار تحتضن الظهر ومقعدٍ سرجيّ مشكّل يدويًا. وصلات النقر واللسان الدائرية تُبقيه خفيفًا ومتينًا عبر سنواتٍ من الجلوس إلى المائدة.",
    dimensions: "45 × 50 × 82 cm",
    artKey: "chair",
    tags: ["ash", "steam-bent", "dining"],
  },
  {
    name: "Jerash Dining Chair",
    name_ar: "كرسي طعام جرش",
    category: "seating",
    collection: "furniture",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 360,
    blurb: "Spindled cherry back over a saddled seat.",
    blurb_ar: "ظهر كرزٍ بأعمدةٍ فوق مقعدٍ سرجيّ.",
    description:
      "A fan of turned cherry spindles springs from a sculpted saddle seat, each spindle socketed and wedged by hand. The cherry will darken with use into a deep amber over the years.",
    description_ar:
      "مروحة من أعمدة الكرز المخروطة تنبثق من مقعدٍ سرجيّ منحوت، كل عمودٍ مركّب في تجويفٍ ومُسفنّ يدويًا. سيغمق الكرز مع الاستعمال إلى كهرمانٍ عميق على مرّ السنين.",
    dimensions: "46 × 52 × 84 cm",
    artKey: "chair",
    tags: ["cherry", "spindle-back", "dining"],
  },
  {
    name: "Souq Bar Stool",
    name_ar: "كرسي بار السوق",
    category: "seating",
    collection: "furniture",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 290,
    blurb: "A turned oak stool with a worn-saddle seat.",
    blurb_ar: "كرسي بلوطٍ مخروط بمقعدٍ سرجيّ.",
    description:
      "A counter-height oak stool with a deeply saddled seat and a single sculpted footrail polished by anticipation of use. Turned legs splay just enough to feel planted.",
    description_ar:
      "كرسي بلوطٍ بارتفاع طاولة المطبخ بمقعدٍ سرجيّ عميق ومسند قدمٍ منحوتٍ واحد لمّعه توقّع الاستعمال. قوائمه المخروطة تتباعد بما يكفي ليبدو راسخًا.",
    dimensions: "Ø 38 × 66 cm",
    artKey: "stool",
    tags: ["oak", "counter-height", "saddle-seat"],
  },
  {
    name: "Citadel Bar Stool",
    name_ar: "كرسي بار القلعة",
    category: "seating",
    collection: "furniture",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 340,
    blurb: "A tall walnut stool with a curved backrest.",
    blurb_ar: "كرسي جوزٍ عالٍ بمسند ظهرٍ منحنٍ.",
    description:
      "A bar-height walnut stool given a low bent-lamination backrest that catches the small of the back. The footrail is brass-capped where shoes will land most.",
    description_ar:
      "كرسي جوزٍ بارتفاع البار زُوّد بمسند ظهرٍ منخفض مصفّح ومثنيّ يحتضن أسفل الظهر. مسند القدم مكسوٌّ بالنحاس حيث تستقرّ الأحذية غالبًا.",
    dimensions: "42 × 46 × 98 cm",
    artKey: "stool",
    tags: ["walnut", "bar-height", "backrest"],
  },
  {
    name: "Aqaba Bench",
    name_ar: "مقعد العقبة",
    category: "seating",
    collection: "furniture",
    wood: "Teak",
    wood_ar: "ساج",
    price: 620,
    blurb: "A long teak plank on three sturdy trestles.",
    blurb_ar: "لوح ساجٍ طويل على ثلاثة حوامل متينة.",
    description:
      "A single thick teak plank, its live edge eased smooth, spans three trestle legs joined with through-wedged tenons. Teak's natural oils let it earn a silver patina or stay golden under wax.",
    description_ar:
      "لوح ساجٍ سميك واحد، لُطّفت حافته الطبيعية ناعمةً، يمتدّ فوق ثلاثة حوامل موصولة بألسنةٍ نافذة مُسفنّة. زيوت الساج الطبيعية تتيح له اكتساب لمعةٍ فضّية أو البقاء ذهبيًّا تحت الشمع.",
    dimensions: "160 × 38 × 45 cm",
    artKey: "bench",
    tags: ["teak", "live-edge", "trestle"],
    featured: true,
  },
  {
    name: "Threshold Entry Bench",
    name_ar: "مقعد مدخل العتبة",
    category: "seating",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 480,
    blurb: "An ash bench with a woven Danish-cord seat.",
    blurb_ar: "مقعد دردارٍ بجلسةٍ منسوجة من الحبل الدنماركيّ.",
    description:
      "A slim ash frame strung with hand-woven Danish paper cord, firm enough to sit and pull on boots. A lower stretcher doubles as a heel rail and a shelf edge.",
    description_ar:
      "هيكل دردارٍ نحيل مشدودٌ بحبلٍ ورقيّ دنماركيّ منسوجٍ يدويًا، متينٌ بما يكفي للجلوس وانتعال الأحذية. عارضةٌ سفلية تخدم مسندًا للكعب وحافة رفٍّ في آنٍ.",
    dimensions: "110 × 35 × 45 cm",
    artKey: "bench",
    tags: ["ash", "danish-cord", "entryway"],
  },
  {
    name: "Dana Rocking Chair",
    name_ar: "كرسي هزّاز ضانا",
    category: "seating",
    collection: "furniture",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 1250,
    blurb: "A sculpted cherry rocker that finds its own rhythm.",
    blurb_ar: "كرسي كرزٍ هزّاز منحوت يجد إيقاعه الخاص.",
    description:
      "A continuous-arm cherry rocker carved to flow from crest to arm to runner in one unbroken line. The runners are shaped by feel until the chair rocks to a stop without a lurch.",
    description_ar:
      "كرسيّ هزّاز من الكرز بذراعٍ متّصلة منحوتة لتنساب من القمّة إلى الذراع إلى الزحّافة في خطٍّ واحد غير منقطع. تُشكّل الزحّافتان بالحسّ حتى يتوقّف الكرسي عن الهزّ دون ارتجاج.",
    dimensions: "66 × 100 × 105 cm",
    artKey: "rocker",
    tags: ["cherry", "continuous-arm", "heirloom"],
    featured: true,
  },
  {
    name: "Hearth Rocking Chair",
    name_ar: "كرسي هزّاز الموقد",
    category: "seating",
    collection: "furniture",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 1180,
    blurb: "A spindled walnut rocker for long evenings.",
    blurb_ar: "كرسي جوزٍ هزّاز بأعمدةٍ لأماسٍ طويلة.",
    description:
      "A walnut rocker with a tall fan of spindles and a deeply saddled seat, built to be lived in by the fire. The runners are laminated for spring and tuned for a slow, even glide.",
    description_ar:
      "كرسيّ هزّاز من الجوز بمروحةٍ عالية من الأعمدة ومقعدٍ سرجيّ عميق، صُنع لتُمضى به الأمسيات قرب النار. زحّافتاه مصفّحتان للمرونة ومضبوطتان لانزلاقٍ بطيءٍ متساوٍ.",
    dimensions: "64 × 96 × 110 cm",
    artKey: "rocker",
    tags: ["walnut", "spindle-back", "saddle-seat"],
  },
  {
    name: "Meridian Dining Table",
    name_ar: "طاولة طعام ميريديان",
    category: "tables",
    collection: "furniture",
    wood: "Black Walnut",
    wood_ar: "جوز أسود",
    price: 1900,
    blurb: "A wide walnut top floating on a sculpted base.",
    blurb_ar: "سطح جوزٍ عريض يطفو على قاعدةٍ منحوتة.",
    description:
      "A bookmatched walnut top, butterfly-keyed across its one natural check, rests on a pair of sculpted trestle legs joined by a wedged stretcher. Built to seat eight and to be passed down.",
    description_ar:
      "سطح جوزٍ متناظر الفلق، مثبّت بمفتاح الفراشة عبر شقّه الطبيعي الوحيد، يستقرّ على حاملين منحوتين موصولين بعارضةٍ مُسفنّة. صُنع ليتّسع لثمانية ولِيُورَّث.",
    dimensions: "220 × 100 × 75 cm",
    artKey: "table",
    tags: ["walnut", "bookmatched", "butterfly-keys"],
    featured: true,
  },
  {
    name: "Jordan Valley Dining Table",
    name_ar: "طاولة طعام وادي الأردن",
    category: "tables",
    collection: "furniture",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 1450,
    blurb: "A live-edge oak table on splayed steel-free legs.",
    blurb_ar: "طاولة بلوطٍ بحافةٍ طبيعية على قوائم بلا فولاذ.",
    description:
      "A live-edge oak top, its waney edges sanded silken, sits on four canted oak legs drawbored to an underframe with no metal anywhere. Finished in a hardwax oil that takes a spill in stride.",
    description_ar:
      "سطح بلوطٍ بحافةٍ طبيعية، صُقلت حوافّه اللحائية كالحرير، يستقرّ على أربع قوائم بلوطٍ مائلة موصولة بالوتد الجاذب إلى هيكلٍ سفليّ بلا أيّ معدن. مُنهى بزيتٍ شمعيّ صلب يتحمّل أيّ انسكاب.",
    dimensions: "200 × 95 × 75 cm",
    artKey: "table",
    tags: ["oak", "live-edge", "drawbored"],
  },
  {
    name: "Round Oasis Dining Table",
    name_ar: "طاولة طعام الواحة المستديرة",
    category: "tables",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 1100,
    blurb: "A round ash top on a turned pedestal foot.",
    blurb_ar: "سطح دردارٍ مستدير على قاعدةٍ مخروطة.",
    description:
      "A circular ash top rests on a single turned column flaring into three feet, so chairs tuck anywhere around it. The grain is laid to radiate from the centre like ripples.",
    description_ar:
      "سطح دردارٍ دائريّ يستقرّ على عمودٍ مخروط واحد يتّسع إلى ثلاث أقدام، فتنزوي الكراسي حوله من أيّ مكان. رُتّبت العروق لتشعّ من المركز كالتموّجات.",
    dimensions: "Ø 130 × 75 cm",
    artKey: "table",
    tags: ["ash", "round", "pedestal"],
  },
  {
    name: "Tidewater Coffee Table",
    name_ar: "طاولة قهوة مدّ المياه",
    category: "tables",
    collection: "furniture",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 760,
    blurb: "A walnut slab on a floating shadow-gap base.",
    blurb_ar: "لوح جوزٍ على قاعدةٍ تطفو بفجوةِ ظلّ.",
    description:
      "A thick walnut top hovers over a recessed plinth so it appears to float, a single river of resin-free figure running its length. The shadow gap is fussed by hand until the float reads perfect.",
    description_ar:
      "سطح جوزٍ سميك يحوم فوق قاعدةٍ غائرة فيبدو طافيًا، يجري في طوله نهرٌ واحد من زخارف العروق. عُولجت فجوة الظلّ يدويًا حتى بدا الطفو مثاليًا.",
    dimensions: "120 × 60 × 38 cm",
    artKey: "coffeeTable",
    tags: ["walnut", "floating", "slab"],
    featured: true,
  },
  {
    name: "Nesting Dunes Coffee Tables",
    name_ar: "طاولات قهوة الكثبان المتداخلة",
    category: "tables",
    collection: "furniture",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 690,
    blurb: "Three oak tables that drift apart or tuck away.",
    blurb_ar: "ثلاث طاولات بلوطٍ تتباعد أو تنزوي معًا.",
    description:
      "Three oak tables of climbing height that nest into one footprint then scatter across a room as needed. Each top is gently dished at the edge so a hand finds it naturally.",
    description_ar:
      "ثلاث طاولات بلوطٍ بارتفاعاتٍ متصاعدة تتداخل في حيّزٍ واحد ثم تتفرّق في الغرفة حسب الحاجة. سطح كلٍّ منها مقعّر برفقٍ عند الحافة فتجده اليد طبيعيًّا.",
    dimensions: "Largest 60 × 45 × 45 cm",
    artKey: "coffeeTable",
    tags: ["oak", "nesting", "set-of-3"],
  },
  {
    name: "Pebble Side Table",
    name_ar: "طاولة جانبية الحصاة",
    category: "tables",
    collection: "furniture",
    wood: "Maple",
    wood_ar: "قيقب",
    price: 380,
    blurb: "A soft maple pebble top on three thin legs.",
    blurb_ar: "سطح قيقبٍ كالحصاة على ثلاث قوائم رفيعة.",
    description:
      "An organic pebble-shaped maple top, every edge rounded to the touch, balances on three slender splayed legs. The pale grain is left almost bare to keep it feeling weightless.",
    description_ar:
      "سطح قيقبٍ عضويّ على هيئة حصاة، كل حافةٍ منه مدوّرة للمسة، يتّزن على ثلاث قوائم نحيلة متباعدة. تُركت عروقه الشاحبة شبه عارية ليبقى الإحساس به عديم الوزن.",
    dimensions: "50 × 42 × 52 cm",
    artKey: "sideTable",
    tags: ["maple", "organic", "tripod"],
  },
  {
    name: "Cairo Drum Side Table",
    name_ar: "طاولة جانبية أسطوانة القاهرة",
    category: "tables",
    collection: "furniture",
    wood: "Beech",
    wood_ar: "زان",
    price: 340,
    blurb: "A coopered beech drum with a hidden cubby.",
    blurb_ar: "أسطوانة زانٍ مجمّعة بحجيرةٍ مخفية.",
    description:
      "A cylindrical side table coopered from beech staves, its lid lifting to reveal a hidden well for remotes and reading glasses. The staves are mitred so the seams nearly vanish.",
    description_ar:
      "طاولة جانبية أسطوانية مجمّعة من ألواح الزان كبرميل، يرتفع غطاؤها ليكشف حوضًا مخفيًّا لأجهزة التحكّم ونظّارات القراءة. الألواح مشطوفة فتكاد تختفي الوصلات.",
    dimensions: "Ø 42 × 50 cm",
    artKey: "sideTable",
    tags: ["beech", "coopered", "storage"],
  },
  {
    name: "Wadi Console",
    name_ar: "كونسول الوادي",
    category: "tables",
    collection: "furniture",
    wood: "White Oak",
    wood_ar: "بلوط أبيض",
    price: 980,
    blurb: "A slim oak console with a single floating drawer.",
    blurb_ar: "كونسول بلوطٍ نحيل بدرجٍ واحد يطفو.",
    description:
      "A narrow oak console on tapered legs carries one hand-cut dovetailed drawer that glides on waxed wooden runners. The top overhangs just enough to read as a thin, hovering plane.",
    description_ar:
      "كونسول بلوطٍ ضيّق على قوائم مدبّبة يحمل درجًا واحدًا موصولًا بذيل حمامةٍ محفور يدويًا ينزلق على مجارٍ خشبية مشمّعة. يتدلّى سطحه بما يكفي ليبدو لوحًا رفيعًا حائمًا.",
    dimensions: "140 × 35 × 80 cm",
    artKey: "console",
    tags: ["oak", "dovetail-drawer", "entryway"],
    featured: true,
  },
  {
    name: "Colonnade Console",
    name_ar: "كونسول الرواق",
    category: "tables",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 820,
    blurb: "An ash console standing on a row of slim columns.",
    blurb_ar: "كونسول دردارٍ على صفٍّ من الأعمدة النحيلة.",
    description:
      "A long ash top rests on a colonnade of turned legs evenly spaced like a small ruined portico. A lower shelf ties the legs together and holds books or baskets.",
    description_ar:
      "سطح دردارٍ طويل يستقرّ على رواقٍ من القوائم المخروطة متباعدةً بانتظامٍ كرواقٍ صغير مهدّم. رفٌّ سفليّ يربط القوائم معًا ويحمل الكتب أو السلال.",
    dimensions: "150 × 38 × 78 cm",
    artKey: "console",
    tags: ["ash", "turned-legs", "shelf"],
  },
  {
    name: "Atelier Writing Desk",
    name_ar: "مكتب الكتابة المشغل",
    category: "desk",
    collection: "furniture",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 1280,
    blurb: "A cherry desk with a leather top and twin drawers.",
    blurb_ar: "مكتب كرزٍ بسطحٍ جلديّ ودرجين توأمين.",
    description:
      "A cherry desk inset with hand-stitched leather and flanked by two dovetailed drawers on wooden runners. A shallow pencil trough is carved beneath the front lip, hidden until reached for.",
    description_ar:
      "مكتب كرزٍ مطعّم بجلدٍ مخيطٍ يدويًا يحفّه درجان موصولان بذيل الحمامة على مجارٍ خشبية. حُفر تجويفٌ ضحل للأقلام تحت الحافة الأمامية، مخفيٌّ حتى تمتدّ إليه اليد.",
    dimensions: "140 × 65 × 76 cm",
    artKey: "desk",
    tags: ["cherry", "leather-top", "dovetail-drawers"],
    featured: true,
  },
  {
    name: "Scholar's Slope Desk",
    name_ar: "مكتب منحدر العالِم",
    category: "desk",
    collection: "furniture",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 1150,
    blurb: "A walnut desk whose lid tilts to a reading slope.",
    blurb_ar: "مكتب جوزٍ يميل سطحه إلى منحدر قراءة.",
    description:
      "A walnut writing desk with a top that hinges to a gentle slope for reading and sketching, locking flat for the laptop. The hinge is a hand-fitted wooden knuckle, smooth and silent.",
    description_ar:
      "مكتب كتابةٍ من الجوز بسطحٍ يُفصّل إلى منحدرٍ لطيف للقراءة والرسم، ويثبت مستويًا للحاسوب المحمول. المفصّل مفصلةٌ خشبية مركّبة يدويًا، ناعمة وصامتة.",
    dimensions: "120 × 60 × 78 cm",
    artKey: "desk",
    tags: ["walnut", "tilting-top", "writing"],
  },
  {
    name: "Meridian Standing Desk",
    name_ar: "مكتب الوقوف ميريديان",
    category: "desk",
    collection: "furniture",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 1350,
    blurb: "An oak desk that rises on a hand-cranked column.",
    blurb_ar: "مكتب بلوطٍ يرتفع على عمودٍ يُدار يدويًا.",
    description:
      "An oak desktop rides a pair of hand-built wooden screw columns, cranked from sit to stand with a satisfying turn. The mechanism is exposed and oiled, made to be admired rather than hidden.",
    description_ar:
      "سطح مكتبٍ من البلوط يعلو عمودَي لولبٍ خشبيين مصنوعين يدويًا، يُدار من الجلوس إلى الوقوف بلفّةٍ مُرضية. الآلية مكشوفة ومزيّتة، صُنعت لتُعجَب بها لا لتُخفى.",
    dimensions: "150 × 70 × 72–112 cm",
    artKey: "desk",
    tags: ["oak", "standing", "hand-crank"],
  },
  {
    name: "Citadel Bookshelf",
    name_ar: "مكتبة القلعة",
    category: "storage",
    collection: "furniture",
    wood: "White Oak",
    wood_ar: "بلوط أبيض",
    price: 1400,
    blurb: "A tall oak tower with stepped, climbing shelves.",
    blurb_ar: "برج بلوطٍ عالٍ بأرففٍ متدرّجة صاعدة.",
    description:
      "An oak bookcase whose shelves step in width as they rise, narrowing like a watchtower so it reads as architecture. Every shelf is housed in a stopped dado, no fasteners showing.",
    description_ar:
      "مكتبة بلوطٍ تضيق أرففها عرضًا كلما ارتفعت، متناقصةً كبرج مراقبة فتبدو عمارةً قائمة. كل رفٍّ مركّب في حزٍّ موقوف دون ظهور أيّ مثبّتات.",
    dimensions: "90 × 35 × 210 cm",
    artKey: "shelf",
    tags: ["oak", "stepped", "dado-joinery"],
    featured: true,
  },
  {
    name: "Ladder Lean Bookshelf",
    name_ar: "مكتبة السلّم المائلة",
    category: "storage",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 760,
    blurb: "An ash ladder of shelves leaning to the wall.",
    blurb_ar: "سلّم أرففٍ من الدردار يتّكئ على الجدار.",
    description:
      "A leaning ash shelf of climbing-depth tiers, the lowest deep for art books and the highest slim for paperbacks. A discreet wall strap keeps it from tipping.",
    description_ar:
      "رفّ دردارٍ مائل بطبقاتٍ متدرّجة العمق، أدناها عميقٌ لكتب الفنّ وأعلاها نحيلٌ للكتب الورقية. شريط جدارٍ خفيّ يمنعه من الميل.",
    dimensions: "70 × 40 × 180 cm",
    artKey: "shelf",
    tags: ["ash", "leaning", "graduated"],
  },
  {
    name: "Honeycomb Wall Shelf",
    name_ar: "رفّ جدار خليّة النحل",
    category: "storage",
    collection: "furniture",
    wood: "Beech",
    wood_ar: "زان",
    price: 540,
    blurb: "Hexagonal beech cells that cluster across a wall.",
    blurb_ar: "خلايا زانٍ سداسية تتجمّع على الجدار.",
    description:
      "A cluster of mitred beech hexagons that bolt together into any constellation you like, each cell a little display niche. The mitres are splined so the corners stay knife-sharp.",
    description_ar:
      "عنقودٌ من سداسيّات الزان المشطوفة تتعاشق معًا في أيّ كوكبةٍ تشاء، كل خليّةٍ حنيّة عرضٍ صغيرة. الشطفات مفنّنة فتبقى الزوايا حادّة كالسكين.",
    dimensions: "Each cell 30 × 30 × 18 cm",
    artKey: "shelf",
    tags: ["beech", "hexagon", "modular"],
  },
  {
    name: "Wadi Rum Sideboard",
    name_ar: "بوفيه وادي رم",
    category: "storage",
    collection: "furniture",
    wood: "Black Walnut",
    wood_ar: "جوز أسود",
    price: 1850,
    blurb: "A long walnut credenza with carved ripple doors.",
    blurb_ar: "بوفيه جوزٍ طويل بأبوابٍ محفورة كالتموّجات.",
    description:
      "A low walnut sideboard whose door fronts are carved in shallow ripples that catch raking light like dunes at dusk. Inside, dovetailed drawers and adjustable shelves glide on wooden runners.",
    description_ar:
      "بوفيه جوزٍ منخفض حُفرت واجهات أبوابه بتموّجاتٍ ضحلة تلتقط الضوء المائل ككثبانٍ عند الغسق. في الداخل، أدراجٌ موصولة بذيل الحمامة وأرففٌ قابلة للضبط تنزلق على مجارٍ خشبية.",
    dimensions: "180 × 45 × 75 cm",
    artKey: "cabinet",
    tags: ["walnut", "carved-doors", "credenza"],
    featured: true,
  },
  {
    name: "Courtyard Sideboard",
    name_ar: "بوفيه الفناء",
    category: "storage",
    collection: "furniture",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 1500,
    blurb: "An oak sideboard fronted with woven cane panels.",
    blurb_ar: "بوفيه بلوطٍ بواجهةٍ من ألواح الخيزران المنسوج.",
    description:
      "An oak sideboard whose doors are framed around hand-woven cane that breathes and softens the mass. Solid brass pulls are turned in-house to a small worn-pebble shape.",
    description_ar:
      "بوفيه بلوطٍ أبوابه مؤطّرة حول خيزرانٍ منسوج يدويًا يتنفّس ويخفّف من ثِقل الكتلة. مقابضه من النحاس الصلب مخروطة في الورشة على هيئة حصاةٍ صغيرة.",
    dimensions: "160 × 45 × 80 cm",
    artKey: "cabinet",
    tags: ["oak", "cane", "brass-pulls"],
  },
  {
    name: "Atlas Wardrobe",
    name_ar: "خزانة أطلس",
    category: "storage",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 1800,
    blurb: "A tall ash wardrobe with full-height fluted doors.",
    blurb_ar: "خزانة دردارٍ عالية بأبوابٍ محزّزة بكامل الارتفاع.",
    description:
      "A floor-to-near-ceiling ash wardrobe whose doors are fluted top to bottom, the reeds hand-planed so each catches light differently. A cedar-lined interior keeps woollens fragrant and safe.",
    description_ar:
      "خزانة دردارٍ من الأرض إلى ما يقارب السقف، أبوابها محزّزة من أعلاها إلى أسفلها، حُزوزها مسحوجة يدويًا فيلتقط كلٌّ منها الضوء على نحوٍ مختلف. داخلٌ مبطّن بالأرز يُبقي الصوف عطرًا وآمنًا.",
    dimensions: "120 × 60 × 210 cm",
    artKey: "cabinet",
    tags: ["ash", "fluted", "cedar-lined"],
  },
  {
    name: "Sahara Six-Drawer Dresser",
    name_ar: "خزانة أدراج الصحراء السداسية",
    category: "storage",
    collection: "furniture",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 1650,
    blurb: "A cherry dresser of six soft-running drawers.",
    blurb_ar: "خزانة كرزٍ بستة أدراجٍ تنزلق بنعومة.",
    description:
      "A cherry dresser of six hand-fitted dovetailed drawers, each riding wooden runners waxed to glide shut with a whisper. The pulls are sculpted finger-pockets carved into the drawer face itself.",
    description_ar:
      "خزانة كرزٍ بستة أدراجٍ موصولة بذيل الحمامة ومركّبة يدويًا، يجري كلٌّ منها على مجارٍ خشبية مشمّعة لينغلق بانسيابةٍ كالهمس. المقابض جيوب أصابعٍ منحوتة في وجه الدرج ذاته.",
    dimensions: "110 × 50 × 90 cm",
    artKey: "dresser",
    tags: ["cherry", "dovetail-drawers", "finger-pull"],
    featured: true,
  },
  {
    name: "Mesa Lowboy Dresser",
    name_ar: "خزانة أدراج ميسا المنخفضة",
    category: "storage",
    collection: "furniture",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 1450,
    blurb: "A wide low walnut dresser on tapered legs.",
    blurb_ar: "خزانة جوزٍ عريضة منخفضة على قوائم مدبّبة.",
    description:
      "A long, low walnut dresser raised on splayed tapered legs so it floats above the floor, three wide drawers spanning its face. The top is a single bookmatched board, mirror-figured.",
    description_ar:
      "خزانة جوزٍ طويلة منخفضة مرفوعة على قوائم متباعدة مدبّبة فتطفو فوق الأرض، تمتدّ في واجهتها ثلاثة أدراجٍ عريضة. سطحها لوحٌ واحد متناظر الفلق، زخارفه منعكسة كالمرآة.",
    dimensions: "150 × 48 × 70 cm",
    artKey: "dresser",
    tags: ["walnut", "lowboy", "tapered-legs"],
  },
  {
    name: "Quiet Plains Bed Frame",
    name_ar: "هيكل سرير السهول الهادئة",
    category: "storage",
    collection: "furniture",
    wood: "White Oak",
    wood_ar: "بلوط أبيض",
    price: 1700,
    blurb: "A low oak platform with a softly angled headboard.",
    blurb_ar: "منصّة بلوطٍ منخفضة بلوح رأسٍ مائلٍ برفق.",
    description:
      "A low oak platform bed with a gently raked headboard shaped to lean against, all joined with exposed wedged tenons. The slat base is sprung subtly for a forgiving night.",
    description_ar:
      "سرير منصّةٍ بلوطيّ منخفض بلوح رأسٍ مائلٍ برفقٍ مشكّلٍ للاتّكاء، كله موصولٌ بألسنةٍ مُسفنّة مكشوفة. قاعدة الشرائح ذات مرونةٍ خفية لليلةٍ متسامحة.",
    dimensions: "165 × 215 × 95 cm",
    artKey: "bed",
    tags: ["oak", "platform", "wedged-tenons"],
    featured: true,
  },
  {
    name: "Caravanserai Canopy Bed",
    name_ar: "سرير مظلّة الخان",
    category: "storage",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 1880,
    blurb: "A slender ash four-poster framing open sky.",
    blurb_ar: "سرير دردارٍ بأربعة أعمدةٍ نحيلة يؤطّر سماءً مفتوحة.",
    description:
      "A four-poster in ash kept deliberately slim so it frames the room like a drawing rather than filling it. The posts knock down with bridle joints and bronze pins for moving day.",
    description_ar:
      "سرير بأربعة أعمدةٍ من الدردار أُبقي نحيلًا عن قصدٍ ليؤطّر الغرفة كرسمٍ لا ليملأها. تُفكّ أعمدته بوصلات لجامٍ وأوتاد برونزٍ ليوم الانتقال.",
    dimensions: "165 × 215 × 200 cm",
    artKey: "bed",
    tags: ["ash", "four-poster", "knock-down"],
  },
  {
    name: "Moonrise Nightstand",
    name_ar: "كومودينو شروق القمر",
    category: "storage",
    collection: "furniture",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 520,
    blurb: "A walnut nightstand with a curved open shelf.",
    blurb_ar: "كومودينو جوزٍ برفٍّ مفتوح منحنٍ.",
    description:
      "A compact walnut nightstand with one soft-close drawer above a curved open shelf for the night's book. A shallow rim around the top keeps a glass from wandering.",
    description_ar:
      "كومودينو جوزٍ صغير بدرجٍ واحد ناعم الإغلاق فوق رفٍّ مفتوح منحنٍ لكتاب الليل. حافةٌ ضحلة حول السطح تمنع الكوب من التزحلق.",
    dimensions: "45 × 40 × 55 cm",
    artKey: "nightstand",
    tags: ["walnut", "drawer", "open-shelf"],
  },
  {
    name: "Cradle Nightstand",
    name_ar: "كومودينو المهد",
    category: "storage",
    collection: "furniture",
    wood: "Cherry",
    wood_ar: "كرز",
    price: 480,
    blurb: "A cherry nightstand cradled on a bent-wood loop.",
    blurb_ar: "كومودينو كرزٍ يحتضنه حلقةٌ خشبية مثنيّة.",
    description:
      "A small cherry box of drawers nests inside a single steam-bent loop that forms both legs and handle in one gesture. The loop is laminated thin so it springs without cracking.",
    description_ar:
      "صندوق أدراجٍ صغير من الكرز يستقرّ داخل حلقةٍ واحدة مثنيّة بالبخار تشكّل القوائم والمقبض في حركةٍ واحدة. الحلقة مصفّحة رقيقةً فتنثني دون أن تتشقّق.",
    dimensions: "42 × 38 × 56 cm",
    artKey: "nightstand",
    tags: ["cherry", "steam-bent", "loop-base"],
  },
  {
    name: "Souk Shoe Cabinet",
    name_ar: "خزانة أحذية السوق",
    category: "storage",
    collection: "furniture",
    wood: "Beech",
    wood_ar: "زان",
    price: 640,
    blurb: "A beech cabinet of tilting shoe drawers.",
    blurb_ar: "خزانة زانٍ بأدراج أحذيةٍ مائلة.",
    description:
      "A slim beech hall cabinet whose drawers tilt open like louvres to stack shoes on edge, keeping the footprint shallow. A padded top doubles as a perch for lacing up.",
    description_ar:
      "خزانة مدخلٍ نحيلة من الزان تنفتح أدراجها مائلةً كالمصاريع لتصفّ الأحذية على حافّتها، فيبقى حيّزها ضحلًا. سطحٌ مبطّن يخدم مجلسًا لربط الأحذية.",
    dimensions: "90 × 24 × 110 cm",
    artKey: "cabinet",
    tags: ["beech", "tilt-drawers", "shallow"],
  },
  {
    name: "Gallery TV Console",
    name_ar: "كونسول تلفاز المعرض",
    category: "storage",
    collection: "furniture",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 1100,
    blurb: "A long oak media console with cane-vented doors.",
    blurb_ar: "كونسول وسائط بلوطٍ بأبوابٍ مهوّاة بالخيزران.",
    description:
      "A low oak media unit with cane-fronted doors that hide gear while letting remotes pass and components breathe. A routed spine channels every cable out of sight to a single exit.",
    description_ar:
      "وحدة وسائط بلوطٍ منخفضة بأبوابٍ خيزرانية الواجهة تُخفي الأجهزة مع تمرير أجهزة التحكّم وتنفّس المكوّنات. مجرى محفور في الظهر يوجّه كل كابلٍ بعيدًا عن النظر إلى مخرجٍ واحد.",
    dimensions: "170 × 42 × 50 cm",
    artKey: "cabinet",
    tags: ["oak", "cane-vented", "cable-routed"],
  },
  {
    name: "Strata Shelving System",
    name_ar: "نظام أرفف الطبقات",
    category: "storage",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 1250,
    blurb: "An ash ladder-and-plank system you compose freely.",
    blurb_ar: "نظام قوائم وألواح دردارٍ تركّبه بحريّة.",
    description:
      "Pairs of ash uprights notched at intervals accept planks at any height, so the wall of shelving grows and shifts with you. No tools and no hardware — gravity and good joinery hold it.",
    description_ar:
      "أزواجٌ من قوائم الدردار محزّزة على مسافاتٍ تتقبّل الألواح بأيّ ارتفاع، فينمو جدار الأرفف ويتبدّل معك. بلا أدواتٍ ولا مثبّتات، تحمله الجاذبية ووصلاتٌ متقنة.",
    dimensions: "200 × 32 × 200 cm",
    artKey: "shelf",
    tags: ["ash", "modular", "tool-free"],
    featured: true,
  },
  {
    name: "Hall Tree of Dana",
    name_ar: "شجرة معاطف ضانا",
    category: "storage",
    collection: "furniture",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 780,
    blurb: "A branching walnut tree for coats and hats.",
    blurb_ar: "شجرة جوزٍ متفرّعة للمعاطف والقبّعات.",
    description:
      "A turned walnut trunk sprouts shaped branches at staggered heights for coats, scarves and hats, the tips rounded so nothing snags. A weighted base keeps it upright under a winter's load.",
    description_ar:
      "جذع جوزٍ مخروط تتفرّع منه أغصانٌ مشكّلة بارتفاعاتٍ متفاوتة للمعاطف والأوشحة والقبّعات، أطرافها مدوّرة فلا يعلق بها شيء. قاعدةٌ مثقّلة تُبقيها منتصبةً تحت حمل الشتاء.",
    dimensions: "Ø 50 × 185 cm",
    artKey: "shelf",
    tags: ["walnut", "coat-tree", "turned"],
  },
  {
    name: "Credenza of Jerash",
    name_ar: "بوفيه جرش",
    category: "storage",
    collection: "furniture",
    wood: "Teak",
    wood_ar: "ساج",
    price: 1550,
    blurb: "A teak credenza with tambour doors that roll away.",
    blurb_ar: "بوفيه ساجٍ بأبوابٍ شريحية تنزلق بعيدًا.",
    description:
      "A teak credenza fitted with tambour doors that roll silently into the case to reveal the interior whole. The slats are glued to canvas and waxed so they whisper rather than rattle.",
    description_ar:
      "بوفيه ساجٍ مزوّد بأبوابٍ شريحية تنزلق بصمتٍ داخل الهيكل لتكشف الداخل كاملًا. الشرائح ملصقة بقماش الكنفا ومشمّعة فتهمس بدل أن تخشخش.",
    dimensions: "180 × 45 × 78 cm",
    artKey: "cabinet",
    tags: ["teak", "tambour", "credenza"],
    featured: true,
  },
  {
    name: "Anvil Coffee Table",
    name_ar: "طاولة قهوة السندان",
    category: "tables",
    collection: "furniture",
    wood: "Acacia",
    wood_ar: "أكاسيا/سنط",
    price: 720,
    blurb: "A chunky acacia top on a single carved plinth.",
    blurb_ar: "سطح أكاسيا ضخم على قاعدةٍ منحوتة واحدة.",
    description:
      "A thick acacia top with wild streaking sits on one bold carved plinth, the whole thing reading like a found stone. The plinth is hollowed within so it stays liftable by two.",
    description_ar:
      "سطح أكاسيا سميك بخطوطٍ جامحة يستقرّ على قاعدةٍ منحوتة جريئة واحدة، فتبدو القطعة كلها كحجرٍ منحوت طبيعيًّا. جُوّفت القاعدة من الداخل لتبقى قابلةً للرفع بشخصين.",
    dimensions: "110 × 65 × 36 cm",
    artKey: "coffeeTable",
    tags: ["acacia", "plinth", "monolithic"],
  },
  {
    name: "Reed Lounge Chair",
    name_ar: "كرسي استرخاء القصب",
    category: "seating",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 890,
    blurb: "A bent-ash frame with a woven cord seat.",
    blurb_ar: "هيكل دردارٍ مثنيّ بجلسةٍ منسوجة من الحبل.",
    description:
      "A lightweight ash lounge frame, all sweeping bent members, strung with a woven cord seat and back that flex to the body. Built to be carried with one hand to the balcony.",
    description_ar:
      "هيكل استرخاءٍ خفيف من الدردار، كله أعضاءٌ منحنية منسابة، مشدودٌ بمقعدٍ وظهرٍ منسوجين من الحبل ينثنيان مع الجسد. صُنع ليُحمل بيدٍ واحدة إلى الشرفة.",
    dimensions: "68 × 80 × 76 cm",
    artKey: "lounge",
    tags: ["ash", "woven-cord", "lightweight"],
  },
  {
    name: "Pasha Bench",
    name_ar: "مقعد الباشا",
    category: "seating",
    collection: "furniture",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 740,
    blurb: "An upholstered walnut bench on sled runners.",
    blurb_ar: "مقعد جوزٍ منجّد على زلّاجتين.",
    description:
      "A walnut bench on shaped sled runners, its long cushion buttoned in wool over a webbed base. The exposed frame is detailed with a fine bullnose that invites a trailing hand.",
    description_ar:
      "مقعد جوزٍ على زلّاجتين مشكّلتين، وسادته الطويلة مزرّرة بالصوف فوق قاعدةٍ مشبّكة. هيكله المكشوف منمّق بحافةٍ مدوّرة دقيقة تدعو اليد إلى ملامسته.",
    dimensions: "140 × 40 × 45 cm",
    artKey: "bench",
    tags: ["walnut", "upholstered", "sled-base"],
  },
  {
    name: "Perch Counter Stool",
    name_ar: "كرسي مطبخ المجثم",
    category: "seating",
    collection: "furniture",
    wood: "Maple",
    wood_ar: "قيقب",
    price: 260,
    blurb: "A pale maple stool with a tractor-style seat.",
    blurb_ar: "كرسي قيقبٍ شاحب بمقعدٍ على طراز الجرّار.",
    description:
      "A maple counter stool with a pressed-and-carved tractor seat that cups comfortably for a quick meal. The splayed legs are joined by stretchers worn smooth for resting heels.",
    description_ar:
      "كرسي مطبخٍ من القيقب بمقعدٍ مكبوسٍ ومنحوت على طراز الجرّار يحتضن الجالس بمريّةٍ لوجبةٍ سريعة. قوائمه المتباعدة موصولة بعوارض لُمّست ناعمةً لإراحة الكعبين.",
    dimensions: "Ø 36 × 65 cm",
    artKey: "stool",
    tags: ["maple", "tractor-seat", "counter"],
  },
  {
    name: "Origami Side Table",
    name_ar: "طاولة جانبية الأوريغامي",
    category: "tables",
    collection: "furniture",
    wood: "Oak",
    wood_ar: "بلوط",
    price: 410,
    blurb: "An oak table that reads like folded paper.",
    blurb_ar: "طاولة بلوطٍ تبدو كورقٍ مطويّ.",
    description:
      "An oak side table whose faceted legs and top look creased and folded from a single sheet, every angle precisely mitred and splined. The crisp planes make a small table feel like sculpture.",
    description_ar:
      "طاولة بلوطٍ جانبية تبدو قوائمها وسطحها المضلّعان مثنيَّين ومطويَّين من ورقةٍ واحدة، كل زاويةٍ مشطوفة ومفنّنة بدقّة. أوجهها الحادّة تجعل الطاولة الصغيرة تبدو منحوتة.",
    dimensions: "45 × 45 × 50 cm",
    artKey: "sideTable",
    tags: ["oak", "faceted", "mitred"],
  },
  {
    name: "Loom Writing Desk",
    name_ar: "مكتب كتابة النول",
    category: "desk",
    collection: "furniture",
    wood: "Ash",
    wood_ar: "دردار",
    price: 980,
    blurb: "A compact ash desk with a woven-cane underslung tray.",
    blurb_ar: "مكتب دردارٍ صغير بصينيةٍ من الخيزران المنسوج أسفله.",
    description:
      "A petite ash desk for tight rooms, with a single drawer and a woven cane tray slung beneath for papers. The legs taper to a delicate foot so it never crowds the corner.",
    description_ar:
      "مكتب دردارٍ صغير للغرف الضيّقة، بدرجٍ واحد وصينية خيزرانٍ منسوجة معلّقة أسفله للأوراق. تتدبّب قوائمه إلى قدمٍ رقيقة فلا يزدحم في الزاوية أبدًا.",
    dimensions: "110 × 55 × 76 cm",
    artKey: "desk",
    tags: ["ash", "cane-tray", "compact"],
  },
  {
    name: "Quarry Console",
    name_ar: "كونسول المحجر",
    category: "tables",
    collection: "furniture",
    wood: "Walnut",
    wood_ar: "جوز",
    price: 1050,
    blurb: "A walnut console split by a stone-like fissure.",
    blurb_ar: "كونسول جوزٍ يشقّه صدعٌ كصدع الحجر.",
    description:
      "A walnut console whose top is parted by a hand-carved fissure bridged with brass, as if cracked and pinned back together. Two cubbies flank the gap for keys and letters.",
    description_ar:
      "كونسول جوزٍ يقسم سطحه صدعٌ محفور يدويًا مجسورٌ بالنحاس، كأنّه تشقّق ثم ثُبّت معًا. تحفّ الفجوةَ حجيرتان للمفاتيح والرسائل.",
    dimensions: "150 × 36 × 80 cm",
    artKey: "console",
    tags: ["walnut", "brass-bridge", "sculptural"],
  },
  {
    name: "Almond Blossom Dining Chair",
    name_ar: "كرسي طعام زهر اللوز",
    category: "seating",
    collection: "furniture",
    wood: "Maple",
    wood_ar: "قيقب",
    price: 300,
    blurb: "A pale maple chair with a pierced blossom back.",
    blurb_ar: "كرسي قيقبٍ شاحب بظهرٍ مثقوب بزهرٍ.",
    description:
      "A maple dining chair whose backrest is pierced with a stylised almond-blossom motif, lightening the chair and casting petal shadows. The saddle seat is hand-scooped for a long dinner.",
    description_ar:
      "كرسي طعامٍ من القيقب ظهره مثقوبٌ بزخرفةٍ منمّقة لزهر اللوز، تخفّف الكرسي وتلقي ظلال البتلات. مقعده السرجيّ محفورٌ يدويًا لعشاءٍ طويل.",
    dimensions: "45 × 50 × 84 cm",
    artKey: "chair",
    tags: ["maple", "pierced-back", "dining"],
  },
  {
    name: "Dead Sea Float Coffee Table",
    name_ar: "طاولة قهوة طفو البحر الميت",
    category: "tables",
    collection: "furniture",
    wood: "White Oak",
    wood_ar: "بلوط أبيض",
    price: 840,
    blurb: "An oak top that seems to float on a glass-clear gap.",
    blurb_ar: "سطح بلوطٍ يبدو طافيًا فوق فجوةٍ شفّافة.",
    description:
      "An oak coffee table whose top is cantilevered off a hidden steel-free spine so it appears to float weightless above its base. The illusion is tuned by hand until the eye refuses to find the support.",
    description_ar:
      "طاولة قهوةٍ من البلوط سطحها محمولٌ على ذراعٍ ناتئة من عمودٍ خفيّ بلا فولاذ فيبدو طافيًا بلا وزنٍ فوق قاعدته. عُولج الوهم يدويًا حتى تعجز العين عن إيجاد الدعامة.",
    dimensions: "130 × 65 × 36 cm",
    artKey: "coffeeTable",
    tags: ["oak", "cantilever", "floating"],
  },
];

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const products: Product[] = build([...objectDrafts, ...furnitureDrafts]);

export const categories: {
  key: WoodCategory;
  label: string;
  label_ar: string;
}[] = [
  { key: "seating", label: "Seating", label_ar: "مقاعد" },
  { key: "tables", label: "Tables", label_ar: "طاولات" },
  { key: "desk", label: "Desks", label_ar: "مكاتب" },
  { key: "storage", label: "Storage", label_ar: "تخزين" },
  { key: "lighting", label: "Lighting", label_ar: "إضاءة" },
  { key: "decor", label: "Decor", label_ar: "ديكور" },
  { key: "kitchenware", label: "Kitchenware", label_ar: "أدوات مطبخ" },
  { key: "wall", label: "Wall", label_ar: "حائط" },
];

export const collections: {
  key: Collection;
  label: string;
  label_ar: string;
}[] = [
  { key: "objects", label: "Objects", label_ar: "قطع وأشياء" },
  { key: "furniture", label: "Furniture", label_ar: "أثاث" },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(p: Product, n = 4): Product[] {
  const scored = products
    .filter((q) => q.id !== p.id)
    .map((q) => {
      let score = 0;
      if (q.category === p.category) score += 2;
      if (q.wood === p.wood) score += 1;
      if (q.collection === p.collection) score += 1;
      return { q, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.q.id.localeCompare(b.q.id));
  return scored.slice(0, n).map((x) => x.q);
}

export const woods: string[] = Array.from(
  new Set(products.map((p) => p.wood))
).sort();
