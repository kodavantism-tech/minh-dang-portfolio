'use client';

import Link from 'next/link';
import { useLang } from '@/components/Lang';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Sections';

export default function NotFound() {
  const { u } = useLang();
  return (
    <>
      <Nav />
      <main className="shell flex min-h-[58vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-6xl font-semibold text-faint">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{u('notFoundTitle')}</h1>
        <p className="mt-3 text-muted">{u('notFoundBody')}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg transition hover:bg-white"
        >
          {u('notFoundCta')}
        </Link>
      </main>
      <Footer />
    </>
  );
}
