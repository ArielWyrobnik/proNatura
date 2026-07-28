/* Der weiße Text im Distributor-Band muss in jeder Breite im dunklen
   Oligase-Abteil bleiben. Die Wellenkante liegt an ihrer linkesten Stelle
   bei 600/1200 = 50 % der Bandbreite. Weiß auf #407740 = 5,3:1 (AA);
   auf Lactrase-Blau oder Fructaid-Lime wäre es unlesbar. */
import { chromium } from 'playwright';
const KANTE = 0.50;
const b = await chromium.launch();
const bad = [];
for (const w of [900, 1000, 1100, 1280, 1440, 1600, 1728, 1920]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const band = document.querySelector('.cta-banner').getBoundingClientRect();
    let right = 0;
    for (const el of document.querySelectorAll('.cta-banner__text h2, .cta-banner__text p')) {
      const range = document.createRange(); range.selectNodeContents(el);
      for (const line of range.getClientRects()) right = Math.max(right, line.right);
    }
    return { anteil: (right - band.left) / band.width };
  });
  const okk = r.anteil < KANTE - 0.02;
  console.log(`${w}px → Text endet bei ${(r.anteil * 100).toFixed(1)} % der Bandbreite ` +
              `(Kante ${KANTE * 100} %) ${okk ? 'ok' : 'ZU WEIT'}`);
  if (!okk) bad.push(w);
  await p.close();
}
console.log(bad.length ? `\n${bad.length} Breiten mit Text im hellen Abteil` : '\nBANNERTEXT BLEIBT IM DUNKLEN ABTEIL');
await b.close();
process.exit(bad.length ? 1 : 0);
