// ── Firebase Admin (server-only) ──
// All Firebase access in this app happens here, on the server. The browser
// never gets Firebase credentials, so the single admin passcode can never
// expose the database. Reads for /live and writes from /plexusadmin both flow
// through the Admin SDK.
//
// Config comes from env vars (set in .env.local for dev, Vercel for prod):
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY        (with literal \n escaped)
//   FIREBASE_STORAGE_BUCKET     (e.g. plexus-live.appspot.com)
//
// If those are absent, isFirebaseConfigured() returns false and callers fall
// back to the legacy static files — the site keeps working.

import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let app: App | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

function getApp(): App {
  if (app) return app;
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured (missing FIREBASE_* env vars).");
  }
  app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Vercel/.env store the key with escaped newlines; unescape them.
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  return app;
}

export function db(): Firestore {
  return getFirestore(getApp());
}

export function bucket() {
  return getStorage(getApp()).bucket();
}
