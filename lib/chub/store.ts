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

/** Upload one file to Storage under chub/{orderId}/ and return its record with
 *  a public download URL. Caller must catch — Storage may not be enabled yet. */
export async function uploadChubFile(
  orderId: string,
  file: File
): Promise<ChubFile> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "file";
  const objectPath = `chub/${orderId}/${randomUUID()}-${safeName}`;
  const dlToken = randomUUID();
  const buf = Buffer.from(await file.arrayBuffer());
  const obj = bucket().file(objectPath);
  await obj.save(buf, {
    contentType: file.type || "application/octet-stream",
    metadata: { metadata: { firebaseStorageDownloadTokens: dlToken } },
  });
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket().name}/o/${encodeURIComponent(
    objectPath
  )}?alt=media&token=${dlToken}`;
  return {
    name: file.name,
    url,
    sizeKB: Math.round(file.size / 1024),
    type: file.type || "",
  };
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
