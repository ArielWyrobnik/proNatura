/* Deutsche und englische Fassung dürfen strukturell nicht auseinanderlaufen.
   Verglichen wird das Gerüst, nicht der Text: Anzahl und Verschachtelung der
   Abschnitte, Überschriftenebenen, Formularfelder, Bilder, Links nach außen.
   Dazu die Verweise: jede Seite muss auf ihr Gegenstück zeigen und der
   Sprachumschalter muss die richtige Seite als aktiv markieren. */
import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:8000';
const PAIRS = [
  ['/index.html', '/en/index.html'],
  ['/ueber-uns.html', '/en/about.html'],
  ['/lactrase.html', '/en/lactrase.html'],
  ['/fructaid.html', '/en/fructaid.html'],
  ['/oligase.html', '/en/oligase.html'],
  ['/impressum.html', '/en/imprint.html'],
  ['/datenschutz.html', '/en/privacy.html'],
];
const browser = await chromium.launch();
const fail = [];
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fail.push(m); };

const shape = (page) => page.evaluate(() => {
  const main = document.querySelector('main');
  const count = (sel, root = document) => root.querySelectorAll(sel).length;
  return {
    lang: document.documentElement.lang,
    sections: count('main section'),
    h1: count('main h1'), h2: count('main h2'), h3: count('main h3'),
    ebene: [...main.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName).join(','),
    bilder: count('main img'),
    felder: count('main input, main select, main textarea'),
    navLinks: count('.primary-nav a'),
    footerLinks: count('.site-footer a'),
    umschalter: [...document.querySelectorAll('.lang-switch a')].map(a => ({
      text: a.textContent.trim(), href: a.getAttribute('href'),
      aktiv: a.getAttribute('aria-current') === 'true'
    })),
    alternates: [...document.querySelectorAll('link[rel="alternate"]')]
      .map(l => l.getAttribute('hreflang') + '→' + l.getAttribute('href')),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
  };
});

for (const [de, en] of PAIRS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p1 = await ctx.newPage(); await p1.goto(BASE + de, { waitUntil: 'load' });
  const p2 = await ctx.newPage(); await p2.goto(BASE + en, { waitUntil: 'load' });
  const a = await shape(p1), b = await shape(p2);
  const name = de.replace(/^\//, '');

  ok(a.lang === 'de' && b.lang === 'en', `${name}: lang de/en (${a.lang}/${b.lang})`);
  for (const k of ['sections', 'h1', 'h2', 'h3', 'bilder', 'felder', 'navLinks', 'footerLinks']) {
    ok(a[k] === b[k], `${name}: gleiche Anzahl ${k} (${a[k]} / ${b[k]})`);
  }
  ok(a.ebene === b.ebene, `${name}: gleiche Überschriftenfolge`);
  ok(a.umschalter.length === 2 && b.umschalter.length === 2, `${name}: Umschalter hat zwei Sprachen`);
  ok(a.umschalter[0].aktiv && !a.umschalter[1].aktiv, `${name}: DE markiert sich als aktiv`);
  ok(!b.umschalter[0].aktiv && b.umschalter[1].aktiv, `${name}: EN markiert sich als aktiv`);
  ok(a.alternates.length === 3 && b.alternates.length === 3,
     `${name}: je drei hreflang-Verweise (${a.alternates.length}/${b.alternates.length})`);
  ok(JSON.stringify(a.alternates) === JSON.stringify(b.alternates),
     `${name}: beide Fassungen nennen dieselben Alternativen`);
  ok(a.canonical !== b.canonical && !!a.canonical && !!b.canonical,
     `${name}: eigenes canonical je Fassung`);

  /* Der Umschalter muss tatsächlich zum Gegenstück führen. */
  const zielDe = new URL(b.umschalter[0].href, BASE + en).pathname;
  const zielEn = new URL(a.umschalter[1].href, BASE + de).pathname;
  ok(zielDe === de, `${name}: EN-Seite verlinkt zurück auf ${de} (${zielDe})`);
  ok(zielEn === en, `${name}: DE-Seite verlinkt auf ${en} (${zielEn})`);
  await ctx.close();
}
await browser.close();
console.log(fail.length ? `\n${fail.length} FAILURE(S)` : '\nSPRACHFASSUNGEN DECKUNGSGLEICH');
process.exit(fail.length ? 1 : 0);
