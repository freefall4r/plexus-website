// ── C Hub job sheet — server-side data store ──
// Every Firebase read/write for chub orders lives here, through the shared
// admin layer (lib/firebase/admin), mirroring lib/fabrication/store.ts. The
// browser never touches Firebase directly. Guarded by isFirebaseConfigured()
// so the route degrades instead of crashing if creds are ever missing.

import "server-only";
import { randomUUID } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { isFirebaseConfigured, db, bucket } from "@/lib/firebase/admin";
import type {
  ChubFile,
  ChubInvoice,
  ChubMaterialLogEntry,
  ChubOffer,
  ChubOrder,
  ChubOrderView,
  ChubPatch,
  ChubProcessLogEntry,
  ChubWip,
  ChubWipBoard,
} from "./types";

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

// ── Board notes ──
// One shared scratchpad for the whole job list — Layth's comments across jobs
// ("waiting on birch ply", "khaled needs a site visit"), not tied to any one
// order. A single fixed document rather than a collection: there is exactly
// one board, and it should stay that way.

const BOARD_COLLECTION = "chubBoard";
const BOARD_DOC = "notes";

export type ChubBoardNotes = { text: string; updatedAt: string | null };

export async function getChubBoardNotes(): Promise<ChubBoardNotes> {
  if (!isFirebaseConfigured()) return { text: "", updatedAt: null };
  const snap = await db().collection(BOARD_COLLECTION).doc(BOARD_DOC).get();
  if (!snap.exists) return { text: "", updatedAt: null };
  const d = snap.data() as Partial<ChubBoardNotes>;
  return { text: d.text ?? "", updatedAt: d.updatedAt ?? null };
}

export async function setChubBoardNotes(text: string): Promise<ChubBoardNotes> {
  const updatedAt = new Date().toISOString();
  await db().collection(BOARD_COLLECTION).doc(BOARD_DOC).set({ text, updatedAt }, { merge: true });
  return { text, updatedAt };
}

/** One order by id, or null. Used by the offer route, which needs the whole
 *  job (price, dimensions, materials, photos) to build the quotation from. */
export async function getChubOrder(id: string): Promise<ChubOrderView | null> {
  if (!isFirebaseConfigured()) return null;
  const doc = await db().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as ChubOrder) };
}

/** Link a created client quotation back onto the job. Deliberately its own
 *  function rather than a ChubPatch field: ChubPatch is what the shared-
 *  passcode inline-edit route accepts, and the offer (Plexus's margin) must
 *  never be writable from Layth's side. Only the owner-gated offer route
 *  calls this. */
export async function setChubOffer(id: string, offer: ChubOffer): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.set({ offer, updatedAt: new Date().toISOString() }, { merge: true });
  return true;
}

/** Link a created invoice back onto the job (Phase 2). Same owner-only
 *  reasoning as setChubOffer — never a ChubPatch field. */
export async function setChubInvoice(id: string, invoice: ChubInvoice): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.set({ invoice, updatedAt: new Date().toISOString() }, { merge: true });
  return true;
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

// ── Work-In-Progress ──
// Every write below touches `wip` via dot-path field updates (`ref.update({
// "wip.x": ... })`) rather than replacing the whole `wip` map, so a
// materials-log append can never clobber the process log (or board,
// startDate, liveLink) and vice versa — same "only touch what's given"
// discipline as updateChubOrder above, just enforced at the Firestore field
// level instead of the JS-object level since `wip` is a nested map.

function todayISODate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Promote an order onto a WIP board. Preserves an existing startDate/logs
 *  if the job was started once before and later marked complete — reopening
 *  a completed job shouldn't wipe its history, just reactivate it. */
export async function startChubWip(id: string, board: ChubWipBoard): Promise<ChubWip | null> {
  if (!isFirebaseConfigured()) return null;
  const ref = db().collection(COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const existing = (snap.data() as ChubOrder).wip;
  const startDate = existing?.startDate ?? todayISODate();
  await ref.update({
    "wip.active": true,
    "wip.board": board,
    "wip.startDate": startDate,
    updatedAt: new Date().toISOString(),
  });
  return {
    active: true,
    board,
    startDate,
    materialsLog: existing?.materialsLog ?? [],
    processLog: existing?.processLog ?? [],
    liveLink: existing?.liveLink ?? null,
  };
}

/** Simple wip field patch — active (e.g. "mark complete"), board (correct a
 *  mis-guess), startDate, or liveLink. Dot-path update so materialsLog/
 *  processLog are never touched. */
export async function updateChubWipFields(
  id: string,
  patch: Partial<Pick<ChubWip, "active" | "board" | "startDate" | "liveLink">>
): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const ref = db().collection(COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [k, v] of Object.entries(patch)) update[`wip.${k}`] = v;
  await ref.update(update);
  return true;
}

/** Append one materials-log entry (arrayUnion — a single atomic op that
 *  only ever touches wip.materialsLog). */
export async function addChubMaterialLogEntry(
  id: string,
  entry: { text: string; buyer: string }
): Promise<ChubMaterialLogEntry | null> {
  if (!isFirebaseConfigured()) return null;
  const ref = db().collection(COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const item: ChubMaterialLogEntry = {
    id: randomUUID(),
    text: entry.text,
    buyer: entry.buyer,
    date: new Date().toISOString(),
  };
  await ref.update({ "wip.materialsLog": FieldValue.arrayUnion(item), updatedAt: new Date().toISOString() });
  return item;
}

/** Append one process-log entry (arrayUnion — only ever touches
 *  wip.processLog). Starts as not-done. */
export async function addChubProcessLogEntry(
  id: string,
  entry: { text: string; who: string }
): Promise<ChubProcessLogEntry | null> {
  if (!isFirebaseConfigured()) return null;
  const ref = db().collection(COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const item: ChubProcessLogEntry = {
    id: randomUUID(),
    text: entry.text,
    who: entry.who,
    date: new Date().toISOString(),
    done: false,
  };
  await ref.update({ "wip.processLog": FieldValue.arrayUnion(item), updatedAt: new Date().toISOString() });
  return item;
}

/** Flip one process-log entry's done flag. Reads the current array, flips
 *  the matching entry, writes the whole array back through the single
 *  wip.processLog field path — sibling fields (materialsLog, board, etc.)
 *  are never touched. */
export async function toggleChubProcessLogEntry(id: string, entryId: string, done: boolean): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const ref = db().collection(COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  const list = (snap.data() as ChubOrder).wip?.processLog ?? [];
  if (!list.some((e) => e.id === entryId)) return false;
  const next = list.map((e) => (e.id === entryId ? { ...e, done } : e));
  await ref.update({ "wip.processLog": next, updatedAt: new Date().toISOString() });
  return true;
}
