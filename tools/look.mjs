import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
await p.waitForTimeout(500);
// realistisches Scrollen in kleinen Schritten
const steps = [0,400,800,1100,1400,1700,2000,2300,2600,2900,3300,3800];
let prev = 0;
for (const y of steps) {
  for (let v = prev; v <= y; v += 60) { await p.evaluate(t => window.scrollTo(0, t), v); await p.waitForTimeout(16); }
  prev = y;
  await p.waitForTimeout(400);
  await p.screenshot({ path: `look-${String(y).padStart(4,'0')}.png` });
}
// dann wieder hoch
for (let v = prev; v >= 0; v -= 90) { await p.evaluate(t => window.scrollTo(0, t), v); await p.waitForTimeout(16); }
await p.waitForTimeout(600);
await p.screenshot({ path: 'look-zurueck.png' });
console.log(JSON.stringify(await p.evaluate(() => ({
  sichtbar: [...document.querySelectorAll('.ray')].map(e => e.style.strokeDasharray.split(' ')[2]),
  karten: [...document.querySelectorAll('.brand-card__img')].map(f => f.style.getPropertyValue('--rf')),
  zonen: [...document.querySelectorAll('.cta-banner__zone')].map(z => z.style.getPropertyValue('--rz'))
}))));
await b.close();
