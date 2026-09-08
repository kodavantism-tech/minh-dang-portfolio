'use client';

import Link from 'next/link';
import { useLang } from '@/components/Lang';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Sections';
import { Reveal } from '@/components/Reveal';
import { Gallery } from '@/components/Gallery';
import { StoreBadge, MetricRow, ArchiveNote } from '@/components/StoreBits';
import { games, formatDate, compactInstalls, type Game } from '@/lib/games';

export function GameDetail({ slug }: { slug: string }) {
  const { t, u, lang, base } = useLang();
  const game = games.find((g) => g.slug === slug)!;
  const others = games.filter((g) => g.slug !== slug);

  const facts: { label: string; value: string }[] = [
    ...(game.installs ? [{ label: u('installs'), value: `${compactInstalls(game.installsExact ?? 0)}` }] : []),
    ...(game.score != null
      ? [{ label: u('rating'), value: `${game.score.toFixed(2)}★ · ${game.ratings ?? 0} ${u('ratings')}` }]
      : []),
    { label: u('released'), value: formatDate(game.released, lang) },
    { label: u('lastUpdate'), value: formatDate(game.updated, lang) },
    { label: u('version'), value: game.version },
    { label: u('genre'), value: game.genre },
    { label: u('publisher'), value: game.developer },
  ];

  return (
    <>
      <Nav />

      <main>
        {/* ------------------------------------------------------------ header */}
        <header className="relative overflow-hidden pt-10 pb-12 md:pt-16 md:pb-16">
          {game.header && (
            <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-72 opacity-25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={game.header.src} alt="" className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/85 to-bg" />
            </div>
          )}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 -z-10 h-64 w-[46rem] -translate-x-1/2 opacity-45 blur-[80px]"
            style={{ background: `radial-gradient(50% 60% at 50% 0%, ${game.accent}, transparent 70%)` }}
          />

          <div className="shell">
            <Link
              href={`${base}/#work`}
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink"
            >
              <svg viewBox="0 0 20 20" className="size-3.5" fill="currentColor">
                <path d="M16 10H5.5l4 4L8 15.5 2 10l6-5.5L9.5 6l-4 4H16z" />
              </svg>
              {u('backToWork')}
            </Link>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.icon.src}
                alt=""
                width={game.icon.w}
                height={game.icon.h}
                className="size-20 shrink-0 rounded-[1.35rem] border border-white/12 object-cover shadow-xl sm:size-24"
              />

              <div className="min-w-0 flex-1">
                <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-[2.6rem]">
                  {game.displayTitle ?? game.title}
                </h1>

                {game.alsoKnownAs && (
                  <p className="mt-2 text-sm text-faint">
                    {u('alsoKnownAs')} <span className="text-muted">{game.alsoKnownAs}</span>
                  </p>
                )}

                <p className="mt-3 text-lg font-medium" style={{ color: 'var(--color-accent-soft)' }}>
                  {t(game.role)}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <StoreBadge store={game.store} />
                  <MetricRow game={game} />
                  <a
                    href={game.storeUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="chip transition hover:border-white/30 hover:text-ink"
                  >
                    {u('openStore')}
                    <svg viewBox="0 0 20 20" className="size-3" fill="currentColor" aria-hidden="true">
                      <path d="M7 3h10v10h-2V6.4L5.4 16 4 14.6 13.6 5H7z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/90">{t(game.headline)}</p>
          </div>
        </header>

        {/* ------------------------------------------------------------- body */}
        <div className="shell grid gap-12 pb-20 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <div className="min-w-0 space-y-14">
            <Reveal>
              <h2 className="eyebrow mb-5">{u('whatIDid')}</h2>
              <ul className="space-y-4">
                {game.points.map((p, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full"
                      style={{ background: 'var(--color-accent)' }}
                      aria-hidden="true"
                    />
                    <span className="text-[1.02rem] leading-relaxed text-ink/90">{t(p)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-2">
                {game.tech.map((tag) => (
                  <span key={tag} className="chip text-ink/80">
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <h2 className="eyebrow mb-5">{u('gallery')}</h2>
              <Gallery shots={game.shots} title={game.title} accent={game.accent} />
            </Reveal>

            <Reveal>
              <h2 className="eyebrow mb-4">{u('aboutGame')}</h2>
              <div className="card p-5 sm:p-6">
                <p className="text-[0.97rem] leading-relaxed whitespace-pre-line text-muted">
                  {cleanDescription(game.description)}
                </p>
              </div>
            </Reveal>
          </div>

          {/* --------------------------------------------------------- aside */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <dl className="card divide-y divide-line p-5 sm:p-6">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                    <dt className="text-sm text-faint">{f.label}</dt>
                    <dd className="text-right text-sm font-medium text-ink/90">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={80}>
              <ArchiveNote date={game.archivedAt} />
            </Reveal>

            <Reveal delay={140}>
              <div className="card p-5 sm:p-6">
                <h3 className="eyebrow mb-4">{u('backToWork')}</h3>
                <ul className="space-y-3">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={`${base}/games/${o.slug}`} className="group flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={o.icon.src}
                          alt=""
                          width={o.icon.w}
                          height={o.icon.h}
                          className="size-10 shrink-0 rounded-xl border border-white/10 object-cover"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink/90 transition group-hover:text-ink">
                            {o.displayTitle ?? o.title}
                          </span>
                          <span className="block truncate text-xs text-faint">{t(o.role)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

/** Store copy is marketing text with emoji bullets — tidy it for reading. */
function cleanDescription(d: string): string {
  return d
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 14)
    .join('\n');
}

export type { Game };
