import type { MetadataRoute } from 'next';
import { games } from '@/lib/games';
import { SITE_URL } from '@/lib/site';

/**
 * Both languages are listed, each pointing at the other through `alternates`,
 * so Google treats /vi/x as a translation of /x rather than duplicate content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entry = (path: string, lastModified: Date, priority: number) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority,
    alternates: {
      languages: {
        en: `${SITE_URL}${path === '/' ? '' : path}`,
        vi: `${SITE_URL}${path === '/' ? '/vi' : `/vi${path}`}`,
      },
    },
  });

  const pages: { path: string; lastModified: Date; priority: number }[] = [
    { path: '/', lastModified: now, priority: 1 },
    { path: '/cv', lastModified: now, priority: 0.9 },
    ...games.map((g) => ({
      path: `/games/${g.slug}`,
      lastModified: new Date(`${g.archivedAt}T00:00:00Z`),
      priority: 0.8,
    })),
  ];

  return pages.flatMap((p) => [
    entry(p.path, p.lastModified, p.priority),
    {
      ...entry(p.path, p.lastModified, p.priority),
      url: `${SITE_URL}${p.path === '/' ? '/vi' : `/vi${p.path}`}`,
    },
  ]);
}
