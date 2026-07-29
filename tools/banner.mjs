/* Der weiße Text im Distributor-Band darf nie auf einem hellen Abteil
   stehen. Weiß auf Oligase-Grün #407740 = 5,3:1 (AA); auf Lactrase-Blau
   #3ab3e0 = 2,5:1 und auf Fructaid-Lime noch schlechter.

   Es gibt zwei erlaubte Zustände:
     a) mehrere Abteile sichtbar → der Text muss links der Wellenkante enden
        (linkeste Stelle der Kante: 600/1200 = 50 % der Bandbreite),
     b) nur ein Abteil sichtbar  → es muss das dunkle Oligase-Feld sein.
   Zustand b gilt unter 900 px, wo der Textblock über die volle Breite läuft. */
import { chromium } from 'playwright';
const KANTE = 0.50;
const b = await chromium.launch();
const bad = [];
for (const w of [360, 390, 480, 600, 768, 820, 899, 900, 1000, 1100, 1280, 1440, 1600, 1728, 1920]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const band = document.querySelector('.cta-banner').getBoundingClientRect();
    let right = 0;
    for (const el of document.querySelectorAll('.cta-banner__text h2, .cta-banner__text p')) {
      const range = document.createRange(); range.selectNodeContents(el);
      for (const line of range.getClientRects()) right = Math.max(right, line.right);
    }
    const sichtbar = [...document.querySelectorAll('.cta-banner__zone')]
      .filter(z => getComputedStyle(z).display !== 'none')
      .map(z => (z.className.match(/zone--(\w+)/) || [])[1]);
    return { anteil: (right - band.left) / band.width, sichtbar };
  });
  let okk, wie;
  if (r.sichtbar.length === 1) {
    okk = r.sichtbar[0] === 'oligase';
    wie = `ein Abteil (${r.sichtbar[0]})`;
  } else {
    okk = r.anteil < KANTE - 0.02;
    wie = `${r.sichtbar.length} Abteile, Text bis ${(r.anteil * 100).toFixed(1)} % (Kante ${KANTE * 100} %)`;
  }
  console.log(`${String(w).padStart(4)}px → ${wie} ${okk ? 'ok' : '❌ WEISS AUF HELL'}`);
  if (!okk) bad.push(w);
  await p.close();
}
console.log(bad.length ? `\n${bad.length} Breiten mit weißem Text auf hellem Abteil` : '\nBANNERTEXT STEHT ÜBERALL DUNKEL');
await b.close();
process.exit(bad.length ? 1 : 0);
