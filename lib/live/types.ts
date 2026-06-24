// ── Plexus Live — shared data model ──
// A "Project" is one client commission followed on /live and its private portal.
// Public fields are safe to show on the open /live page; private fields
// (clientName, passcode) never leave the server except inside a gated portal.

export type StageStatus = "todo" | "doing" | "done";

export type Stage = {
  id: string;
  name: string;          // e.g. "Cutting the birch"
  status: StageStatus;
  note?: string;         // optional detail, e.g. "Board 7 of 13"
  photos?: string[];     // Storage URLs
  date?: string;         // ISO date this stage was last touched
};

export type Message = {
  id: string;
  text: string;          // update written to the client
  date: string;          // ISO
  photos?: string[];
};

export type Project = {
  slug: string;          // url-safe id, e.g. "dj-library"
  title: string;         // public piece name
  clientName: string;    // PRIVATE
  location: string;      // public, e.g. "Amman, Jordan"
  pct: number;           // 0-100 overall progress
  now: string;           // current headline stage
  nowProgress: string;   // current sub-progress
  accent: string;        // hex, card accent
  heroUrl: string | null;// hero image (Storage URL)
  visible: boolean;      // show on the public /live grid
  passcode: string;      // PRIVATE — client portal access code
  stages: Stage[];
  messages: Message[];
  createdAt: string;     // ISO
  updatedAt: string;     // ISO
};

// What the PUBLIC /live grid is allowed to see (no client name, no passcode).
export type PublicBuild = {
  slug: string;
  title: string;
  location: string;
  pct: number;
  now: string;
  nowProgress: string;
  hero: string | null;
  accent: string;
  updated: string;
};

// What a gated client portal sees once the passcode matches (still no other
// client's data — just this piece, its stages and messages).
export type PortalView = {
  slug: string;
  title: string;
  location: string;
  pct: number;
  now: string;
  nowProgress: string;
  hero: string | null;
  accent: string;
  updated: string;
  stages: Stage[];
  messages: Message[];
};

export function toPublic(p: Project): PublicBuild {
  return {
    slug: p.slug,
    title: p.title,
    location: p.location,
    pct: p.pct,
    now: p.now,
    nowProgress: p.nowProgress,
    hero: p.heroUrl,
    accent: p.accent || "#9c5b2c",
    updated: p.updatedAt?.slice(0, 10) || "",
  };
}

export function toPortal(p: Project): PortalView {
  return {
    ...toPublic(p),
    stages: p.stages || [],
    messages: p.messages || [],
  };
}
