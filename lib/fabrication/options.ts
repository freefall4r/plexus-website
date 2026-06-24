// ── On-Demand Fabrication — form options ──
// Starter menu from FABRICATION-SPEC.md §9. Edit freely — these drive the order
// wizard dropdowns and the server-side validation. Materials/thicknesses differ
// by service (CNC router vs laser).

import type { FabricationService } from "./types";

export type Opt = { value: string; en: string; ar: string };

// Files (spec §4)
export const MAX_FILE_BYTES = 50_000_000; // 50 MB per file
export const MAX_FILES = 10;
export const ACCEPTED_EXT = [
  "dxf",
  "svg",
  "ai",
  "pdf",
  "step",
  "stp",
  "jpg",
  "jpeg",
  "png",
];
// For the <input accept="…"> attribute
export const ACCEPTED_ATTR = ".dxf,.svg,.ai,.pdf,.step,.stp,.jpg,.jpeg,.png";

export const MATERIALS: Record<FabricationService, Opt[]> = {
  cnc: [
    { value: "birch-ply", en: "Birch plywood", ar: "خشب البتولا الطبقي" },
    { value: "mdf", en: "MDF", ar: "خشب MDF" },
    { value: "oak", en: "Solid oak", ar: "بلوط صلب" },
    { value: "walnut", en: "Solid walnut", ar: "جوز صلب" },
    { value: "beech", en: "Solid beech", ar: "زان صلب" },
    { value: "bamboo-ply", en: "Bamboo plywood", ar: "خشب الخيزران الطبقي" },
    { value: "acrylic", en: "Acrylic (cast)", ar: "أكريليك" },
    { value: "dibond", en: "Aluminium composite (Dibond)", ar: "مركّب ألمنيوم" },
  ],
  laser: [
    { value: "birch-ply-thin", en: "Birch plywood (thin)", ar: "بتولا طبقي رقيق" },
    { value: "mdf-thin", en: "MDF (thin)", ar: "MDF رقيق" },
    { value: "acrylic", en: "Acrylic (cast)", ar: "أكريليك" },
    { value: "leather", en: "Leather", ar: "جلد" },
    { value: "card", en: "Cardboard / paperboard", ar: "كرتون / ورق مقوّى" },
    { value: "anodised-al", en: "Anodised aluminium (engraving)", ar: "ألمنيوم مؤكسد (حفر)" },
  ],
  // Milling & turning works in solid stock (bowls, cups, candle holders).
  milling: [
    { value: "walnut", en: "Solid walnut", ar: "جوز صلب" },
    { value: "oak", en: "Solid oak", ar: "بلوط صلب" },
    { value: "beech", en: "Solid beech", ar: "زان صلب" },
    { value: "olive", en: "Olive wood", ar: "خشب الزيتون" },
    { value: "maple", en: "Maple", ar: "قيقب" },
    { value: "cherry", en: "Cherry", ar: "كرز" },
    { value: "ash", en: "Ash", ar: "دردار" },
  ],
};

export const THICKNESS: Record<FabricationService, Opt[]> = {
  cnc: [3, 6, 9, 12, 18, 25].map((mm) => ({
    value: `${mm}mm`,
    en: `${mm} mm`,
    ar: `${mm} مم`,
  })),
  laser: [2, 3, 5, 8, 10].map((mm) => ({
    value: `${mm}mm`,
    en: `${mm} mm`,
    ar: `${mm} مم`,
  })),
  // For milling/turning this is the rough stock/blank size, not a sheet thickness.
  milling: [
    { value: "blank-s", en: "Small blank (≤ Ø100 mm)", ar: "كتلة صغيرة (≤ ١٠٠ مم)" },
    { value: "blank-m", en: "Medium blank (Ø100–200 mm)", ar: "كتلة متوسطة (١٠٠–٢٠٠ مم)" },
    { value: "blank-l", en: "Large blank (≥ Ø200 mm)", ar: "كتلة كبيرة (≥ ٢٠٠ مم)" },
  ],
};

export const FINISHES: Opt[] = [
  { value: "raw", en: "Raw (as cut)", ar: "خام (كما يُقطع)" },
  { value: "sanded", en: "Sanded", ar: "مصنفر" },
  { value: "oiled", en: "Oiled", ar: "مزيّت" },
  { value: "custom", en: "Painted / custom (describe in notes)", ar: "دهان / مخصّص (وضّح في الملاحظات)" },
];

export const LEAD_TIME_HOURS = 24; // confirmation-screen promise

// Validation helpers (used server-side)
export function isService(v: unknown): v is FabricationService {
  return v === "cnc" || v === "laser";
}
export function extOf(filename: string): string {
  return (filename.split(".").pop() || "").toLowerCase();
}
export function isAcceptedFile(filename: string): boolean {
  return ACCEPTED_EXT.includes(extOf(filename));
}
