"use client";

import { Marquee } from "@/components/ui/Marquee";
import { useLang } from "@/lib/i18n/context";

const wordsEn = [
  "Walnut",
  "Hand-cut joinery",
  "White Oak",
  "Olive",
  "Made to order",
  "Cherry",
  "Natural oils",
  "Ash",
  "Solid wood",
  "Amman",
];
const wordsAr = [
  "جوز",
  "وصلات يدوية",
  "بلوط أبيض",
  "زيتون",
  "حسب الطلب",
  "كرز",
  "زيوت طبيعية",
  "دردار",
  "خشب صلب",
  "عمّان",
];

export function WoodMarquee() {
  const { lang } = useLang();
  const words = lang === "ar" ? wordsAr : wordsEn;
  return (
    <div className="border-y border-bone/10 bg-[#0c0805]/50 py-5 backdrop-blur-sm">
      <Marquee speed={34}>
        {words.map((w, i) => (
          <span key={i} className="flex items-center">
            <span className="px-7 font-display text-2xl text-bone/85 md:text-3xl">{w}</span>
            <span className="text-amber">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
