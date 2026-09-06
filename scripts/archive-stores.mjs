/**
 * Re-archives every store listing this portfolio depends on.
 *
 *   npm run archive
 *
 * Why this exists: mobile listings get renamed, region-locked or delisted.
 * (One already has — the CV's "Jackal Retro - Tank Shooter" is now
 * "Strike Force: Tank Shooter".) So nothing on the site is ever fetched from
 * Google or Apple at render time. This script pulls everything down once and
 * writes two layers:
 *
 *   archive/<slug>/          original-resolution images + raw store JSON
 *                            (the preservation copy — kept in git, excluded
 *                             from the deploy via .vercelignore)
 *   public/games/<slug>/     resized .webp the site actually serves
 *   content/store-data.json  manifest the site reads at build time
 *
 * Safe to re-run: it overwrites in place. If a listing has been pulled, the
 * fetch for that game fails, the script leaves the existing archive alone and
 * reports it — the site keeps working off what was captured before.
 */
import gplay from 'google-play-scraper';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const g = gplay.default ?? gplay;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public/games');
const ARC = path.join(ROOT, 'archive');
const MANIFEST = path.join(ROOT, 'content/store-data.json');

/** Add a game here and re-run to bring it into the portfolio. */
const TARGETS = [
  { slug: 'strike-force-tank-shooter', store: 'ios', id: '6736940484', keep: 10 },
  { slug: 'block-out-color-puzzle', store: 'play', id: 'com.fc.block.out.wood.puzzle', keep: 8 },
  { slug: 'yarn-pull-3d', store: 'play', id: 'com.fc.knit.jam.wool.sort.puzzle', keep: 8 },
  { slug: 'hole-escape-puzzle', store: 'play', id: 'com.fc.black.hole.people.escape.puzzle', keep: 8 },
];

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const SHOT_WIDTH = 640;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Local calendar date — `toISOString()` would report yesterday for a UTC+7 evening run. */
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function get(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 512) throw new Error(`too small (${buf.length} bytes)`);
  return buf;
}

/** Try progressively less specific URLs — store CDNs change their size syntax. */
async function getBest(urls) {
  let lastErr;
  for (const u of urls) {
    try {
      return await get(u);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

const playSized = (url, w) => {
  const base = url.replace(/=[whs]\d+.*$/, '');
  return [`${base}=w${w}`, base, url];
};

const appleSized = (url, w) => {
  const alt = url.replace(/\/\d+x\d+[a-z]{0,3}\.(jpg|png|jpeg)$/i, `/${w}x0w.jpg`);
  return alt === url ? [url] : [alt, url];
};

/** Windows AV sometimes holds a lock on a freshly written file. */
async function rmRetry(p) {
  for (let i = 0; i < 5; i++) {
    try {
      await fs.rm(p, { force: true });
      return true;
    } catch (e) {
      if (e.code !== 'EBUSY' && e.code !== 'EPERM') return false;
      await sleep(400 * (i + 1));
    }
  }
  return false;
}

async function emit(buf, outFile, srcPath, width, quality) {
  let img = sharp(buf, { animated: false });
  const meta = await img.metadata();
  if (meta.width > width) img = img.resize({ width, withoutEnlargement: true });
  const out = await img.webp({ quality, effort: 5 }).toBuffer();
  await fs.writeFile(outFile, out);

  const m2 = await sharp(out).metadata();
  const tiny = await sharp(out).resize({ width: 14 }).webp({ quality: 30 }).toBuffer();

  return {
    src: srcPath,
    w: m2.width,
    h: m2.height,
    bytes: out.length,
    blur: `data:image/webp;base64,${tiny.toString('base64')}`,
  };
}

async function fetchPlay(id) {
  const raw = await g.app({ appId: id, lang: 'en', country: 'us' });
  return {
    raw,
    storeUrl: `https://play.google.com/store/apps/details?id=${id}`,
    iconUrl: raw.icon,
    headerUrl: raw.headerImage,
    shotUrls: raw.screenshots ?? [],
    meta: {
      title: raw.title,
      developer: raw.developer,
      summary: raw.summary ?? null,
      description: raw.description,
      genre: raw.genre,
      installs: raw.installs,
      installsExact: raw.maxInstalls,
      score: raw.score ?? null,
      ratings: raw.ratings ?? null,
      version: raw.version,
      released: raw.released,
      updated: raw.updated ? new Date(raw.updated).toISOString().slice(0, 10) : null,
      contentRating: raw.contentRating,
      video: raw.video ?? null,
    },
  };
}

async function fetchIos(id) {
  const r = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=us`, {
    headers: { 'User-Agent': UA },
  });
  const raw = (await r.json()).results?.[0];
  if (!raw) throw new Error('App Store returned no result — listing may be gone');
  return {
    raw,
    storeUrl: raw.trackViewUrl,
    iconUrl: raw.artworkUrl512 || raw.artworkUrl100,
    headerUrl: null,
    shotUrls: raw.screenshotUrls ?? [],
    meta: {
      title: raw.trackName,
      developer: raw.sellerName,
      summary: null,
      description: raw.description,
      genre: raw.primaryGenreName,
      installs: null,
      installsExact: null,
      score: raw.averageUserRating ?? null,
      ratings: raw.userRatingCount ?? null,
      version: raw.version,
      released: raw.releaseDate ? raw.releaseDate.slice(0, 10) : null,
      updated: raw.currentVersionReleaseDate ? raw.currentVersionReleaseDate.slice(0, 10) : null,
      contentRating: raw.contentAdvisoryRating,
      video: null,
    },
  };
}

// ---------------------------------------------------------------------------

const previous = await fs
  .readFile(MANIFEST, 'utf8')
  .then((s) => JSON.parse(s))
  .catch(() => []);

const games = [];
const failures = [];

for (const t of TARGETS) {
  const pubDir = path.join(PUB, t.slug);
  const rawDir = path.join(ARC, t.slug, 'raw');

  let fetched;
  try {
    fetched = t.store === 'play' ? await fetchPlay(t.id) : await fetchIos(t.id);
  } catch (e) {
    const kept = previous.find((p) => p.slug === t.slug);
    failures.push(`${t.slug}: ${e.message}`);
    if (kept) {
      console.log(`[keep] ${t.slug}: listing unreachable, keeping the ${kept.archivedAt} archive`);
      games.push(kept);
    } else {
      console.log(`[skip] ${t.slug}: unreachable and never archived`);
    }
    continue;
  }

  await fs.mkdir(pubDir, { recursive: true });
  await fs.mkdir(rawDir, { recursive: true });
  await fs.writeFile(path.join(ARC, t.slug, 'store-raw.json'), JSON.stringify(fetched.raw, null, 2));

  const sized = t.store === 'play' ? playSized : appleSized;

  const iconBuf = await getBest(sized(fetched.iconUrl, 512));
  await fs.writeFile(path.join(rawDir, 'icon.orig'), iconBuf);
  const icon = await emit(iconBuf, path.join(pubDir, 'icon.webp'), `/games/${t.slug}/icon.webp`, 256, 90);

  // Dominant colour of the icon drives each game's accent on the site.
  const { dominant } = await sharp(path.join(pubDir, 'icon.webp')).stats();
  const accent = `#${[dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

  let header = null;
  if (fetched.headerUrl) {
    try {
      const hb = await getBest(sized(fetched.headerUrl, 1400));
      await fs.writeFile(path.join(rawDir, 'header.orig'), hb);
      header = await emit(hb, path.join(pubDir, 'header.webp'), `/games/${t.slug}/header.webp`, 1400, 78);
    } catch (e) {
      console.log(`  header unavailable: ${e.message}`);
    }
  }

  // Stores return phone + tablet variants of the same art. The phone set comes
  // first and is the set the studio ordered deliberately, so keep the head of
  // the list for display and archive the full original set regardless.
  const shots = [];
  for (let i = 0; i < fetched.shotUrls.length; i++) {
    const n = String(i + 1).padStart(2, '0');
    try {
      const buf = await getBest(sized(fetched.shotUrls[i], 1080));
      await fs.writeFile(path.join(rawDir, `shot-${n}.orig`), buf);
      if (i < t.keep) {
        shots.push(
          await emit(buf, path.join(pubDir, `shot-${n}.webp`), `/games/${t.slug}/shot-${n}.webp`, SHOT_WIDTH, 80)
        );
      } else {
        await rmRetry(path.join(pubDir, `shot-${n}.webp`));
      }
    } catch (e) {
      console.log(`  shot ${n} failed: ${e.message}`);
    }
  }

  games.push({
    slug: t.slug,
    store: t.store,
    storeId: t.id,
    storeUrl: fetched.storeUrl,
    archivedAt: today(),
    ...fetched.meta,
    accent,
    icon,
    header,
    shots,
  });

  console.log(`[ok]   ${t.slug}: icon + ${header ? 'header + ' : ''}${shots.length} shots, accent ${accent}`);
}

await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
await fs.writeFile(MANIFEST, JSON.stringify(games, null, 2));

console.log(`\nwrote content/store-data.json (${games.length} games)`);
if (failures.length) {
  console.log('\nlistings that could not be refreshed:');
  for (const f of failures) console.log(`  - ${f}`);
  console.log('The site still builds from the previously archived copies.');
}
