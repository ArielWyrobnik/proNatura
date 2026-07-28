import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });
const m = await p.evaluate(() => {
  const main = document.querySelector('main').getBoundingClientRect();
  const rel = (s) => { const n = document.querySelector(s); if (!n) return null;
    const r = n.getBoundingClientRect();
    return { x: Math.round(r.left - main.left), y: Math.round(r.top + scrollY - main.top - scrollY), w: Math.round(r.width), h: Math.round(r.height),
             right: Math.round(r.right - main.left), bottom: Math.round(r.top - main.top + r.height) }; };
  const cards = [...document.querySelectorAll('.brand-card')].map(c => { const r = c.getBoundingClientRect();
    return { x: Math.round(r.left - main.left), y: Math.round(r.top - main.top), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right-main.left), bottom: Math.round(r.top-main.top+r.height) }; });
  const lead = document.querySelector('[data-rays-lead]');
  const kids = lead ? [...lead.children].map(k => { const r = k.getBoundingClientRect();
    return { x: Math.round(r.left-main.left), right: Math.round(r.right-main.left), y: Math.round(r.top-main.top), bottom: Math.round(r.top-main.top+r.height) }; }) : [];
  const zi = (s) => { const n = document.querySelector(s); if(!n) return null; const cs=getComputedStyle(n); return cs.position+' / z:'+cs.zIndex; };
  return { W: Math.round(main.width), H: Math.round(main.height),
    hero: rel('.hero__image img'), heroCopy: rel('.hero__copy'), trust: rel('.trust-bar'),
    head: rel('#marken .section-head'), grid: rel('.brand-grid'), cards, lead: rel('[data-rays-lead]'), kids,
    banner: rel('.cta-banner'), headerH: getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
    ziImg: zi('.media-split__img'), ziSplit: zi('[data-rays-lead]'), ziCard: zi('.brand-card'), ziSection: zi('#marken') };
});
console.log(JSON.stringify(m, null, 1));
await b.close();
