// Replaces the Weebly theme scripts: sticky header, mobile menu, submenus, blog helpers.
(function () {
  var body = document.body;

  // Header condenses once the page is scrolled
  var prev = 0;
  function onScroll() {
    var y = window.pageYOffset;
    body.classList.toggle('affix', y > 0);
    if (y >= prev + 10) body.classList.add('is-scrolling-down');
    else if (y < prev - 5) body.classList.remove('is-scrolling-down');
    prev = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger menu
  document.querySelectorAll('label.hamburger').forEach(function (el) {
    el.addEventListener('click', function () {
      body.classList.toggle('nav-open');
      body.classList.remove('search-open', 'mini-cart-open');
    });
  });

  // Submenu toggles (mobile menu caret)
  document.querySelectorAll('li.has-submenu').forEach(function (li) {
    var link = li.querySelector(':scope > a');
    var menu = li.querySelector(':scope > .wsite-menu-wrap');
    if (!link || !menu) return;
    var caret = li.querySelector(':scope > .icon-caret');
    if (!caret) {
      caret = document.createElement('span');
      caret.className = 'icon-caret';
      link.after(caret);
    }
    caret.addEventListener('click', function () { menu.classList.toggle('open'); });
  });

  // Blog: collapsible sidebar and share buttons
  document.querySelectorAll('a.blog-sidebar-toggle').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      a.classList.toggle('open');
      var col = a.parentNode.querySelector('.column-blog');
      if (col) col.style.display = getComputedStyle(col).display === 'none' ? '' : 'none';
    });
  });
  document.querySelectorAll('.blog-share').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var s = el.parentNode.querySelector('.blog-social');
      if (s) s.style.display = getComputedStyle(s).display === 'none' ? 'block' : 'none';
    });
  });

  // Blog: ?cat=<id> shows only posts in that category
  var cat = new URLSearchParams(location.search).get('cat');
  if (cat) {
    document.querySelectorAll('.blog-post[data-cat]').forEach(function (p) {
      if (p.getAttribute('data-cat') !== cat) p.style.display = 'none';
    });
  }
})();
