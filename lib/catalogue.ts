import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import {
  products as staticProducts,
  type Product,
  type ArtKey,
} from "@/lib/products";

/** A product that may come from Sanity (real image) or the built-in fallback
 *  catalogue (generative art via artKey). */
export type CatalogueProduct = Omit<Product, "artKey"> & {
  artKey?: ArtKey;
  imageUrl?: string;
  galleryUrls?: string[];
};

const QUERY = `*[_type=="product"] | order(featured desc, _createdAt desc){
  "id": _id,
  "slug": slug.current,
  name, "name_ar": coalesce(name_ar, name),
  category, collection,
  wood, "wood_ar": coalesce(wood_ar, wood),
  price,
  "blurb": coalesce(blurb, ""), "blurb_ar": coalesce(blurb_ar, blurb, ""),
  "description": coalesce(description, ""), "description_ar": coalesce(description_ar, description, ""),
  "dimensions": coalesce(dimensions, ""),
  "tags": coalesce(tags, []),
  featured,
  image,
  gallery
}`;

type SanityProductDoc = Omit<CatalogueProduct, "imageUrl" | "galleryUrls"> & {
  image?: Parameters<typeof urlForImage>[0];
  gallery?: Parameters<typeof urlForImage>[0][];
};

/** All products. Sanity if any exist, otherwise the built-in catalogue so the
 *  site is never empty. */
export async function getCatalogue(): Promise<CatalogueProduct[]> {
  if (client) {
    try {
      const docs = await client.fetch<SanityProductDoc[]>(
        QUERY,
        {},
        { next: { revalidate: 30 } }
      );
      if (docs && docs.length > 0) {
        return docs.map(({ image, gallery, ...rest }) => ({
          ...rest,
          imageUrl: urlForImage(image, 1100),
          galleryUrls: (gallery ?? [])
            .map((g) => urlForImage(g, 1400))
            .filter(Boolean),
        }));
      }
    } catch {
      // network/config issue — fall back to the static catalogue
    }
  }
  return staticProducts as CatalogueProduct[];
}

export async function getCatalogueProduct(
  slug: string
): Promise<CatalogueProduct | null> {
  const all = await getCatalogue();
  return all.find((p) => p.slug === slug) ?? null;
}

export function relatedFrom(
  list: CatalogueProduct[],
  product: CatalogueProduct,
  n = 4
): CatalogueProduct[] {
  const sameCat = list.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const pool = sameCat.length >= n
    ? sameCat
    : [...sameCat, ...list.filter((p) => p.id !== product.id && p.category !== product.category)];
  return pool.slice(0, n);
}
