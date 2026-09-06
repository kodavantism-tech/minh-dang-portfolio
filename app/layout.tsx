import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/components/Lang';
import { profile } from '@/content/profile';
import { totals, compactInstalls } from '@/lib/games';
import { SITE_URL } from '@/lib/site';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const description = `Unity developer at Falcon Game Studio. Gameplay cores, UI systems and enemy design across four shipped mobile titles with ${compactInstalls(
  totals.installs
)} downloads.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.nameLatin} — Unity Game Developer`,
    template: `%s — ${profile.nameLatin}`,
  },
  description,
  keywords: [
    'Unity developer',
    'game developer',
    'C#',
    'mobile games',
    'Hanoi',
    'Vietnam',
    profile.nameLatin,
  ],
  authors: [{ name: profile.nameLatin, url: profile.github }],
  creator: profile.nameLatin,
  openGraph: {
    type: 'profile',
    title: `${profile.nameLatin} — Unity Game Developer`,
    description,
    siteName: `${profile.nameLatin} · Portfolio`,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.nameLatin} — Unity Game Developer`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#07080d',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint so reveal animations never
            leave content invisible for readers without JS. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        <div className="ambience" aria-hidden="true" />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
