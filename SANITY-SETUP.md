# Product Dashboard (Sanity) — 2-minute setup

Your products live in a visual dashboard at **`/studio`** (e.g. `yoursite.com/studio`).
You add products, drag in images, set prices in JOD, and fill EN/AR fields — no code.

## One-time setup

1. Go to **https://www.sanity.io/manage** and sign in (Google/GitHub/email — free).
2. Click **Create new project**. Name it `PLEXUS AMMAN`.
3. When asked for a dataset, use **`production`** (the default).
4. Open the project → **API** tab → copy the **Project ID** (looks like `abc12xyz`).
5. Paste it into **`.env.local`**:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc12xyz
   ```
6. Still in the **API** tab → **CORS origins** → **Add origin**:
   - add `http://localhost:3000` (check "Allow credentials")
   - later add your live URL too (e.g. `https://yoursite.com`)
7. Restart the dev server. Visit **http://localhost:3000/studio** → log in → start adding products.

## On Vercel (for the live site)

Add the same env var in **Vercel → Settings → Environment Variables**:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=abc12xyz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
```
and add your live domain to Sanity's CORS origins (step 6).

## What you can edit per product

Name (EN/AR) · Slug · Main image + gallery · Price (JOD) · Category ·
Collection · Wood/material (EN/AR) · Dimensions · Blurb (EN/AR) ·
Description (EN/AR) · Tags · "Featured on homepage".

> Until a Project ID is set, the site safely shows the existing built-in
> catalogue, and `/studio` shows a short reminder instead of crashing.

Once you've added a few products, tell me and I'll wire the shop & homepage
to display them (with your uploaded images) instead of the placeholder catalogue.
