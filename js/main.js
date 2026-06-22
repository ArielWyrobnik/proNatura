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

  function fmt(v) { return v.toFixed(1); }

  function mkPath(points) {
    if (!points.length) return '';
    var d = 'M' + fmt(points[0].x) + ' ' + fmt(points[0].y);
    for (var i = 1; i < points.length; i++) {
      var a = points[i - 1], b = points[i];
      var dx = b.x - a.x, dy = b.y - a.y;
      // Smooth vertical ribbons without forcing a straight drop through content.
      d += ' C' + fmt(a.x + dx * 0.18) + ' ' + fmt(a.y + dy * 0.52)
        + ' ' + fmt(b.x - dx * 0.18) + ' ' + fmt(b.y - dy * 0.52)
        + ' ' + fmt(b.x) + ' ' + fmt(b.y);
    }
    return d;
  }

  function progressAtY(startY, endY) {
    return Math.min(1, Math.max(0, (window.scrollY - startY) / Math.max(1, endY - startY)));
  }

  var hasArrived = false;

  function build() {
    var m = main.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + Math.round(m.width) + ' ' + Math.round(m.height));
    var h = rel(heroImg), c0 = rel(cards[0]), c1 = rel(cards[1]), c2 = rel(cards[2]), d = rel(distrib);

    // Startpunkte liegen sehr tief am Composite, damit keine Linie in den
    // transparenten Zwischenräumen der Packshots wie „aus der Mitte” austritt.
    var startY = h.y + h.h * 0.91;
    var heroL = { x: h.x + h.w * 0.30, y: startY };
    var heroC = { x: h.x + h.w * 0.53, y: startY };
    var heroR = { x: h.x + h.w * 0.74, y: startY };
    function cardA(c) { return { x: c.cx, y: c.y + c.h * 0.12 }; }
    function below(c) { return { x: c.cx, y: c.y + c.h + Math.min(80, c.h * 0.18) }; }
    var dy = d.y + d.h * 0.54;
    var dL = { x: d.x + d.w / 6, y: dy }, dM = { x: d.x + d.w / 2, y: dy }, dR = { x: d.x + d.w * 5 / 6, y: dy };
    var offLeft = -90;
    var offRight = m.width + 90;
    var reentryY = d.y - 34;

    // Die Mission-Sektion bleibt frei: Nach den Karten werden die Strahlen in
    // einem kurzen Bogen aus dem sichtbaren Bereich geführt und tauchen erst
    // direkt über dem Distributor-Balken wieder auf.
    rays.lactrase.setAttribute('d',
      mkPath([heroC, cardA(c0), below(c0), { x: offLeft, y: below(c0).y + 110 }])
      + ' ' + mkPath([{ x: offLeft, y: reentryY }, { x: dL.x, y: d.y + 6 }, dL]));
    rays.oligase.setAttribute('d',
      mkPath([heroR, cardA(c1), below(c1), { x: offLeft, y: below(c1).y + 170 }])
      + ' ' + mkPath([{ x: offLeft, y: reentryY + 18 }, { x: dM.x, y: d.y + 6 }, dM]));
    rays.fructaid.setAttribute('d',
      mkPath([heroL, cardA(c2), below(c2), { x: offRight, y: below(c2).y + 120 }])
      + ' ' + mkPath([{ x: offRight, y: reentryY }, { x: dR.x, y: d.y + 6 }, dR]));
    ['lactrase', 'oligase', 'fructaid'].forEach(function (k) {
      var p = rays[k], len = p.getTotalLength();
      p._len = len; p.style.strokeDasharray = len; p.style.strokeDashoffset = hasArrived ? 0 : len;
    });
    update();
  }

  function update() {
    var mRect = main.getBoundingClientRect();
    var pageTop = mRect.top + window.scrollY;
    var distPageY = pageTop + rel(distrib).y;
    var start = pageTop + rel(heroImg).y - window.innerHeight * 0.15;
    var end = distPageY - window.innerHeight * 0.62;
    var prog = progressAtY(start, end);

    if (hasArrived) {
      wrap.classList.add('is-swallowed');
      cards.forEach(function (card) { card.classList.add('is-lit'); });
      distrib.classList.add('is-lit');
      return;
    }

    ['lactrase', 'oligase', 'fructaid'].forEach(function (k) {
      var p = rays[k]; if (p._len != null) p.style.strokeDashoffset = (p._len * (1 - prog)).toFixed(1);
    });

    // Die Farbigkeit erscheint erst, wenn der gezeichnete Strahl seine jeweilige Karte erreicht.
    for (var i = 0; i < cards.length; i++) {
      var cardPageY = pageTop + rel(cards[i]).y;
      var cardProg = progressAtY(start, cardPageY - window.innerHeight * 0.62);
      if (cardProg >= 0.98) cards[i].classList.add('is-lit');
      else cards[i].classList.remove('is-lit');
    }

    if (prog >= 0.985 || distrib.getBoundingClientRect().top < window.innerHeight * 0.64) {
      hasArrived = true;
      wrap.classList.add('is-swallowed');
      cards.forEach(function (card) { card.classList.add('is-lit'); });
      distrib.classList.add('is-lit');
    } else if (prog > 0.92) {
      distrib.classList.add('is-lit');
    } else {
      distrib.classList.remove('is-lit');
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
