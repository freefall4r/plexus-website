# Plexus Workshop — website

Marketing site + shop + a "Custom 3D Studio" for a wood workshop in **Amman, Jordan**, run by a
**Sopron-trained timber-industry engineer**. Brand: **Plexus Workshop**. Aesthetic: natural/editorial —
limewash + copper + sage, Fraunces display font, organic motion.

- **Repo:** `/Users/anahata/Desktop/plexus-amman` · GitHub `git@github.com:freefall4r/plexus-website.git`
- **Stack:** Next.js **16.2.6** (App Router, Turbopack), React 19, Tailwind **v4** (`app/globals.css` `@theme` tokens), framer-motion + Lenis, three.js/R3F (3D studio).
- **Host:** Vercel project **`plexus-website-ausc`** (team `freefall4rs-projects`, user **freefall4r**). Live: **https://www.plexusworkshop.com** (apex → www).
- **Deploy:** `git push origin main` auto-deploys to production. Manual: `~/.npm-global/bin/vercel --prod --yes` (CLI authed as freefall4r).

---

## ✅ CURRENT STATE — RESUME HERE (as of 2026-06-06)

The site is **redesigned, bilingual (EN/AR + RTL), mobile-ready, and LIVE**. Editing is via **Sanity Studio at `/studio`** (text, images, products — no code). SEO done (LocalBusiness JSON-LD, sitemap, robots). Contact: phone `+962 7 9179 2129`, IG `plexus.workshop`, address `Waela Bent Al Askaa, Amman`; **email is still a placeholder** `hello@plexusworkshop.com`. Vercel Web Analytics is live (re-added 2026-06-05).

### Session 2026-06-06 — shop products, Brand Partnerships, lime plaster
- **Shop now has 3 real Sanity products:** Hammered Copper Cup (44 JOD), **Smooth Copper Cup** (24 JOD), **Rose Quartz on Walnut Stand** (212 JOD, marked sold). Created via a temporary Sanity **write token** (since `.env.local` only has read keys — Sensitive Vercel vars); token was revoked after. To add more programmatically, the user makes a new Editor token at `sanity.io/manage/project/04el01fe/api/tokens`.
- **"Sold" feature (no schema change):** a product is sold if its **`tags` include `"sold"`**. `components/shop/ProductCard.tsx` + `ProductDetail.tsx` show a "Sold" badge, strike the price, and swap the order CTA to "Commission a similar piece". Tags aren't used in shop filters, so it doesn't leak.
- **New page `/partnerships` — "Brand Partnerships"** (B2B / white-label): `app/partnerships/page.tsx` + `components/partnerships/BrandPartnerships.tsx` (bilingual inline EN/AR, WhatsApp+email intake). Added to `components/layout/Nav.tsx` (`nav.partners` in `lib/i18n/dict.ts`) and `app/sitemap.ts`.
- **Lime-plaster background:** `.grain::before` underlay in `app/globals.css` (mottled radial pools + soft-light fractal-noise grain + a diagonal light). **Gotcha:** the body has an opaque `bone` background, so the `z-index:-1` underlay was invisible until `.grain { isolation: isolate }` was added (makes `.grain` its own stacking context so the underlay paints above the body bg). `/studio` excluded (no `.grain`).
- **Product imagery is AI-made** (Higgsfield: GPT Image 2 for concept renders, Nano Banana 2 for image-to-image restyles of the user's real photos into the limewash/stone look). Working files live in **`renders/`** (gitignored). Other gitignored scratch: `PRODUCT-RESEARCH.md` (200-product research), `catalog-preview.html`, `collection.html` (30 curated rendered concepts), `designs.html`, `restyle-preview.html`. Local design preview = `npm run dev` + headless-Chrome screenshots into `~/Desktop/Plexus-Preview/`.

**Content model:** `lib/catalogue.ts` reads products from **Sanity** (project id `04el01fe`), static fallback `lib/products.ts`. The **homepage is editable in `/studio`** via a singleton-ish **`homepage` document** (`sanity/schemaTypes/homepage.ts`): per-section text (EN/AR) + section images. `lib/home.ts` `getHomeContent()` fetches it; `app/page.tsx` passes it to each `components/redesign/*` section, which use the Sanity value **|| the default** in `lib/i18n/sections.ts` (so an empty/blank Homepage doc = the original built-in copy/images in `public/brand/*`). About page + other sections' fine-grained bits (steps, services, CTAs) are still code-only (could be added to the schema later).

### History note — Payload CMS experiment was REVERTED (2026-06-05)
We tried replacing Sanity with a self-hosted **Payload** CMS (Neon Postgres + Vercel Blob) to avoid Sanity cost. It deployed and connected, but the admin wouldn't render on this stack (Next 16/Turbopack didn't generate Payload's importMap; the CLI fix was blocked by a Node 20 / `file-type` issue; the webpack fallback hit a **malformed `/Users/anahata/package.json`** in the home dir). We **reverted everything** (commit `50889ca`) back to the clean Sanity-based redesign. Neon DB + Vercel Blob stores still exist in Vercel (unused — can be deleted). `.env.local` has leftover (gitignored) Neon/Payload vars — harmless.

### Editing = Sanity, kept FREE
- The user worried "Sanity ends in 30 days." That's a **paid-plan trial banner**, not a forced charge. **Sanity Free plan = $0 forever** (limits are plenty for this site).
- **To keep it free:** `sanity.io/manage` → the Plexus project → **Plan / Billing → downgrade to Free**. Then `/studio` keeps working at no cost.

### Possible next tasks
- Confirm Sanity is on the **Free** plan (above).
- Replace the **placeholder email** with a real one (`lib/config.ts`).
- Populate the **shop** further (3 products now) — more curated/rendered pieces from `collection.html`; user can add via `/studio` or another temp token.
- Fix the **Smooth Copper Cup dimensions** (placeholder `Ø 7 × 9 cm`) + add real Brand Partnerships example photos / real MOQ.
- (Optional) **Delete** the now-unused Neon database + Vercel Blob store in the Vercel dashboard.
- Clean up: the abandoned local **`next-phase`** branch and the broken **`/Users/anahata/package.json`** (invalid JSON — can break other tools).

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
