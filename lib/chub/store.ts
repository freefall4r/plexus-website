// ── C Hub job sheet — server-side data store ──
// Every Firebase read/write for chub orders lives here, through the shared
// admin layer (lib/firebase/admin), mirroring lib/fabrication/store.ts. The
// browser never touches Firebase directly. Guarded by isFirebaseConfigured()
// so the route degrades instead of crashing if creds are ever missing.

import "server-only";
import { randomUUID } from "node:crypto";
import { isFirebaseConfigured, db, bucket } from "@/lib/firebase/admin";
import type { ChubFile, ChubOrder, ChubOrderView, ChubPatch } from "./types";

const COLLECTION = "chubOrders";

/** A fresh order id — generated up front so files can be uploaded under
 *  chub/{id}/ before the Firestore doc is written. */
export function newChubOrderId(): string {
  return randomUUID();
}

// Direct-to-Storage upload (bypasses the Vercel serverless function body-size
// cap, which sits around ~4.5 MB — too small for real phone photos or 3D
// files). The browser never touches Firebase credentials: the server only
// hands back a short-lived signed URL scoped to one exact object path, the
// browser PUTs the bytes straight to Google Cloud Storage, then a second tiny
// (byte-free) server call stamps the object with its download token. See
// app/api/chub/uploads/route.ts.

export type ChubUploadSlot = {
  name: string;
  objectPath: string;
  token: string;
  uploadUrl: string;
  contentType: string;
};

/** Mint a signed PUT URL for one file, scoped to chub/{orderId}/. Expires in
 *  15 minutes — plenty for a single upload, short enough to not linger. */
export async function createChubUploadSlot(
  orderId: string,
  fileName: string,
  contentType: string
): Promise<ChubUploadSlot> {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "file";
  const objectPath = `chub/${orderId}/${randomUUID()}-${safeName}`;
  const token = randomUUID();
  const type = contentType || "application/octet-stream";
  const [uploadUrl] = await bucket()
    .file(objectPath)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType: type,
    });
  return { name: fileName, objectPath, token, uploadUrl, contentType: type };
}

/** After the browser's PUT succeeds, stamp the object with its download
 *  token (a tiny metadata call, no file bytes) and return the finished
 *  Firebase-style download URL. Caller must catch — the PUT may have failed,
 *  or Storage may be unavailable. */
export async function finalizeChubUpload(
  objectPath: string,
  token: string,
  name: string,
  sizeKB: number,
  type: string
): Promise<ChubFile> {
  const obj = bucket().file(objectPath);
  await obj.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } });
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket().name}/o/${encodeURIComponent(
    objectPath
  )}?alt=media&token=${token}`;
  return { name, url, sizeKB, type };
}

/** Create the order doc at a given id (use newChubOrderId()). Always
 *  status:"New", priceJOD:null at creation. */
export async function createChubOrder(
  id: string,
  data: Omit<ChubOrder, "status" | "priceJOD" | "createdAt" | "updatedAt">
): Promise<void> {
  const now = new Date().toISOString();
  const order: ChubOrder = {
    ...data,
    status: "New",
    priceJOD: null,
    createdAt: now,
    updatedAt: now,
  };
  await db().collection(COLLECTION).doc(id).set(order);
}

/** All orders, newest first. */
export async function listChubOrders(): Promise<ChubOrderView[]> {
  if (!isFirebaseConfigured()) return [];
  const snap = await db().collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ChubOrder) }));
}

/** Inline edits — status, price, or any other field — merge-patched. */
export async function updateChubOrder(id: string, patch: ChubPatch): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.set({ ...patch, updatedAt: new Date().toISOString() }, { merge: true });
  return true;
}

/** Used only by the cleanup script (scripts/delete-chub-order.mjs). */
export async function deleteChubOrder(id: string): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  await db().collection(COLLECTION).doc(id).delete();
  return true;
}
