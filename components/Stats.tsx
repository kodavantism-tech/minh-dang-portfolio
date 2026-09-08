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
            /* A <dl> group must be `dt` then `dd` in the markup; the number is
               lifted above its label with `order-*` so reading order stays
               valid without changing the layout. */
            <div
              key={it.label}
              className={`flex flex-col px-5 py-6 md:px-7 md:py-8 ${
                i < 2 ? 'border-b border-line md:border-b-0' : ''
              } ${i % 2 === 1 ? 'border-l border-line md:border-l-0' : ''}`}
            >
              <dt className="order-2 mt-1.5 text-sm font-medium text-ink/85">{u(it.label)}</dt>
              <dd className="order-1 font-display text-3xl font-semibold tracking-tight text-ink md:text-[2.1rem]">
                {it.value}
              </dd>
              <dd className="order-3 mt-0.5 text-xs text-faint">{u(it.note)}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
