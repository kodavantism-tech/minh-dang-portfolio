'use client';

import { useLang } from '@/components/Lang';
import { compactInstalls, formatDate, type Game } from '@/lib/games';

export function StoreBadge({ store }: { store: 'play' | 'ios' }) {
  const { u } = useLang();
  return (
    <span className="chip">
      {store === 'play' ? (
        <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
          <path d="M3.6 2.3a1 1 0 0 0-.5.9v17.6a1 1 0 0 0 .5.9l9.3-9.7L3.6 2.3zm10.7 8.1 2.6-2.7-9.6-5.4 7 8.1zm0 3.2-7 8.1 9.6-5.4-2.6-2.7zm4.1-1.6 2.4-1.4c.7-.4.7-1.4 0-1.8l-2.2-1.2-2.8 2.9 2.6 1.5z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
          <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.5zM14.2 5.4c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z" />
        </svg>
      )}
      {store === 'play' ? u('storePlay') : u('storeIos')}
    </span>
  );
}

/** Installs + rating, the two numbers a recruiter scans for. */
export function MetricRow({ game, compact = false }: { game: Game; compact?: boolean }) {
  const { u, lang } = useLang();

  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
      {game.installsExact != null && (
        <span className="inline-flex items-center gap-1.5">
          <svg viewBox="0 0 20 20" className="size-3.5 text-faint" fill="currentColor" aria-hidden="true">
            <path d="M10 2.5a1 1 0 0 1 1 1v7.1l2.3-2.3 1.4 1.4L10 14.4 5.3 9.7l1.4-1.4L9 10.6V3.5a1 1 0 0 1 1-1zM4 15.5h12v2H4z" />
          </svg>
          <span className="font-medium text-ink/85 tabular-nums">{compactInstalls(game.installsExact)}</span>
          {!compact && <span className="text-faint">{u('installs')}</span>}
        </span>
      )}
      {game.score != null && (
        <span className="inline-flex items-center gap-1.5">
          <svg viewBox="0 0 20 20" className="size-3.5 text-amber" fill="currentColor" aria-hidden="true">
            <path d="m10 1.8 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L2.2 7.5l5.4-.8z" />
          </svg>
          <span className="font-medium text-ink/85 tabular-nums">{game.score.toFixed(2)}</span>
          {game.ratings != null && (
            <span className="text-faint tabular-nums">
              ({new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US').format(game.ratings)})
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/** The "this data is a snapshot" note — the whole point of the archive. */
export function ArchiveNote({ date, short = false }: { date: string; short?: boolean }) {
  const { u, lang } = useLang();
  const pretty = formatDateFull(date, lang);

  if (short) {
    return <span className="chip">{u('archivedShort').replace('{date}', pretty)}</span>;
  }

  return (
    <div className="card flex gap-3.5 p-4 sm:p-5">
      <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />
        <path d="M2 3.8h20V7H2zM9.5 11.5h5" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-ink">{u('archivedTitle')}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {u('archivedBody').replace('{date}', pretty)}
        </p>
      </div>
    </div>
  );
}

function formatDateFull(iso: string, lang: 'en' | 'vi') {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

export { formatDate };
