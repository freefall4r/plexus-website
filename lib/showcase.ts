// The Showcase — selected one-off pieces and commissions, shown without
// pricing. Each piece is a few lines here; add a new one by appending an
// entry and dropping its images into public/showcase-media/<slug>/.

type Bi = { en: string; ar: string };

export type ShowcasePiece = {
  slug: string;
  name: Bi;
  /** One quiet line under the name — material · size · technique. */
  line: Bi;
  /** 2–3 sentence story shown on the piece page. */
  story: Bi;
  /** Small facts strip on the piece page. */
  facts: Bi[];
  card: string;
  hero: string;
  gallery: { src: string; caption: Bi }[];
  video?: { src: string; poster: string; caption: Bi };
  /** If set, the card links here instead of /showcase/<slug> (NAWAH's microsite). */
  externalHref?: string;
};

const M = "/showcase-media";

export const showcasePieces: ShowcasePiece[] = [
  {
    slug: "nawah",
    name: { en: "NAWAH — Reading Pod", ar: "نواة — كبسولة قراءة" },
    line: {
      en: "Nested birch-ply rings · a room within a room",
      ar: "حلقات متداخلة من خشب البتولا · غرفة داخل غرفة",
    },
    story: {
      en: "A sculptural reading pod built from sixteen nested rings of birch plywood — every ring cut whole from flat sheet, no joints anywhere. It has its own full presentation.",
      ar: "كبسولة قراءة منحوتة من ستة عشر حلقة متداخلة من خشب البتولا الرقائقي — كل حلقة مقطوعة كاملة من لوح مسطّح، دون أي وصلات. لها عرض تقديمي كامل خاص بها.",
    },
    facts: [],
    card: `${M}/nawah/card.jpg`,
    hero: `${M}/nawah/card.jpg`,
    gallery: [],
    externalHref: "/showcase/nawah",
  },
  {
    slug: "alhambra-light",
    name: { en: "The Alhambra Light", ar: "إضاءة الحمراء" },
    line: {
      en: "Backlit mashrabiya panel · cherry · 38 × 38 cm",
      ar: "لوحة مشربية مضاءة · خشب الكرز · ٣٨ × ٣٨ سم",
    },
    story: {
      en: "A wall light drawn from the pinwheel tilework of the Alhambra. The pattern is redrawn line by line, laser-cut into a solid cherry panel, and backlit so the geometry falls across the wall as shadow.",
      ar: "إضاءة جدارية مستوحاة من زخارف قصر الحمراء الدوّارة. أُعيد رسم النقش خطًا بخط، ثم قُطع بالليزر في لوح من خشب الكرز، وأُضيء من الخلف لتنعكس الهندسة على الجدار ظلًا.",
    },
    facts: [
      { en: "Solid cherry", ar: "خشب كرز صلب" },
      { en: "38 × 38 cm", ar: "٣٨ × ٣٨ سم" },
      { en: "Laser-cut pinwheel mashrabiya", ar: "مشربية دوّارة مقطوعة بالليزر" },
      { en: "Warm LED backlight", ar: "إضاءة خلفية دافئة LED" },
    ],
    card: `${M}/alhambra-light/card.jpg`,
    hero: `${M}/alhambra-light/hero.jpg`,
    gallery: [
      {
        src: `${M}/alhambra-light/pattern.jpg`,
        caption: { en: "The redrawn pattern", ar: "النقش المُعاد رسمه" },
      },
      {
        src: `${M}/alhambra-light/inspiration.jpg`,
        caption: { en: "The original Alhambra tilework", ar: "الزخرفة الأصلية في قصر الحمراء" },
      },
    ],
  },
  {
    slug: "lion-cane",
    name: { en: "The Lion-Head Cane", ar: "عصا رأس الأسد" },
    line: {
      en: "Carved head · oak, brass & bronze studies",
      ar: "رأس منحوت · دراسات بالبلوط والنحاس والبرونز",
    },
    story: {
      en: "A walking cane with a fully sculpted lion head, studied in oak, brass and bronze before the final piece. The head is carved in the round; the shaft is turned and finished by hand.",
      ar: "عصا مشي برأس أسد منحوت بالكامل، دُرس بالبلوط والنحاس والبرونز قبل القطعة النهائية. الرأس منحوت من كل الجهات، والساق مخروطة ومُنهاة يدويًا.",
    },
    facts: [
      { en: "Sculpted lion head", ar: "رأس أسد منحوت" },
      { en: "Oak · brass · bronze studies", ar: "دراسات بلوط · نحاس · برونز" },
      { en: "Hand-turned shaft", ar: "ساق مخروطة يدويًا" },
    ],
    card: `${M}/lion-cane/head-brass.jpg`,
    hero: `${M}/lion-cane/hero.jpg`,
    gallery: [
      { src: `${M}/lion-cane/head-oak.jpg`, caption: { en: "The head in oak", ar: "الرأس بخشب البلوط" } },
      { src: `${M}/lion-cane/head-brass.jpg`, caption: { en: "Brass study", ar: "دراسة بالنحاس" } },
      { src: `${M}/lion-cane/head-bronze.jpg`, caption: { en: "Bronze study", ar: "دراسة بالبرونز" } },
      { src: `${M}/lion-cane/velvet.jpg`, caption: { en: "The full cane", ar: "العصا كاملة" } },
      {
        src: `${M}/lion-cane/sabertooth.jpg`,
        caption: { en: "A sabertooth variation, carved in oak", ar: "نسخة بأنياب السيف منحوتة بالبلوط" },
      },
    ],
  },
  {
    slug: "wedding-tree",
    name: { en: "The Wedding Guest Tree", ar: "شجرة ضيوف العرس" },
    line: {
      en: "Guestbook relief · solid beech · 180 signing leaves",
      ar: "لوحة ضيوف بارزة · خشب زان صلب · ١٨٠ ورقة للتوقيع",
    },
    story: {
      en: "A guestbook that becomes a piece of furniture. A tree is relief-carved into a solid beech panel; guests sign small wooden leaves that snap onto the canopy with hidden magnets — and the finished tree hangs in the couple's home for good.",
      ar: "دفتر ضيوف يتحوّل إلى قطعة فنية. شجرة منحوتة نحتًا بارزًا في لوح زان صلب، يوقّع الضيوف على أوراق خشبية صغيرة تُثبَّت على الأغصان بمغناطيسات مخفية — لتبقى الشجرة معلّقة في بيت العروسين إلى الأبد.",
    },
    facts: [
      { en: "Solid beech relief", ar: "نحت بارز بخشب الزان" },
      { en: "55 × 70 cm panel", ar: "لوح ٥٥ × ٧٠ سم" },
      { en: "180 laser-cut signing leaves", ar: "١٨٠ ورقة توقيع مقطوعة بالليزر" },
      { en: "Hidden magnet mounting", ar: "تثبيت بمغناطيسات مخفية" },
    ],
    card: `${M}/wedding-tree/card.jpg`,
    hero: `${M}/wedding-tree/hero.jpg`,
    gallery: [
      { src: `${M}/wedding-tree/render-2.jpg`, caption: { en: "In the home, after the wedding", ar: "في البيت، بعد العرس" } },
      { src: `${M}/wedding-tree/cut-plan.jpg`, caption: { en: "The laser nest for the leaves", ar: "مخطط قصّ الأوراق بالليزر" } },
    ],
    // Full standalone presentation (magnet-canopy rev D) in public/showcase/tree/
    externalHref: "/showcase/tree",
  },
  {
    slug: "oak-table",
    name: { en: "The Oak Dining Table", ar: "طاولة الطعام من البلوط" },
    line: {
      en: "Solid oak · built and finished in the workshop",
      ar: "بلوط صلب · صُنعت وأُنهيت في الورشة",
    },
    story: {
      en: "A solid oak dining table, joined, glued and finished entirely in the workshop — real timber, real joinery, photographed on the workshop floor the day it was finished.",
      ar: "طاولة طعام من البلوط الصلب، جُمعت ولُصقت وأُنهيت بالكامل داخل الورشة — خشب حقيقي ووصلات حقيقية، صُوّرت في الورشة يوم اكتمالها.",
    },
    facts: [
      { en: "Solid oak", ar: "بلوط صلب" },
      { en: "Hand-fitted joinery", ar: "وصلات مُجمّعة يدويًا" },
      { en: "Made in Amman", ar: "صُنعت في عمّان" },
    ],
    card: `${M}/oak-table/card.jpg`,
    hero: `${M}/oak-table/hero.jpg`,
    gallery: [],
    video: {
      src: `${M}/oak-table/build.mp4`,
      poster: `${M}/oak-table/build-poster.jpg`,
      caption: { en: "On the bench, mid-build", ar: "على طاولة العمل، أثناء الصنع" },
    },
  },
];

export function getShowcasePiece(slug: string): ShowcasePiece | undefined {
  return showcasePieces.find((p) => p.slug === slug);
}

/** Slugs that get a generated /showcase/<slug> page (NAWAH has its own microsite). */
export function showcaseDetailSlugs(): string[] {
  return showcasePieces.filter((p) => !p.externalHref).map((p) => p.slug);
}
