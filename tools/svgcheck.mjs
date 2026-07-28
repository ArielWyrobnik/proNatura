import { chromium } from 'playwright';
const pages = ['index','ueber-uns','lactrase','fructaid','oligase','impressum','datenschutz'];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
let bad = 0;
for (const p of pages) {
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:8000/${p}.html`, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const out = await page.evaluate(() => {
    const res = [];
    document.querySelectorAll('svg').forEach(s => {
      if (s.closest('.rays')) return;
      const r = s.getBoundingClientRect();
      if (r.width > 64 || r.height > 64) res.push(`${s.parentElement.tagName}.${s.parentElement.className} ${Math.round(r.width)}x${Math.round(r.height)}`);
    });
    // also: images without alt, headings order
    const noAlt = [...document.querySelectorAll('img:not([alt])')].map(i => i.src);
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
    const jumps = [];
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i-1] > 1) jumps.push(`${hs[i-1]}→${hs[i]}`);
    const h1s = document.querySelectorAll('h1').length;
    // labels
    const unlabeled = [...document.querySelectorAll('input,select,textarea')]
      .filter(e => !e.labels || e.labels.length === 0).map(e => e.id || e.name);
    return { res, noAlt, jumps, h1s, unlabeled };
  });
  const flags = [];
  if (out.res.length) { flags.push('BIG SVG: ' + out.res.join(', ')); bad++; }
  if (out.noAlt.length) { flags.push('IMG OHNE ALT: ' + out.noAlt.join(', ')); bad++; }
  if (out.jumps.length) { flags.push('HEADING JUMP: ' + out.jumps.join(', ')); bad++; }
  if (out.h1s !== 1) { flags.push('H1 COUNT: ' + out.h1s); bad++; }
  if (out.unlabeled.length) { flags.push('FELD OHNE LABEL: ' + out.unlabeled.join(', ')); bad++; }
  console.log(`${p}: ${flags.length ? '❌ ' + flags.join(' | ') : 'ok'}`);
  await page.close();
}
await b.close();
process.exit(bad ? 1 : 0);
