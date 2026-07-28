/* Blöcke mit festen <br>-Zeilen (Adressen, Telefonblöcke) dürfen nicht auf
   Kante sitzen: sonst brechen sie in anderen Browsern mitten im Wort um. */
import { chromium } from 'playwright';
const PAGES = ['index','ueber-uns','lactrase','fructaid','oligase','impressum','datenschutz'];
const b = await chromium.launch();
const bad = [];
for (const name of PAGES) {
  for (const w of [1024, 1280, 1440, 1728]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(`http://127.0.0.1:8000/${name}.html`, { waitUntil: 'networkidle' });
    const out = await p.evaluate(() => {
      const res = [];
      for (const el of document.querySelectorAll('p, address, div')) {
        if (!el.querySelector('br') || el.querySelector('p, div, ul')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none') continue;
        const box = el.getBoundingClientRect().width;
        const probe = document.createElement('span');
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px';
        probe.style.font = cs.font; probe.style.letterSpacing = cs.letterSpacing;
        document.body.appendChild(probe);
        let need = 0, worst = '';
        for (const seg of el.innerHTML.split(/<br\s*\/?>/i)) {
          const t = document.createElement('div'); t.innerHTML = seg;
          probe.textContent = t.textContent.trim();
          if (probe.offsetWidth > need) { need = probe.offsetWidth; worst = probe.textContent; }
        }
        probe.remove();
        if (box - need < 12) res.push({ box: Math.round(box), need: Math.round(need), worst });
      }
      return res;
    });
    out.forEach(o => bad.push(`${name} @${w}: "${o.worst}" braucht ${o.need}px, Fläche ${o.box}px (Reserve ${o.box - o.need})`));
    await p.close();
  }
}
bad.forEach(l => console.log('  FAIL ' + l));
console.log(bad.length ? `\n${bad.length} ZEILEN AUF KANTE` : '\nZEILENBLOECKE OK (überall Reserve)');
await b.close();
process.exit(bad.length ? 1 : 0);
