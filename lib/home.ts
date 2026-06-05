import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";

/** A bilingual text value pulled from Sanity (either side may be empty). */
export type Bi = { en?: string; ar?: string };

export type HomeContent = {
  hero?: { eyebrow?: Bi; line1?: Bi; line2?: Bi; sub?: Bi };
  philosophy?: { eyebrow?: Bi; heading?: Bi; p1?: Bi; p2?: Bi; image?: string };
  work?: {
    eyebrow?: Bi;
    heading?: Bi;
    items?: { name?: Bi; material?: Bi; image?: string }[];
  };
  studio?: { eyebrow?: Bi; heading?: Bi; sub?: Bi };
  research?: { eyebrow?: Bi; heading?: Bi; intro?: Bi; image?: string };
  craft?: { eyebrow?: Bi; statement?: Bi; overlay?: Bi; image?: string };
  contact?: { eyebrow?: Bi; heading?: Bi; p?: Bi };
};

const QUERY = `*[_type=="homepage"][0]{
  heroEyebrow_en, heroEyebrow_ar, heroLine1_en, heroLine1_ar, heroLine2_en, heroLine2_ar, heroSub_en, heroSub_ar,
  philoEyebrow_en, philoEyebrow_ar, philoHeading_en, philoHeading_ar, philoP1_en, philoP1_ar, philoP2_en, philoP2_ar, philoImage,
  workEyebrow_en, workEyebrow_ar, workHeading_en, workHeading_ar, workItems[]{name_en, name_ar, material_en, material_ar, image},
  studioEyebrow_en, studioEyebrow_ar, studioHeading_en, studioHeading_ar, studioSub_en, studioSub_ar,
  researchEyebrow_en, researchEyebrow_ar, researchHeading_en, researchHeading_ar, researchIntro_en, researchIntro_ar, researchImage,
  craftEyebrow_en, craftEyebrow_ar, craftStatement_en, craftStatement_ar, craftOverlay_en, craftOverlay_ar, craftImage,
  contactEyebrow_en, contactEyebrow_ar, contactHeading_en, contactHeading_ar, contactP_en, contactP_ar
}`;

const bi = (en?: string, ar?: string): Bi | undefined =>
  en || ar ? { en: en || undefined, ar: ar || undefined } : undefined;

const img = (src: unknown, w = 1200): string | undefined =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (urlForImage(src as any, w) || undefined) as string | undefined;

/** Homepage content from Sanity. Returns null if Sanity isn't configured or no
 *  Homepage doc exists yet — callers then use their built-in default copy. */
export async function getHomeContent(): Promise<HomeContent | null> {
  if (!client) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d: any = await client.fetch(QUERY, {}, { next: { revalidate: 30 } });
    if (!d) return null;
    return {
      hero: {
        eyebrow: bi(d.heroEyebrow_en, d.heroEyebrow_ar),
        line1: bi(d.heroLine1_en, d.heroLine1_ar),
        line2: bi(d.heroLine2_en, d.heroLine2_ar),
        sub: bi(d.heroSub_en, d.heroSub_ar),
      },
      philosophy: {
        eyebrow: bi(d.philoEyebrow_en, d.philoEyebrow_ar),
        heading: bi(d.philoHeading_en, d.philoHeading_ar),
        p1: bi(d.philoP1_en, d.philoP1_ar),
        p2: bi(d.philoP2_en, d.philoP2_ar),
        image: img(d.philoImage, 1100),
      },
      work: {
        eyebrow: bi(d.workEyebrow_en, d.workEyebrow_ar),
        heading: bi(d.workHeading_en, d.workHeading_ar),
        items: Array.isArray(d.workItems)
          ? d.workItems.map((i: Record<string, unknown>) => ({
              name: bi(i.name_en as string, i.name_ar as string),
              material: bi(i.material_en as string, i.material_ar as string),
              image: img(i.image, 1100),
            }))
          : undefined,
      },
      studio: {
        eyebrow: bi(d.studioEyebrow_en, d.studioEyebrow_ar),
        heading: bi(d.studioHeading_en, d.studioHeading_ar),
        sub: bi(d.studioSub_en, d.studioSub_ar),
      },
      research: {
        eyebrow: bi(d.researchEyebrow_en, d.researchEyebrow_ar),
        heading: bi(d.researchHeading_en, d.researchHeading_ar),
        intro: bi(d.researchIntro_en, d.researchIntro_ar),
        image: img(d.researchImage, 1100),
      },
      craft: {
        eyebrow: bi(d.craftEyebrow_en, d.craftEyebrow_ar),
        statement: bi(d.craftStatement_en, d.craftStatement_ar),
        overlay: bi(d.craftOverlay_en, d.craftOverlay_ar),
        image: img(d.craftImage, 2000),
      },
      contact: {
        eyebrow: bi(d.contactEyebrow_en, d.contactEyebrow_ar),
        heading: bi(d.contactHeading_en, d.contactHeading_ar),
        p: bi(d.contactP_en, d.contactP_ar),
      },
    };
  } catch {
    return null;
  }
}
