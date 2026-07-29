import { chromium } from 'playwright';
const pages = ['index','ueber-uns','lactrase','fructaid','oligase','impressum','datenschutz',
  'en/index','en/about','en/lactrase','en/fructaid','en/oligase','en/imprint','en/privacy'];
const b = await chromium.launch();
let bad = 0;
const AUDIT = `(() => {
  function srgb(c){c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
  function lum(rgb){const m=rgb.match(/\\d+(\\.\\d+)?/g).map(Number);
    return 0.2126*srgb(m[0])+0.7152*srgb(m[1])+0.0722*srgb(m[2]);}
  function alpha(rgb){const m=rgb.match(/\\d+(\\.\\d+)?/g).map(Number);return m.length>3?m[3]:1;}
  function bgOf(el){
    let n=el;
    while(n && n!==document.documentElement){
      const s=getComputedStyle(n);
      if(alpha(s.backgroundColor)>0.85) return s.backgroundColor;
      if(s.backgroundImage!=='none') return null; // Verlauf/Bild -> manuell prüfen
      n=n.parentElement;
    }
    return 'rgb(255,255,255)';
  }
  const out=[];
  document.querySelectorAll('p,span,a,li,h1,h2,h3,h4,h5,h6,label,strong,b,dt,dd,small,button,figcaption,address').forEach(el=>{
    if(!el.textContent.trim()) return;
    if(el.children.length && ![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) return;
    const s=getComputedStyle(el);
    if(s.visibility==='hidden'||s.display==='none') return;
    const r=el.getBoundingClientRect();
    if(r.width===0||r.height===0) return;
    const bg=bgOf(el); if(!bg) return;
    const fg=s.color;
    if(alpha(fg)<0.999){ /* transparente Schrift -> überspringen */ }
    const L1=lum(fg),L2=lum(bg);
    const ratio=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    const px=parseFloat(s.fontSize);
    const w=parseInt(s.fontWeight)||400;
    const large = px>=24 || (px>=18.66 && w>=700);
    const need = large?3:4.5;
    if(ratio < need - 0.02){
      out.push(el.tagName+'.'+String(el.className).slice(0,28)+' '+px.toFixed(0)+'px w'+w+' '+fg+' auf '+bg+' = '+ratio.toFixed(2)+' (min '+need+') "'+el.textContent.trim().slice(0,32)+'"');
    }
  });
  return [...new Set(out)];
})()`;
for (const p of pages) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:8000/${p}.html`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  // alles sichtbar machen, damit auch reveal-Inhalte geprüft werden
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-visible')));
  await page.waitForTimeout(200);
  const res = await page.evaluate(AUDIT);
  console.log(`--- ${p}: ${res.length ? res.length + ' Befunde' : 'ok'}`);
  res.slice(0,12).forEach(r => console.log('    ' + r));
  bad += res.length;
  await ctx.close();
}
await b.close();
console.log(bad ? `\nGESAMT ${bad}` : '\nKONTRAST OK');
