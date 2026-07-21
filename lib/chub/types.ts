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
  wip: ChubWip; // production-tracking layer — see below. Older docs won't have
  // this field at all; every read site defaults with `order.wip ?? EMPTY_WIP`.
  offer?: ChubOffer | null; // set only once anahata turns Layth's price into a
  // client quotation (see below). Absent on every order that hasn't been
  // offered yet, and on every doc written before this feature existed.
  invoice?: ChubInvoice | null; // set only once the offer is converted to an
  // invoice (Phase 2). Requires `offer` to exist first.
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

// ── The offer link — a job's client-facing quotation ──
// `priceJOD` above is what C Hub charges Plexus (a cost). The client sees a
// Plexus Quotation built on top of it with anahata's margin. That document
// lives in the normal Plexus documents system (Firestore `documents`,
// lib/docs/*), NOT here — this is only the pointer back to it, so the job
// card can show "Offer PLX-Q-2607-01 →" and never create a second one.
// Written by app/api/chub/offer, which is owner-gated: Layth can neither see
// nor set any of this.
export type ChubOffer = {
  docId: string; // BizDoc id → /plexusadmin/doc/<docId>
  number: string; // e.g. "PLX-Q-2607-01"
  priceJOD: number; // the client-facing price at creation time
  marginPct: number; // margin applied over priceJOD at creation time
  createdAt: string; // ISO
};

// The invoice link — a job's offer, converted to a bill (Phase 2). Same
// pointer-only pattern as ChubOffer: the actual Invoice BizDoc lives in the
// documents system; this just lets the card jump to it and blocks a second
// conversion. Built by app/api/chub/invoice (owner-gated) by copying the
// quotation, so any edits anahata made to the offer carry over.
export type ChubInvoice = {
  docId: string; // BizDoc id → /plexusadmin/doc/<docId>
  number: string; // e.g. "PLX-INV-2607-01"
  createdAt: string; // ISO
};

// ── Work-In-Progress — a production-tracking layer over an order ──
// 1:1 with a ChubOrder (not a separate collection): once a job moves from
// "quoted/agreed" into actual production, it gets promoted onto one of two
// boards (who's actively building it) with a start date, then accrues a
// materials log and a process log as work happens. `deadline` above doubles
// as the WIP end date — no separate field for it.

export type ChubWipBoard = "plexus" | "chub";
export const WIP_BOARD_OPTIONS: { value: ChubWipBoard; label: string }[] = [
  { value: "plexus", label: "Plexus" },
  { value: "chub", label: "C Hub" },
];

export type ChubMaterialLogEntry = {
  id: string;
  text: string; // what was bought
  buyer: string; // who bought it
  date: string; // ISO, set server-side when logged
};

export type ChubProcessLogEntry = {
  id: string;
  text: string; // the step
  who: string; // who did / will do it
  date: string; // ISO, set server-side when logged
  done: boolean;
};

export type ChubWip = {
  active: boolean;
  board: ChubWipBoard | null;
  startDate: string | null; // "YYYY-MM-DD"
  materialsLog: ChubMaterialLogEntry[];
  processLog: ChubProcessLogEntry[];
  liveLink: string | null;
};

export const EMPTY_WIP: ChubWip = {
  active: false,
  board: null,
  startDate: null,
  materialsLog: [],
  processLog: [],
  liveLink: null,
};

// "Start Work" board guess from the job code — L1 is entirely C Hub's
// build, M1 is entirely Plexus's, CM5 is a genuine 50/50 split and Custom
// is arrangement-specific, so both of those return null ("ask the user")
// rather than a false guess.
export function boardGuessFromJobCode(jobCode: ChubJobCode): ChubWipBoard | null {
  if (jobCode === "L1") return "chub";
  if (jobCode === "M1") return "plexus";
  return null;
}

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
