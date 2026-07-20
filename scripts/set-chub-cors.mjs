#!/usr/bin/env node
// ── C Hub job sheet — one-time bucket CORS setup ──
// Direct browser-to-GCS uploads (bypassing the Vercel serverless body-size
// limit, see app/api/chub/uploads/route.ts) need the Storage bucket to allow
// cross-origin PUT from the site's own origins — GCS buckets have no CORS
// policy by default, which silently blocks the browser's PUT to the signed
// URL. This is bucket-wide (GCS has no path-scoped CORS), but only ADDS an
// allow-list for our own origins/methods — doesn't touch anything else about
// the bucket, and no other feature in this repo does client-side GCS access.
//
// Usage:  node scripts/set-chub-cors.mjs

import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

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
const bucket = getStorage(app).bucket();

await bucket.setCorsConfiguration([
  {
    origin: [
      "https://www.plexusworkshop.com",
      "https://plexusworkshop.com",
      "https://chub.plexusworkshop.com",
      "http://localhost:3000",
    ],
    method: ["PUT", "GET", "HEAD"],
    responseHeader: ["Content-Type"],
    maxAgeSeconds: 3600,
  },
]);

const [meta] = await bucket.getMetadata();
console.log("✓ CORS set:", JSON.stringify(meta.cors, null, 2));
