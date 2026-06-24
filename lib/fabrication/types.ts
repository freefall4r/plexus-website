// ── On-Demand Fabrication — shared data model ──
// One Firestore document per order in the `fabricationOrders` collection.
// The document ID IS the client's secret tracking token (see lib/fabrication/store).
// Shape + status lifecycle are the contract in FABRICATION-SPEC.md §2–§3 — the
// /plexusadmin order manager (other session) reads/writes the same shape.

export type FabricationService = "cnc" | "laser" | "milling";
export type FabricationSource = "custom" | "template";

export type FabricationStatus =
  | "new"
  | "reviewing"
  | "quoted"
  | "confirmed"
  | "in_production"
  | "ready"
  | "completed"
  | "declined"
  | "cancelled";

export type FabricationFile = {
  name: string;
  url: string; // Firebase Storage download URL
  sizeKB: number;
  type: string;
};

export type FabricationSpecs = {
  material: string;
  thickness: string;
  dimensions: string;
  quantity: number;
  finish: string;
  notes: string;
};

export type FabricationQuote = {
  amountJOD: number;
  leadTimeDays: number;
  message: string;
} | null;

export type FabricationContact = {
  name: string;
  whatsapp: string;
  email: string;
};

export type FabricationOrder = {
  service: FabricationService;
  source: FabricationSource;
  templateId: string | null;
  specs: FabricationSpecs;
  files: FabricationFile[];
  contact: FabricationContact;
  status: FabricationStatus; // website only ever sets "new"
  quote: FabricationQuote; // null at creation; written by /plexusadmin
  lang: "en" | "ar";
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

// The data the public tracking page is allowed to show the client (their own
// order). No internal admin notes; contact is reduced to a first name.
export type FabricationTrackView = {
  id: string; // = the token
  service: FabricationService;
  source: FabricationSource;
  templateId: string | null;
  specs: FabricationSpecs;
  files: { name: string }[];
  contactName: string;
  status: FabricationStatus;
  quote: FabricationQuote;
  createdAt: string;
  updatedAt: string;
};
