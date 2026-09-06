import type { Img } from '@/lib/games';

/**
 * A screenshot inside a phone bezel. `priority` skips lazy-loading for the
 * handful of frames that are visible before any scrolling happens.
 */
export function PhoneFrame({
  shot,
  alt,
  className = '',
  priority = false,
  glow,
}: {
  shot: Img;
  alt: string;
  className?: string;
  priority?: boolean;
  glow?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.6rem] border border-white/12 bg-black p-[3px] shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)] ${className}`}
      style={glow ? { boxShadow: `0 28px 70px -28px ${glow}80, 0 0 0 1px rgba(255,255,255,.08)` } : undefined}
    >
      <div className="relative overflow-hidden rounded-[1.4rem] bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={alt}
          width={shot.w}
          height={shot.h}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="block h-full w-full object-cover"
          style={
            shot.blur
              ? { backgroundImage: `url(${shot.blur})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        />
        {/* Screen sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-white/[0.12]"
        />
      </div>
    </div>
  );
}
