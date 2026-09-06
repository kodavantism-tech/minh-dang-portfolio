'use client';

import Link from 'next/link';
import { useLang } from '@/components/Lang';
import { StoreBadge, MetricRow } from '@/components/StoreBits';
import type { Game } from '@/lib/games';

export function GameCard({ game, index }: { game: Game; index: number }) {
  const { t, u } = useLang();
  const cover = game.shots[0];

  return (
    <Link
      href={`/games/${game.slug}`}
      className="card group relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-white/20"
      style={{ ['--accent' as string]: game.accent }}
    >
      {/* accent wash that warms up on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: `radial-gradient(60% 100% at 50% 100%, ${game.accent}, transparent 70%)` }}
      />

      <div className="relative flex gap-5 p-5 sm:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.icon.src}
          alt=""
          width={game.icon.w}
          height={game.icon.h}
          className="size-14 shrink-0 rounded-[1rem] border border-white/12 object-cover sm:size-16"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg leading-snug font-semibold tracking-tight text-ink sm:text-xl">
              {game.displayTitle ?? game.title}
            </h3>
            <span className="mt-0.5 shrink-0 text-xs tabular-nums text-faint">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium" style={{ color: 'var(--color-accent-soft)' }}>
            {t(game.role)}
          </p>
        </div>
      </div>

      <p className="relative px-5 pb-5 text-[0.92rem] leading-relaxed text-muted sm:px-6">
        {t(game.headline)}
      </p>

      {/* screenshot strip */}
      <div className="relative mx-5 mb-5 flex gap-2 overflow-hidden rounded-xl sm:mx-6">
        {game.shots.slice(0, 4).map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt=""
            width={s.w}
            height={s.h}
            loading="lazy"
            decoding="async"
            className={`h-28 w-full rounded-lg border border-white/8 object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] sm:h-32 ${
              i > 2 ? 'hidden sm:block' : ''
            }`}
            style={{ transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>

      <div className="relative mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line px-5 py-4 sm:px-6">
        <StoreBadge store={game.store} />
        <MetricRow game={game} compact />
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-ink/80 transition group-hover:text-ink">
          {u('viewCase')}
          <svg viewBox="0 0 20 20" className="size-3.5 transition-transform group-hover:translate-x-0.5" fill="currentColor">
            <path d="M4 10h10.5l-4-4L12 4.5 18 10l-6 5.5-1.5-1.5 4-4H4z" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
