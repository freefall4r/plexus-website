"use client";

// The private cohort page — what the five students get after they pay.
//
// The gate is a SOFT gate: the passcode is checked in the browser, exactly like
// the /live build portals. That is deliberate and adequate — nothing behind it is
// sensitive (a schedule, a kit list, a map pin). Do NOT put anything private here
// (no phone numbers, no payment state, no names of other students) on the
// assumption that the gate protects it. It does not.

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/context";
import { contact } from "@/lib/config";
import { COHORT } from "./WoodSchoolPage";

/** Rule: a word he can say down the phone, never a PIN. */
const PASSCODE = "wood";
const STORAGE_KEY = "plexus-woodschool-cohort";

const COPY = {
  gateTitle: { en: "Cohort 01", ar: "الدفعة الأولى" },
  gateHint: { en: "Enter the word you were given.", ar: "أدخل الكلمة التي أُعطيت لك." },
  enter: { en: "Enter", ar: "دخول" },
  wrong: { en: "Not that one — try again.", ar: "ليست هذه — حاول مرة أخرى." },

  welcome: { en: "You're in.", ar: "تم — أنت معنا." },
  tbc: { en: "Your weekend is being agreed with the group — we will message you the moment it is set.",
         ar: "يجري الاتفاق على العطلة مع المجموعة — سنراسلك فور تحديدها." },
  when: { en: "When & where", ar: "متى وأين" },
  bring: { en: "What to bring", ar: "ما الذي تُحضره" },
  schedule: { en: "Day one, roughly", ar: "اليوم الأول، تقريباً" },
  questions: { en: "Anything at all, message the workshop.", ar: "لأي سؤال، راسل الورشة." },
};

const BRING = [
  { en: "Closed shoes — no sandals, no exceptions", ar: "حذاء مغلق — بلا صندل، دون استثناء" },
  { en: "Clothes you do not mind marking", ar: "ملابس لا يهمّك أن تتّسخ" },
  { en: "Long hair tied back", ar: "الشعر الطويل مربوط" },
  { en: "A notebook and a pencil", ar: "دفتر وقلم رصاص" },
  { en: "Nothing else — every tool and material is provided", ar: "لا شيء آخر — كل أداة ومادة مؤمّنة" },
];

const SCHEDULE = [
  { t: "10:00", en: "Arrive, coffee, safety brief", ar: "الوصول، قهوة، شرح السلامة" },
  { t: "10:35", en: "What wood actually is — the three planes", ar: "ما هو الخشب فعلاً — المستويات الثلاثة" },
  { t: "11:35", en: "The species, and the sheet goods", ar: "الأنواع، والألواح المصنّعة" },
  { t: "12:35", en: "Lunch, in the shop", ar: "الغداء، في الورشة" },
  { t: "13:15", en: "Joints, then marking out", ar: "الوصلات، ثم التخطيط" },
  { t: "13:45", en: "Cut your own joinery", ar: "قص وصلاتك بنفسك" },
  { t: "15:25", en: "Dry fit, then glue up", ar: "تركيب تجريبي ثم التغرية" },
  { t: "16:00", en: "End of day one", ar: "نهاية اليوم الأول" },
];

export function CohortPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = (o: { en: string; ar: string }) => (ar ? o.ar : o.en);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [bad, setBad] = useState(false);

  // remember the gate so nobody re-types the word every visit
  useEffect(() => {
    if (typeof window !== "undefined" &&
        localStorage.getItem(STORAGE_KEY) === PASSCODE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSCODE) {
      localStorage.setItem(STORAGE_KEY, PASSCODE);
      setOpen(true);
    } else {
      setBad(true);
    }
  }

  if (!open) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#2c271e] px-6"
        dir={ar ? "rtl" : "ltr"}
      >
        <form onSubmit={submit} className="w-full max-w-sm text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c98f4e]">
            {ar ? "مدرسة الخشب" : "Plexus Wood School"}
          </p>
          <h1 className="mt-4 font-serif text-4xl text-[#f4efe6]">
            {t(COPY.gateTitle)}
          </h1>
          <p className="mt-3 text-sm text-[#a8977c]">{t(COPY.gateHint)}</p>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setBad(false);
            }}
            autoFocus
            className="mt-7 w-full rounded-full border border-[#554b39] bg-[#3a3428] px-6 py-3.5 text-center text-[#f4efe6] outline-none focus:border-[#e8b57a]"
          />
          {bad && <p className="mt-3 text-sm text-[#e8b57a]">{t(COPY.wrong)}</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-[#e8b57a] px-6 py-3.5 text-sm font-bold text-[#2c271e] transition hover:bg-[#f4efe6]"
          >
            {t(COPY.enter)}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="bg-[#f4efe6] text-[#2c271e]" dir={ar ? "rtl" : "ltr"}>
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#9c5b2c]">
          {ar ? "مدرسة الخشب" : "Plexus Wood School"} · {t(COPY.gateTitle)}
        </p>
        <h1 className="mt-5 font-serif text-4xl">{t(COPY.welcome)}</h1>

        <h2 className="mt-12 font-serif text-2xl">{t(COPY.when)}</h2>
        <div className="mt-4 rounded-lg border border-[#e3d9c7] bg-white p-6 text-sm leading-relaxed text-[#473826]">
          {COHORT.dates ? (
            <p className="font-semibold text-[#2c271e]">{t(COHORT.dates)}</p>
          ) : (
            <p className="font-semibold text-[#9c5b2c]">{t(COPY.tbc)}</p>
          )}
          <p className="mt-1">{COHORT.hours}</p>
          <p className="mt-3">{contact.addressLine}</p>
          <a
            className="mt-3 inline-block font-semibold text-[#9c5b2c] underline"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ar ? "افتح الموقع على الخريطة" : "Open the location in Maps"} →
          </a>
        </div>

        <h2 className="mt-12 font-serif text-2xl">{t(COPY.bring)}</h2>
        <ul className="mt-4 space-y-2">
          {BRING.map((b) => (
            <li key={b.en} className="flex gap-3 text-sm text-[#473826]">
              <span className="text-[#c98f4e]">—</span>
              <span>{t(b)}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-serif text-2xl">{t(COPY.schedule)}</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-[#e3d9c7] bg-white">
          {SCHEDULE.map((s, i) => (
            <div
              key={s.t}
              className={`flex gap-5 px-6 py-3 text-sm ${i % 2 ? "bg-[#f7f3ec]" : ""}`}
            >
              <span className="w-14 shrink-0 font-semibold text-[#9c5b2c]">{s.t}</span>
              <span className="text-[#473826]">{t(s)}</span>
            </div>
          ))}
        </div>

        <p className="mt-14 text-sm text-[#6b5d4a]">{t(COPY.questions)}</p>
      </section>
    </main>
  );
}
