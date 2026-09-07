'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { useLang } from '@/components/Lang';
import { Reveal } from '@/components/Reveal';
import { GameCard } from '@/components/GameCard';
import { games } from '@/lib/games';
import { profile, experience, skills, SHOW_STREET_ADDRESS } from '@/content/profile';
import type { UiKey } from '@/content/ui';

/* -------------------------------------------------------------- section shell */

export function Section({
  id,
  title,
  lead,
  children,
  className = '',
}: {
  id?: string;
  title?: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`shell scroll-mt-24 py-16 md:py-24 ${className}`}>
      {(title || lead) && (
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          {title && (
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          )}
          {lead && <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">{lead}</p>}
        </Reveal>
      )}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------------ work */

export function Work() {
  const { u } = useLang();
  return (
    <Section id="work" title={u('workTitle')} lead={u('workLead')}>
      <div className="grid gap-5 md:grid-cols-2">
        {games.map((g, i) => (
          <Reveal key={g.slug} delay={(i % 2) * 90} className="h-full">
            <div className="h-full [&>a]:h-full">
              <GameCard game={g} index={i} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ experience */

export function Experience() {
  const { t, u } = useLang();

  return (
    <Section id="experience" title={u('experienceTitle')}>
      <ol className="relative max-w-4xl space-y-8 border-l border-line pl-6 md:pl-9">
        {experience.map((role, i) => (
          <Reveal as="li" key={`${role.company}-${i}`} delay={i * 80} className="relative">
            <span
              className={`absolute -left-[1.72rem] top-1.5 size-3 rounded-full border-2 md:-left-[2.42rem] ${
                role.current ? 'border-teal bg-teal' : 'border-line bg-bg'
              }`}
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-lg font-semibold text-ink">{t(role.title)}</h3>
              <span className="text-sm font-medium text-accent-soft">{role.company}</span>
              {role.current && <span className="chip border-teal/40 text-teal">●&nbsp;now</span>}
            </div>
            <p className="mt-1 text-sm text-faint tabular-nums">{t(role.period)}</p>
            {role.companyNote && (
              <p className="mt-1 text-xs text-faint">{t(role.companyNote)}</p>
            )}
            <ul className="mt-4 space-y-2.5">
              {role.points.map((p, j) => (
                <li key={j} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-faint" aria-hidden="true" />
                  {t(p)}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------------------------------------------------------------- skills */

export function Skills() {
  const { t, u } = useLang();
  return (
    <Section id="skills" title={u('skillsTitle')} lead={u('skillsLead')}>
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal key={group.items.join()} delay={(i % 2) * 80}>
            <div className="card h-full p-5 sm:p-6">
              <h3 className="eyebrow mb-4">{t(group.label)}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <li key={s} className="chip text-ink/80">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------------- contact */

function CopyEmail() {
  const { u } = useLang();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className="chip no-print transition hover:border-white/30 hover:text-ink"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          /* clipboard blocked — the address is right there to select */
        }
      }}
    >
      {done ? u('copied') : u('copyEmail')}
    </button>
  );
}

function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line py-4 last:border-b-0">
      <span className="eyebrow">{label}</span>
      <span className="flex items-center gap-3">{children}</span>
    </div>
  );
}

export function Contact() {
  const { t, u } = useLang();

  return (
    <Section id="contact" title={u('contactTitle')} lead={u('contactLead')}>
      <Reveal>
        <div className="card p-5 sm:p-7">
          <ContactRow label={u('contactEmail')}>
            <a
              href={`mailto:${profile.email}`}
              className="text-[0.98rem] font-medium text-ink underline decoration-accent/50 underline-offset-4 transition hover:decoration-accent"
            >
              {profile.email}
            </a>
            <CopyEmail />
          </ContactRow>

          <ContactRow label={u('contactLocation')}>
            <span className="text-[0.98rem] text-ink">
              {SHOW_STREET_ADDRESS ? t(profile.streetAddress) : t(profile.location)}
            </span>
          </ContactRow>
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------------------------------------------------------------------- footer */

export function Footer() {
  const { u } = useLang();
  const links: { href: string; key: UiKey }[] = [
    { href: '/#work', key: 'navWork' },
    { href: '/#experience', key: 'navExperience' },
    { href: '/#skills', key: 'navSkills' },
    { href: '/#contact', key: 'navContact' },
  ];

  return (
    <footer className="border-t border-line/70 py-10">
      <div className="shell flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink">
            © {new Date().getFullYear()} {profile.nameLatin}
          </p>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-faint">{u('footerNote')}</p>
        </div>
        <ul className="no-print flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-muted transition hover:text-ink">
                {u(l.key)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
