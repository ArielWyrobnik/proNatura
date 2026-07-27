/* =========================================================================
   Pro Natura — main.js
   Kein Framework, keine Abhängigkeiten.

   Module
   1. Kopfzeile (Höhe messen, Scroll-Zustand)
   2. Navigation (Mobil-Panel, Marken-Dropdown, Tastatur, Scroll-Lock)
   3. Scroll-Reveal
   4. Produkt-Strahlen (Scroll-Erzählung auf der Startseite)
   5. Kontaktformular
   6. Jahreszahl im Footer

   Grundsätze: alle Inhalte sind auch ohne JS sichtbar und bedienbar;
   Layout-Messungen passieren gebündelt, nie pro Scroll-Frame.
   ========================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Hilfsfunktionen ------------------------------------------------------ */
  function on(el, type, fn, opts) { if (el) el.addEventListener(type, fn, opts); }
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait);
    };
  }
  /* Bündelt Scroll-Arbeit auf einen Frame. */
  function rafThrottle(fn) {
    var queued = false;
    return function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; fn(); });
    };
  }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* ======================================================== 1. Kopfzeile */
  var header = document.getElementById('header');

  function measureHeader() {
    if (!header) return;
    root.style.setProperty('--header-h', Math.round(header.offsetHeight) + 'px');
  }

  var headerStuck = null;
  function syncHeader() {
    if (!header) return;
    var stuck = window.scrollY > 8;
    if (stuck !== headerStuck) {
      headerStuck = stuck;
      header.classList.toggle('is-stuck', stuck);
    }
  }

  /* ======================================================= 2. Navigation */
  var nav = document.getElementById('primaryNav');
  var navToggle = document.getElementById('navToggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var brandsTrigger = document.getElementById('brandsTrigger');
  var brandsMenu = document.getElementById('brandsMenu');
  var mobileQuery = window.matchMedia('(max-width: 900px)');

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  /* --- Marken-Dropdown */
  function closeBrands(refocus) {
    if (!brandsTrigger || !brandsMenu || brandsTrigger.getAttribute('aria-expanded') !== 'true') return;
    brandsTrigger.setAttribute('aria-expanded', 'false');
    brandsMenu.hidden = true;
    if (refocus) brandsTrigger.focus();
  }
  function openBrands() {
    if (!brandsTrigger || !brandsMenu) return;
    brandsTrigger.setAttribute('aria-expanded', 'true');
    brandsMenu.hidden = false;
  }
  function toggleBrands() {
    if (brandsTrigger.getAttribute('aria-expanded') === 'true') closeBrands(false);
    else openBrands();
  }

  if (brandsTrigger && brandsMenu) {
    on(brandsTrigger, 'click', function (e) { e.stopPropagation(); toggleBrands(); });

    /* Pfeiltasten öffnen das Menü und springen auf den ersten Eintrag. */
    on(brandsTrigger, 'keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Down') {
        e.preventDefault();
        openBrands();
        var first = brandsMenu.querySelector('a');
        if (first) first.focus();
      }
    });
    on(brandsMenu, 'keydown', function (e) {
      var items = Array.prototype.slice.call(brandsMenu.querySelectorAll('a'));
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'Down') {
        e.preventDefault(); items[(i + 1) % items.length].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        e.preventDefault(); items[(i - 1 + items.length) % items.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault(); items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault(); items[items.length - 1].focus();
      }
    });

    /* Auf dem Desktop schließt ein Klick daneben oder Fokusverlust das Menü. */
    on(document, 'click', function (e) {
      if (mobileQuery.matches) return;
      if (!brandsMenu.contains(e.target) && e.target !== brandsTrigger) closeBrands(false);
    });
    on(document, 'focusin', function (e) {
      if (mobileQuery.matches) return;
      if (!brandsMenu.contains(e.target) && e.target !== brandsTrigger) closeBrands(false);
    });
  }

  /* --- Mobiles Panel */
  var lastFocused = null;

  function isNavOpen() { return !!nav && nav.classList.contains('is-open'); }

  function openNav() {
    if (!nav || !navToggle) return;
    lastFocused = document.activeElement;
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Menü schließen');
    if (backdrop) backdrop.classList.add('is-visible');
    document.body.classList.add('is-locked');
  }

  function closeNav(refocus) {
    if (!nav || !navToggle || !isNavOpen()) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menü öffnen');
    if (backdrop) backdrop.classList.remove('is-visible');
    document.body.classList.remove('is-locked');
    closeBrands(false);
    if (refocus && lastFocused && lastFocused.focus) lastFocused.focus();
  }

  on(navToggle, 'click', function () { isNavOpen() ? closeNav(false) : openNav(); });
  on(backdrop, 'click', function () { closeNav(true); });

  /* Ein Klick auf einen Menüpunkt schließt das Panel. */
  if (nav) {
    nav.querySelectorAll('a').forEach(function (link) {
      on(link, 'click', function () { if (mobileQuery.matches) closeNav(false); });
    });
  }

  on(document, 'keydown', function (e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    if (brandsTrigger && brandsTrigger.getAttribute('aria-expanded') === 'true' && !mobileQuery.matches) {
      closeBrands(true);
      return;
    }
    if (isNavOpen()) closeNav(true);
  });

  /* Fokus bleibt im offenen Mobil-Panel (inkl. Hamburger-Button). */
  on(document, 'keydown', function (e) {
    if (e.key !== 'Tab' || !isNavOpen() || !mobileQuery.matches) return;
    var items = [navToggle].concat(
      Array.prototype.filter.call(nav.querySelectorAll(FOCUSABLE), function (el) {
        return el.offsetParent !== null || el === navToggle;
      })
    );
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* Beim Wechsel auf Desktop aufräumen. */
  function syncNavMode() {
    if (!mobileQuery.matches) {
      closeNav(false);
      if (brandsMenu) closeBrands(false);
    } else {
      closeBrands(false);
    }
  }
  if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', syncNavMode);
  else if (mobileQuery.addListener) mobileQuery.addListener(syncNavMode);

  /* ==================================================== 3. Scroll-Reveal */
  var revealItems = document.querySelectorAll('[data-reveal]');
  if (revealItems.length) {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
      revealItems.forEach(function (el) { io.observe(el); });

      /* Sicherheitsnetz: was nach dem Laden schon im Bild ist, wird sichtbar,
         auch wenn der Observer (z. B. bei Sprungmarken) nichts meldet. */
      window.setTimeout(function () {
        revealItems.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-visible');
        });
      }, 1200);
    }
  }

  /* ============================================ 4a. Farbe kommt an (IO) */
  /* Die Marken-Fotos starten entsättigt und färben sich, sobald sie in den
     Blick kommen; das Distributor-Band blendet seine drei Signaturfarben ein.
     Bewusst unabhängig von den Strahlen: funktioniert auf jedem Viewport,
     ohne JS-Geometrie und mit reduzierter Bewegung. */
  (function () {
    var targets = document.querySelectorAll('.brand-card, .cta-banner--waves');
    if (!targets.length) return;
    root.classList.add('rays-on');

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-lit'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-lit');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    targets.forEach(function (el) { io.observe(el); });
  })();

  /* ================================================= 4b. Produkt-Strahlen */
  /* Zwei bewusst gesetzte Momente, beide ausschließlich in garantiert
     freiem Raum – die Linien laufen nie über Text:

       Moment 1  Drei feine Fäden treten hinter den Hero-Packshots hervor,
                 fließen nach unten und werden vom Vertrauensband geschluckt.
       Moment 2  Im Freiraum über dem Distributor-Band steigen sie wieder auf,
                 laufen zusammen und tauchen in das Band ein.

     Beide Enden laufen über einen Verlauf weich aus (kein harter Abriss).
     Gemessen wird gebündelt in build(); update() schreibt nur noch. */
  var raysApi = (function () {
    var wrap = document.querySelector('.rays');
    var host = wrap && wrap.closest('main');
    if (!wrap || !host) return null;

    var svg = wrap.querySelector('svg');
    var heroImg = document.querySelector('.hero__image img');
    var swallow = document.querySelector('.trust-bar');
    var banner = document.querySelector('.cta-banner--waves');
    var bannerLead = document.querySelector('[data-rays-lead]');
    if (!svg || !heroImg || !swallow || !banner) return null;

    /* Reihenfolge folgt den Packshots im Hero: Fructaid, Lactrase, Oligase. */
    var LAYOUT = [
      { key: 'fructaid', from: 0.28, to: 0.17 },
      { key: 'lactrase', from: 0.50, to: 0.50 },
      { key: 'oligase',  from: 0.72, to: 0.83 }
    ];
    var wideQuery = window.matchMedia('(min-width: 1000px)');

    var defs = null;
    var moments = [];   // { paths:[{el,len}], start, end }
    var ready = false;

    function makeEl(tag, attrs) {
      var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      return el;
    }

    /* Weiche Enden: der Strich blendet an beiden Seiten aus. */
    function gradient(id, color, y0, y1) {
      var g = makeEl('linearGradient', {
        id: id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: y0, x2: 0, y2: y1
      });
      [[0, 0], [0.18, .9], [0.78, .9], [1, 0]].forEach(function (s) {
        g.appendChild(makeEl('stop', { offset: s[0], 'stop-color': color, 'stop-opacity': s[1] }));
      });
      return g;
    }

    function curve(a, b, bend) {
      var dy = b.y - a.y;
      return 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) +
        ' C' + a.x.toFixed(1) + ' ' + (a.y + dy * bend).toFixed(1) +
        ' ' + b.x.toFixed(1) + ' ' + (b.y - dy * bend).toFixed(1) +
        ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
    }

    function teardown() {
      moments = [];
      ready = false;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      defs = makeEl('defs', {});
      svg.appendChild(defs);
      wrap.hidden = true;
    }

    function build() {
      teardown();
      if (!wideQuery.matches) return;

      /* --- Alle Messungen an genau einer Stelle. */
      var hostBox = host.getBoundingClientRect();
      var pageTop = hostBox.top + window.scrollY;
      function rel(el) {
        var r = el.getBoundingClientRect();
        return {
          x: r.left - hostBox.left, y: r.top - hostBox.top,
          w: r.width, h: r.height,
          cx: r.left - hostBox.left + r.width / 2,
          bottom: r.top - hostBox.top + r.height
        };
      }
      var W = hostBox.width, H = hostBox.height;
      var hero = rel(heroImg);
      var band = rel(swallow);
      var b = rel(banner);
      var lead = bannerLead ? rel(bannerLead) : null;
      var vh = window.innerHeight;

      /* Freiraum, in dem Moment 2 leben darf. */
      var runwayTop = lead ? lead.bottom + 24 : b.y - 200;
      var runway = b.y - runwayTop;

      var css = getComputedStyle(root);
      var frag = document.createDocumentFragment();
      var m1 = { paths: [] }, m2 = { paths: [] };

      /* --- Moment 1: hinter den Packshots hervor, ins Vertrauensband. */
      var canM1 = (band.y - hero.bottom) > 40;
      /* --- Moment 2: im Freiraum über dem Band. */
      var canM2 = runway > 130;

      LAYOUT.forEach(function (item, i) {
        var color = css.getPropertyValue('--ray-' + item.key).trim() ||
          ({ lactrase: '#3ab3e0', oligase: '#407740', fructaid: '#b3d24a' })[item.key];

        if (canM1) {
          var a0 = { x: hero.x + hero.w * item.from, y: hero.y + hero.h * 0.66 };
          var a1 = { x: hero.x + hero.w * (0.5 + (item.from - 0.5) * 2.1), y: band.y + 26 };
          a1.x = Math.max(18, Math.min(W - 18, a1.x));
          defs.appendChild(gradient('ray-m1-' + i, color, a0.y, a1.y));
          var p1 = makeEl('path', { class: 'ray', d: curve(a0, a1, 0.55) });
          p1.style.stroke = 'url(#ray-m1-' + i + ')';
          frag.appendChild(p1);
          m1.paths.push(p1);
        }

        if (canM2) {
          var c0 = { x: b.x + b.w * item.from, y: runwayTop };
          var c1 = { x: b.x + b.w * item.to, y: b.y + 30 };
          defs.appendChild(gradient('ray-m2-' + i, color, c0.y, c1.y));
          var p2 = makeEl('path', { class: 'ray', d: curve(c0, c1, 0.5) });
          p2.style.stroke = 'url(#ray-m2-' + i + ')';
          frag.appendChild(p2);
          m2.paths.push(p2);
        }
      });

      if (!m1.paths.length && !m2.paths.length) return;

      svg.setAttribute('viewBox', '0 0 ' + Math.round(W) + ' ' + Math.round(H));
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.appendChild(frag);
      wrap.hidden = false;

      /* Fortschrittsfenster in Seitenkoordinaten. */
      if (m1.paths.length) {
        /* Nie vor dem ersten Scrollen anfangen: sonst hinge beim Laden ein
           halb gezeichneter Stummel unter den Packshots. */
        m1.start = Math.max(0, pageTop + hero.y + hero.h * 0.66 - vh * 0.92);
        m1.end = pageTop + band.y - vh * 0.35;
        moments.push(m1);
      }
      if (m2.paths.length) {
        m2.start = pageTop + runwayTop - vh * 0.9;
        m2.end = pageTop + b.y - vh * 0.5;
        moments.push(m2);
      }

      moments.forEach(function (m) {
        if (m.end - m.start < 160) m.end = m.start + 160;
        m.paths.forEach(function (el) {
          var len = el.getTotalLength();
          el._len = len;
          el.style.strokeDasharray = len;
          el.style.strokeDashoffset = reduceMotion.matches ? 0 : len;
        });
      });

      ready = true;
      if (!reduceMotion.matches) update();
    }

    function update() {
      if (!ready || reduceMotion.matches) return;
      var y = window.scrollY;
      for (var i = 0; i < moments.length; i++) {
        var m = moments[i];
        var p = clamp01((y - m.start) / (m.end - m.start));
        for (var j = 0; j < m.paths.length; j++) {
          var el = m.paths[j];
          /* Leichter Versatz je Strang – wirkt organisch statt gleichgeschaltet. */
          var local = clamp01((p - j * 0.06) / (1 - j * 0.06));
          el.style.strokeDashoffset = (el._len * (1 - local)).toFixed(1);
        }
      }
    }

    return { build: build, update: update, media: wideQuery };
  })();

  if (raysApi) {
    if (raysApi.media.addEventListener) raysApi.media.addEventListener('change', raysApi.build);
    else if (raysApi.media.addListener) raysApi.media.addListener(raysApi.build);
  }

  /* ------------------------------------------------ Gebündelte Scroll-Loop */
  var onScroll = rafThrottle(function () {
    syncHeader();
    if (raysApi) raysApi.update();
  });
  on(window, 'scroll', onScroll, { passive: true });

  var onResize = debounce(function () {
    measureHeader();
    if (raysApi) raysApi.build();
  }, 160);
  on(window, 'resize', onResize);
  on(window, 'orientationchange', onResize);

  /* Inhaltshöhe ändert sich (Bilder, Schriften, Reveal) → neu vermessen. */
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(debounce(function () {
      measureHeader();
      if (raysApi) raysApi.build();
    }, 200));
    ro.observe(document.body);
  }

  /* ================================================= 5. Kontaktformular */
  var form = document.getElementById('contactForm');
  if (form) {
    var status = document.getElementById('formStatus');
    var statusText = status ? status.querySelector('[data-status-text]') : null;

    function fieldOf(input) { return input.closest('.field'); }

    function messageFor(input) {
      if (input.validity.valueMissing) {
        if (input.type === 'checkbox') return 'Bitte stimmen Sie der Verarbeitung zu.';
        return 'Bitte füllen Sie dieses Feld aus.';
      }
      if (input.validity.typeMismatch && input.type === 'email') return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      if (input.validity.tooShort) return 'Bitte geben Sie etwas mehr Text ein.';
      return 'Bitte prüfen Sie diese Eingabe.';
    }

    function setError(input, message) {
      var f = fieldOf(input);
      if (!f) return;
      var box = f.querySelector('.field__error');
      f.classList.toggle('has-error', !!message);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (box) {
        var span = box.querySelector('span');
        if (span) span.textContent = message || '';
      }
    }

    function validateField(input) {
      var ok = input.checkValidity();
      setError(input, ok ? '' : messageFor(input));
      return ok;
    }

    var inputs = Array.prototype.slice.call(form.querySelectorAll('input, textarea, select'));
    inputs.forEach(function (input) {
      /* Erst nach dem ersten Absenden live prüfen – nicht beim Tippen nerven. */
      on(input, 'blur', function () { if (form.dataset.submitted) validateField(input); });
      on(input, 'input', function () { if (form.dataset.submitted) validateField(input); });
      on(input, 'change', function () { if (form.dataset.submitted) validateField(input); });
    });

    function showStatus(kind, text) {
      if (!status) return;
      status.classList.remove('is-ok', 'is-error');
      status.classList.add(kind === 'ok' ? 'is-ok' : 'is-error');
      if (statusText) statusText.textContent = text;
    }

    on(form, 'submit', function (e) {
      e.preventDefault();
      form.dataset.submitted = '1';

      var firstInvalid = null;
      inputs.forEach(function (input) {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        showStatus('error', 'Bitte prüfen Sie die markierten Felder.');
        firstInvalid.focus();
        return;
      }

      var get = function (id) {
        var el = document.getElementById(id);
        return el ? String(el.value || '').trim() : '';
      };
      var topic = get('topic');
      var subject = get('subject') || (topic ? topic : 'Anfrage über die Website');
      var body = 'Name: ' + get('name') +
        '\nE-Mail: ' + get('email') +
        (topic ? '\nAnliegen: ' + topic : '') +
        '\n\n' + get('message');

      window.location.href = 'mailto:info@pro-natura-gmbh.de' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      showStatus('ok', 'Vielen Dank! Ihr E-Mail-Programm wurde mit der Nachricht geöffnet.');
      form.reset();
      form.dataset.submitted = '';
      inputs.forEach(function (input) { setError(input, ''); });
    });
  }

  /* ================================================== 6. Jahr im Footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------------------------------------------------------- Startlauf */
  measureHeader();
  syncHeader();
  if (raysApi) { raysApi.build(); }

  on(window, 'load', function () {
    measureHeader();
    if (raysApi) raysApi.build();
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      measureHeader();
      if (raysApi) raysApi.build();
    });
  }
})();
