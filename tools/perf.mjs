import { chromium } from 'playwright';
const b = await chromium.launch();
for (const p of ['index','lactrase','ueber-uns']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  let bytes = 0, reqs = 0, external = [];
  page.on('response', async r => {
    reqs++;
    const u = r.url();
    if (!u.startsWith('http://127.0.0.1:8000')) external.push(u);
    try { const h = r.headers()['content-length']; if (h) bytes += parseInt(h); } catch {}
  });
  await page.goto(`http://127.0.0.1:8000/${p}.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const m = await page.evaluate(() => new Promise(res => {
    let cls = 0, lcp = 0;
    new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => { const es = l.getEntries(); lcp = es[es.length-1].startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      res({ cls: +cls.toFixed(4), lcp: Math.round(lcp), dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd) });
    }, 1200);
  }));
  console.log(`${p}: ${reqs} Requests, ~${Math.round(bytes/1024)} KB, LCP ${m.lcp}ms, CLS ${m.cls}, DCL ${m.dcl}ms, load ${m.load}ms, extern: ${external.length ? external.join(',') : 'keine'}`);
  await ctx.close();
}
await b.close();
