'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Bi } from '@/content/profile';
import { ui, type UiKey } from '@/content/ui';

export type LangCode = 'en' | 'vi';

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  /** Pick the active side of a bilingual string. */
  t: (b: Bi) => string;
  /** Look up interface chrome by key. */
  u: (k: UiKey) => string;
};

const LangContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'portfolio-lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'vi' || saved === 'en') {
        setLangState(saved);
        return;
      }
    } catch {
      /* private mode / blocked storage — English stays */
    }
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('vi')) {
      setLangState('vi');
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: LangCode) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  const value: Ctx = {
    lang,
    setLang,
    t: (b) => b[lang],
    u: (k) => ui[k][lang],
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const c = useContext(LangContext);
  if (!c) throw new Error('useLang must be used inside <LangProvider>');
  return c;
}

export function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, u } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
      className={`group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white ${className}`}
      aria-label={lang === 'en' ? 'Chuyển sang tiếng Việt' : 'Switch to English'}
    >
      <svg viewBox="0 0 24 24" className="size-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
      </svg>
      {u('langLabel')}
    </button>
  );
}
