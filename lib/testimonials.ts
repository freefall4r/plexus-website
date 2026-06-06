import { client } from "@/sanity/lib/client";

export type Testimonial = {
  id: string;
  name: string;
  name_ar?: string;
  role?: string;
  role_ar?: string;
  quote: string;
  quote_ar?: string;
};

const QUERY = `*[_type=="testimonial"] | order(order asc, _createdAt desc){
  "id": _id, name, name_ar, role, role_ar, quote, quote_ar
}`;

/** Real client testimonials from Sanity. Returns [] when none exist (or Sanity
 *  isn't configured) — the Testimonials section then renders nothing, so the
 *  site never shows an empty or fabricated reviews block. */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!client) return [];
  try {
    const docs = await client.fetch<Testimonial[]>(QUERY, {}, { next: { revalidate: 30 } });
    return docs ?? [];
  } catch {
    return [];
  }
}
