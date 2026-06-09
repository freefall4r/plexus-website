# Plexus Workshop — website

Marketing site + shop + a "Custom 3D Studio" for a wood workshop in **Amman, Jordan**, run by a
**Sopron-trained timber-industry engineer**. Brand: **Plexus Workshop**. Aesthetic: natural/editorial —
limewash + copper + sage, Fraunces display font, organic motion.

- **Repo:** `/Users/anahata/Desktop/plexus-amman` · GitHub `git@github.com:freefall4r/plexus-website.git`
- **Stack:** Next.js **16.2.6** (App Router, Turbopack), React 19, Tailwind **v4** (`app/globals.css` `@theme` tokens), framer-motion + Lenis, three.js/R3F (3D studio).
- **Host:** Vercel project **`plexus-website-ausc`** (team `freefall4rs-projects`, user **freefall4r**). Live: **https://www.plexusworkshop.com** (apex → www).
- **Deploy:** `git push origin main` auto-deploys to production. Manual: `~/.npm-global/bin/vercel --prod --yes` (CLI authed as freefall4r).

---

## ✅ CURRENT STATE — RESUME HERE (as of 2026-06-10)

The site is **redesigned, bilingual (EN/AR + RTL), mobile-ready, and LIVE**, now with a **full Cash-on-Delivery order flow (WhatsApp intake)**, trust signals (real Google reviews, 5.0★ badges, Instagram block, FAQ), and a revamped Workshop page. Editing is via **Sanity Studio at `/studio`** (text, images, products — no code). SEO done (LocalBusiness JSON-LD, sitemap, robots, + bookshelf/shelving keywords). Contact: phone `+962 7 9179 2129`, IG `plexus.workshop`, address `Waela Bent Al Askaa, Amman`; **email is still a placeholder** `hello@plexusworkshop.com`. Vercel Web Analytics is live.

### Session 2026-06-08 — e-commerce (COD), bookshelves, workshop page, trust + fixes
**How a sale arrives:** there is NO payment gateway and NO sales dashboard. Every "Order/Buy/Checkout" action **opens WhatsApp pre-filled to `+962 7 9179 2129`** with product + customer name/phone/address (COD) — so **a sale = a new WhatsApp message**. Analytics shows visits only, never sales.

- **Cart + Cash-on-Delivery checkout** (commit `658f46c`): `lib/cart.tsx` (CartProvider, `localStorage` key `plexus-cart`), `components/cart/{AddToCart,CartDrawer,CheckoutForm}.tsx`, `app/checkout/page.tsx` (noindex). `CheckoutForm` builds a WhatsApp message and `window.open(waLink(msg))`. Cart button + count badge added to `components/layout/Nav.tsx` (desktop + mobile).
- **In-stock vs made-to-order:** `lib/stock.ts` — `IN_STOCK_SLUGS = {smooth-copper-cup, hammered-copper-cup}`, `isInStock(slug)`. In-stock cups get Add-to-Cart/COD; everything else routes to WhatsApp "commission / made to order".
- **Product galleries** (commit `9e317fe`/`9c162df`): `components/shop/ProductGallery.tsx` (main image + thumbnail switcher). `ProductDetail` builds `photos = [imageUrl, ...galleryUrls]`; Sold/Featured badge overlays. Each product now has a 2nd image.
- **Bookshelves + bookshelf SEO** (`5006e11`): added 2 bookshelf products + EN/AR shelving keywords/copy (came from a real Google Trends demand signal — the demand→research→product→SEO method). Shop static fallback `lib/products.ts` has 3 art entries; live shop is Sanity-driven (8 products incl. cups, Rose Quartz [sold], bookshelves).
- **Workshop page revamp** (`a0c479d`→`63edde0`): `components/about/AboutPage.tsx` — a `caps` grid of **9 capabilities** (hand joinery, laser, CNC, 3D printing, leather, sewing, milling, metal forming, granite/stone) each w/ inline SVG icon + EN/AR; a `services` list (7, incl. restoration); two new sections ("Inside the workshop", "What we can make for you"). **Hero = the girih / multi-material console** (`/brand/workshop-fabrication.jpg`) — the user loved it; he rejected the "Fault Line Bench" render as fake. Don't swap the hero back.
- **Trust upgrades:** real Google reviews in Sanity `testimonial` type (`c46201a`); visible **5.0★ · 17 reviews** badge in hero + contact + testimonials (`7972a74`,`286789c`); **Instagram follow** block (`d790f30`); **FAQ + FAQPage JSON-LD** (`1a2b42c`); OG/Twitter share image (`a7acbbe`). `lib/config.ts` → `reviews = {rating:5.0, count:17, url: site.googleProfile}`, `site.googleProfile` = his real `share.google` listing.
- **English is now the default language** (`ab229d9`): removed the navigator→`ar` auto-switch in `lib/i18n/context.tsx`; only a saved localStorage choice flips it.
- **Mobile/robustness fixes:** plaster/grain layers `display:none` ≤640px (iOS renders fixed + blend-mode badly) — see globals.css; shop grid layout-shift fixed by dropping framer-motion `layout` animation (`dcbb1fe`); **blank-page failsafe** in `app/layout.tsx` (~110 framer `opacity:0` els → `<noscript>` reveal + window error/unhandledrejection listeners) after a friend in Saudi/Instagram saw a blank page (`d6d56cc`); **`text-size-adjust:100%`** on `html` to stop Instagram/FB in-app WebViews inflating + glitching text (`d790789`).

### Session 2026-06-06 — shop products, Brand Partnerships, lime plaster
- **Shop now has 3 real Sanity products:** Hammered Copper Cup (44 JOD), **Smooth Copper Cup** (24 JOD), **Rose Quartz on Walnut Stand** (212 JOD, marked sold). Created via a temporary Sanity **write token** (since `.env.local` only has read keys — Sensitive Vercel vars); token was revoked after. To add more programmatically, the user makes a new Editor token at `sanity.io/manage/project/04el01fe/api/tokens`.
- **"Sold" feature (no schema change):** a product is sold if its **`tags` include `"sold"`**. `components/shop/ProductCard.tsx` + `ProductDetail.tsx` show a "Sold" badge, strike the price, and swap the order CTA to "Commission a similar piece". Tags aren't used in shop filters, so it doesn't leak.
- **New page `/partnerships` — "Brand Partnerships"** (B2B / white-label): `app/partnerships/page.tsx` + `components/partnerships/BrandPartnerships.tsx` (bilingual inline EN/AR, WhatsApp+email intake). Added to `components/layout/Nav.tsx` (`nav.partners` in `lib/i18n/dict.ts`) and `app/sitemap.ts`.
- **Lime-plaster background:** `.grain::before` underlay in `app/globals.css` (mottled radial pools + soft-light fractal-noise grain + a diagonal light). **Gotcha:** the body has an opaque `bone` background, so the `z-index:-1` underlay was invisible until `.grain { isolation: isolate }` was added (makes `.grain` its own stacking context so the underlay paints above the body bg). `/studio` excluded (no `.grain`).
- **Product imagery is AI-made** (Higgsfield: GPT Image 2 for concept renders, Nano Banana 2 for image-to-image restyles of the user's real photos into the limewash/stone look). Working files live in **`renders/`** (gitignored). Other gitignored scratch: `PRODUCT-RESEARCH.md` (200-product research), `catalog-preview.html`, `collection.html` (30 curated rendered concepts), `designs.html`, `restyle-preview.html`. Local design preview = `npm run dev` + headless-Chrome screenshots into `~/Desktop/Projects/Plexus/assets/preview/`.

**Content model:** `lib/catalogue.ts` reads products from **Sanity** (project id `04el01fe`), static fallback `lib/products.ts`. The **homepage is editable in `/studio`** via a singleton-ish **`homepage` document** (`sanity/schemaTypes/homepage.ts`): per-section text (EN/AR) + section images. `lib/home.ts` `getHomeContent()` fetches it; `app/page.tsx` passes it to each `components/redesign/*` section, which use the Sanity value **|| the default** in `lib/i18n/sections.ts` (so an empty/blank Homepage doc = the original built-in copy/images in `public/brand/*`). About page + other sections' fine-grained bits (steps, services, CTAs) are still code-only (could be added to the schema later).

### History note — Payload CMS experiment was REVERTED (2026-06-05)
We tried replacing Sanity with a self-hosted **Payload** CMS (Neon Postgres + Vercel Blob) to avoid Sanity cost. It deployed and connected, but the admin wouldn't render on this stack (Next 16/Turbopack didn't generate Payload's importMap; the CLI fix was blocked by a Node 20 / `file-type` issue; the webpack fallback hit a **malformed `/Users/anahata/package.json`** in the home dir). We **reverted everything** (commit `50889ca`) back to the clean Sanity-based redesign. Neon DB + Vercel Blob stores still exist in Vercel (unused — can be deleted). `.env.local` has leftover (gitignored) Neon/Payload vars — harmless.

### Editing = Sanity, kept FREE
- The user worried "Sanity ends in 30 days." That's a **paid-plan trial banner**, not a forced charge. **Sanity Free plan = $0 forever** (limits are plenty for this site).
- **To keep it free:** `sanity.io/manage` → the Plexus project → **Plan / Billing → downgrade to Free**. Then `/studio` keeps working at no cost.

### Possible next tasks
**anahata's off-keyboard actions (his, not code):** optimize **Google Business Profile** (add "Custom Bookshelves & Shelving" + capabilities as services); **B2B outreach / visits** with a sample (`/partnerships` + `~/Desktop/Projects/Plexus/assets/sales/02-b2b-outreach.md`); send a **real email address**, the **Smooth Copper Cup dimensions**, and **real workshop/station photos** to swap in for AI renders.

**Code/site:**
- (Offered, not yet approved) **More realistic 2nd photos** for the 5 collection pieces (Mashrabiya Light, Desk Shelf, Honeycomb Shelves, Sculptural Clock, Arch Mirror) — ~35 Higgsfield credits. Don't spend without his OK.
- Replace the **placeholder email** with a real one (`lib/config.ts`) once he sends it.
- Confirm Sanity is on the **Free** plan; replace AI renders with his real photos as they arrive.
- (Optional) order confirmation screen / email copy of each order (he asked "how would I know if I got a sale" — answer: WhatsApp).
- (Optional) **Delete** the unused Neon database + Vercel Blob store in Vercel.

### Operational reminders / lessons
- **Higgsfield = the user's account** (`zzeidnaser@gmail.com`); normal render ≈ 7 credits. A 2026-06 run showed a **one-off billing glitch** (2 failed bookshelf renders briefly charged ~133 credits, then self-corrected to 7 each). Check before any big credit spend.
- **Never fabricate testimonials/reviews** — only publish the user's real Google reviews after he confirms.
- `collection-data.json` (repo root, untracked) backs the local 130-product `collection.html` select-and-ship preview server (port 8787, local scratch — fine if it dies).
- **Don't mask build exit status** with `| grep | head` — a transient font-fetch flake ("Error while requesting resource") once printed "build failed" while exit was 0; verify "Compiled successfully" in the full log before reacting.

## Key files
- `app/layout.tsx` — root layout (fonts, `LanguageProvider`, `SiteChrome`, `StructuredData`).
- `components/redesign/*` — Hero (motion typographic + contours), Philosophy, WorkGrid, CustomFeature, Research, MakerProcess, ContactCommission.
- `lib/i18n/sections.ts` — EN/AR copy for redesigned sections (RTL via `<html dir>` in `lib/i18n/context.tsx`).
- `lib/config.ts` — brand + contact + `site.url`. `lib/catalogue.ts` / `lib/products.ts` — products (Sanity + fallback).
- `app/studio/[[...tool]]/` + `sanity.config.ts` — the Sanity editor at `/studio`.
- `components/seo/StructuredData.tsx` — LocalBusiness JSON-LD.

## Gotchas / operational notes
- **Shell is zsh:** quote/`unsetopt nomatch` for globs; don't use `path` as a loop var (it's `$PATH`); `timeout` isn't installed (use background + poll).
- **Vercel "Sensitive" env vars** can't be pulled to disk (come down empty) — only the user can fetch them.
- **Preview deploys are unreachable from the user's network** (ISP resets `*.vercel.app`) → test on the production custom domain.
- The **`!command`** prompt input wraps long lines into real newlines → use short commands or a script file.
- Production pushes to `main` need the user's explicit OK (auto-mode classifier guards it).
