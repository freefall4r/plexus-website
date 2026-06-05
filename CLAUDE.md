# Plexus Workshop — website

Marketing site + shop + a "Custom 3D Studio" for a wood workshop in **Amman, Jordan**, run by a
**Sopron-trained timber-industry engineer**. Brand: **Plexus Workshop**. Aesthetic: natural/editorial —
limewash + copper + sage, Fraunces display font, organic motion.

- **Repo:** `/Users/anahata/Desktop/plexus-amman` · GitHub `git@github.com:freefall4r/plexus-website.git`
- **Stack:** Next.js **16.2.6** (App Router, Turbopack), React 19, Tailwind **v4** (`app/globals.css` `@theme` tokens), framer-motion + Lenis, three.js/R3F (3D studio).
- **Host:** Vercel project **`plexus-website-ausc`** (team `freefall4rs-projects`, user **freefall4r**). Live: **https://www.plexusworkshop.com** (apex → www).
- **Deploy:** `git push origin main` auto-deploys to production. Manual: `~/.npm-global/bin/vercel --prod --yes` (CLI authed as freefall4r).

---

## ✅ CURRENT STATE — RESUME HERE (as of 2026-06-05)

The site is **redesigned, bilingual (EN/AR + RTL), mobile-ready, and LIVE**. Editing is via **Sanity Studio at `/studio`** (text, images, products — no code). SEO done (LocalBusiness JSON-LD, sitemap, robots). Contact: phone `+962 7 9179 2129`, IG `plexus.workshop`, address `Waela Bent Al Askaa, Amman`; **email is still a placeholder** `hello@plexusworkshop.com`.

**Content model:** `lib/catalogue.ts` reads products from **Sanity** (project id `04el01fe`), with a static fallback in `lib/products.ts`. Section text/images for the redesigned pages live in `lib/i18n/sections.ts` (EN/AR) + `public/brand/*` images.

### History note — Payload CMS experiment was REVERTED (2026-06-05)
We tried replacing Sanity with a self-hosted **Payload** CMS (Neon Postgres + Vercel Blob) to avoid Sanity cost. It deployed and connected, but the admin wouldn't render on this stack (Next 16/Turbopack didn't generate Payload's importMap; the CLI fix was blocked by a Node 20 / `file-type` issue; the webpack fallback hit a **malformed `/Users/anahata/package.json`** in the home dir). We **reverted everything** (commit `50889ca`) back to the clean Sanity-based redesign. Neon DB + Vercel Blob stores still exist in Vercel (unused — can be deleted). `.env.local` has leftover (gitignored) Neon/Payload vars — harmless.

### Editing = Sanity, kept FREE
- The user worried "Sanity ends in 30 days." That's a **paid-plan trial banner**, not a forced charge. **Sanity Free plan = $0 forever** (limits are plenty for this site).
- **To keep it free:** `sanity.io/manage` → the Plexus project → **Plan / Billing → downgrade to Free**. Then `/studio` keeps working at no cost.

### Possible next tasks
- Confirm Sanity is on the **Free** plan (above).
- Replace the **placeholder email** with a real one (`lib/config.ts`).
- Populate the **shop** (only ~1 product) + real WorkGrid piece names (still placeholders) — user handles content via `/studio`.
- (Optional) Re-add **Vercel Web Analytics** (was reverted): `npm i @vercel/analytics`, `<Analytics/>` in `app/layout.tsx`, enable in Vercel→Analytics.
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
