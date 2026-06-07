"use client";

import { useState } from "react";

/** Main image + thumbnail switcher for products that have real photos
 *  (main + gallery from Sanity). */
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const main = images[i] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-bone-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={main} alt={alt} className="h-full w-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => setI(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-bone-2 ring-2 transition ${
                idx === i ? "ring-copper" : "ring-transparent hover:ring-ink/20"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
