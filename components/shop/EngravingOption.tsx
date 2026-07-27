"use client";

import { useLang } from "@/lib/i18n/context";
import { currency } from "@/lib/config";
import {
  ENGRAVING_FEE,
  ENGRAVING_MAX_CHARS,
  engravingStyleLabel,
  type Engraving,
  type EngravingStyle,
} from "@/lib/engraving";

type Props = {
  enabled: boolean;
  engraving: Engraving;
  onToggle: (on: boolean) => void;
  onChange: (e: Engraving) => void;
};

const STYLES: EngravingStyle[] = ["clean", "calligraphy"];

export function EngravingOption({ enabled, engraving, onToggle, onChange }: Props) {
  const { lang, num } = useLang();
  const ar = lang === "ar";

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-ink/15">
      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        aria-expanded={enabled}
        className="flex w-full items-center justify-between gap-3 bg-bone-2/50 px-5 py-4 text-start transition-colors hover:bg-bone-2"
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] leading-none transition-colors ${
              enabled ? "border-copper bg-copper text-bone" : "border-ink/30 text-transparent"
            }`}
          >
            ✓
          </span>
          <span className="text-sm font-medium">
            ✒️ {ar ? "أضف نقشًا شخصيًا" : "Add a personal engraving"}
          </span>
        </span>
        <span className="shrink-0 font-mono text-sm text-copper">
          +{currency.symbol} {num(ENGRAVING_FEE)}
        </span>
      </button>

      {enabled && (
        <div className="border-t border-ink/10 px-5 py-4">
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              {ar ? "الاسم أو العبارة" : "Name or short message"}
            </span>
            <input
              value={engraving.text}
              onChange={(e) =>
                onChange({ ...engraving, text: e.target.value.slice(0, ENGRAVING_MAX_CHARS) })
              }
              maxLength={ENGRAVING_MAX_CHARS}
              placeholder={ar ? "مثال: عمر · بيت العيلة" : "e.g. Omar · The Family Table"}
              className="mt-2 w-full rounded-xl border border-ink/15 bg-bone px-4 py-3 text-ink outline-none transition-colors focus:border-amber"
            />
          </label>
          <div className="mt-1 text-end font-mono text-[11px] text-ink-soft">
            {num(engraving.text.length)}/{num(ENGRAVING_MAX_CHARS)}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              {ar ? "النمط" : "Style"}
            </span>
            {STYLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ ...engraving, style: s })}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  engraving.style === s
                    ? "bg-ink text-bone"
                    : "border border-ink/15 text-ink-soft hover:border-ink/40"
                }`}
              >
                {engravingStyleLabel(s, ar)}
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-ink-soft">
            {ar
              ? "يُحفر بالليزر في ورشتنا — بالعربية أو الإنجليزية. نؤكّد الموضع معك على واتساب."
              : "Laser-engraved in our workshop — Arabic or English. We confirm the placement with you on WhatsApp."}
          </p>
        </div>
      )}
    </div>
  );
}
