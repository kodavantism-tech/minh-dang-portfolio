'use client';

/**
 * The printable CV. It reads the exact same content/profile.ts the rest of the
 * site does, so the PDF an employer downloads can never drift from the pages
 * they browsed — there is no second copy of the text to forget to update.
 *
 * Screen: the site's dark theme, one narrow column.
 * Print:  black on white, A4, no navigation — see the `.cv` rules in
 *         app/globals.css.
 */

import Link from 'next/link';
import { useLang } from '@/components/Lang';
import { profile, experience, skills, SHOW_STREET_ADDRESS } from '@/content/profile';
import { games, compactInstalls } from '@/lib/games';
import { SITE_URL } from '@/lib/site';

const SITE_LABEL = SITE_URL.replace(/^https?:\/\//, '');

export function Cv() {
  const { t, u, lang } = useLang();

  return (
    <main className="cv shell max-w-3xl py-10 md:py-14">
      <p className="no-print mb-8 rounded-xl border border-line bg-surface/60 p-4 text-sm leading-relaxed text-muted">
        {u('cvHint')}
      </p>

      {/* ------------------------------------------------------------ header */}
      <header className="cv-head border-b border-line pb-6">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {lang === 'vi' ? profile.name : profile.nameLatin}
            </h1>
            <p className="mt-1 text-lg text-accent-soft">{t(profile.role)}</p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2">
            {/* Built by scripts/make-cv-pdf.mjs from this very page. */}
            <a
              href={lang === 'vi' ? '/dang-quang-minh-cv-vi.pdf' : '/dang-quang-minh-cv.pdf'}
              download
              className="rounded-full border border-accent/40 bg-accent/15 px-4 py-2 text-sm font-medium text-accent-soft transition hover:border-accent/70 hover:bg-accent/25 hover:text-white"
            >
              {u('cvDownload')}
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
            >
              {u('cvPrint')}
            </button>
          </div>
        </div>

        <ul className="cv-contact mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
          <li>
            <a href={`mailto:${profile.email}`} className="hover:text-ink">
              {profile.email}
            </a>
          </li>
          <li>{SHOW_STREET_ADDRESS ? t(profile.streetAddress) : t(profile.location)}</li>
          <li>
            <a href={SITE_URL} className="hover:text-ink">
              {SITE_LABEL}
            </a>
          </li>
        </ul>
      </header>

      {/* ----------------------------------------------------------- profile */}
      <CvSection title={u('cvProfile')}>
        <p className="text-[0.95rem] leading-relaxed text-muted">{t(profile.summary)}</p>
      </CvSection>

      {/* -------------------------------------------------------- experience */}
      <CvSection title={u('experienceTitle')}>
        <div className="space-y-6">
          {experience.map((role, i) => (
            <article key={`${role.company}-${i}`} className="cv-item">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-display text-base font-semibold text-ink">
                  {t(role.title)} · <span className="text-accent-soft">{role.company}</span>
                </h3>
                <span className="text-sm text-faint tabular-nums">{t(role.period)}</span>
              </div>
              {role.companyNote && (
                <p className="mt-1 text-xs text-faint">{t(role.companyNote)}</p>
              )}
              <ul className="mt-2 space-y-1.5">
                {role.points.map((p, j) => (
                  <li key={j} className="cv-bullet text-[0.9rem] leading-relaxed text-muted">
                    {t(p)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </CvSection>

      {/* ------------------------------------------------------------- games */}
      <CvSection title={u('cvGames')}>
        <div className="space-y-4">
          {games.map((g) => (
            <article key={g.slug} className="cv-item">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-display text-base font-semibold text-ink">
                  {g.displayTitle ?? g.title}
                </h3>
                <span className="text-sm text-faint">{t(g.role)}</span>
              </div>
              <p className="mt-0.5 text-xs text-faint tabular-nums">
                {metrics(g, u('installs').toLowerCase())}
              </p>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{t(g.headline)}</p>
            </article>
          ))}
        </div>
      </CvSection>

      {/* ------------------------------------------------------------ skills */}
      <CvSection title={u('skillsTitle')}>
        <dl className="space-y-2.5">
          {skills.map((group) => (
            <div key={group.items.join()} className="cv-skill flex flex-wrap gap-x-3 text-[0.9rem]">
              <dt className="min-w-[11rem] font-medium text-ink">{t(group.label)}</dt>
              <dd className="flex-1 text-muted">{group.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </CvSection>

      <p className="mt-10 border-t border-line pt-5 text-xs text-faint">
        {u('cvSource')}{' '}
        <Link href="/" className="text-accent-soft hover:text-ink">
          {SITE_LABEL}
        </Link>
      </p>
    </main>
  );
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cv-section mt-8">
      <h2 className="eyebrow mb-3 border-b border-line pb-1.5">{title}</h2>
      {children}
    </section>
  );
}

/** One dense line of store facts, or nothing if the listing had none. */
function metrics(g: (typeof games)[number], installsWord: string): string {
  const bits = [
    g.installsExact ? `${compactInstalls(g.installsExact)} ${installsWord}` : null,
    g.score ? `${g.score.toFixed(2)}★` : null,
    g.store === 'ios' ? 'App Store' : 'Google Play',
  ].filter(Boolean);
  return bits.join(' · ');
}
