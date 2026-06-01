"use client";

import * as React from "react";
import type { ArtKey } from "@/lib/products";

/**
 * ProductArt — the visual signature of Plexus Workshop.
 *
 * Renders a premium, editorial single-weight line illustration of a product on
 * a warm, layered wood-tone gradient with subtle grain and a soft contact
 * shadow. Fully deterministic and SSR-safe: same (artKey, wood, seed) always
 * yields identical markup. No Math.random, no window access at render.
 */

type Props = {
  artKey: ArtKey;
  wood?: string;
  seed?: number;
  className?: string;
};

// --- palette tokens (warm woods) ------------------------------------------
const INK = "#2a1d12";
const BONE = "#f4ede0";

// Small, pure string hash → unsigned 32-bit. Deterministic across server/client.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Per-wood gradient definition: [outer/deep, mid, inner/light] hex stops.
type WoodTone = { deep: string; mid: string; light: string };

function toneForWood(wood?: string): WoodTone {
  const w = (wood ?? "").toLowerCase();
  // Richer, deeper tones so cards have depth (no washed-out pales).
  if (w.includes("walnut")) return { deep: "#2a1709", mid: "#5a3a1f", light: "#8a5d34" };
  if (w.includes("oak")) return { deep: "#4a3216", mid: "#8a6235", light: "#b8915a" };
  if (w.includes("olive")) return { deep: "#2e2c14", mid: "#5e5a2e", light: "#8f8650" };
  if (w.includes("cherry")) return { deep: "#3f160d", mid: "#7a3220", light: "#a85c3e" };
  if (w.includes("ash")) return { deep: "#5a4c34", mid: "#8a7654", light: "#b6a07a" };
  if (w.includes("maple")) return { deep: "#5e4a2e", mid: "#947a50", light: "#c2a878" };
  if (w.includes("beech")) return { deep: "#5a3c1f", mid: "#8e6638", light: "#bd935d" };
  if (w.includes("acacia")) return { deep: "#42260f", mid: "#7c4a22", light: "#a9743b" };
  if (w.includes("teak")) return { deep: "#43300f", mid: "#7a5626", light: "#a8803f" };
  if (w.includes("cedar")) return { deep: "#48230f", mid: "#8a4a28", light: "#bd7c4c" };
  // default warm walnut-ish
  return { deep: "#3a2412", mid: "#6b4423", light: "#9a6a38" };
}

// Nudge a hex color's lightness by a signed amount (-1..1 small range).
function shiftHex(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const d = amt * 255;
  const to2 = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${to2(r + d)}${to2(g + d)}${to2(b + d)}`;
}

export function ProductArt({ artKey, wood, seed, className }: Props): React.JSX.Element {
  const s = seed ?? 0;
  const uid = `${artKey}-${s}`;
  const h = hash(uid);

  const tone = toneForWood(wood);
  // seed-derived, deterministic variation
  const hueNudge = ((h % 13) - 6) / 90; // small lightness drift
  const deep = shiftHex(tone.deep, hueNudge - 0.02);
  const mid = shiftHex(tone.mid, hueNudge);
  const light = shiftHex(tone.light, hueNudge + 0.03);

  const gx = 30 + (h % 40); // radial center x %
  const gy = 20 + ((h >> 3) % 35); // radial center y %
  const grainFreq = 0.6 + ((h >> 5) % 7) / 20; // 0.6..0.9
  const grainSeed = h % 100;

  const gradId = `g-${uid}`;
  const grainId = `n-${uid}`;
  const vignId = `v-${uid}`;
  const shadowId = `s-${uid}`;
  const spotId = `sp-${uid}`;

  return (
    <svg
      viewBox="0 0 600 600"
      width="100%"
      height="100%"
      className={className}
      role="img"
      aria-label={`${wood ?? "wood"} ${artKey} illustration`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id={gradId} cx={`${gx}%`} cy={`${gy}%`} r="90%">
          <stop offset="0%" stopColor={light} />
          <stop offset="30%" stopColor={mid} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>

        <radialGradient id={vignId} cx="50%" cy="44%" r="74%">
          <stop offset="45%" stopColor="#1a0e04" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a0e04" stopOpacity="0.46" />
        </radialGradient>

        {/* warm top spotlight for dimensionality */}
        <radialGradient id={spotId} cx="50%" cy="16%" r="55%">
          <stop offset="0%" stopColor="#ffe8c2" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffe8c2" stopOpacity="0" />
        </radialGradient>

        {/* faint transparent grain — preserves the wood color underneath */}
        <filter id={grainId} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={grainFreq}
            numOctaves={2}
            seed={grainSeed}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feComponentTransfer in="mono" result="grain">
            <feFuncA type="linear" slope="0.08" intercept="0" />
          </feComponentTransfer>
        </filter>

        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={INK} stopOpacity="0.34" />
          <stop offset="70%" stopColor={INK} stopOpacity="0.14" />
          <stop offset="100%" stopColor={INK} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* background */}
      <rect x="0" y="0" width="600" height="600" fill={`url(#${gradId})`} />
      {/* warm top spotlight */}
      <rect x="0" y="0" width="600" height="600" fill={`url(#${spotId})`} />
      {/* grain overlay */}
      <rect
        x="0"
        y="0"
        width="600"
        height="600"
        filter={`url(#${grainId})`}
        opacity="0.9"
      />
      {/* vignette */}
      <rect x="0" y="0" width="600" height="600" fill={`url(#${vignId})`} />

      {/* soft contact shadow under the object */}
      <ellipse cx="300" cy="488" rx="186" ry="30" fill={`url(#${shadowId})`} />

      {/* object — ink emboss underlay for depth */}
      <g
        fill="none"
        stroke={INK}
        strokeOpacity={0.4}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3.5,5)"
      >
        <Illustration artKey={artKey} accent={INK} />
      </g>
      {/* object — cream line-art on top, pops on any wood */}
      <g
        fill="none"
        stroke={BONE}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Illustration artKey={artKey} accent={shiftHex(deep, -0.05)} />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Illustrations — one elegant line drawing per ArtKey.
// All drawn inside a ~120..480 box so the parent <g> padding reads consistently.
// `accent` is a wood-derived dark fill used for a single accent shape.
// ---------------------------------------------------------------------------

function Illustration({
  artKey,
  accent,
}: {
  artKey: ArtKey;
  accent: string;
}): React.JSX.Element {
  const hi = "#f4ede0"; // bone highlight stroke for depth

  switch (artKey) {
    case "chair":
      return (
        <>
          <path d="M205 175 q95 -30 190 0 v120 h-190 z" />
          <path d="M205 175 v260" />
          <path d="M205 295 h190" />
          <path d="M205 435 v45 M395 295 v185" />
          <path d="M205 360 h190" stroke={hi} strokeWidth={4} opacity={0.5} />
        </>
      );
    case "lounge":
      return (
        <>
          <path d="M165 215 q70 -28 150 -8 l130 40 v60 l-160 -30 z" />
          <path d="M155 245 q-10 90 60 130 l210 18" />
          <path d="M215 395 v85 M425 333 v147" />
          <path d="M165 215 q-30 60 0 110" stroke={hi} strokeWidth={4} opacity={0.5} />
        </>
      );
    case "stool":
      return (
        <>
          <ellipse cx="300" cy="225" rx="100" ry="34" />
          <ellipse cx="300" cy="225" rx="100" ry="34" fill={accent} stroke="none" opacity={0.18} />
          <path d="M215 245 l-30 215 M385 245 l30 215 M232 350 h136" />
        </>
      );
    case "bench":
      return (
        <>
          <rect x="150" y="250" width="300" height="34" rx="14" />
          <path d="M180 290 v160 M420 290 v160 M180 380 h60 M360 380 h60" />
          <path d="M150 268 h300" stroke={hi} strokeWidth={4} opacity={0.45} />
        </>
      );
    case "rocker":
      return (
        <>
          <path d="M215 165 q85 -26 170 0 v130 h-170 z" />
          <path d="M215 165 v245 M385 295 v115" />
          <path d="M215 295 h170" />
          <path d="M165 470 q135 -60 270 0" />
          <path d="M205 410 l-35 50 M395 410 l35 50" />
        </>
      );
    case "table":
      return (
        <>
          <rect x="135" y="240" width="330" height="26" rx="12" />
          <path d="M170 266 v200 M430 266 v200" />
          <path d="M170 320 h260" stroke={accent} strokeWidth={7} />
          <path d="M135 252 h330" stroke={hi} strokeWidth={4} opacity={0.45} />
        </>
      );
    case "coffeeTable":
      return (
        <>
          <rect x="140" y="295" width="320" height="30" rx="14" />
          <path d="M175 325 v110 M425 325 v110" />
          <path d="M175 400 h250" />
          <path d="M140 310 h320" stroke={hi} strokeWidth={4} opacity={0.45} />
        </>
      );
    case "sideTable":
      return (
        <>
          <ellipse cx="300" cy="250" rx="105" ry="30" />
          <path d="M230 272 l-18 190 M370 272 l18 190 M300 280 v182" />
        </>
      );
    case "console":
      return (
        <>
          <rect x="135" y="245" width="330" height="24" rx="11" />
          <path d="M165 269 v200 M435 269 v200" />
          <rect x="225" y="300" width="150" height="70" rx="8" />
          <circle cx="300" cy="335" r="6" fill={accent} stroke="none" />
        </>
      );
    case "desk":
      return (
        <>
          <rect x="140" y="240" width="320" height="26" rx="12" />
          <path d="M170 266 v200 M430 266 v200" />
          <rect x="300" y="290" width="120" height="70" rx="8" />
          <circle cx="360" cy="325" r="6" fill={accent} stroke="none" />
        </>
      );
    case "shelf":
      return (
        <>
          <rect x="180" y="140" width="240" height="320" rx="10" />
          <path d="M180 230 h240 M180 320 h240 M180 410 h240" />
          <path d="M250 150 v70 M330 240 v70" stroke={accent} strokeWidth={6} />
        </>
      );
    case "cabinet":
      return (
        <>
          <rect x="160" y="200" width="280" height="250" rx="12" />
          <path d="M300 200 v250" />
          <circle cx="278" cy="325" r="7" fill={accent} stroke="none" />
          <circle cx="322" cy="325" r="7" fill={accent} stroke="none" />
          <path d="M160 250 h280" stroke={hi} strokeWidth={3} opacity={0.4} />
        </>
      );
    case "dresser":
      return (
        <>
          <rect x="160" y="190" width="280" height="240" rx="12" />
          <path d="M160 270 h280 M160 350 h280" />
          <path d="M260 230 h80 M260 310 h80 M260 390 h80" stroke={accent} strokeWidth={7} />
          <path d="M180 430 l-14 40 M420 430 l14 40" />
        </>
      );
    case "bed":
      return (
        <>
          <path d="M150 300 h300 v90 h-300 z" />
          <path d="M150 300 v-120 q0 -20 20 -20 h60 q20 0 20 20 v120" />
          <path d="M165 390 v50 M435 390 v50" />
          <path d="M150 330 h300" stroke={hi} strokeWidth={4} opacity={0.45} />
        </>
      );
    case "nightstand":
      return (
        <>
          <rect x="205" y="225" width="190" height="190" rx="12" />
          <path d="M205 295 h190" />
          <path d="M270 260 h60" stroke={accent} strokeWidth={7} />
          <path d="M225 415 l-14 45 M375 415 l14 45" />
        </>
      );
    case "bowl":
      return (
        <>
          <path d="M170 270 q130 130 260 0" />
          <ellipse cx="300" cy="270" rx="130" ry="34" />
          <path d="M210 282 q90 60 180 0" stroke={hi} strokeWidth={4} opacity={0.5} />
        </>
      );
    case "board":
      return (
        <>
          <path d="M205 230 h170 q60 0 60 70 v60 q0 70 -60 70 h-170 q-40 0 -40 -40 v-120 q0 -40 40 -40 z" />
          <circle cx="200" cy="265" r="12" fill={accent} stroke="none" />
          <path d="M255 320 q60 40 130 0" stroke={hi} strokeWidth={4} opacity={0.5} />
        </>
      );
    case "vase":
      return (
        <>
          <path d="M265 175 q-10 50 -35 90 q-25 50 0 110 q30 70 140 0 q25 -60 0 -110 q-25 -40 -35 -90 z" />
          <path d="M265 175 q35 16 70 0" />
          <path d="M250 300 q50 40 100 0" stroke={hi} strokeWidth={4} opacity={0.45} />
        </>
      );
    case "utensil":
      return (
        <>
          <path d="M250 175 q-45 18 -45 60 q0 42 45 50 v150" />
          <path d="M350 175 v260" />
          <ellipse cx="250" cy="225" rx="32" ry="44" fill={accent} stroke="none" opacity={0.25} />
        </>
      );
    case "wineRack":
      return (
        <>
          <path d="M170 250 q130 70 260 0 v40 q-130 70 -260 0 z" />
          <ellipse cx="218" cy="262" rx="20" ry="14" />
          <ellipse cx="300" cy="278" rx="20" ry="14" />
          <ellipse cx="382" cy="262" rx="20" ry="14" />
          <path d="M180 470 h240" />
        </>
      );
    case "lamp":
      return (
        <>
          <path d="M230 200 h140 l-25 90 h-90 z" />
          <path d="M300 290 v110" />
          <path d="M225 400 q75 28 150 0" />
          <path d="M255 215 h90" stroke={hi} strokeWidth={4} opacity={0.5} />
        </>
      );
    case "pendant":
      return (
        <>
          <path d="M300 120 v70" />
          <path d="M215 190 h170 l-30 100 q-55 30 -110 0 z" />
          <ellipse cx="300" cy="290" rx="55" ry="14" fill={accent} stroke="none" opacity={0.3} />
          <circle cx="300" cy="120" r="6" fill={accent} stroke="none" />
        </>
      );
    case "candle":
      return (
        <>
          <rect x="270" y="240" width="60" height="180" rx="8" />
          <path d="M300 240 v-55" />
          <path d="M300 175 q14 -22 0 -40 q-14 18 0 40 z" fill={accent} stroke="none" />
          <ellipse cx="300" cy="420" rx="55" ry="16" />
        </>
      );
    case "mirror":
      return (
        <>
          <circle cx="300" cy="290" r="135" />
          <circle cx="300" cy="290" r="112" stroke={hi} strokeWidth={4} opacity={0.45} />
          <path d="M235 235 q-30 30 -22 80" stroke={hi} strokeWidth={6} opacity={0.4} />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="300" cy="290" r="130" />
          <path d="M300 290 v-70 M300 290 l55 30" />
          <circle cx="300" cy="290" r="9" fill={accent} stroke="none" />
          <path d="M300 175 v16 M415 290 h-16 M300 405 v-16 M185 290 h16" stroke={accent} strokeWidth={6} />
        </>
      );
    case "wallArt":
      return (
        <>
          <rect x="170" y="160" width="260" height="280" rx="10" />
          <path d="M210 360 q40 -120 90 -120 q50 0 90 120" stroke={accent} strokeWidth={7} />
          <circle cx="350" cy="220" r="24" fill={accent} stroke="none" opacity={0.5} />
        </>
      );
    case "frame":
      return (
        <>
          <rect x="190" y="160" width="220" height="280" rx="8" />
          <rect x="222" y="192" width="156" height="216" rx="4" stroke={hi} strokeWidth={5} opacity={0.55} />
          <path d="M250 360 l45 -55 l35 35 l30 -35" stroke={accent} strokeWidth={6} />
        </>
      );
    case "box":
      return (
        <>
          <rect x="185" y="245" width="230" height="180" rx="10" />
          <path d="M185 290 h230" />
          <rect x="175" y="225" width="250" height="40" rx="10" fill={accent} stroke="none" opacity={0.22} />
          <rect x="175" y="225" width="250" height="40" rx="10" />
          <circle cx="300" cy="360" r="8" fill={accent} stroke="none" />
        </>
      );
    case "tray":
      return (
        <>
          <path d="M165 290 q135 70 270 0 l-22 70 q-113 50 -226 0 z" />
          <path d="M165 290 q135 70 270 0" stroke={hi} strokeWidth={4} opacity={0.5} />
          <path d="M195 360 q105 36 210 0" />
        </>
      );
    case "organizer":
      return (
        <>
          <rect x="180" y="260" width="240" height="160" rx="10" />
          <path d="M260 260 v160 M340 260 v160" />
          <path d="M210 240 v-50 M230 240 v-65 M250 240 v-40" stroke={accent} strokeWidth={6} />
        </>
      );
    case "plantStand":
      return (
        <>
          <path d="M250 215 q50 -50 100 0 l-22 70 h-56 z" />
          <path d="M280 215 q-30 -70 -10 -110 M300 210 v-110 M320 215 q30 -70 10 -110" stroke={accent} strokeWidth={6} />
          <path d="M260 285 l-40 175 M340 285 l40 175 M300 285 v175" />
        </>
      );
    case "speaker":
      return (
        <>
          <rect x="225" y="175" width="150" height="270" rx="14" />
          <circle cx="300" cy="250" r="40" />
          <circle cx="300" cy="250" r="16" fill={accent} stroke="none" />
          <circle cx="300" cy="380" r="22" />
        </>
      );
    default:
      return (
        <>
          <rect x="200" y="220" width="200" height="200" rx="14" />
          <circle cx="300" cy="320" r="40" fill={accent} stroke="none" opacity={0.3} />
        </>
      );
  }
}

export default ProductArt;
