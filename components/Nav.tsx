'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useLang, LangToggle } from '@/components/Lang';
import { profile } from '@/content/profile';

/** Paths are relative to the active language — see `base` in Lang.tsx. */
const LINKS = [
  { href: '/#work', key: 'navWork' },
  { href: '/#experience', key: 'navExperience' },
  { href: '/#skills', key: 'navSkills' },
  { href: '/#contact', key: 'navContact' },
  { href: '/cv', key: 'navCv' },
] as const;

export function Nav() {
  const { u, base } = useLang();
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = 'site-menu';
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Navigating away should never leave the panel covering the new page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`no-print sticky top-0 z-50 transition-colors duration-300 ${
        solid || open
          ? 'border-b border-line/80 bg-bg/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between gap-4">
        <Link
          href={base || '/'}
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-ink"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-teal text-[0.68rem] font-bold text-bg">
            ĐM
          </span>
          <span className="hidden sm:inline">{profile.nameLatin}</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <ul className="mr-1 hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={`${base}${l.href}`}
                  className="rounded-full px-3 py-1.5 text-sm text-muted transition hover:bg-white/5 hover:text-ink"
                >
                  {u(l.key)}
                </Link>
              </li>
            ))}
          </ul>

          <LangToggle />

          {/* Below md the links above are hidden, so without this a phone has
              no way to reach the CV or any section. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={u('menu')}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/5 text-slate-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white md:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id={panelId} className="border-t border-line/70 bg-bg/95 backdrop-blur-xl md:hidden">
          <ul className="shell flex flex-col py-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={`${base}${l.href}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-[0.95rem] text-muted transition hover:bg-white/5 hover:text-ink"
                >
                  {u(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
