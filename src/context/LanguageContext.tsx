"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Language } from "@/types";
import en from "@/locales/en.json";
import pt from "@/locales/pt.json";
import es from "@/locales/es.json";

const translations: Record<Language, typeof en> = { en, pt, es };

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  /** Returns a translated string, interpolating {varName} tokens */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Returns a translated string array (e.g. dropdown options) */
  tArray: (key: string) => string[];
  /** Returns raw translated value (array of objects, etc.) */
  tRaw: (key: string) => unknown;
  /** Returns the products array for the given mode */
  tProducts: (mode: "personal" | "commercial") => Array<{ id: string; title: string; description: string }>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && !Array.isArray(acc)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const dict = translations[lang] as Record<string, unknown>;
      const val = getNestedValue(dict, key);
      if (typeof val !== "string") return key;
      if (!vars) return val;
      return Object.entries(vars).reduce(
        (s, [k, v]) => s.replace(`{${k}}`, String(v)),
        val
      );
    },
    [lang]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const dict = translations[lang] as Record<string, unknown>;
      const val = getNestedValue(dict, key);
      if (Array.isArray(val) && val.every((v) => typeof v === "string")) {
        return val as string[];
      }
      return [];
    },
    [lang]
  );

  const tRaw = useCallback(
    (key: string): unknown => {
      const dict = translations[lang] as Record<string, unknown>;
      return getNestedValue(dict, key);
    },
    [lang]
  );

  const tProducts = useCallback(
    (mode: "personal" | "commercial") => {
      const dict = translations[lang] as Record<string, unknown>;
      const val = getNestedValue(dict, `products.${mode}`);
      if (Array.isArray(val)) {
        return val as Array<{ id: string; title: string; description: string }>;
      }
      return [];
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tArray, tRaw, tProducts }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
