// PLEXUS AMMAN — central brand & contact config.
// Replace the PLACEHOLDER values with the real ones; everything wires up automatically.

export const brand = {
  name: "PLEXUS",
  city: "AMMAN",
  full: "PLEXUS AMMAN",
  tagline: "Wood, joined with intention.",
  est: "EST. AMMAN — JORDAN",
  description:
    "A workshop in Amman crafting custom furniture and sculptural objects in solid wood. Bring us a photo of an idea — see it rendered in 3D, then made real.",
} as const;

// --- CONTACT (placeholders — swap in the real details) ---
export const contact = {
  // International format, digits only after the +, no spaces — used for wa.me + tel:
  whatsapp: "962790000000", // PLACEHOLDER WhatsApp number
  phoneDisplay: "+962 7 9000 0000", // PLACEHOLDER shown to humans
  phoneTel: "+962790000000", // PLACEHOLDER tel: link
  email: "hello@plexusamman.com", // PLACEHOLDER
  instagram: "plexus.amman", // PLACEHOLDER handle (no @)
  addressLine: "Workshop — Amman, Jordan",
  mapsQuery: "Amman, Jordan",
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
