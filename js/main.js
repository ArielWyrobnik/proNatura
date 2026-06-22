/* =========================================================================
   Pro Natura — main.js
   Header-Scroll, Mobile-Menü, Scroll-Reveal, Kontaktformular, Jahr
   Kein Framework, keine Abhängigkeiten.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------- Sticky header on scroll */
  var header = document.getElementById('header');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var y = window.scrollY;
    if (y > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    // Hero füllt nur beim Laden den ganzen Bildschirm und schrumpft beim
    // ersten Scrollen EINMALIG auf normale Höhe (kein Wieder-Aufklappen oben).
    if (hero && y > 12) hero.classList.add('is-collapsed');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------- Mobile menu */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    // Close when a link is tapped
    nav.querySelectorAll('.nav__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------- Scroll reveal */
  var revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealItems.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just show everything
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------- Contact form (mailto) */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var name = (document.getElementById('name').value || '').trim();
      var email = (document.getElementById('email').value || '').trim();
      var subject = (document.getElementById('subject').value || 'Anfrage über die Website').trim();
      var message = (document.getElementById('message').value || '').trim();

      var body = 'Name: ' + name + '\nE-Mail: ' + email + '\n\n' + message;
      var href = 'mailto:info@pro-natura-gmbh.de'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      window.location.href = href;

      var status = document.getElementById('formStatus');
      if (status) status.classList.add('is-ok');
      form.reset();
    });
  }

  /* ------------------------------------------------------- Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/* =========================================================================
   Produkt-Strahlen: farbige Linien sprießen aus den Produkten, folgen dem
   Scroll, laufen durch die Marken-Karten und „beleuchten" am Ende den
   Distributor-Block (schwarz -> Farben). Pfade an echte Positionen gebunden.
   ========================================================================= */
(function () {
  'use strict';
  var main = document.getElementById('top');
  var wrap = document.querySelector('.rays');
  if (!main || !wrap) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var svg = wrap.querySelector('svg');
  var rays = {
    lactrase: svg.querySelector('.ray--lactrase'),
    oligase: svg.querySelector('.ray--oligase'),
    fructaid: svg.querySelector('.ray--fructaid')
  };
  var heroImg = document.querySelector('.hero__image img');
  var cards = document.querySelectorAll('.brand-card'); // 0=Lactrase, 1=Oligase, 2=Fructaid
  var distrib = document.querySelector('.cta-banner--waves');
  if (!heroImg || cards.length < 3 || !distrib) return;

  function rel(el) {
    var m = main.getBoundingClientRect();
    var r = el.getBoundingClientRect();
    return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height,
             cx: r.left - m.left + r.width / 2 };
  }

  function mkPath(p1, p2, p3) {
    var d1 = p2.y - p1.y, d2 = p3.y - p2.y;
    function n(v) { return v.toFixed(1); }
    return 'M' + n(p1.x) + ' ' + n(p1.y)
      + ' C' + n(p1.x) + ' ' + n(p1.y + d1 * 0.45) + ' ' + n(p2.x) + ' ' + n(p2.y - d1 * 0.45) + ' ' + n(p2.x) + ' ' + n(p2.y)
      + ' C' + n(p2.x) + ' ' + n(p2.y + d2 * 0.45) + ' ' + n(p3.x) + ' ' + n(p3.y - d2 * 0.45) + ' ' + n(p3.x) + ' ' + n(p3.y);
  }

  function build() {
    var m = main.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + Math.round(m.width) + ' ' + Math.round(m.height));
    var h = rel(heroImg), c0 = rel(cards[0]), c1 = rel(cards[1]), c2 = rel(cards[2]), d = rel(distrib);
    var hy = h.y + h.h * 0.60;
    var heroL = { x: h.x + h.w * 0.30, y: hy }; // Fructaid links
    var heroC = { x: h.x + h.w * 0.50, y: hy }; // Lactrase mitte
    var heroR = { x: h.x + h.w * 0.72, y: hy }; // Oligase rechts
    function cardA(c) { return { x: c.cx, y: c.y + c.h * 0.20 }; }
    var dy = d.y + d.h * 0.5;
    var dL = { x: d.x + d.w / 6, y: dy }, dM = { x: d.x + d.w / 2, y: dy }, dR = { x: d.x + d.w * 5 / 6, y: dy };
    rays.lactrase.setAttribute('d', mkPath(heroC, cardA(c0), dL));
    rays.oligase.setAttribute('d', mkPath(heroR, cardA(c1), dM));
    rays.fructaid.setAttribute('d', mkPath(heroL, cardA(c2), dR));
    ['lactrase', 'oligase', 'fructaid'].forEach(function (k) {
      var p = rays[k], len = p.getTotalLength();
      p._len = len; p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    });
    update();
  }

  function update() {
    var mRect = main.getBoundingClientRect();
    var distPageY = mRect.top + window.scrollY + rel(distrib).y;
    var end = distPageY - window.innerHeight * 0.6;
    var prog = end > 0 ? Math.min(1, Math.max(0, window.scrollY / end)) : 1;
    ['lactrase', 'oligase', 'fructaid'].forEach(function (k) {
      var p = rays[k]; if (p._len != null) p.style.strokeDashoffset = (p._len * (1 - prog)).toFixed(1);
    });
    if (prog > 0.9) distrib.classList.add('is-lit'); else distrib.classList.remove('is-lit');
    // Marken-Fotos einfärben, sobald ein Strahl die Karte erreicht (in den Viewport scrollt)
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getBoundingClientRect().top < window.innerHeight * 0.72) cards[i].classList.add('is-lit');
      else cards[i].classList.remove('is-lit');
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(function () { update(); ticking = false; }); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', build);
  window.addEventListener('load', build);
  if (heroImg.complete) build(); else heroImg.addEventListener('load', build);
  var heroSec = document.querySelector('.hero');
  if (heroSec) heroSec.addEventListener('transitionend', function (e) { if (e.propertyName === 'min-height') build(); });
  setTimeout(build, 400);
  build();
})();
