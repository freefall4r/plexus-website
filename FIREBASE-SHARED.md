# Firebase — shared foundation (read before building anything Firebase-backed)

Two features share ONE Firebase project in this repo:

| Feature | Owner | Firestore collection | Storage prefix |
|---|---|---|---|
| **Live builds** (`/live`) + **admin** (`/plexusadmin`) | live/admin-Claude | `projects` | `live/{slug}/` |
| **On-demand fabrication** (`/fabrication`) | fabrication-Claude | `fabricationOrders` | `fabrication/{orderId}/` |

The fabrication data shape + status lifecycle live in **FABRICATION-SPEC.md**.
This file is the **Firebase plumbing** both sides must reuse — don't re-implement it.

---

## 1. One Firebase access layer — `lib/firebase/admin.ts` (server-only)

Already built. **All Firebase access goes through this**, on the server. Import:

```ts
import { db, bucket, isFirebaseConfigured } from "@/lib/firebase/admin";
```

- `db()` → Firestore (Admin SDK)
- `bucket()` → Storage bucket (Admin SDK)
- `isFirebaseConfigured()` → boolean; **guard with it** so the site doesn't crash
  before creds are set (degrade gracefully, like `lib/live/store.ts` does).

Do **not** add a second Firebase init or the client SDK. See §3 for why.

## 2. Env vars (already in `.env.example`) — same names on both sides

```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY        # one line, literal \n for newlines, quoted
FIREBASE_STORAGE_BUCKET     # e.g. plexus-live.appspot.com
PLEXUS_ADMIN_PASSCODE       # unlocks /plexusadmin (admin/portal side)
```

Fabrication's WhatsApp/Meta notification vars are separate and owned by that side.

## 3. Access pattern — **server-side only** (recommended standard)

The admin side reads/writes Firebase **only through Next.js API routes / server
components** using the Admin SDK above. The browser never holds Firebase creds, so
a leaked passcode or token can't touch the database directly.

**Fabrication should do the same:**
- Order create (`status:"new"`) → a server API route writes via `db()`, uploads via `bucket()`.
- `/fabrication/track/[token]` → read the single order **server-side by token** (server
  component or API route), not the client SDK.

Benefit: **Firestore security rules can deny ALL direct client access** (one rule for
the whole project), and we never ship client Firebase config. Simpler + safer than the
"allow get / deny list" client-rules approach sketched in FABRICATION-SPEC §5 — that
rule set becomes unnecessary if reads are server-side. **If fabrication needs client-SDK
reads for a reason, raise it before Firebase is provisioned so rules are written to match.**

## 4. The admin portal = `/plexusadmin` (single surface)

FABRICATION-SPEC calls the order manager "the admin portal (built separately)." That
**is** `/plexusadmin`. It already manages live-build `projects`; it will get a
**Fabrication Orders** section that lists `fabricationOrders`, changes `status`, and
writes `quote` per the spec's lifecycle. One passcode, one app, both features.

## 5. Provisioning (one-time, done by the live/admin side)

When the real Firebase project is created it serves **both** features. Security +
storage rules will cover **both** collections/prefixes. Nothing fabrication does needs
its own Firebase project.

---

_Maintained by the live-builds/admin session. Ping via anahata before changing the
shared lib interface or env-var names._
