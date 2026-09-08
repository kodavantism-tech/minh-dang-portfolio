/**
 * Prints /cv to a real PDF, one file per language.
 *
 *   npm run cv:pdf        (needs `npm run build` first)
 *
 * Why bother when the page already prints: a recruiter forwarding your CV
 * internally wants a file, not a URL and an instruction to press Ctrl+P. This
 * produces that file from the same page, so it can never say something the
 * site does not.
 *
 * The output lands in public/, which means it ships with the next deploy and
 * is downloadable at /dang-quang-minh-cv.pdf.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4321;
const BASE = `http://127.0.0.1:${PORT}`;

/** localStorage key read by components/Lang.tsx. */
const LANG_KEY = 'portfolio-lang';

const OUTPUTS = [
  { lang: 'en', file: 'dang-quang-minh-cv.pdf' },
  { lang: 'vi', file: 'dang-quang-minh-cv-vi.pdf' },
];

/**
 * Chromium stamps the exact second into /CreationDate and /ModDate, so two runs
 * of identical content produce different bytes and git sees a change every time.
 * Rounding both down to midnight makes the output reproducible within a day —
 * the CI job can then commit only when the CV actually changed.
 *
 * The replacement is the same length as the original, so byte offsets in the
 * xref table stay valid and the file needs no repair.
 */
async function roundTimestampsToTheDay(file) {
  const raw = await fs.readFile(file, 'latin1');
  const flattened = raw.replace(
    /D:(\d{8})\d{6}(\+00'00')/g,
    (_, day, tz) => `D:${day}000000${tz}`
  );
  if (flattened !== raw) await fs.writeFile(file, flattened, 'latin1');
}

/** Boots `next start` and resolves once it answers, so we never race the server. */
async function startServer() {
  const server = spawn('npx', ['next', 'start', '--port', String(PORT)], {
    cwd: ROOT,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${BASE}/cv`);
      if (r.ok) return server;
    } catch {
      /* not listening yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  server.kill();
  throw new Error('next start did not come up within 60s — did you run `npm run build`?');
}

const server = await startServer();
const browser = await chromium.launch();

try {
  for (const { lang, file } of OUTPUTS) {
    const context = await browser.newContext();
    // Set the language before any page script runs, so the CV renders in the
    // right language on first paint instead of flipping after hydration.
    await context.addInitScript(
      ([key, value]) => window.localStorage.setItem(key, value),
      [LANG_KEY, lang]
    );

    const page = await context.newPage();
    await page.goto(`${BASE}/cv`, { waitUntil: 'networkidle' });
    // Fonts load through next/font; printing before they land gives fallback metrics.
    await page.evaluate(() => document.fonts.ready);

    const out = path.join(ROOT, 'public', file);
    await page.pdf({
      path: out,
      printBackground: false,
      // Honour the `@page { size: A4; margin: ... }` rule in app/globals.css
      // rather than keeping a second copy of those numbers here.
      preferCSSPageSize: true,
    });

    await roundTimestampsToTheDay(out);

    const { size } = await fs.stat(out);
    console.log(`[ok] public/${file} (${lang}, ${(size / 1024).toFixed(0)} KB)`);
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}
