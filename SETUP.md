# PLEXUS AMMAN

A cinematic, bilingual (EN / AR-RTL) website for a custom woodworking workshop in Amman, Jordan.

## Run it

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # Node 24 lives here on this machine
cd ~/dev/plexus-amman
npm run dev          # http://localhost:3000  (hot reload, for editing)
# or a production build:
npm run build && npm run start
```

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript
- **Tailwind v4** (design tokens in `app/globals.css`)
- **Framer Motion** (scroll + micro-interactions) — pinned considerations: avoid percentage-string MotionValues bound to `style`; the hero's on-load reveals are CSS (always fire on first paint).
- **React Three Fiber + drei** — the homepage 3D "burr" hero (no PMREM environment, so it never drops the WebGL context).
- **@google/model-viewer** — the custom-studio result viewer **and AR** ("View in your room").
- **Lenis** — smooth scroll.

## Pages

- `/` — dark cinematic hero (scroll-assembling 3D burr) → manifesto → marquee → featured → 3D-studio teaser → process rail.
- `/shop` — 100 made-to-order pieces (filter by collection / category / wood, sort). Product art is generated SVG (see `components/shop/ProductArt.tsx`).
- `/shop/[slug]` — product detail with prefilled WhatsApp / email order buttons.
- `/custom` — **the 3D Studio**: upload a photo → Meshy.ai generates a textured 3D model (live progress) → spin it, **view it in your room with AR**, download the `.glb`, or send it to the workshop.
- `/about` — the workshop story + all contact channels.

## ⚙️ Things to set before going public

1. **Contact details** — edit `lib/config.ts` (`contact`): WhatsApp number, phone, email, Instagram handle. They're placeholders right now and wire up everywhere automatically.
2. **Meshy API key** — in `.env.local` (`MESHY_API_KEY`). Already set. Server-side only; never exposed to the browser.
3. **Rate limit** — `.env.local`: `CUSTOM_RATE_MAX` (default 4) and `CUSTOM_RATE_WINDOW_HOURS` (default 6) per visitor for the 3D generator.

## AR notes

- `<model-viewer>` launches **native AR**: Android → Scene Viewer (uses the GLB), iPhone → AR Quick Look (uses the USDZ — both come from Meshy).
- **AR requires HTTPS.** It works once deployed (e.g. Vercel); it won't activate over plain `http://localhost` on a phone. The button auto-hides on devices that can't do AR.

## Deploy (when ready)

`npm i -g vercel && vercel` (or push to GitHub and import on Vercel). Add `MESHY_API_KEY` as an environment variable in the Vercel project. The Meshy calls run in the `/api/custom/*` route handlers (Node runtime).

## Localization

Custom EN/AR i18n in `lib/i18n/` (dictionary + context). All 100 products carry Arabic name/blurb/description/wood. Toggle is in the nav; `<html dir>` + Arabic fonts (Cairo / Reem Kufi) switch automatically.
