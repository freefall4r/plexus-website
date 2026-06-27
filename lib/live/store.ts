// ── Plexus Live — server-side data store ──
// One place for every read/write of build projects. Uses Firebase when it's
// configured; otherwise falls back to the legacy public/live/<slug>/meta.json
// files so the public page never goes blank during setup.

import "server-only";
import fs from "node:fs";
import path from "node:path";
import { isFirebaseConfigured, db } from "@/lib/firebase/admin";
import {
  type Project,
  type PublicBuild,
  type PortalView,
  toPublic,
  toPortal,
} from "./types";

const COLLECTION = "projects";

// ---------- legacy static fallback (current behaviour) ----------
function staticBuilds(): PublicBuild[] {
  const dir = path.join(process.cwd(), "public", "live");
  let slugs: string[] = [];
  try {
    slugs = fs
      .readdirSync(dir)
      .filter((s) => fs.existsSync(path.join(dir, s, "meta.json")));
  } catch {
    return [];
  }
  return slugs
    .map((slug) => {
      const m = JSON.parse(
        fs.readFileSync(path.join(dir, slug, "meta.json"), "utf8")
      );
      return {
        slug: m.slug || slug,
        title: m.title || slug,
        location: m.location || "",
        pct: typeof m.pct === "number" ? m.pct : 0,
        now: m.now || "",
        nowProgress: m.nowProgress || "",
        hero: m.hero ? `/live/${slug}/${m.hero}` : null,
        accent: m.accent || "#9c5b2c",
        updated: m.updated || "",
      } as PublicBuild;
    })
    .sort((a, b) => b.pct - a.pct);
}

// ---------- public reads ----------
export async function getPublicBuilds(): Promise<PublicBuild[]> {
  if (!isFirebaseConfigured()) return staticBuilds();
  const snap = await db()
    .collection(COLLECTION)
    .where("visible", "==", true)
    .get();
  return snap.docs
    .map((d) => toPublic(d.data() as Project))
    .sort((a, b) => b.pct - a.pct);
}

// ---------- portal read (passcode-gated; called server-side only) ----------
export async function getPortal(
  slug: string,
  passcode: string
): Promise<PortalView | null> {
  if (!isFirebaseConfigured()) return null;
  const doc = await db().collection(COLLECTION).doc(slug).get();
  if (!doc.exists) return null;
  const p = doc.data() as Project;
  // Passcodes are client first names — match case-insensitively and ignore
  // stray spaces / phone auto-capitalisation.
  const norm = (s: string) => (s || "").trim().toLowerCase();
  if (!p.passcode || norm(p.passcode) !== norm(passcode)) return null;
  return toPortal(p);
}

// ---------- admin reads (full docs; behind the passcode session) ----------
export async function getAllProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured()) return [];
  const snap = await db().collection(COLLECTION).get();
  return snap.docs
    .map((d) => d.data() as Project)
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!isFirebaseConfigured()) return null;
  const doc = await db().collection(COLLECTION).doc(slug).get();
  return doc.exists ? (doc.data() as Project) : null;
}

// ---------- admin writes ----------
export async function saveProject(p: Project): Promise<void> {
  await db().collection(COLLECTION).doc(p.slug).set(p, { merge: true });
}

export async function deleteProject(slug: string): Promise<void> {
  await db().collection(COLLECTION).doc(slug).delete();
}
