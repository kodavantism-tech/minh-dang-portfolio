/**
 * JSON-LD structured data.
 *
 * Why: when a recruiter searches the name, Google has nothing to go on but the
 * page text. These objects tell it explicitly that this is a person, what they
 * do, and which shipped apps belong to them — which is what produces a rich
 * result instead of a plain blue link.
 *
 * Everything here is derived from content/profile.ts and the archived store
 * manifest, so there is no second set of facts to keep in sync. English only:
 * schema.org consumers are machines, and mixing languages in one graph is
 * worse than picking one.
 */
import { profile, experience, skills } from '@/content/profile';
import { games, type Game } from '@/lib/games';
import { SITE_URL } from '@/lib/site';

const PERSON_ID = `${SITE_URL}/#person`;

export function personSchema() {
  const current = experience.find((r) => r.current) ?? experience[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.nameLatin,
    alternateName: profile.name,
    jobTitle: profile.role.en,
    description: profile.summary.en,
    email: `mailto:${profile.email}`,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hanoi',
      addressCountry: 'VN',
    },
    worksFor: { '@type': 'Organization', name: current.company },
    knowsAbout: skills.flatMap((g) => g.items),
    knowsLanguage: ['vi', 'en'],
  };
}

/** The four shipped games as one ordered list, so they surface together. */
export function worksListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Games shipped by ${profile.nameLatin}`,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: games.length,
    itemListElement: games.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/games/${g.slug}`,
      name: g.displayTitle ?? g.title,
    })),
  };
}

export function gameSchema(g: Game) {
  const rated = g.score != null && g.ratings != null && g.ratings > 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: g.displayTitle ?? g.title,
    ...(g.alsoKnownAs ? { alternateName: g.alsoKnownAs } : {}),
    url: `${SITE_URL}/games/${g.slug}`,
    sameAs: g.storeUrl,
    description: g.summary ?? g.headline.en,
    genre: g.genre,
    applicationCategory: 'GameApplication',
    operatingSystem: g.store === 'ios' ? 'iOS' : 'Android',
    image: `${SITE_URL}${g.icon.src}`,
    screenshot: g.shots.map((s) => `${SITE_URL}${s.src}`),
    publisher: { '@type': 'Organization', name: g.developer },
    softwareVersion: g.version,
    ...(g.released ? { datePublished: g.released } : {}),
    ...(g.updated ? { dateModified: g.updated } : {}),
    contributor: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: profile.nameLatin,
      url: SITE_URL,
      // The site's own claim about the role — kept out of the store facts above.
      jobTitle: g.role.en,
    },
    ...(rated
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(g.score!.toFixed(2)),
            ratingCount: g.ratings!,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}
