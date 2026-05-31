"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translate, type DictKey, type Lang } from "./dict";

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: DictKey) => string;
  /** pick the right field from a bilingual object, e.g. tf(p, "name") */
  num: (n: number) => string;
};

const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "plexus-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // hydrate from storage / browser on mount
  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem(STORAGE_KEY)) as Lang | null;
    if (stored === "en" || stored === "ar") {
      setLangState(stored);
    } else if (typeof navigator !== "undefined" && navigator.language?.startsWith("ar")) {
      setLangState("ar");
    }
  }, []);

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  // reflect language on <html> for CSS (font + dir)
  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = dir;
  }, [lang, dir]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  const value: Ctx = {
    lang,
    dir,
    setLang,
    toggle: () => setLang(lang === "en" ? "ar" : "en"),
    t: (key: DictKey) => translate(lang, key),
    num: (n: number) =>
      n.toLocaleString(lang === "ar" ? "ar-JO" : "en-JO"),
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
