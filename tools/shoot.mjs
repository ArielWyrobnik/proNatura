import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT = process.argv[2] || 'shots';
const BASE = 'http://127.0.0.1:8000';

const PAGES = [
  ['index', '/index.html'],
  ['ueber-uns', '/ueber-uns.html'],
  ['lactrase', '/lactrase.html'],
  ['fructaid', '/fructaid.html'],
  ['oligase', '/oligase.html'],
  ['impressum', '/impressum.html'],
  ['datenschutz', '/datenschutz.html'],
  ['en-index', '/en/index.html'],
  ['en-about', '/en/about.html'],
  ['en-lactrase', '/en/lactrase.html'],
  ['en-fructaid', '/en/fructaid.html'],
  ['en-oligase', '/en/oligase.html'],
  ['en-imprint', '/en/imprint.html'],
  ['en-privacy', '/en/privacy.html'],
];

const VIEWPORTS = [
  ['375x812', 375, 812],
  ['390x844', 390, 844],
  ['768x1024', 768, 1024],
  ['1024x768', 1024, 768],
  ['1280x800', 1280, 800],
  ['1440x900', 1440, 900],
  ['1728x1117', 1728, 1117],
];

const only = process.env.ONLY_VP ? process.env.ONLY_VP.split(',') : null;
const onlyPages = process.env.ONLY_PAGES ? process.env.ONLY_PAGES.split(',') : null;

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const report = [];

for (const [vpName, w, h] of VIEWPORTS) {
  if (only && !only.includes(vpName)) continue;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  for (const [name, url] of PAGES) {
    if (onlyPages && !onlyPages.includes(name)) continue;
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // metrics
    const m0 = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      scrollH: document.documentElement.scrollHeight,
    }));

    // top
    await page.screenshot({ path: path.join(OUT, `${vpName}__${name}__1-top.png`) });

    // scroll through in steps, then capture middle + bottom
    const steps = 14;
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((f) => window.scrollTo(0, (document.body.scrollHeight - window.innerHeight) * f), i / steps);
      await page.waitForTimeout(90);
    }
    await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight - window.innerHeight) * 0.42));
    await page.waitForTimeout(1100);
    await page.screenshot({ path: path.join(OUT, `${vpName}__${name}__2-mid.png`) });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1100);
    await page.screenshot({ path: path.join(OUT, `${vpName}__${name}__3-bottom.png`) });

    const m1 = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));

    // overflow offenders
    let offenders = [];
    if (m1.scrollW > m1.clientW + 1) {
      offenders = await page.evaluate(() => {
        const out = [];
        const cw = document.documentElement.clientWidth;
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > cw + 1 || r.left < -1)) {
            out.push(`${el.tagName}.${el.className && String(el.className).slice(0, 40)} L${Math.round(r.left)} R${Math.round(r.right)}`);
          }
        });
        return out.slice(0, 15);
      });
    }

    report.push({ vp: vpName, page: name, ...m0, afterScrollW: m1.scrollW, overflow: m1.scrollW > m1.clientW + 1, offenders, errors });
    await page.close();
  }
  await ctx.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
for (const r of report) {
  const flags = [];
  if (r.overflow) flags.push(`OVERFLOW ${r.afterScrollW}>${r.clientW} :: ${r.offenders.join(' | ')}`);
  if (r.errors.length) flags.push(`ERRORS: ${r.errors.join(' | ')}`);
  console.log(`${r.vp} ${r.page} h=${r.scrollH} ${flags.length ? '❌ ' + flags.join(' ;; ') : 'ok'}`);
}
