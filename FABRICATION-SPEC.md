# Plexus Workshop — On-Demand Fabrication (CNC + Laser)

**Status:** Planning / contract draft — not yet built.
**Purpose:** A new section on plexusworkshop.com where clients request on-demand CNC
routing and laser cutting. They either upload their own files or pick a ready
design, describe specs, and submit. Every order is **quote-after** (no payment on
site). Orders land in a shared Firebase store that the **admin portal** (built
separately) reads and updates.

> This file is the **shared contract** between the website and the admin portal.
> Both sides MUST build to the data shape and status lifecycle below. If the two
> agree on this, neither needs to know how the other is implemented.

---

## 1. The two builds and who owns what

| Surface | Owner | Writes | Reads |
|---|---|---|---|
| **Website** (this repo) | website-Claude | Creates the order once (`status: "new"`), uploads files to Storage | Reads one order by ID for the client's status link |
| **Admin portal** (separate) | portal-Claude | All status changes after `new`, the quote, internal notes | Lists & reads all orders |

The handoff is **Firebase**: Firestore for order data, Firebase Storage for files.
Project already has Firebase wired (used by `/live`) — same project, same creds.

---

## 2. Data contract — Firestore

Collection: **`fabricationOrders`**
Document ID: a **long, unguessable random string** — this same ID IS the client's
status-link token (see §5). Do not use sequential IDs.

```
fabricationOrders/{orderId}
  service:      "cnc" | "laser"
  source:       "custom" | "template"
  templateId:   string | null        // which ready design, if source = "template"
  specs:
    material:   string               // e.g. "Birch plywood"
    thickness:  string               // e.g. "9mm"
    dimensions: string               // free text or "W x H (mm)"
    quantity:   number
    finish:     string               // e.g. "raw" | "sanded" | "oiled"
    notes:      string
  files: [ { name: string, url: string, sizeKB: number, type: string } ]
  contact:
    name:       string
    whatsapp:   string               // E.164 preferred, e.g. "+9627..."
    email:      string
  status:       "new" | "reviewing" | "quoted" | "confirmed"
              | "in_production" | "ready" | "completed"
              | "declined" | "cancelled"
  quote:        { amountJOD: number, leadTimeDays: number, message: string } | null
  lang:         "en" | "ar"          // language the client ordered in
  createdAt:    timestamp
  updatedAt:    timestamp
```

**Rules of the contract**
- Website sets everything EXCEPT `quote` (null at creation) and only ever sets
  `status: "new"`.
- Portal owns `status` transitions and writes `quote`.
- `updatedAt` is bumped on every write by whoever writes.
- `client accept` action on the status page may move `quoted -> confirmed`
  (the only post-creation write the website is allowed to make). Everything else
  past `new` is the portal.

---

## 3. Status lifecycle

```
[new] ──► [reviewing] ──► [quoted] ──► [confirmed] ──► [in_production] ──► [ready] ──► [completed]
                              │
                              └─► [declined]        (client declines the quote)
   any state ──► [cancelled]                        (either side cancels)
```

- `new` — created by website. **Fires the WhatsApp ping to anahata.**
- `reviewing` — an engineer has it.
- `quoted` — `quote` is filled; client sees price + lead time on their link.
- `confirmed` — client accepted.
- `in_production` — cutting.
- `ready` / `completed` — done / handed over.
- `declined` / `cancelled` — terminal.

---

## 4. Firebase Storage layout

Uploaded files go to: `fabrication/{orderId}/{filename}`
Each file's public/download URL is stored back in `files[].url` on the order doc.

**Accepted file types:** `.dxf, .svg, .ai, .pdf, .step, .stp` (design/CAD)
plus `.jpg, .jpeg, .png` (reference images).
**Per-file size cap:** 50 MB.

---

## 5. Security model (no client login) — SERVER-SIDE ONLY

> Supersedes the earlier "allow get / deny list" client-rules sketch. Per
> FIREBASE-SHARED.md + HANDOFF-to-fabrication.md, **the browser never touches
> Firebase**. Firestore rules deny ALL direct client access for the whole project.

- Order ID = a long, unguessable url-safe token (20+ chars). Knowing the ID =
  access to that one order's status. Nothing else identifies the client.
- **All Firebase access is server-side** via `lib/firebase/admin.ts` (`db()`,
  `bucket()`), through Next.js API routes / server components:
  - Order create → server route writes the doc + uploads files.
  - `/fabrication/track/[token]` → server component/route reads the single order
    by token. No Firebase client SDK in the browser (it would be blocked).
  - Client "accept" (`quoted → confirmed`) → server route.
- The token is the only secret; because reads are server-side, a leaked token
  only exposes that one order's status, never the collection.

---

## 6. Notifications

- **On `new`:** WhatsApp ping to anahata via the Meta WhatsApp Cloud API
  (same Meta path being set up for Content Studio IG auto-posting). Triggered by a
  Cloud Function / API route on order create. Volume is tiny (self-notify) so cost
  is negligible, but needs the WhatsApp Business number connected once.
- **Fallback until WhatsApp is live:** email summary + the portal's new-order list.
  The order code does not change when switching the alert channel on.

---

## 7. Website pages (this repo)

All bilingual EN/AR + RTL, matching the existing site (Tailwind v4 tokens,
Fraunces/Hanken/Reem fonts, copper accent).

| Route | Purpose |
|---|---|
| `/fabrication` | Landing: hero, examples gallery (CNC / Laser tabs), "how it works" (3 steps), two CTAs — "Start a custom order" / "Browse ready designs". |
| `/fabrication/order` | The order wizard (see §8). |
| `/fabrication/track/[token]` | Read-only status page for the client; shows quote + "Accept / talk on WhatsApp" when `quoted`. |

**Sanity additions** (so anahata edits content without code):
- `fabricationExample` — gallery items: title (EN/AR), service ("cnc"/"laser"),
  image, material, short description.
- `fabricationTemplate` — ready designs (lids, trays…): title (EN/AR), image,
  service, default material/thickness options, description. No price (quote-after).

---

## 8. Order wizard steps (`/fabrication/order`)

1. **Service** — CNC or Laser.
2. **Start point** — "My own design (upload)" OR "A ready template" (pick one).
3. **Specs** — material, thickness, dimensions, quantity, finish, notes
   (dropdowns from §9).
4. **Files** — drag & drop (types/cap from §4). Optional if a template was picked.
5. **Contact** — name, WhatsApp, email.
6. **Submit** → writes the order (`status: "new"`), uploads files, shows
   confirmation: *"✅ Order received — an engineer will contact you within 24
   hours. Save your tracking link: …"* + the `/fabrication/track/[token]` link.

---

## 9. Starter options for the form (anahata to tweak)

These are sensible defaults — edit freely. Materials differ by service.

### CNC (router) materials
- Birch plywood
- MDF
- Solid oak
- Solid walnut
- Solid beech
- Bamboo plywood
- Acrylic (cast)
- Aluminium composite (Dibond)

**CNC thicknesses:** 3, 6, 9, 12, 18, 25 mm

### Laser materials
- Birch plywood (thin)
- MDF (thin)
- Acrylic (cast)
- Leather
- Cardboard / paperboard
- Anodised aluminium (engraving only)

**Laser thicknesses:** 2, 3, 5, 8, 10 mm

### Finish options (both)
- Raw (as cut)
- Sanded
- Oiled
- Painted / custom (describe in notes)

### Lead-time promise (confirmation screen)
- "An engineer will contact you within **24 hours**."

---

## 10. Open / later
- Confirm Meta WhatsApp Business number is connected (for the ping).
- Decide exact gallery seed content (which CNC/laser examples to show first).
- Optional v2: client accepts/pays a deposit online; for now accept = WhatsApp.
