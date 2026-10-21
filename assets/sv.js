/* Stone Valves — motion: scroll reveal, hero parallax, page transitions */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  var root = document.documentElement;
  root.classList.add('motion');

  /* Scroll reveal with stagger among siblings */
  var sel = [
    '.section-head', '.grid > .tile', '.values > .value', '.stats > .stat', '.intro-copy', '.intro-media > .panel',
    '.about-img', '.contact-list > li', '.quality > div', '.why > *', '.motto-inner > *', '.mat-grid > .mat',
    '.ind-list > li', '.mat-ind .h2', '.en-panel', '.article-body > *', '.article-nav > a', '.contact-copy', '.contact .actions',
    '.cat-nav', '.toolbar', '.kw'
  ].join(',');
  var els = [].slice.call(document.querySelectorAll(sel));
  els.forEach(function (el) {
    var sibs = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (c) { return c.matches(sel); }) : [];
    var i = Math.max(0, sibs.indexOf(el));
    el.style.setProperty('--d', Math.min(i, 7) * 70 + 'ms');
    el.classList.add('reveal');
  });
  function done(el) {
    el.addEventListener('transitionend', function h(e) {
      if (e.target !== el) return;
      el.classList.remove('reveal', 'in');
      el.style.removeProperty('--d');
      el.removeEventListener('transitionend', h);
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); done(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.remove('reveal'); });
  }

  /* Hero line-art parallax */
  var lines = [].slice.call(document.querySelectorAll('.hero-lines'));
  if (lines.length) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        lines.forEach(function (l) { l.style.transform = 'translate3d(0,' + (y * -0.12) + 'px,0) rotate(' + (y * 0.02) + 'deg)'; });
        ticking = false;
      });
    }, { passive: true });
  }

  /* Page transition: fade out before leaving to another page of the site */
  var supportsVT = 'onpagereveal' in window || (CSS && CSS.supports && CSS.supports('view-transition-name: none'));
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    var href = a.getAttribute('href');
    if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href) || /^https?:/i.test(href)) return;
    if (href.split('#')[0] === '' ) return;
    if (supportsVT && location.protocol !== 'file:') return; /* native cross-document view transition handles it */
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(function () { location.href = a.href; }, 220);
  });
  window.addEventListener('pageshow', function () { document.body.classList.remove('leaving'); });
})();
