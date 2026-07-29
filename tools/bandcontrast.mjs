/* Misst den echten Kontrast des weißen Bandtextes gegen die gerenderten
   Pixel dahinter – nicht gerechnet, sondern aus dem Screenshot gelesen. */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'fs';
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const b = await chromium.launch();
let worst = 99, wo = '';
for (const [page, widths] of [['/index.html', [360, 390, 600, 768, 899, 900, 1100, 1280, 1440, 1728]],
     ['/en/index.html', [390, 768, 899, 900, 1280, 1440]]])
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('http://127.0.0.1:8000' + page, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  /* Abteile voll aufdecken, damit die Endfarbe gemessen wird. */
  await p.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-visible'));
    document.querySelectorAll('.cta-banner__zone').forEach(z => z.style.setProperty('--rz', '165%'));
  });
  await p.evaluate(() => document.querySelector('.cta-banner').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(600);
  const box = await p.evaluate(() => {
    const r = document.querySelector('.cta-banner__text').getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  });
  /* Den Text kurz ausblenden und genau denselben Ausschnitt aufnehmen –
     so wird wirklich der Hintergrund gemessen und nicht die Kantenglättung
     der weißen Schrift. */
  await p.evaluate(() => { document.querySelector('.cta-banner__text').style.visibility = 'hidden'; });
  await p.waitForTimeout(120);
  await p.screenshot({ path: 'bc.png', clip: box });
  await p.evaluate(() => { document.querySelector('.cta-banner__text').style.visibility = ''; });
  const png = PNG.sync.read(fs.readFileSync('bc.png'));
  /* Der hellste Hintergrundpixel ist der schlechteste Fall für weiße Schrift. */
  let maxL = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    maxL = Math.max(maxL, L(png.data[i], png.data[i + 1], png.data[i + 2]));
  }
  const ratio = 1.05 / (maxL + 0.05);
  if (ratio < worst) { worst = ratio; wo = `${page} @${w}`; }
  console.log(`${page.padEnd(16)} ${String(w).padStart(4)}px  hellster Hintergrund hinter dem Text → Kontrast ${ratio.toFixed(2)}:1  ${ratio >= 4.5 ? 'ok' : 'ZU WENIG'}`);
  await p.close();
}
fs.unlinkSync('bc.png');
await b.close();
console.log(`\nschlechtester Wert ${worst.toFixed(2)}:1 (${wo}) – AA verlangt 4,5:1`);
process.exit(worst >= 4.5 ? 0 : 1);
