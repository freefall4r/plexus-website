// Plexus Workshop — central brand & contact config.
// Replace the PLACEHOLDER values with the real ones; everything wires up automatically.

export const brand = {
  name: "Plexus",
  tag: "Workshop",
  full: "Plexus Workshop",
  tagline: "Wood, joined with intention.",
  est: "EST. AMMAN — JORDAN",
  description:
    "A workshop in Amman crafting custom furniture and sculptural objects in solid wood. Bring us a photo of an idea — see it rendered in 3D, then made real.",
} as const;

// --- CONTACT (placeholders — swap in the real details) ---
export const contact = {
  // International format, digits only after the +, no spaces — used for wa.me + tel:
  whatsapp: "962791792129", // WhatsApp / mobile (intl, digits only)
  phoneDisplay: "+962 7 9179 2129", // shown to humans
  phoneTel: "+962791792129", // tel: link
  email: "mofakhori@gmail.com", // real address (anahata, 2026-07-22) — JSON-LD picks it up automatically
  instagram: "plexus.workshop", // real handle (no @) — instagram.com/plexus.workshop
  street: "Waela Bent Al Askaa", // street, used in structured data + maps
  addressLine: "Waela Bent Al Askaa, Amman",
  mapsQuery: "Waela Bent Al Askaa, Amman, Jordan",
} as const;

// --- SITE / SEO ---
export const site = {
  // Canonical production URL (the live Vercel domain). Used for metadata,
  // sitemap, robots and structured data.
  url: "https://www.plexusworkshop.com",
  // Google Business Profile link — a "sameAs" signal that helps Google
  // associate this domain with the listing. Best replaced with the Maps
  // "share" link once you have it (Maps → your business → Share → copy link).
  googleProfile: "https://share.google/nwNy5rQrXpqzIuzTV",
} as const;

// --- GOOGLE REVIEWS --- (update the count as your reviews grow)
export const reviews = {
  rating: 5.0,
  count: 17,
  url: site.googleProfile,
} as const;

export const currency = {
  code: "JOD",
  symbol: "JD",
} as const;

export function formatPrice(value: number): string {
  return `${currency.symbol} ${value.toLocaleString("en-JO")}`;
}

// Prefilled message helpers
export function waLink(message: string): string {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
export function mailLink(subject: string, body: string): string {
  return `mailto:${contact.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
export function igLink(): string {
  return `https://instagram.com/${contact.instagram}`;
}

export const nav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Custom 3D", href: "/custom" },
  { label: "Workshop", href: "/about" },
] as const;
