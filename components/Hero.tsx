'use client';

import Link from 'next/link';
import { useLang } from '@/components/Lang';
import { PhoneFrame } from '@/components/PhoneFrame';
import { profile } from '@/content/profile';
import { games, totals, compactInstalls } from '@/lib/games';

/** Left, centre, right of the hero device stack. The centre one is the hero frame. */
const STACK = ['hole-escape-puzzle', 'yarn-pull-3d', 'block-out-color-puzzle'];
const CENTRE = 1;

export function Hero() {
  const { t, u, lang, base } = useLang();
  const stack = STACK.map((slug) => games.find((g) => g.slug === slug)!).filter(Boolean);

  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* ------------------------------------------------ copy */}
        <div>
          <p className="eyebrow mb-5 flex items-center gap-2.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-teal" />
            </span>
            {u('heroKicker')}
          </p>

          <h1 className="text-[2.65rem] leading-[1.03] font-semibold tracking-tight sm:text-6xl lg:text-[4.1rem]">
            {profile.name}
          </h1>

          <p className="mt-4 bg-gradient-to-r from-accent-soft via-ink to-teal bg-clip-text text-xl font-medium text-transparent sm:text-2xl">
            {t(profile.role)}
          </p>

          <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-muted sm:text-lg">
            {t(profile.tagline)}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg transition hover:bg-white"
            >
              {u('heroCtaWork')}
              <svg viewBox="0 0 20 20" className="size-4 transition-transform group-hover:translate-x-0.5" fill="currentColor">
                <path d="M4 10h10.5l-4-4L12 4.5 18 10l-6 5.5-1.5-1.5 4-4H4z" />
              </svg>
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.04] px-5 py-3 text-sm font-semibold text-ink transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              {u('heroCtaContact')}
            </Link>
          </div>

          <p className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-faint">
            <span className="chip">{t(profile.location)}</span>
          </p>
        </div>

        {/* ------------------------------------------------ device stack */}
        <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[90px]"
          />

          <div className="relative flex items-end justify-center gap-3 sm:gap-5">
            {stack.map((g, i) => {
              const centre = i === CENTRE;
              return (
                <div
                  key={g.slug}
                  className={
                    centre
                      ? 'relative z-20 w-[42%] -translate-y-4 sm:w-[44%]'
                      : `relative z-10 w-[32%] opacity-90 ${
                          i < CENTRE ? 'rotate-[-7deg] translate-y-6' : 'rotate-[7deg] translate-y-6'
                        }`
                  }
                >
                  <PhoneFrame
                    shot={g.shots[centre ? 2 : 1] ?? g.shots[0]}
                    alt={`${g.title} gameplay screenshot`}
                    priority={centre}
                    glow={g.accent}
                  />
                </div>
              );
            })}
          </div>

          {/* Floating game icons */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {games.map((g) => (
              <Link
                key={g.slug}
                href={`${base}/games/${g.slug}`}
                title={g.title}
                className="group relative block size-11 overflow-hidden rounded-[0.85rem] border border-white/12 transition hover:-translate-y-1 hover:border-white/30 sm:size-12"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.icon.src}
                  alt={g.title}
                  width={g.icon.w}
                  height={g.icon.h}
                  className="size-full object-cover"
                />
              </Link>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-faint">
            {lang === 'vi'
              ? `${totals.titles} tựa game đã phát hành · ${compactInstalls(totals.installs)} lượt tải`
              : `${totals.titles} shipped titles · ${compactInstalls(totals.installs)} downloads`}
          </p>
        </div>
      </div>
    </section>
  );
}
