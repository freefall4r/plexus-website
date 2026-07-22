// ── C Hub web push — server side ──
// Stores browser push subscriptions (Firestore `chubPush`) and sends the
// "new job posted" notification through the Web Push protocol (`web-push`
// with our own VAPID keys — no third-party push account involved). Layth
// installs C Hub as a home-screen app and taps Enable notifications once;
// from then on every new job order pings his phone.
//
// Env (set in .env.local for dev, Vercel for prod):
//   NEXT_PUBLIC_VAPID_PUBLIC_KEY   (also baked into the client button)
//   VAPID_PRIVATE_KEY
//   VAPID_SUBJECT                  (optional, defaults to the site URL)

import "server-only";
import { createHash } from "node:crypto";
import webpush from "web-push";
import { FieldValue } from "firebase-admin/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/admin";

const COLLECTION = "chubPush";

export type ChubPushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export function isPushConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

function configureVapid(): void {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "https://www.plexusworkshop.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

/** Basic shape check on what the browser sent — endpoint must be an https
 *  push-service URL and both crypto keys must be present. */
export function isChubPushSubscription(v: unknown): v is ChubPushSubscription {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  const keys = s.keys as Record<string, unknown> | undefined;
  return (
    typeof s.endpoint === "string" &&
    s.endpoint.startsWith("https://") &&
    s.endpoint.length < 2048 &&
    !!keys &&
    typeof keys.p256dh === "string" &&
    typeof keys.auth === "string"
  );
}

// Doc id = hash of the endpoint, so re-subscribing the same device
// overwrites its own record instead of piling up duplicates.
function docId(endpoint: string): string {
  return createHash("sha256").update(endpoint).digest("hex").slice(0, 32);
}

export async function saveChubPushSubscription(
  sub: ChubPushSubscription,
  userAgent: string
): Promise<void> {
  await db()
    .collection(COLLECTION)
    .doc(docId(sub.endpoint))
    .set({
      endpoint: sub.endpoint,
      keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      userAgent: userAgent.slice(0, 300),
      createdAt: FieldValue.serverTimestamp(),
    });
}

export async function deleteChubPushSubscription(endpoint: string): Promise<void> {
  await db().collection(COLLECTION).doc(docId(endpoint)).delete();
}

/** Send a notification to every subscribed device. Dead subscriptions
 *  (push service answers 404/410 — app uninstalled, permission revoked)
 *  are pruned as we go. Never throws — a push failure must not break the
 *  job-creation request it rides on. */
export async function sendChubPush(payload: {
  title: string;
  body: string;
  url: string;
}): Promise<void> {
  try {
    if (!isPushConfigured() || !isFirebaseConfigured()) return;
    configureVapid();
    const snap = await db().collection(COLLECTION).get();
    const json = JSON.stringify(payload);
    await Promise.all(
      snap.docs.map(async (doc) => {
        const data = doc.data();
        try {
          await webpush.sendNotification(
            { endpoint: data.endpoint, keys: data.keys },
            json,
            { TTL: 60 * 60 * 24 }
          );
        } catch (e) {
          const status = (e as { statusCode?: number })?.statusCode;
          if (status === 404 || status === 410) {
            await doc.ref.delete().catch(() => null);
          }
        }
      })
    );
  } catch {
    // deliberately swallowed — see note above
  }
}
