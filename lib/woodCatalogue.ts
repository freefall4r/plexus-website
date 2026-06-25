import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import {
  woodEntries as staticEntries,
  explainers,
  type WoodEntry,
  type Explainer,
} from "@/lib/woodLibrary";

/** A wood entry whose image may come from Sanity (uploaded) or the built-in
 *  /public path. The rest of the shape is identical to the static WoodEntry. */
export type LibraryEntry = WoodEntry;

const QUERY = `*[_type=="woodEntry"]{
  "slug": slug.current,
  category,
  name, "name_ar": coalesce(name_ar, name),
  "localName_ar": coalesce(localName_ar, ""),
  "botanical": coalesce(botanical, ""),
  "tagline": coalesce(tagline, ""), "tagline_ar": coalesce(tagline_ar, tagline, ""),
  "intro": coalesce(intro, ""), "intro_ar": coalesce(intro_ar, intro, ""),
  "facts": coalesce(facts, []),
  "uses": coalesce(uses, []), "uses_ar": coalesce(uses_ar, uses, []),
  "watchOut": coalesce(watchOut, ""), "watchOut_ar": coalesce(watchOut_ar, watchOut, ""),
  "notes": coalesce(notes, ""), "notes_ar": coalesce(notes_ar, notes, ""),
  image
}`;

type SanityWoodDoc = Omit<WoodEntry, "image"> & {
  image?: Parameters<typeof urlForImage>[0];
};

/** All wood entries. Sanity if any have been added, else the built-in set so
 *  the library always renders. */
export async function getLibraryEntries(): Promise<WoodEntry[]> {
  if (client) {
    try {
      const docs = await client.fetch<SanityWoodDoc[]>(
        QUERY,
        {},
        { next: { revalidate: 60 } }
      );
      if (docs && docs.length > 0) {
        return docs
          .filter((d) => d.slug)
          .map(({ image, ...rest }) => ({
            ...rest,
            image: (image && urlForImage(image, 1200)) || `/wood-library/${rest.slug}.png`,
          }));
      }
    } catch {
      // network/config issue — fall back to the built-in set
    }
  }
  return staticEntries;
}

export async function getLibraryEntry(slug: string): Promise<WoodEntry | null> {
  const all = await getLibraryEntries();
  return all.find((e) => e.slug === slug) ?? null;
}

/** Explainers are content-only (no images to upload), so they stay built-in. */
export function getExplainers(): Explainer[] {
  return explainers;
}

export function getExplainerBySlug(slug: string): Explainer | null {
  return explainers.find((e) => e.slug === slug) ?? null;
}

/** Related entries — same category first, then fill from others. */
export function relatedEntries(
  all: WoodEntry[],
  entry: WoodEntry,
  n = 3
): WoodEntry[] {
  const sameCat = all.filter(
    (e) => e.slug !== entry.slug && e.category === entry.category
  );
  const pool =
    sameCat.length >= n
      ? sameCat
      : [...sameCat, ...all.filter((e) => e.slug !== entry.slug && e.category !== entry.category)];
  return pool.slice(0, n);
}
