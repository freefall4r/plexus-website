// ── On-Demand Fabrication — server-side data store ──
// Every Firebase read/write for fabrication orders lives here, on the server,
// through the shared admin layer (lib/firebase/admin). The browser never touches
// Firebase (see FIREBASE-SHARED.md / HANDOFF-to-fabrication.md). Guarded by
// isFirebaseConfigured() so the site keeps working before creds land.

import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { isFirebaseConfigured, db, bucket } from "@/lib/firebase/admin";
import type {
  FabricationFile,
  FabricationOrder,
  FabricationTrackView,
} from "./types";

const COLLECTION = "fabricationOrders";

/** A long, unguessable url-safe token. Doubles as the Firestore doc id and the
 *  client's tracking-link secret. */
export function newOrderToken(): string {
  return randomBytes(18).toString("base64url"); // 24 url-safe chars
}

/** Upload one file to Storage under fabrication/{orderId}/ and return its record
 *  with a public download URL. Caller must ensure Firebase is configured. */
export async function uploadOrderFile(
  orderId: string,
  file: File
): Promise<FabricationFile> {
  const safeName =
    file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "file";
  const objectPath = `fabrication/${orderId}/${randomUUID()}-${safeName}`;
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

/** Create the order doc. Website only ever writes status:"new", quote:null. */
export async function createFabricationOrder(
  id: string,
  data: Omit<FabricationOrder, "status" | "quote" | "createdAt" | "updatedAt">
): Promise<void> {
  const now = new Date().toISOString();
  const order: FabricationOrder = {
    ...data,
    status: "new",
    quote: null,
    createdAt: now,
    updatedAt: now,
  };
  await db().collection(COLLECTION).doc(id).set(order);
}

/** Read a single order by its token (server-side only) for the tracking page. */
export async function getOrderByToken(
  token: string
): Promise<FabricationTrackView | null> {
  if (!isFirebaseConfigured()) return null;
  const doc = await db().collection(COLLECTION).doc(token).get();
  if (!doc.exists) return null;
  const o = doc.data() as FabricationOrder;
  return {
    id: doc.id,
    service: o.service,
    source: o.source,
    templateId: o.templateId ?? null,
    specs: o.specs,
    files: (o.files || []).map((f) => ({ name: f.name })),
    contactName: (o.contact?.name || "").split(" ")[0] || "",
    status: o.status,
    quote: o.quote ?? null,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

/** Client accepts a quote: quoted → confirmed. The ONLY post-"new" write the
 *  website makes; every other status change + the quote is owned by /plexusadmin. */
export async function acceptQuote(token: string): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const ref = db().collection(COLLECTION).doc(token);
  const doc = await ref.get();
  if (!doc.exists) return false;
  const o = doc.data() as FabricationOrder;
  if (o.status !== "quoted") return false;
  await ref.set(
    { status: "confirmed", updatedAt: new Date().toISOString() },
    { merge: true }
  );
  return true;
}
