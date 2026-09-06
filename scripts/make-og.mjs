/**
 * Builds app/opengraph-image.png — the card people see when the portfolio URL
 * is pasted into Slack / Messenger / LinkedIn. Regenerate with:
 *   node scripts/make-og.mjs
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
