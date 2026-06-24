# Handoff → the fabrication (CNC/Laser) session

Paste this into the other Claude. It lets both sessions work the same repo in
parallel without clashing.

---

You're building the **on-demand fabrication** feature (FABRICATION-SPEC.md) in
`~/Desktop/Projects/Plexus/plexus-amman`. A parallel session already built the
**Firebase foundation + live-builds + `/plexusadmin` admin**. Build on it; don't
rebuild it. Read **FIREBASE-SHARED.md** and **FABRICATION-SPEC.md** first.

## Use the existing Firebase layer (do NOT add a second one)
```ts
import { db, bucket, isFirebaseConfigured } from "@/lib/firebase/admin";
```
- `db()` Firestore (Admin SDK), `bucket()` Storage, `isFirebaseConfigured()` guard.
- `firebase` + `firebase-admin` are already in package.json. No client SDK.
- Env vars already defined in `.env.example`: `FIREBASE_PROJECT_ID`,
  `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET`. Reuse
  them as-is. Add your WhatsApp/Meta vars in a NEW section of `.env.example`.

## Access pattern is SERVER-SIDE ONLY (hard requirement)
The Firestore security rules I provision will **deny all direct browser access**.
So everything must go through Next.js API routes / server components using `db()`/
`bucket()`:
- Order create → a server route writes the doc + uploads files.
- `/fabrication/track/[token]` → **read the single order server-side by token**
  (server component or API route). **Do not use the Firebase client SDK in the
  browser — it will be blocked.** (This replaces the "allow get / deny list" client
  rules in FABRICATION-SPEC §5; not needed when reads are server-side.)
  If you have a real reason to need client reads, tell anahata BEFORE Firebase is
  provisioned so rules can be written to match.

## Who owns what (stay in your lane to avoid clobbering)

**You own (create/edit freely):**
- `app/fabrication/**` — landing, `/order` wizard, `/track/[token]`
- `app/api/fabrication/**` — your order-create + accept routes (namespace under
  `fabrication/` so we never collide on route files)
- Sanity schema additions: `fabricationExample`, `fabricationTemplate`
- `FABRICATION-SPEC.md`

**I own (DON'T edit — import only):**
- `lib/firebase/**`, `lib/live/**`, `lib/admin/**`
- `app/plexusadmin/**`, `app/api/admin/**`, `app/api/live/**`
- `app/live/**`, `components/live/**`, `components/admin/**`
- the `/plexusadmin` exclusion line in `components/layout/SiteChrome.tsx`
- the Firebase + "Plexus Live" sections of `.env.example`
- **The admin/portal side of fabrication is mine:** the order-management UI (list
  orders, change `status`, write `quote`) goes in `/plexusadmin`. You do NOT build a
  separate admin portal — just the public website side + order creation.

**Shared files — append, don't rewrite:**
- `.env.example` — add your vars in a new section only.
- `package.json` — add only new deps you actually need (e.g. WhatsApp SDK); firebase
  is already there.
- `sanity.config.ts` / schema index — add your two types; I don't touch Sanity.

## Data contract you must honor (so my portal can read your orders)
- Collection **`fabricationOrders`**, doc id = long random url-safe token (= the
  track token). Shape + status lifecycle exactly per FABRICATION-SPEC §2–§3.
- On create: `status:"new"`, `quote:null`, set `createdAt`/`updatedAt`.
- Files → Storage `fabrication/{orderId}/{filename}`; save download URLs in
  `files[].url`. (My live builds use `live/{slug}/` — different prefix, no clash.)
- After `new`, only the client "accept" (`quoted → confirmed`) is yours; every other
  status change + the `quote` is written by my `/plexusadmin`.

## Don't provision Firebase yourself
I'm creating the single Firebase project (serves both features) and writing the
security + storage rules to cover **both** `projects` (mine) and `fabricationOrders`
(yours). Build against `isFirebaseConfigured()` so the site keeps working until creds
land.

Questions about the shared layer → route through anahata.
