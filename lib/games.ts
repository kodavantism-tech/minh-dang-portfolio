import storeData from '@/content/store-data.json';
import { gameContent, CAREER_START, type GameContent } from '@/content/profile';

export type Img = { src: string; w: number; h: number; bytes: number; blur?: string };

export type StoreGame = {
  slug: string;
  store: 'play' | 'ios';
  storeId: string;
  storeUrl: string;
  archivedAt: string;
  title: string;
  developer: string;
  summary: string | null;
  description: string;
  genre: string;
  installs: string | null;
  installsExact: number | null;
  score: number | null;
  ratings: number | null;
  version: string;
  released: string | null;
  updated: string | null;
  contentRating: string;
  video: string | null;
  accent: string;
  icon: Img;
  header: Img | null;
  shots: Img[];
};

export type Game = StoreGame & GameContent;

/** Display order is curated: strongest ownership story first. */
const ORDER = ['yarn-pull-3d', 'block-out-color-puzzle', 'strike-force-tank-shooter', 'hole-escape-puzzle'];

const store = storeData as unknown as StoreGame[];

export const games: Game[] = gameContent
  .map((c) => {
    const s = store.find((g) => g.slug === c.slug);
    if (!s) throw new Error(`No archived store data for "${c.slug}". Run: npm run archive`);
    return { ...s, ...c, accent: displayAccent(s.accent) };
  })
  .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));

/**
 * The archived accent is an icon's dominant colour, which for dark icons comes
 * back near-black and makes the glows invisible. Lift lightness and saturation
 * to a floor so every game gets a usable accent while keeping its hue.
 */
function displayAccent(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return '#8b7bff';

  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  // A colourless icon has no hue worth keeping — fall back to the site accent.
  if (s < 0.08) return '#8b7bff';

  return hslToHex(h, Math.max(s, 0.58), Math.min(Math.max(l, 0.62), 0.72));
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] :
    [c, 0, x];

  return `#${[r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('')}`;
}

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export const totals = (() => {
  const installs = games.reduce((n, g) => n + (g.installsExact ?? 0), 0);
  const rated = games.filter((g) => g.score != null && g.ratings != null);
  const ratingCount = rated.reduce((n, g) => n + (g.ratings ?? 0), 0);
  const weighted = ratingCount
    ? rated.reduce((n, g) => n + (g.score ?? 0) * (g.ratings ?? 0), 0) / ratingCount
    : 0;
  return {
    installs,
    titles: games.length,
    ratingCount,
    avgRating: weighted,
    /** Whole years since the first day at Falcon — the date lives in profile.ts. */
    years: Math.max(
      1,
      Math.floor(
        (Date.now() - Date.parse(`${CAREER_START}T00:00:00Z`)) / (365.25 * 24 * 3600 * 1000)
      )
    ),
  };
})();

export function compactInstalls(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M+`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K+`;
  return String(n);
}

export function formatDate(iso: string | null, lang: 'en' | 'vi'): string {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(d);
}
