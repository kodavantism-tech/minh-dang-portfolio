'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { Bi } from '@/content/profile';
import { ui, type UiKey } from '@/content/ui';

export type LangCode = 'en' | 'vi';

/**
 * Language is decided by the URL, not by client state:
 *
 *   /            /cv            /games/<slug>          English
 *   /vi          /vi/cv         /vi/games/<slug>       Vietnamese
 *
 * That matters because the site is statically generated. When the language
 * lived in localStorage, every page shipped English HTML and only became
 * Vietnamese after hydration — so Google indexed one language, and a search in
 * Vietnamese found nothing. Now each language is a real, crawlable document
 * with its own hreflang.
 */
type Ctx = {
  lang: LangCode;
  /** '' for English, '/vi' for Vietnamese — prefix for every internal link. */
  base: string;
  /** Pick the active side of a bilingual string. */
  t: (b: Bi) => string;
  /** Look up interface chrome by key. */
  u: (k: UiKey) => string;
  /** This same page in the other language. */
  otherHref: string;
};

const LangContext = createContext<Ctx | null>(null);

export function localeOf(pathname: string): LangCode {
  return pathname === '/vi' || pathname.startsWith('/vi/') ? 'vi' : 'en';
}

/** The given path with the locale prefix added or stripped. */
export function swapLocale(pathname: string, to: LangCode): string {
  const bare = pathname === '/vi' ? '/' : pathname.replace(/^\/vi(?=\/)/, '');
  if (to === 'en') return bare || '/';
  return bare === '/' ? '/vi' : `/vi${bare}`;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const lang = localeOf(pathname);

  // Both language trees share one root layout, so the <html lang> in the static
  // markup is always "en" — the Vietnamese pages correct it on arrival.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: Ctx = {
    lang,
    base: lang === 'vi' ? '/vi' : '',
    t: (b) => b[lang],
    u: (k) => ui[k][lang],
    otherHref: swapLocale(pathname, lang === 'en' ? 'vi' : 'en'),
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const c = useContext(LangContext);
  if (!c) throw new Error('useLang must be used inside <LangProvider>');
  return c;
}

export function LangToggle({ className = '' }: { className?: string }) {
  const { lang, u, otherHref } = useLang();
  return (
    <Link
      href={otherHref}
      hrefLang={lang === 'en' ? 'vi' : 'en'}
      className={`group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white ${className}`}
      aria-label={lang === 'en' ? 'Chuyển sang tiếng Việt' : 'Switch to English'}
    >
      <svg viewBox="0 0 24 24" className="size-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
      </svg>
      {u('langLabel')}
    </Link>
  );
}
