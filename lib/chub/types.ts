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

// One labeled price option from Layth — a job can carry several ("beech 500",
// "with brass inlay 620") on top of the single headline priceJOD, which stays
// the actionable number the offer flow builds on.
export type ChubPriceLine = {
  id: string;
  label: string;
  amountJOD: number;
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
  priceLines?: ChubPriceLine[]; // Layth's labeled price options beyond the
  // headline priceJOD — one piece can genuinely have several prices
  // (materials, tiers). Absent on docs written before this existed.
  quoteRequest?: boolean; // a design-first card: Plexus designed the piece
  // (renders, dimensions, spec) and posted it here FOR Layth to price —
  // the reverse of the usual client-photo → job flow. Shown pinned in a
  // "For pricing" section until priced. Absent on older docs.
  wip: ChubWip; // production-tracking layer — see below. Older docs won't have
  // this field at all; every read site defaults with `order.wip ?? EMPTY_WIP`.
  offer?: ChubOffer | null; // set only once anahata turns Layth's price into a
  // client quotation (see below). Absent on every order that hasn't been
  // offered yet, and on every doc written before this feature existed.
  invoice?: ChubInvoice | null; // set only once the offer is converted to an
  // invoice (Phase 2). Requires `offer` to exist first.
  archived?: boolean; // cleared off the board BY HAND — never automatically,
  // and never deleted. Archived jobs are hidden from every other filter and
  // live under the Archived chip, where they can be restored.
  archivedAt?: string | null;
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
  sentAt?: string | null; // ISO, set when anahata marks the quotation as sent
  // to the client. Owner-set (only he sends quotes), but the resulting stage
  // IS shown to Layth — knowing a quote went out isn't price-sensitive.
  costJOD: number; // Layth's price at creation time — snapshotted, because he
  // can still edit priceJOD afterwards and the card must keep showing the
  // arithmetic the offer was actually built on, not a later cost against an
  // older price (which reads as wrong maths).
  marginPct: number; // margin applied over costJOD at creation time
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
  amountJOD: number; // the invoice total at conversion — snapshotted so the
  // money view can add up without fetching every document. The document
  // itself stays the source of truth if it's edited afterwards.
  paidAt?: string | null; // ISO, set when the money actually lands
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

// ── Where a job sits in the pipeline ──
// Derived from the data the job already carries rather than stored as its own
// editable field, so a job's stage can never disagree with its price, offer or
// WIP state. ONE definition, used by both the filter chips and the badge on
// the card — they can't drift apart.
//
// `archived` is the exception: it's the one stage set by hand (the Archive
// button), and it wins over everything, because clearing a card off the board
// is a decision, not a consequence.
export type ChubStage =
  | "archived"
  | "paid"
  | "invoiced"
  | "production"
  | "sent"
  | "quoted"
  | "priced"
  | "new";

export const STAGE_META: Record<ChubStage, { label: string; chip: string; badge: string }> = {
  new: { label: "Needs price", chip: "Needs price", badge: "bg-ink/10 text-ink-soft" },
  priced: { label: "Priced — no offer yet", chip: "Priced", badge: "bg-sage/25 text-sage" },
  quoted: { label: "Quotation ready", chip: "Quote ready", badge: "bg-amber/20 text-amber" },
  sent: { label: "Quotation sent", chip: "Sent", badge: "bg-amber text-white" },
  production: { label: "In production", chip: "In production", badge: "bg-green-600 text-white" },
  invoiced: { label: "Invoiced — unpaid", chip: "Unpaid", badge: "bg-red-100 text-red-700" },
  paid: { label: "Paid", chip: "Paid", badge: "bg-green-700 text-white" },
  archived: { label: "Archived", chip: "Archived", badge: "bg-ink/15 text-ink-soft" },
};

// Chip order = the order a job actually travels in.
export const STAGE_ORDER: ChubStage[] = [
  "new",
  "priced",
  "quoted",
  "sent",
  "production",
  "invoiced",
  "paid",
  "archived",
];

// Money outranks production: once a job is invoiced, "has this been paid?" is
// the live question about it, not whether the bench work is still open.
export function jobStage(o: ChubOrderView): ChubStage {
  if (o.archived) return "archived";
  if (o.invoice?.paidAt) return "paid";
  if (o.invoice) return "invoiced";
  if (o.wip?.active) return "production";
  if (o.offer?.sentAt) return "sent";
  if (o.offer) return "quoted";
  if (o.priceJOD != null) return "priced";
  return "new";
}

// ── The money view ──
// What the board is worth, owner-side. Deliberately counts DIFFERENT things
// in each bucket so nothing is double-counted: a job contributes to exactly
// one of collected / outstanding / quoted, in that order of precedence.
export type ChubMoney = {
  collected: number; // paid invoices
  outstanding: number; // invoices issued, money not in yet
  quoted: number; // offers made but not yet invoiced — the pipeline
  cost: number; // what C Hub charges Plexus on everything invoiced
  margin: number; // invoiced value minus that cost
};

export function boardMoney(orders: ChubOrderView[]): ChubMoney {
  const m: ChubMoney = { collected: 0, outstanding: 0, quoted: 0, cost: 0, margin: 0 };
  for (const o of orders) {
    if (o.archived) continue; // cleared jobs don't count toward a live board
    if (o.invoice) {
      const amount = o.invoice.amountJOD || o.offer?.priceJOD || 0;
      if (o.invoice.paidAt) m.collected += amount;
      else m.outstanding += amount;
      const cost = o.offer?.costJOD ?? o.priceJOD ?? 0;
      m.cost += cost;
      m.margin += amount - cost;
    } else if (o.offer) {
      m.quoted += o.offer.priceJOD || 0;
    }
  }
  return m;
}

// ── To-Do & Tally — the shared board's second surface ──
// Same trust level as board notes: one checklist and one running settlement
// ledger between anahata and Layth, both behind the plain chub passcode.
// Nothing here is price-sensitive (it's their OWN money between each other,
// not client pricing or margin).

export type ChubTodoItem = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string; // ISO
  doneAt: string | null; // ISO, stamped when checked off
};

export type ChubTallySide = "anahata" | "layth";

// "took" = took something of value from the other side (owes for it).
// "paid" = handed the other side money (reduces what they owe).
export type ChubTallyKind = "took" | "paid";

export type ChubTallyEntry = {
  id: string;
  side: ChubTallySide;
  kind: ChubTallyKind;
  text: string;
  amountJOD: number | null; // null = note only, doesn't count in the balance
  date: string; // ISO
};

// A settled period — the "settled ✓" button archives the live entries here
// (never deletes them) and starts a fresh tally.
export type ChubTallyPeriod = {
  id: string;
  settledAt: string; // ISO
  entries: ChubTallyEntry[];
};

// net > 0 → anahata owes Layth `net` JOD; net < 0 → Layth owes anahata.
// Per side: took adds to what that side owes, paid subtracts from it.
export function tallyBalance(entries: ChubTallyEntry[]): {
  anahata: number;
  layth: number;
  net: number;
} {
  let anahata = 0;
  let layth = 0;
  for (const e of entries) {
    if (e.amountJOD == null) continue;
    const signed = e.kind === "took" ? e.amountJOD : -e.amountJOD;
    if (e.side === "anahata") anahata += signed;
    else layth += signed;
  }
  return { anahata, layth, net: anahata - layth };
}

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
    | "priceLines"
    | "quoteRequest"
    | "archived"
    | "archivedAt"
  >
>;
