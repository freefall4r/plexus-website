import { brand, contact, site } from "@/lib/config";

/**
 * LocalBusiness JSON-LD. Emits structured data Google uses to associate this
 * domain with the "Plexus Workshop" Business Profile.
 *
 * Contact fields in lib/config.ts are still placeholders, and bad NAP (name /
 * address / phone) data hurts more than it helps — so telephone, email and the
 * Instagram sameAs are only emitted once you replace the placeholders with the
 * real values. Everything then populates automatically; no change needed here.
 */
const PLACEHOLDERS = new Set<string>([
  "962790000000",
  "+962790000000",
  "+962 7 9000 0000",
  "hello@plexusamman.com",
  "plexus.amman",
]);

const real = (v?: string) =>
  v && !PLACEHOLDERS.has(v.trim()) ? v.trim() : undefined;

export function StructuredData() {
  const telephone = real(contact.phoneTel);
  const email = real(contact.email);
  const ig = real(contact.instagram);

  const sameAs = [
    site.googleProfile,
    ig ? `https://instagram.com/${ig}` : undefined,
  ].filter(Boolean) as string[];

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: brand.full,
    alternateName: "Plexus Workshop",
    url: site.url,
    image: `${site.url}/work/faceted-oak-table.jpg`,
    logo: `${site.url}/work/faceted-oak-table.jpg`,
    description: brand.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Amman",
      addressCountry: "JO",
    },
    areaServed: { "@type": "City", name: "Amman" },
    priceRange: "$$",
    ...(telephone ? { telephone } : {}),
    ...(email ? { email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
