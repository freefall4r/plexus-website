// Custom engraving — which products can carry it, and what it costs.
// A product is engravable when its Sanity `tags` include "engravable"
// (zero-schema, same trick as the "sold" tag — flip it per product in /studio).
// The slug set below is the fallback for the built-in catalogue + the
// personalized-gifts line, so the option works even before tags are set.

export const ENGRAVING_FEE = 5; // JOD, flat, per piece
export const ENGRAVING_MAX_CHARS = 30;

export type EngravingStyle = "clean" | "calligraphy";

export type Engraving = {
  text: string;
  style: EngravingStyle;
};

export const ENGRAVABLE_SLUGS = new Set<string>([
  // personalized-gifts line
  "engraved-serving-board",
  "engraved-coaster-set",
  "desk-nameplate",
  "keepsake-box",
  // existing pieces that take engraving well
  "smooth-copper-cup",
  "hammered-copper-cup",
  "meridian-serving-board",
]);

export function isEngravable(p: { slug?: string; tags?: string[] }): boolean {
  if (p.tags?.includes("engravable")) return true;
  return !!p.slug && ENGRAVABLE_SLUGS.has(p.slug);
}

export function engravingStyleLabel(style: EngravingStyle, ar: boolean): string {
  if (style === "calligraphy") return ar ? "خط عربي" : "Calligraphy";
  return ar ? "نقش بسيط" : "Clean";
}
