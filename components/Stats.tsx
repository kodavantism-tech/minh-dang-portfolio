'use client';

import { useLang } from '@/components/Lang';
import { Reveal } from '@/components/Reveal';
import { totals, compactInstalls } from '@/lib/games';
import type { UiKey } from '@/content/ui';

export function Stats() {
  const { u } = useLang();

  const items: { value: string; label: UiKey; note: UiKey }[] = [
    { value: compactInstalls(totals.installs), label: 'statDownloads', note: 'statDownloadsNote' },
    { value: String(totals.titles), label: 'statTitles', note: 'statTitlesNote' },
    { value: `${totals.avgRating.toFixed(2)}★`, label: 'statRating', note: 'statRatingNote' },
    { value: `${totals.years}+`, label: 'statYears', note: 'statYearsNote' },
  ];

  return (
    <section className="shell">
      <Reveal>
        <dl className="card grid grid-cols-2 divide-line overflow-hidden md:grid-cols-4 md:divide-x">
          {items.map((it, i) => (
            <div
              key={it.label}
              className={`px-5 py-6 md:px-7 md:py-8 ${i < 2 ? 'border-b border-line md:border-b-0' : ''} ${
                i % 2 === 1 ? 'border-l border-line md:border-l-0' : ''
              }`}
            >
              <dd className="font-display text-3xl font-semibold tracking-tight text-ink md:text-[2.1rem]">
                {it.value}
              </dd>
              <dt className="mt-1.5 text-sm font-medium text-ink/85">{u(it.label)}</dt>
              <p className="mt-0.5 text-xs text-faint">{u(it.note)}</p>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
