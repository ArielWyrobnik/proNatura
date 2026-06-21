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
    // Hero füllt am Anfang den ganzen Bildschirm und schrumpft beim Scrollen
    if (hero) {
      if (y > 12) hero.classList.add('is-collapsed');
      else hero.classList.remove('is-collapsed');
    }
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
