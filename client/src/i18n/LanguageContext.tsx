import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, type Language, type Translations } from "./translations";

const STORAGE_KEY = "quiniela-language";

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type TranslationPath = NestedKeyOf<Translations>;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationPath) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

function loadStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(loadStoredLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const locale = language === "es" ? "es-ES" : "en-US";

  const t = useCallback(
    (key: TranslationPath) => getNestedValue(translations[language], key),
    [language]
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === "es"
        ? "Quiniela Copa Mundial FIFA 2026"
        : "Quiniela FIFA World Cup 2026";
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t, locale }),
    [language, setLanguage, t, locale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
