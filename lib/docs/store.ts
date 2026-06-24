// ── Plexus documents — server-side store (Firestore `documents`) ──
import "server-only";
import { isFirebaseConfigured, db } from "@/lib/firebase/admin";
import { type BizDoc, type DocType, DOC_PREFIX } from "./types";

const COLLECTION = "documents";

export async function getAllDocs(): Promise<BizDoc[]> {
  if (!isFirebaseConfigured()) return [];
  const snap = await db().collection(COLLECTION).get();
  return snap.docs
    .map((d) => d.data() as BizDoc)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getDoc(id: string): Promise<BizDoc | null> {
  if (!isFirebaseConfigured()) return null;
  const d = await db().collection(COLLECTION).doc(id).get();
  return d.exists ? (d.data() as BizDoc) : null;
}

export async function saveDoc(doc: BizDoc): Promise<void> {
  await db().collection(COLLECTION).doc(doc.id).set(doc, { merge: true });
}

export async function deleteDoc(id: string): Promise<void> {
  await db().collection(COLLECTION).doc(id).delete();
}

// Next number for a type this month → PLX-<PREFIX>-YYMM-NN (NN zero-padded).
export async function nextNumber(type: DocType, dateISO: string): Promise<string> {
  const d = dateISO ? new Date(dateISO) : new Date();
  const yy = String(d.getUTCFullYear()).slice(2);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const stem = `PLX-${DOC_PREFIX[type]}-${yy}${mm}-`;
  let n = 1;
  if (isFirebaseConfigured()) {
    const snap = await db()
      .collection(COLLECTION)
      .where("type", "==", type)
      .get();
    const used = snap.docs
      .map((s) => (s.data() as BizDoc).number || "")
      .filter((num) => num.startsWith(stem))
      .map((num) => parseInt(num.slice(stem.length), 10))
      .filter((x) => Number.isFinite(x));
    n = (used.length ? Math.max(...used) : 0) + 1;
  }
  return stem + String(n).padStart(2, "0");
}
