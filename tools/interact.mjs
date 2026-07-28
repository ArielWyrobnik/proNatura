import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT = 'interact';
const BASE = 'http://127.0.0.1:8000';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const fail = [];
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fail.push(m); };

/* ---------------------------------------------- 1. Mobile navigation */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const toggle = page.locator('#navToggle');
  ok(await toggle.isVisible(), 'mobile: hamburger visible');
  ok(!(await page.locator('#primaryNav').evaluate(e => getComputedStyle(e).visibility === 'visible')), 'mobile: panel hidden initially');

  await toggle.click();
  await page.waitForTimeout(350);
  ok(await toggle.getAttribute('aria-expanded') === 'true', 'mobile: aria-expanded=true after open');
  ok(await page.locator('#primaryNav').evaluate(e => getComputedStyle(e).visibility === 'visible'), 'mobile: panel visible after open');
  ok(await page.evaluate(() => document.body.classList.contains('is-locked')), 'mobile: scroll lock active');
  await page.screenshot({ path: path.join(OUT, 'mobile-nav-open.png') });

  // brand submenu inside the panel
  await page.locator('#brandsTrigger').click();
  await page.waitForTimeout(250);
  ok(await page.locator('#brandsMenu').isVisible(), 'mobile: brand submenu opens');
  await page.screenshot({ path: path.join(OUT, 'mobile-nav-brands.png') });

  // Escape closes
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  ok(await toggle.getAttribute('aria-expanded') === 'false', 'mobile: Escape closes panel');
  ok(!(await page.evaluate(() => document.body.classList.contains('is-locked'))), 'mobile: scroll lock released');
  ok(await page.evaluate(() => document.activeElement && document.activeElement.id === 'navToggle'), 'mobile: focus returns to toggle');

  // backdrop click
  await toggle.click(); await page.waitForTimeout(300);
  await page.locator('.nav-backdrop').click({ position: { x: 200, y: 700 } });
  await page.waitForTimeout(300);
  ok(await toggle.getAttribute('aria-expanded') === 'false', 'mobile: backdrop click closes panel');

  await ctx.close();
}

/* ------------------------------------------- 2. Desktop brand dropdown */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const trig = page.locator('#brandsTrigger');
  ok(await trig.getAttribute('aria-expanded') === 'false', 'desktop: dropdown closed initially');
  ok(await trig.getAttribute('aria-controls') === 'brandsMenu', 'desktop: aria-controls wired');

  await trig.click(); await page.waitForTimeout(250);
  ok(await page.locator('#brandsMenu').isVisible(), 'desktop: dropdown opens on click');
  await page.screenshot({ path: path.join(OUT, 'desktop-dropdown.png') });

  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  ok(await trig.getAttribute('aria-expanded') === 'false', 'desktop: Escape closes dropdown');
  ok(await page.evaluate(() => document.activeElement.id === 'brandsTrigger'), 'desktop: focus returns to trigger');

  // keyboard: ArrowDown opens + focuses first item
  await trig.focus();
  await page.keyboard.press('ArrowDown'); await page.waitForTimeout(200);
  ok(await page.evaluate(() => document.activeElement.closest('#brandsMenu') !== null), 'desktop: ArrowDown moves into menu');
  await page.keyboard.press('ArrowDown'); await page.waitForTimeout(120);
  ok(await page.evaluate(() => document.activeElement.getAttribute('href') === 'oligase.html'), 'desktop: ArrowDown cycles items');

  // click outside closes
  await page.mouse.click(700, 600); await page.waitForTimeout(200);
  ok(await trig.getAttribute('aria-expanded') === 'false', 'desktop: outside click closes');

  // skip link (frischer Seitenaufruf, damit der Fokus am Dokumentanfang steht)
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(400);
  await page.keyboard.press('Tab'); await page.waitForTimeout(200);
  ok(await page.evaluate(() => document.activeElement.classList.contains('skip-link')), 'desktop: skip link is first tab stop');
  await page.screenshot({ path: path.join(OUT, 'skip-link.png') });

  // focus ring on a button
  await page.locator('.hero__cta .btn--primary').focus();
  await page.screenshot({ path: path.join(OUT, 'focus-button.png'), clip: { x: 120, y: 480, width: 600, height: 220 } });

  await ctx.close();
}

/* --------------------------------------------- 3. Anchor / scroll margin */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html#kontakt', { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const h = document.getElementById('header').getBoundingClientRect().height;
    const t = document.getElementById('kontakt').getBoundingClientRect().top;
    return { headerH: h, sectionTop: t };
  });
  ok(r.sectionTop >= r.headerH - 2, `anchor: #kontakt not hidden under header (top=${Math.round(r.sectionTop)}, header=${Math.round(r.headerH)})`);
  await page.screenshot({ path: path.join(OUT, 'anchor-kontakt.png') });
  await ctx.close();
}

/* ------------------------------------------------ 4. Formular-Validierung */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.locator('#contactForm').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.locator('#contactForm button[type=submit]').click();
  await page.waitForTimeout(300);
  ok(await page.locator('#name-error').isVisible(), 'form: empty required field shows error');
  ok(await page.locator('#name').getAttribute('aria-invalid') === 'true', 'form: aria-invalid set');
  ok(await page.evaluate(() => document.activeElement.id === 'name'), 'form: focus jumps to first invalid field');
  ok(await page.locator('#formStatus').evaluate(e => e.classList.contains('is-error')), 'form: error status shown');
  await page.locator('#contactForm').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, 'form-errors.png') });

  await page.fill('#name', 'Testperson');
  await page.waitForTimeout(150);
  ok(!(await page.locator('#name-error').isVisible()), 'form: error clears on valid input');

  await page.fill('#email', 'keine-email');
  await page.locator('#message').click();
  await page.waitForTimeout(200);
  ok(await page.locator('#email-error').isVisible(), 'form: invalid email flagged');
  const msg = await page.locator('#email-error span').textContent();
  ok(/E-Mail/.test(msg || ''), 'form: email error message is specific');

  await ctx.close();
}

/* --------------------------------------------------- 5. Reduced motion */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const st = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.brand-card')];
    const hidden = [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity === '0').length;
    /* Die Farbe liegt auf der Spill-Ebene: sie muss vollständig aufgedeckt sein. */
    const spills = [...document.querySelectorAll('.brand-card__spill')]
      .map(el => getComputedStyle(el).clipPath);
    return {
      lit: cards.every(c => c.classList.contains('is-lit')),
      spills,
      spillsOpen: spills.length === 3 && spills.every(c => /circle\(1[0-9]{2}(\.\d+)?%/.test(c)),
      hidden,
      bannerLit: document.querySelector('.cta-banner--waves').classList.contains('is-lit')
    };
  });
  ok(st.lit, 'reduced-motion: brand cards lit immediately');
  ok(st.spillsOpen, 'reduced-motion: Farbebene vollständig aufgedeckt (' + st.spills.join(' | ') + ')');
  ok(st.hidden === 0, 'reduced-motion: no content left invisible');
  ok(st.bannerLit, 'reduced-motion: distributor band lit');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, 'reduced-motion.png') });
  await ctx.close();
}

/* ---------------------------------------------------------- 6. Ohne JS */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const st = await page.evaluate(() => {
    const hidden = [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity === '0').length;
    const img = document.querySelector('.brand-card__img img');
    return {
      hidden,
      filter: getComputedStyle(img).filter,
      paintOn: document.documentElement.classList.contains('paint-on'),
      spills: document.querySelectorAll('.brand-card__spill').length,
      rays: getComputedStyle(document.querySelector('.rays')).display
    };
  });
  ok(st.hidden === 0, 'no-js: all content visible');
  ok(!st.paintOn && st.spills === 0, 'no-js: kein Farbaufbruch aufgebaut');
  ok(st.filter === 'none', 'no-js: brand photos in colour');
  ok(st.rays === 'none', 'no-js: rays hidden');
  await page.screenshot({ path: path.join(OUT, 'no-js.png'), fullPage: false });
  await ctx.close();
}

/* ---------------------------------------------- 7. Reload mitten drin */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html#marken', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const st = await page.evaluate(() => {
    const hidden = [...document.querySelectorAll('[data-reveal]')].filter(e => {
      const r = e.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0 && getComputedStyle(e).opacity === '0';
    }).length;
    return { hidden };
  });
  ok(st.hidden === 0, 'deep-link: nothing stuck invisible in viewport');
  await page.screenshot({ path: path.join(OUT, 'deeplink-marken.png') });
  await ctx.close();
}

/* -------------------------------------------- 8. Schnelles Auf/Ab-Scrollen */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(120);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(120);
  }
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(400);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.62));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'after-resize-scroll.png') });
  ok(errs.length === 0, 'stress: no page errors during fast scroll + resize (' + errs.join('; ') + ')');
  const geo = await page.evaluate(() => {
    const svg = document.querySelector('.rays svg');
    const vb = svg.getAttribute('viewBox');
    const w = document.querySelector('.rays').getBoundingClientRect().width;
    return { vb, w };
  });
  ok(Math.abs(parseFloat(geo.vb.split(' ')[2]) - geo.w) < 2, `stress: ray viewBox matches width after resize (${geo.vb} vs ${Math.round(geo.w)})`);
  await ctx.close();
}

/* ------------------------------------------- 9. Farbaufbruch am Einschlag */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await page.waitForTimeout(500);
  const before = await page.evaluate(() =>
    [...document.querySelectorAll('.brand-card')].map(c => c.classList.contains('is-lit')));
  ok(before.every(v => !v), 'spill: Karten starten unbeleuchtet');

  const origins = await page.evaluate(() =>
    [...document.querySelectorAll('.brand-card__img')].map(f => ({
      sx: f.style.getPropertyValue('--sx'), sy: f.style.getPropertyValue('--sy')
    })));
  ok(origins.length === 3 && origins.every(o => o.sx && o.sy),
     'spill: Ursprung je Karte gesetzt (' + origins.map(o => o.sx + '/' + o.sy).join(', ') + ')');
  ok(origins[1].sy !== '0.0%', 'spill: mittlere Karte wird seitlich getroffen');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.42));
  await page.waitForTimeout(1800);
  const after = await page.evaluate(() =>
    [...document.querySelectorAll('.brand-card')].map(c => c.classList.contains('is-lit')));
  ok(after.every(v => v), 'spill: alle Karten nach dem Einschlag beleuchtet');
  await page.screenshot({ path: path.join(OUT, 'spill-origins.png') });
  await ctx.close();
}

/* --- Strahlen: beim Laden noch nichts gezeichnet -------------------------- */
{
  for (const vp of [{ width: 1440, height: 900 }, { width: 1280, height: 800 }, { width: 1680, height: 1050 }]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const drawn = await page.evaluate(() => [...document.querySelectorAll('.ray')].map(el => {
      const len = el.getTotalLength();
      return +(len - parseFloat(el.style.strokeDashoffset || len)).toFixed(1);
    }));
    ok(drawn.length === 3 && drawn.every(v => v <= 2),
       `rays: bei scroll 0 noch nichts gezeichnet @${vp.width} (${drawn.join(', ')})`);
    await ctx.close();
  }
}

/* --- Kopfzeile darf sich nicht selbst aufblähen --------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const h = () => page.evaluate(() => document.getElementById('header').offsetHeight);
  const start = await h();
  for (let i = 0; i < 5; i++) {
    await page.setViewportSize({ width: 1120 + i * 90, height: 900 });
    await page.waitForTimeout(260);
  }
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(300);
  const end = await h();
  ok(end === start && start <= 72,
     `header: Höhe bleibt nach Resize + Scroll stabil (${start} → ${end})`);
  await ctx.close();
}

/* --- Kontaktspalten laufen beim Scrollen nicht auseinander ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  const pos = () => page.evaluate(() => {
    const a = document.querySelector('.contact__cards').getBoundingClientRect();
    const b = document.querySelector('.form').getBoundingClientRect();
    return { a: Math.round(a.top), b: Math.round(b.top) };
  });
  await page.evaluate(() => document.querySelector('#kontakt').scrollIntoView());
  /* Erst messen, wenn die Einblend-Animation beider Spalten durch ist –
     sonst misst man deren Transform statt des Scrollverhaltens. */
  await page.waitForTimeout(1400);
  const p1 = await pos();
  await page.evaluate(() => window.scrollBy(0, 260));
  await page.waitForTimeout(500);
  const p2 = await pos();
  ok(Math.abs((p1.a - p2.a) - (p1.b - p2.b)) <= 2,
     `contact: beide Spalten scrollen gleich (Δ links ${p1.a - p2.a}, Δ rechts ${p1.b - p2.b})`);
  const stickyPos = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.contact__cards')).position);
  ok(stickyPos !== 'sticky', `contact: linke Spalte klebt nicht (${stickyPos})`);
  await ctx.close();
}

/* --- Distributor-Band: jedes Abteil bricht einzeln auf -------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await page.waitForTimeout(400);
  const zonesBefore = await page.evaluate(() =>
    [...document.querySelectorAll('.cta-banner__zone')].map(z => z.classList.contains('is-lit')));
  ok(zonesBefore.length === 3 && zonesBefore.every(v => !v), 'band: Abteile starten unbeleuchtet');

  await page.evaluate(() => document.querySelector('.cta-banner').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(1800);
  const zones = await page.evaluate(() =>
    [...document.querySelectorAll('.cta-banner__zone')].map(z => ({
      lit: z.classList.contains('is-lit'),
      sx: z.style.getPropertyValue('--sx')
    })));
  ok(zones.every(z => z.lit), 'band: alle drei Abteile beleuchtet');
  const xs = zones.map(z => parseFloat(z.sx));
  ok(xs.every(v => !isNaN(v)) && xs[0] < xs[1] && xs[1] < xs[2],
     `band: jeder Faden trifft sein eigenes Abteil (${zones.map(z => z.sx).join(', ')})`);
  await page.screenshot({ path: path.join(OUT, 'band-zones.png') });
  await ctx.close();
}

await browser.close();
console.log(fail.length ? `\n${fail.length} FAILURE(S)` : '\nALL INTERACTION CHECKS PASSED');
process.exit(fail.length ? 1 : 0);
