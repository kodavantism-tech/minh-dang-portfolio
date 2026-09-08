'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`no-print sticky top-0 z-50 transition-colors duration-300 ${
        solid ? 'border-b border-line/80 bg-bg/80 backdrop-blur-xl' : 'border-b border-transparent'
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
        </div>
      </nav>
    </header>
  );
}
