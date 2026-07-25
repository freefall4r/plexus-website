#!/usr/bin/env node
// ── Plexus Live — add/update a build from the command line ──
// Mirrors how the app itself writes builds (lib/firebase/admin.ts + the upload
// route): Firestore collection "projects", doc id = slug, hero images stored in
// Storage under live/<slug>/ with a firebaseStorageDownloadTokens URL.
//
// Usage:  node scripts/add-build.mjs scripts/builds/<file>.json
//
// The JSON is a Project. Extra convenience field:
//   heroLocalPath : absolute path to a local image -> uploaded, sets heroUrl.
// Stage ids / dates are auto-filled if missing.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// ---- load .env.local (no dotenv dependency) ----
function loadEnv(file) {
  const txt = fs.readFileSync(file, "utf8");
  for (const line of txt.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
loadEnv(path.join(ROOT, ".env.local"));

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
const db = getFirestore(app);
const storage = getStorage(app);

// The env may name the bucket with the new firebasestorage.app alias, but the
// underlying GCS bucket can be the classic <id>.appspot.com — try both.
async function resolveBucket() {
  const id = process.env.FIREBASE_PROJECT_ID;
  const candidates = [
    process.env.FIREBASE_STORAGE_BUCKET,
    `${id}.firebasestorage.app`,
    `${id}.appspot.com`,
  ].filter(Boolean);
  for (const name of candidates) {
    const b = storage.bucket(name);
    try {
      const [exists] = await b.exists();
      if (exists) return b;
    } catch {
      /* try next */
    }
  }
  throw new Error(`No accessible storage bucket among: ${candidates.join(", ")}`);
}

async function uploadHero(bucket, slug, localPath) {
  const ext = (localPath.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const objectPath = `live/${slug}/${crypto.randomUUID()}.${ext}`;
  const token = crypto.randomUUID();
  await bucket.upload(localPath, {
    destination: objectPath,
    contentType: ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`,
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    objectPath
  )}?alt=media&token=${token}`;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node scripts/add-build.mjs <build.json>");
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const now = new Date().toISOString();

  if (data.heroLocalPath && !data.heroUrl) {
    console.log("Uploading hero image…");
    const bucket = await resolveBucket();
    console.log("  bucket ->", bucket.name);
    data.heroUrl = await uploadHero(bucket, data.slug, data.heroLocalPath);
    console.log("  hero ->", data.heroUrl);
  }
  delete data.heroLocalPath;

  const stages = (data.stages || []).map((s) => ({
    id: s.id || crypto.randomBytes(4).toString("hex"),
    name: s.name,
    status: s.status || "todo",
    note: s.note || "",
    photos: s.photos || [],
    date: s.date || now,
  }));

  const project = {
    slug: data.slug,
    title: data.title,
    clientName: data.clientName || "",
    location: data.location || "Amman, Jordan",
    pct: Math.min(100, Math.max(0, data.pct ?? 0)),
    now: data.now || "",
    nowProgress: data.nowProgress || "",
    accent: data.accent || "#9c5b2c",
    heroUrl: data.heroUrl || null,
    model3dUrl: data.model3dUrl || null,
    visible: data.visible ?? false,
    passcode: data.passcode || "0000",
    stages,
    messages: data.messages || [],
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  await db.collection("projects").doc(project.slug).set(project, { merge: true });
  console.log(`✓ Saved build "${project.title}" (slug: ${project.slug}, passcode: ${project.passcode})`);
  console.log(`  Public:  https://www.plexusworkshop.com/live`);
  console.log(`  Portal:  https://www.plexusworkshop.com/live/${project.slug}  (passcode ${project.passcode})`);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
