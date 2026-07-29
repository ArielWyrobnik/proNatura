import { chromium } from 'playwright';
const pages = ['index','ueber-uns','lactrase','fructaid','oligase','impressum','datenschutz',
  'en/index','en/about','en/lactrase','en/fructaid','en/oligase','en/imprint','en/privacy'];
const b = await chromium.launch();
let bad = 0;
for (const p of pages) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:8000/${p}.html`, { waitUntil: 'load' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-visible')));
  await page.waitForTimeout(400);
  const small = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('a[href], button, input, select, textarea').forEach(el => {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return;
      if (el.closest('.skip-link') || el.classList.contains('skip-link')) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      // Inline-Links im Fließtext sind ausgenommen (WCAG 2.5.8 Ausnahme)
      const inlineInText = el.tagName === 'A' && (el.closest('p') || el.closest('label'));
      if (inlineInText) return;
      if (r.height < 24 || r.width < 24) out.push(`${el.tagName}.${String(el.className).slice(0,26)} ${Math.round(r.width)}x${Math.round(r.height)} "${el.textContent.trim().slice(0,22)}"`);
    });
    return [...new Set(out)];
  });
  console.log(`${p}: ${small.length ? '❌ ' + small.join(' | ') : 'ok'}`);
  bad += small.length;
  await ctx.close();
}
await b.close();
console.log(bad ? `GESAMT ${bad}` : 'TOUCH-TARGETS OK');
