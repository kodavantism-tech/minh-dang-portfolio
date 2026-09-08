/**
 * Builds the share cards people see when a URL from this site is pasted into
 * Slack / Messenger / LinkedIn / Zalo:
 *
 *   app/opengraph-image.png   the site itself
 *   public/og/<slug>.png      one per game
 *
 * Regenerate with `npm run og`. Before the per-game cards existed, every game
 * page shared one tall phone screenshot, which each platform cropped its own
 * way — usually straight through the middle of the artwork.
 *
 * Text here is English only and comes from the archived store data, never from
 * content/profile.ts: this is a .mjs script and profile.ts is TypeScript, so
 * importing it would mean a build step for one line of copy.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const games = JSON.parse(await fs.readFile(path.join(ROOT, 'content/store-data.json'), 'utf8'));

const W = 1200;
const H = 630;

const installs = games.reduce((n, g) => n + (g.installsExact ?? 0), 0);
const rated = games.filter((g) => g.score != null && g.ratings != null);
const ratingCount = rated.reduce((n, g) => n + g.ratings, 0);
const avg = rated.reduce((n, g) => n + g.score * g.ratings, 0) / ratingCount;
const compact = installs >= 1000 ? `${Math.floor(installs / 1000)}K+` : String(installs);

const FONT = 'Segoe UI, Arial, Helvetica, sans-serif';

const bg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow1" cx="12%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#8b7bff" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#8b7bff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="95%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#3ed7c6" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="#3ed7c6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b3a8ff"/>
      <stop offset="100%" stop-color="#3ed7c6"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#07080d"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <text x="72" y="150" font-family="${FONT}" font-size="21" font-weight="600"
        letter-spacing="4" fill="#6b7290">UNITY GAME DEVELOPER · HANOI</text>

  <text x="70" y="248" font-family="${FONT}" font-size="76" font-weight="700"
        letter-spacing="-2" fill="#eceef6">Dang Quang Minh</text>

  <text x="72" y="308" font-family="${FONT}" font-size="34" font-weight="600"
        fill="url(#accent)">Gameplay cores · UI systems</text>

  <text x="72" y="392" font-family="${FONT}" font-size="25" fill="#969db6">
    Falcon Game Studio — 4 shipped mobile titles
  </text>

  <rect x="72" y="440" width="620" height="1" fill="#1f2434"/>

  <text x="72" y="512" font-family="${FONT}" font-size="46" font-weight="700" fill="#eceef6">${compact}</text>
  <text x="72" y="548" font-family="${FONT}" font-size="20" fill="#6b7290">downloads</text>

  <text x="272" y="512" font-family="${FONT}" font-size="46" font-weight="700" fill="#eceef6">${avg.toFixed(2)}</text>
  <text x="272" y="548" font-family="${FONT}" font-size="20" fill="#6b7290">avg rating</text>

  <text x="452" y="512" font-family="${FONT}" font-size="46" font-weight="700" fill="#eceef6">${games.length}</text>
  <text x="452" y="548" font-family="${FONT}" font-size="20" fill="#6b7290">titles</text>

  <text x="72" y="596" font-family="${FONT}" font-size="19" fill="#4d5470">dangquangminh.vercel.app</text>
</svg>`);

/** Rounded-corner phone shot. */
async function shot(file, w) {
  const img = sharp(file).resize({ width: w });
  const meta = await img.metadata();
  const buf = await img.toBuffer();
  const h = Math.round((meta.height / meta.width) * w);
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${Math.round(w * 0.11)}" fill="#fff"/></svg>`
  );
  const rounded = await sharp(buf)
    .resize(w, h, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  return { buf: rounded, w, h };
}

const picks = ['yarn-pull-3d', 'block-out-color-puzzle', 'hole-escape-puzzle'];
const layers = [];
let x = 720;

for (let i = 0; i < picks.length; i++) {
  const g = games.find((v) => v.slug === picks[i]);
  const src = path.join(ROOT, 'public', g.shots[i === 0 ? 2 : 1].src.slice(1));
  const s = await shot(src, i === 0 ? 190 : 160);
  layers.push({ input: s.buf, left: x, top: i === 0 ? 150 : 195 });
  x += s.w - 22;
}

await sharp(bg)
  .composite(layers)
  .png({ compressionLevel: 9 })
  .toFile(path.join(ROOT, 'app/opengraph-image.png'));

console.log('wrote app/opengraph-image.png');

/* ------------------------------------------------------------ per-game cards */

/** SVG is XML — a store title containing & or < would otherwise break the file. */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]
  );
}

/**
 * Fits the title into the 600px of card left of the screenshots. Store titles
 * run from "Yarn Pull 3D" to "Block Out Color Puzzle Game", so this wraps to a
 * second line first and only then shrinks — a long title set small enough to
 * fit on one line is unreadable at thumbnail size.
 *
 * Widths are estimated at 0.53em per character, which is close enough for a
 * bold sans and errs on the safe side.
 */
const TITLE_BOX = 600;

function layoutTitle(title) {
  const fit = (line, max) => Math.min(max, Math.floor(TITLE_BOX / (line.length * 0.53)));

  const oneLine = fit(title, 64);
  if (oneLine >= 46) return { lines: [title], size: oneLine };

  const words = title.split(/\s+/);
  const lines = ['', ''];
  let i = 0;
  for (const w of words) {
    // Move to the second line once the first is past the halfway mark.
    if (i === 0 && lines[0] && (lines[0] + ' ' + w).length > Math.ceil(title.length / 2)) i = 1;
    lines[i] = lines[i] ? `${lines[i]} ${w}` : w;
  }

  const longest = lines.reduce((a, b) => (a.length > b.length ? a : b));
  return { lines: lines.filter(Boolean), size: fit(longest, 56) };
}

/**
 * The archived accent is an icon's dominant colour, so a dark icon yields a
 * near-black that vanishes against the card. lib/games.ts lifts it for the site;
 * here a floor is enough — below it, fall back to the site accent.
 */
function readable(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return '#b3a8ff';
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 0.34 ? '#b3a8ff' : hex;
}

const OG_DIR = path.join(ROOT, 'public/og');
await fs.mkdir(OG_DIR, { recursive: true });

for (const g of games) {
  const compactInstalls =
    g.installsExact >= 1_000_000
      ? `${(g.installsExact / 1_000_000).toFixed(1)}M+`
      : g.installsExact >= 1000
        ? `${Math.floor(g.installsExact / 1000)}K+`
        : null;

  const stats = [
    compactInstalls && { value: compactInstalls, label: 'downloads' },
    g.score != null && { value: g.score.toFixed(2), label: 'rating' },
    { value: g.store === 'ios' ? 'iOS' : 'Android', label: 'platform' },
  ].filter(Boolean);

  const statSvg = stats
    .map(
      (s, i) => `
  <text x="${72 + i * 200}" y="512" font-family="${FONT}" font-size="44" font-weight="700" fill="#eceef6">${esc(s.value)}</text>
  <text x="${72 + i * 200}" y="548" font-family="${FONT}" font-size="19" fill="#6b7290">${esc(s.label)}</text>`
    )
    .join('');

  const accent = readable(g.accent);

  // Two-line titles start higher so the block below them stays put.
  const title = layoutTitle(g.title);
  const titleTop = title.lines.length > 1 ? 216 : 250;
  const titleBottom = titleTop + (title.lines.length - 1) * Math.round(title.size * 1.08);

  const card = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="tint" cx="14%" cy="0%" r="75%">
      <stop offset="0%" stop-color="${esc(accent)}" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="${esc(accent)}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#07080d"/>
  <rect width="${W}" height="${H}" fill="url(#tint)"/>

  <text x="182" y="128" font-family="${FONT}" font-size="19" font-weight="600"
        letter-spacing="4" fill="#6b7290">DANG QUANG MINH · UNITY DEVELOPER</text>

  ${title.lines
    .map(
      (line, i) => `<text x="72" y="${titleTop + i * Math.round(title.size * 1.08)}"
        font-family="${FONT}" font-size="${title.size}" font-weight="700"
        letter-spacing="-1.5" fill="#eceef6">${esc(line)}</text>`
    )
    .join('\n  ')}

  <text x="72" y="${titleBottom + 44}" font-family="${FONT}" font-size="27" fill="${esc(accent)}">${esc(g.genre)}</text>
  <text x="72" y="${titleBottom + 98}" font-family="${FONT}" font-size="23" fill="#969db6">${esc(g.developer)}</text>

  <rect x="72" y="440" width="600" height="1" fill="#1f2434"/>
  ${statSvg}

  <text x="72" y="596" font-family="${FONT}" font-size="18" fill="#4d5470">dangquangminh.vercel.app/games/${esc(g.slug)}</text>
</svg>`);

  // Icon top-left, then two phone shots down the right-hand side.
  const icon = await shot(path.join(ROOT, 'public', g.icon.src.slice(1)), 86);
  const gameLayers = [{ input: icon.buf, left: 72, top: 72 }];

  let gx = 700;
  for (const i of [1, 2]) {
    if (!g.shots[i]) continue;
    const s = await shot(path.join(ROOT, 'public', g.shots[i].src.slice(1)), 200);
    gameLayers.push({ input: s.buf, left: gx, top: i === 1 ? 120 : 170 });
    gx += s.w + 14;
  }

  const out = path.join(OG_DIR, `${g.slug}.png`);
  await sharp(card).composite(gameLayers).png({ compressionLevel: 9 }).toFile(out);
  console.log(`wrote public/og/${g.slug}.png`);
}
