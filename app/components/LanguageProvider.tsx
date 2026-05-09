"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Language, translations, detectLanguage, Translations } from "../lib/i18n";

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ru",
  t: translations.ru,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("glazik-language") as Language;
    if (saved) {
      setLanguageState(saved);
    } else {
      setLanguageState(detectLanguage());
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (mounted) {
      localStorage.setItem("glazik-language", lang);
    }
  }, [mounted]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}