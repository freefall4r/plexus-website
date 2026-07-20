// ── C Hub job sheet — shared data model ──
// One Firestore document per job order in the `chubOrders` collection. Internal
// tool between Plexus (anahata) and C Hub (Layth, the space owner) — a job-order
// sheet, not a client-facing feature. Quote-after model: anahata/Layth create the
// order, Layth fills in `priceJOD` once he's priced it.

export type ChubMaterial =
  | "wood"
  | "marble"
  | "leather"
  | "stone"
  | "metal"
  | "brass"
  | "other";

export const MATERIAL_OPTIONS: { value: ChubMaterial; label: string }[] = [
  { value: "wood", label: "Wood" },
  { value: "marble", label: "Marble" },
  { value: "leather", label: "Leather" },
  { value: "stone", label: "Stone" },
  { value: "metal", label: "Metal" },
  { value: "brass", label: "Brass" },
  { value: "other", label: "Other" },
];

export type ChubDrawnBy = "Plexus" | "C Hub" | "N/A";
export const DRAWN_BY_OPTIONS: ChubDrawnBy[] = ["Plexus", "C Hub", "N/A"];

export type ChubJobCode = "L1" | "CM5" | "M1" | "Custom";

export const JOB_CODE_MEANINGS: Record<ChubJobCode, string> = {
  L1: "C Hub does all the work, they quote Plexus",
  CM5: "50/50 work & involvement between Plexus and C Hub",
  M1: "Plexus does all the work, C Hub provides space & tools only",
  Custom: "A different process/involvement split — described per job",
};

export const JOB_CODE_OPTIONS: ChubJobCode[] = ["L1", "CM5", "M1", "Custom"];

export type ChubStatus = "New" | "In Progress" | "Done";
export const STATUS_OPTIONS: ChubStatus[] = ["New", "In Progress", "Done"];

// "How fast can Layth knock this out" — scannable at a glance in the Job
// List via a colored badge (green Quick / amber Needs calc). Defaults to
// "quick" on a new order rather than being a hard-required, empty-by-default
// field — every order always has one set.
export type ChubComplexity = "quick" | "complex";
export const COMPLEXITY_OPTIONS: {
  value: ChubComplexity;
  formLabel: string;
  badge: string;
}[] = [
  { value: "quick", formLabel: "Quick — simple, fast to price", badge: "Quick" },
  { value: "complex", formLabel: "Needs calculation — complex, takes more time", badge: "Needs calc" },
];

export type ChubFile = {
  name: string;
  url: string; // Firebase Storage download URL
  sizeKB: number;
  type: string;
};

export type ChubOrder = {
  clientName: string;
  jobType: string;
  materials: ChubMaterial[];
  materialsOther: string; // free text, only meaningful when materials includes "other"
  color: string; // finish/material color, e.g. "walnut natural", "black stain"
  width: number | null; // cm
  depth: number | null; // cm
  height: number | null; // cm
  specs: string; // any other free-text specs/notes (dimensions live in width/depth/height)
  cadNeeded: boolean;
  drawnBy: ChubDrawnBy;
  jobCode: ChubJobCode;
  jobCodeCustom: string; // free text, only meaningful when jobCode is "Custom"
  complexity: ChubComplexity; // default "quick"
  deadline: string | null; // ISO date "YYYY-MM-DD", or null if none set
  urgent: boolean; // default false — shows a banner in the Job List
  notes: string; // anahata's notes, set at creation / full edit
  files: ChubFile[];
  status: ChubStatus; // default "New"
  suggestedPriceJOD: number | null; // anahata's optional target price, set at creation
  priceJOD: number | null; // null until Layth quotes it — the actionable one
  // Layth's own fields — deliberately separate from anahata's notes/deadline
  // above (same "whose input is whose" split as suggestedPriceJOD/priceJOD),
  // inline-editable straight from the Job List card, not the full form.
  laythNotes: string; // Layth's own comments — material availability, concerns, questions
  laythLeadTime: string; // Layth's own estimate of how long the job will take, e.g. "3-4 days"
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type ChubOrderView = ChubOrder & { id: string };

// Fields that inline-edit is allowed to PATCH.
export type ChubPatch = Partial<
  Pick<
    ChubOrder,
    | "status"
    | "suggestedPriceJOD"
    | "priceJOD"
    | "clientName"
    | "jobType"
    | "materials"
    | "materialsOther"
    | "color"
    | "width"
    | "depth"
    | "height"
    | "specs"
    | "cadNeeded"
    | "drawnBy"
    | "jobCode"
    | "jobCodeCustom"
    | "complexity"
    | "deadline"
    | "urgent"
    | "notes"
    | "files"
    | "laythNotes"
    | "laythLeadTime"
  >
>;
