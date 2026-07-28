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

  /* ============================================== 4a. Farbaufbruch (Spill)
     Die Marken-Fotos starten entsättigt. Trifft der Strahl auf die Karte,
     bricht von genau diesem Punkt die Farbe auf und läuft über die Kachel –
     wie ein umgekippter Farbeimer. Zwei übereinanderliegende Kreis-Clips:
     vorn die Signaturfarbe (schnellere Kurve), dahinter das Farbfoto. Der
     Versatz zwischen beiden ergibt den nassen Rand an der Front.

     Bewusst NICHT an die Strahlen-Geometrie gekoppelt: ohne Strahlen bricht
     die Farbe beim Eintritt in den Viewport von der Kachelmitte auf. */
  var paintApi = (function () {
    var cards = document.querySelectorAll('.brand-card');
    var banner = document.querySelector('.cta-banner--waves');
    if (!cards.length && !banner) return null;

    function setOrigin(el, xPercent, yPercent) {
      el.style.setProperty('--sx', xPercent.toFixed(1) + '%');
      el.style.setProperty('--sy', yPercent.toFixed(1) + '%');
    }

    /* Farbebene je Karte anlegen: Klon des vorhandenen <picture>, damit die
       WebP-Aushandlung erhalten bleibt und kein zweiter Request entsteht. */
    cards.forEach(function (card) {
      var frame = card.querySelector('.brand-card__img');
      var pic = frame && frame.querySelector('picture');
      if (!frame || !pic || frame.querySelector('.brand-card__spill')) return;

      var front = document.createElement('span');
      front.className = 'brand-card__front';
      front.setAttribute('aria-hidden', 'true');

      var spill = document.createElement('span');
      spill.className = 'brand-card__spill';
      spill.setAttribute('aria-hidden', 'true');
      var clone = pic.cloneNode(true);
      var img = clone.querySelector('img');
      if (img) { img.setAttribute('alt', ''); img.setAttribute('aria-hidden', 'true'); }
      spill.appendChild(clone);

      frame.appendChild(front);
      frame.appendChild(spill);
      setOrigin(frame, 50, 0);
    });
    root.classList.add('paint-on');

    function light(el) {
      if (!el || el.classList.contains('is-lit')) return;
      el.classList.add('is-lit');
    }

    /* Ohne Strahlen (schmale Viewports, reduzierte Bewegung, kein Observer)
       muss die Farbe trotzdem ankommen. */
    var io = null;
    function observeFallback() {
      if (reduceMotion.matches || !('IntersectionObserver' in window)) {
        cards.forEach(light);
        light(banner);
        return;
      }
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          light(entry.target);
          io.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      cards.forEach(function (c) { io.observe(c); });
      if (banner) io.observe(banner);
    }
    function stopFallback() {
      if (io) { io.disconnect(); io = null; }
    }

    return {
      cards: cards,
      banner: banner,
      light: light,
      setCardOrigin: function (i, xPercent, yPercent) {
        var frame = cards[i] && cards[i].querySelector('.brand-card__img');
        if (frame) setOrigin(frame, xPercent, yPercent);
      },
      setBannerOrigin: function (xPercent) {
        if (banner) banner.style.setProperty('--sx', xPercent.toFixed(1) + '%');
      },
      observeFallback: observeFallback,
      stopFallback: stopFallback
    };
  })();

  /* ================================================= 4b. Produkt-Strahlen */
  /* Ein durchgehender Faden je Produkt, vom Hero bis ins Distributor-Band.
     Der Faden verschwindet nur dort, wo er hinter einem deckenden Element
     durchläuft (Marken-Karte, Band) – er endet nie im Nichts.

     Wegführung (alles aus echten Elementpositionen gemessen):
       Packshot → Hero-Freiraum → Randkanal links/rechts (zwei Fäden
       geflochten, sie kreuzen sich) → am Abschnittskopf vorbei → Einschlag
       auf der Marken-Karte (dort bricht die Farbe auf) → hinter der Karte
       hindurch → Spalte zwischen Missionsbild und Text → zusammenlaufen →
       Eintauchen ins Band, das daraufhin farbig aufbricht.

     Der Zeichen-Fortschritt hängt an einer Ziel-Y-Position im Viewport,
     nicht an der Bogenlänge: die Spitze bleibt dadurch immer auf Höhe des
     Lesepunkts und bleibt nirgends stehen. */
  var raysApi = (function () {
    var wrap = document.querySelector('.rays');
    var host = wrap && wrap.closest('main');
    if (!wrap || !host || !paintApi) return null;

    var svg = wrap.querySelector('svg');
    var heroImg = document.querySelector('.hero__image img');
    var heroCopy = document.querySelector('.hero__copy');
    var swallow = document.querySelector('.trust-bar');
    var head = document.querySelector('#marken .section-head');
    var grid = document.querySelector('.brand-grid');
    var lead = document.querySelector('[data-rays-lead]');
    var cards = paintApi.cards;
    var banner = paintApi.banner;
    if (!svg || !heroImg || !grid || cards.length < 3 || !banner) return null;

    /* DOM-Reihenfolge der Karten: Lactrase, Oligase, Fructaid.
       heroX = Position des zugehörigen Packshots im Hero-Composite.
       side  = Randkanal, über den der Faden nach unten läuft.
       hitX  = Einschlagpunkt auf der Karte (Anteil der Kartenbreite). */
    var THREADS = [
      { key: 'lactrase', heroX: 0.50, lane: 'left',  phase: 0.35,     hitX: 0.26 },
      { key: 'oligase',  heroX: 0.73, lane: 'inner', phase: 0.0,      hitX: 1.0, hitY: 0.46, viaGap: true },
      { key: 'fructaid', heroX: 0.29, lane: 'outer', phase: Math.PI,  hitX: 0.70 }
    ];
    var wideQuery = window.matchMedia('(min-width: 1001px)');

    var threads = [];      // { el, len, table:[{y,l}], hit, hitCard, bannerL }
    var ready = false;
    var defs = null;

    function el(tag, attrs) {
      var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    }

    /* Weiche Enden – der Strich blendet am Anfang und am Ende aus. */
    function gradient(id, color, y0, y1) {
      var g = el('linearGradient', {
        id: id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: y0, x2: 0, y2: y1
      });
      [[0, 0], [0.035, 0.95], [0.955, 0.95], [1, 0]].forEach(function (s) {
        g.appendChild(el('stop', { offset: s[0], 'stop-color': color, 'stop-opacity': s[1] }));
      });
      return g;
    }

    /* Pfad aus Wegpunkten. Jeder Punkt darf die Steuerpunkt-Länge vorgeben
       (t = Anteil des vertikalen Abstands), sonst wird weich abgerundet. */
    function toPath(pts) {
      var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i];
        var dy = b.y - a.y;
        var t1 = a.out != null ? a.out : 0.5;
        var t2 = b.in != null ? b.in : 0.5;
        d += ' C' + a.x.toFixed(1) + ' ' + (a.y + dy * t1).toFixed(1) +
             ' ' + b.x.toFixed(1) + ' ' + (b.y - dy * t2).toFixed(1) +
             ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      }
      return d;
    }

    /* Geflochtener Lauf durch einen schmalen Kanal: die Fäden schwingen um
       die Kanalmitte und kreuzen sich dabei mehrfach. */
    function braid(pts, cx, amp, y0, y1, phase, steps) {
      for (var i = 1; i <= steps; i++) {
        var t = i / steps;
        pts.push({
          x: cx + Math.sin(phase + t * Math.PI * 2.1) * amp,
          y: y0 + (y1 - y0) * t,
          in: 0.42, out: 0.42
        });
      }
    }

    function teardown() {
      threads = [];
      ready = false;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      defs = el('defs', {});
      svg.appendChild(defs);
      wrap.hidden = true;
    }

    /* Nachschlagetabelle Länge ↔ y, damit die Spitze über y gesteuert wird. */
    function sample(path, total) {
      var table = [], n = 160;
      for (var i = 0; i <= n; i++) {
        var l = total * i / n;
        table.push({ y: path.getPointAtLength(l).y, l: l });
      }
      return table;
    }
    function lengthAtY(table, y) {
      if (y <= table[0].y) return 0;
      var last = table[table.length - 1];
      if (y >= last.y) return last.l;
      var lo = 0, hi = table.length - 1;
      while (hi - lo > 1) {
        var mid = (lo + hi) >> 1;
        if (table[mid].y < y) lo = mid; else hi = mid;
      }
      var a = table[lo], b = table[hi];
      var f = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
      return a.l + (b.l - a.l) * f;
    }

    function build() {
      teardown();
      if (!wideQuery.matches) { paintApi.observeFallback(); return; }

      /* ---- Alle Messungen an genau einer Stelle. */
      var hostBox = host.getBoundingClientRect();
      function rel(node) {
        var r = node.getBoundingClientRect();
        return {
          x: r.left - hostBox.left, y: r.top - hostBox.top,
          w: r.width, h: r.height,
          cx: r.left - hostBox.left + r.width / 2,
          right: r.left - hostBox.left + r.width,
          bottom: r.top - hostBox.top + r.height
        };
      }
      var W = hostBox.width, H = hostBox.height;
      var hero = rel(heroImg);
      var bandBox = swallow ? rel(swallow) : null;
      var headBox = head ? rel(head) : null;
      var gridBox = rel(grid);
      var cardBox = [rel(cards[0]), rel(cards[1]), rel(cards[2])];
      var bannerBox = rel(banner);

      /* Zu wenig Luft für einen sauberen Lauf → gar nicht erst zeichnen. */
      var runway = bannerBox.y - gridBox.bottom;
      if (!bandBox || !headBox || runway < 180 || hero.h < 120 || gridBox.x < 24) {
        paintApi.observeFallback();
        return;
      }

      var copyBox = heroCopy ? rel(heroCopy) : null;

      /* Freie Bahnen neben dem (zentrierten) Abschnittskopf.
         links : 0 … headBox.x          – breit, ein Faden schwingt darin
         rechts: headBox.right … Rand   – zwei Fäden flechten sich darin */
      var edge = 14;
      var leftLo = edge, leftHi = Math.max(edge + 20, headBox.x - 26);
      var rightLo = Math.min(W - edge - 20, headBox.right + 26), rightHi = W - edge;
      var rightSpan = rightHi - rightLo;
      var lanes = {
        left:  { c: (leftLo + leftHi) / 2, a: (leftHi - leftLo) / 2 * 0.82 },
        inner: { c: rightLo + rightSpan * 0.42, a: rightSpan * 0.34 },
        outer: { c: rightLo + rightSpan * 0.58, a: rightSpan * 0.34 }
      };

      /* Spalte zwischen Missionsbild und Missionstext. */
      var gapX = null, gapW = 0, leadBox = null;
      if (lead) {
        leadBox = rel(lead);
        var kids = lead.children;
        if (kids.length >= 2) {
          var a = rel(kids[0]), b = rel(kids[1]);
          gapW = b.x - a.right;
          if (gapW > 26) gapX = a.right + gapW / 2;
        }
      }
      /* Kein brauchbarer Zwischenraum → am rechten Rand vorbeiführen. */
      var midX = gapX != null ? gapX : (W - edge - 30);
      var midAmp = gapX != null ? Math.max(4, Math.min(11, gapW * 0.20)) : 16;

      paintApi.stopFallback();

      svg.setAttribute('viewBox', '0 0 ' + Math.round(W) + ' ' + Math.round(H));
      svg.setAttribute('preserveAspectRatio', 'none');
      wrap.hidden = false;

      var css = getComputedStyle(root);
      var frag = document.createDocumentFragment();
      var yStart = hero.y + hero.h * 0.62;
      var bannerX = bannerBox.x + bannerBox.w * 0.2;

      THREADS.forEach(function (cfg, i) {
        var card = cardBox[i];
        var lane = lanes[cfg.lane];
        var pts = [];

        /* 1. Hinter dem Packshot hervor und senkrecht nach unten – solange
              in der Bildspalte, also niemals über dem Hero-Text. */
        var anchorX = hero.x + hero.w * cfg.heroX;
        pts.push({ x: anchorX, y: yStart, out: 0.5 });
        /* Noch innerhalb der Bildspalte zur Zielseite driften – das verkürzt
           den späteren Schwenk deutlich und hält den Hero-Text frei. */
        var driftX = lane.c < W / 2 ? hero.x + 16 : hero.right - 16;
        var dropY = Math.max(copyBox ? copyBox.bottom : 0, hero.bottom) + 14;
        pts.push({ x: driftX, y: dropY, in: 0.5, out: 0.42 });

        /* 2. Der große Schwenk quer über die Seite. Er liegt in der Mitte
              hinter dem deckenden Vertrauensband und ist dort verdeckt. */
        var laneTop = headBox.y - 22;
        pts.push({ x: lane.c + Math.sin(cfg.phase) * lane.a, y: laneTop, in: 0.52, out: 0.4 });

        /* 3. Geflochten am Abschnittskopf vorbei: die beiden rechten Fäden
              schwingen gegenläufig und kreuzen sich mehrfach. */
        var laneEnd = headBox.bottom + Math.max(20, (card.y - headBox.bottom) * 0.3);
        braid(pts, lane.c, lane.a, laneTop, laneEnd, cfg.phase,
              Math.max(2, Math.round((laneEnd - laneTop) / 150)));

        /* 4. Einschwenken auf den Einschlagpunkt. Der mittlere Faden nimmt
              den Spalt zwischen zwei Karten und trifft seitlich auf – so
              entsteht kein flacher Querstrich unter der Überschrift. */
        var hitX, hitY;
        if (cfg.viaGap && cardBox[i + 1]) {
          var gapMid = (card.right + cardBox[i + 1].x) / 2;
          pts.push({ x: gapMid, y: card.y + 4, in: 0.55, out: 0.4 });
          hitX = card.right - 1;
          hitY = card.y + card.h * cfg.hitY;
          pts.push({ x: hitX, y: hitY, in: 0.75, out: 0.5 });
        } else {
          hitX = card.x + card.w * cfg.hitX;
          hitY = card.y + 1;
          pts.push({ x: hitX, y: hitY, in: 0.62, out: 0.5 });
        }

        /* 5. Hinter der Karte hindurch. */
        pts.push({ x: card.x + card.w * 0.5, y: card.bottom - 1, in: 0.5, out: 0.5 });

        /* 6. Zusammenlaufen in die Spalte des Missionsblocks. */
        var mTop = leadBox ? leadBox.y + 8 : gridBox.bottom + runway * 0.35;
        var mBot = leadBox ? leadBox.bottom - 8 : bannerBox.y - runway * 0.35;
        pts.push({ x: midX + (i - 1) * midAmp * 0.9, y: mTop, in: 0.5, out: 0.45 });
        braid(pts, midX, midAmp, mTop, mBot, cfg.phase + i * 0.7,
              Math.max(2, Math.round((mBot - mTop) / 150)));

        /* 7. Gebündelt ins Band eintauchen. */
        pts.push({ x: bannerX + (i - 1) * 6, y: bannerBox.y + 30, in: 0.5 });

        var color = css.getPropertyValue('--ray-' + cfg.key).trim() ||
          ({ lactrase: '#3ab3e0', oligase: '#407740', fructaid: '#b3d24a' })[cfg.key];
        defs.appendChild(gradient('ray-' + cfg.key, color, yStart, bannerBox.y + 30));

        var p = el('path', { class: 'ray', d: toPath(pts) });
        p.style.stroke = 'url(#ray-' + cfg.key + ')';
        frag.appendChild(p);
        threads.push({ el: p, hitY: hitY, cardIndex: i });

        /* Der Farbaufbruch startet dort, wo der Faden die Kachel trifft. */
        paintApi.setCardOrigin(i, cfg.hitX * 100, cfg.viaGap ? cfg.hitY * 100 : 0);
      });

      svg.appendChild(frag);
      paintApi.setBannerOrigin(((bannerX - bannerBox.x) / bannerBox.w) * 100);

      threads.forEach(function (t) {
        t.len = t.el.getTotalLength();
        t.table = sample(t.el, t.len);
        t.hit = lengthAtY(t.table, t.hitY);
        t.bannerL = lengthAtY(t.table, bannerBox.y + 8);
        t.el.style.strokeDasharray = t.len;
        t.el.style.strokeDashoffset = reduceMotion.matches ? 0 : t.len;
      });

      /* Fortschritt: Ziel-Y = Lesepunkt im Viewport, in Host-Koordinaten. */
      ready = true;
      pageTop = hostBox.top + window.scrollY;

      if (reduceMotion.matches) {
        cards.forEach(paintApi.light);
        paintApi.light(banner);
      } else {
        update();
      }
    }

    var pageTop = 0;

    function update() {
      if (!ready || reduceMotion.matches) return;
      var targetY = window.scrollY + window.innerHeight * 0.76 - pageTop;
      for (var i = 0; i < threads.length; i++) {
        var t = threads[i];
        var l = lengthAtY(t.table, targetY);
        t.el.style.strokeDashoffset = (t.len - l).toFixed(1);
        if (l >= t.hit) paintApi.light(cards[t.cardIndex]);
        if (l >= t.bannerL) paintApi.light(banner);
      }
    }

    return { build: build, update: update, media: wideQuery };
  })();

  if (raysApi) {
    if (raysApi.media.addEventListener) raysApi.media.addEventListener('change', raysApi.build);
    else if (raysApi.media.addListener) raysApi.media.addListener(raysApi.build);
  } else if (paintApi) {
    paintApi.observeFallback();
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
