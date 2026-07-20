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

export type ChubJobCode = "CH1" | "CM5" | "M1";

export const JOB_CODE_MEANINGS: Record<ChubJobCode, string> = {
  CH1: "C Hub does all the work, they quote Plexus",
  CM5: "50/50 work & involvement between Plexus and C Hub",
  M1: "Plexus does all the work, C Hub provides space & tools only",
};

export const JOB_CODE_OPTIONS: ChubJobCode[] = ["CH1", "CM5", "M1"];

export type ChubStatus = "New" | "In Progress" | "Done";
export const STATUS_OPTIONS: ChubStatus[] = ["New", "In Progress", "Done"];

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
  specs: string; // specs & dimensions
  cadNeeded: boolean;
  drawnBy: ChubDrawnBy;
  jobCode: ChubJobCode;
  notes: string;
  files: ChubFile[];
  status: ChubStatus; // default "New"
  priceJOD: number | null; // null until Layth quotes it
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type ChubOrderView = ChubOrder & { id: string };

// Fields that inline-edit is allowed to PATCH.
export type ChubPatch = Partial<
  Pick<
    ChubOrder,
    | "status"
    | "priceJOD"
    | "clientName"
    | "jobType"
    | "materials"
    | "materialsOther"
    | "specs"
    | "cadNeeded"
    | "drawnBy"
    | "jobCode"
    | "notes"
  >
>;
