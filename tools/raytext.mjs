import { chromium } from 'playwright';
import fs from 'fs';

const VPS = (process.env.VPS || '1024x800,1280x800,1440x900,1728x1117').split(',').map(s=>s.split('x').map(Number));
const b = await chromium.launch();
let total = 0;
for (const [w,h] of VPS) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'load' });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}.ray{stroke:#ff00ff !important;stroke-width:7 !important;opacity:1 !important}' });
  await p.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-visible')));
  // Pfade vollständig zeichnen
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(800);

  const pageH = await p.evaluate(() => document.body.scrollHeight);
  const hits = [];
  for (let top = 0; top < pageH; top += h - 80) {
    await p.evaluate((y) => window.scrollTo(0, y), top);
    await p.waitForTimeout(400);
    const shot = `rt-${w}-${top}.png`;
    await p.screenshot({ path: shot });
    const boxes = await p.evaluate(() => {
      const out = [];
      const sel = 'h1,h2,h3,h4,p,span,li,a,label,strong,b,dt,dd,small,button,input,select,textarea';
      document.querySelectorAll(sel).forEach(el => {
        if (el.closest('.site-header') || el.closest('.site-footer')) return;
        const t = el.textContent && el.textContent.trim();
        if (!t && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.tagName !== 'SELECT') return;
        if (el.children.length && ![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) return;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;
        if (r.bottom < 4 || r.top > window.innerHeight - 4) return;
        out.push({ x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)),
                   w: Math.round(r.width), h: Math.round(r.height),
                   tag: el.tagName, cls: String(el.className).slice(0,24), txt: (t||'').slice(0,26) });
      });
      return out;
    });
    fs.writeFileSync(`rt-${w}-${top}.json`, JSON.stringify({shot, boxes}));
  }
  await p.close();
}
await b.close();
console.log('shots geschrieben');
