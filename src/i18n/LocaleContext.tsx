import React, { createContext, useContext, useState, useCallback } from 'react';
import { en } from './translations/en';
import { uk } from './translations/uk';

export type Locale = 'uk' | 'en';

const TRANSLATIONS: Record<Locale, Record<string, string>> = { uk, en };
const STORAGE_KEY = 'cyber-arena-locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function translate(dict: Record<string, string>, key: string, params?: Record<string, string>): string {
  let text = dict[key] ?? key;
  if (params) {
    text = Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, v), text);
  }
  return text;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'uk' ? stored : 'uk';
  });

  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLocaleState(l);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    return translate(TRANSLATIONS[locale], key, params);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
