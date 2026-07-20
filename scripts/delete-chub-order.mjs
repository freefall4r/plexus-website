#!/usr/bin/env node
// ── C Hub job sheet — delete an order doc directly ──
// Removes a doc from the "chubOrders" collection by id. Used for cleaning up
// test orders created while verifying the /chub tool (mirrors delete-build.mjs).
//
// Usage:  node scripts/delete-chub-order.mjs <orderId>

import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
  });
const db = getFirestore(app);

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error("Usage: node scripts/delete-chub-order.mjs <orderId>");
    process.exit(1);
  }
  const ref = db.collection("chubOrders").doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    console.log(`No chub order with id "${id}" — nothing to delete.`);
    return;
  }
  const data = snap.data();
  await ref.delete();
  console.log(`✓ Deleted chub order "${data.clientName}" / "${data.jobType}" (id: ${id}).`);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
