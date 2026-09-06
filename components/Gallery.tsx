'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Img } from '@/lib/games';

/**
 * Horizontal screenshot strip with a lightbox. Keyboard: ← → to move, Esc to close.
 */
export function Gallery({ shots, title, accent }: { shots: Img[]; title: string; accent: string }) {
  const [open, setOpen] = useState<number | null>(null);

  const move = useCallback(
    (delta: number) => {
      setOpen((cur) => (cur === null ? null : (cur + delta + shots.length) % shots.length));
    },
    [shots.length]
  );

  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      else if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowLeft') move(-1);
    };

    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, move]);

  return (
    <>
      <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:gap-4">
        {shots.map((s, i) => (
          <li key={s.src} className="w-[57%] shrink-0 snap-start sm:w-auto">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-xl border border-white/10 bg-surface transition hover:-translate-y-1 hover:border-white/25"
              aria-label={`${title} — screenshot ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={`${title} screenshot ${i + 1}`}
                width={s.w}
                height={s.h}
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
                className="block w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={
                  s.blur
                    ? { backgroundImage: `url(${s.blur})`, backgroundSize: 'cover' }
                    : undefined
                }
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshots`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setOpen(null)}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(50% 50% at 50% 50%, ${accent}, transparent 70%)` }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            className="absolute left-2 z-10 grid size-11 place-items-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-black/80 sm:left-6"
            aria-label="Previous screenshot"
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
              <path d="M16 10H5.5l4 4L8 15.5 2 10l6-5.5L9.5 6l-4 4H16z" />
            </svg>
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shots[open].src}
            alt={`${title} screenshot ${open + 1}`}
            width={shots[open].w}
            height={shots[open].h}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[86vh] w-auto rounded-2xl border border-white/15 object-contain shadow-2xl"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            className="absolute right-2 z-10 grid size-11 place-items-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-black/80 sm:right-6"
            aria-label="Next screenshot"
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
              <path d="M4 10h10.5l-4-4L12 4.5 18 10l-6 5.5-1.5-1.5 4-4H4z" />
            </svg>
          </button>

          <p className="absolute bottom-5 text-xs tabular-nums text-white/60">
            {open + 1} / {shots.length}
          </p>
        </div>
      )}
    </>
  );
}
