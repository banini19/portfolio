/* Home: one picture per project fills the screen. Pictures slide sideways; click one to open the project. */
(function () {
  'use strict';
  var projects = window.PROJECTS || [], sizes = window.IMG_SIZES || {};
  var reel = document.getElementById('reel');
  if (!reel || !projects.length) return;
  var motion = matchMedia('(prefers-reduced-motion: reduce)');
  var noMouse = matchMedia('(hover: none)').matches;
  var slides = [], cur = -1;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function findSlug() {
    var slug;
    try { slug = decodeURIComponent(location.hash.slice(1)); } catch (_) { return -1; }
    // an old address of a work that is now part of a bigger project (ODIE) opens that project
    return projects.findIndex(function (p) {
      return p.slug === slug || (p.parts || []).some(function (q) { return q.slug === slug; });
    });
  }
  // "name" lives in the project's own folder; "folder/name" points into another one
  function path(p, name) {
    if (!name && p.parts && p.parts[0]) return p.parts[0].slug + '/' + p.parts[0].hero;
    name = String(name || '');
    return name.indexOf('/') >= 0 ? name : p.slug + '/' + name;
  }

  // Which picture suits this screen, and whether it can fill the screen without losing too much.
  function pick(p) {
    var screen = innerWidth / innerHeight;
    var phone = screen < 0.8 && p.coverPhone;
    var name = path(p, phone || p.cover || p.hero);
    var size = sizes[name] || [16, 9], ar = size[0] / size[1];
    var whole = p.fit === 'whole' || (p.fit !== 'fill' && Math.min(ar / screen, screen / ar) < 0.65);
    return { name: name, focus: phone ? '' : (p.focus || ''), whole: whole };
  }

  // Name and About turn dark over a light picture, read from the top of the picture itself.
  function readTone(s) {
    try {
      var c = document.createElement('canvas'); c.width = c.height = 40;
      var g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(s.img, 0, 0, 40, 40);
      var whole = s.el.classList.contains('whole');
      var d = g.getImageData(0, 0, 40, whole ? 40 : 8).data, t = 0;
      for (var k = 0; k < d.length; k += 4) t += 0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2];
      s.tone = t / (d.length / 4) / 255 > 0.6 ? 'dark' : 'light';
    } catch (_) { s.tone = 'light'; }
    if (slides[cur] === s) document.body.dataset.head = s.tone;
  }

  function place(s) {
    if (s.draw) { s.draw.size(); return; }
    var c = pick(s.p), src = 'img/' + c.name + '.webp';
    s.el.classList.toggle('whole', c.whole);
    s.img.style.objectPosition = c.whole ? '' : c.focus;
    s.fill.style.backgroundImage = c.whole ? 'url("img/' + c.name + '-s.webp")' : '';
    if (s.img.getAttribute('src') !== src) s.img.src = src;
    else if (s.img.complete && s.img.naturalWidth) readTone(s);
  }

  projects.forEach(function (p, i) {
    var el = document.createElement('section');
    el.className = 'slide'; el.id = p.slug;
    if (p.color) el.style.setProperty('--pc', p.color);
    if (p.intro) { slides.push(paperSlide(p, i, el)); reel.appendChild(el); return; }
    // no words on the picture; the project name is only read out by screen readers
    el.innerHTML = '<a class="slide-link" href="work.html?p=' + encodeURIComponent(p.slug) + '" aria-label="' +
      esc(p.title) + ' (' + (i + 1) + ' / ' + projects.length + ') 자세히 보기">' +
      '<span class="slide-fill" aria-hidden="true"></span>' +
      '<img class="slide-img" alt="" decoding="async" loading="lazy"></a>';
    var s = { p: p, el: el, img: el.querySelector('.slide-img'), fill: el.querySelector('.slide-fill'), tone: 'light' };
    s.img.addEventListener('load', function () { readTone(s); });
    slides.push(s); reel.appendChild(el);
  });

  // Paper cover (CeREELs, from the Awesomepiece portfolio page 3): the words always show,
  // the characters appear only where the mouse has moved, as if they were being drawn (assets/draw.js).
  function paperSlide(p, i, el) {
    var c = p.intro;
    el.classList.add('paper-slide');
    el.style.backgroundImage = 'url("img/' + c.paper + '.webp")';
    el.innerHTML = '<a class="slide-link" href="work.html?p=' + encodeURIComponent(p.slug) + '" aria-label="' +
      esc(p.title) + ' (' + (i + 1) + ' / ' + projects.length + ') 자세히 보기">' +
      '<span class="ps-stage"><canvas class="ps-draw" aria-hidden="true"></canvas>' +
      '<img class="ps-title" src="img/' + esc(c.title) + '.webp" alt="" decoding="async"></span></a>';
    var s = { p: p, el: el, tone: 'dark', draw: null };
    if (window.drawReveal) {
      s.draw = window.drawReveal(el, el.querySelector('.ps-stage'), el.querySelector('.ps-draw'), 'img/' + c.drawing);
      if (motion.matches) s.draw.fill();
    }
    return s;
  }
  function eager(i) { if (slides[i] && slides[i].img) slides[i].img.loading = 'eager'; }
  function activate(i) {
    if (i === cur) return;
    if (slides[cur]) slides[cur].el.classList.remove('on');
    cur = i;
    var s = slides[i];
    s.el.classList.add('on');
    document.body.dataset.head = s.tone;
    if (s.draw && noMouse && !motion.matches) s.draw.sweep();   // phones: the drawing draws itself once
    eager(i - 1); eager(i + 1);
    if (i > 0 || location.hash) {
      try { history.replaceState(null, '', '#' + s.p.slug); } catch (_) { /* local file */ }
    }
  }
  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    reel.scrollTo({ left: i * reel.clientWidth, behavior: motion.matches ? 'auto' : 'smooth' });
  }
  function settle() {
    activate(Math.max(0, Math.min(slides.length - 1, Math.round(reel.scrollLeft / reel.clientWidth))));
  }

  var ticking = false;
  reel.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; settle(); });
  }, { passive: true });

  // Mouse wheel and touchpad (up/down or left/right): one push moves exactly one project.
  // Touch screens keep the browser's own sideways swipe, which already stops at each project.
  var lastWheel = 0, pushed = 0, used = false, lockUntil = 0;
  reel.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return;
    e.preventDefault();
    var now = performance.now();
    if (now - lastWheel > 180) { used = false; pushed = 0; }
    lastWheel = now;
    if (used || now < lockUntil) return;
    var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    pushed += delta * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerWidth : 1);
    if (Math.abs(pushed) > 30) {
      used = true; lockUntil = now + 650;
      go(cur + (pushed > 0 ? 1 : -1));
    }
  }, { passive: false });

  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey) return;
    var k = e.key;
    var step = ['ArrowRight', 'ArrowDown', 'PageDown'].indexOf(k) >= 0 || (k === ' ' && !e.shiftKey) ? 1
      : ['ArrowLeft', 'ArrowUp', 'PageUp'].indexOf(k) >= 0 || (k === ' ' && e.shiftKey) ? -1 : 0;
    if (step) { e.preventDefault(); go(cur + step); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(slides.length - 1); }
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      slides.forEach(place);
      reel.scrollTo({ left: cur * reel.clientWidth, behavior: 'auto' });
    }, 150);
  });
  window.addEventListener('hashchange', function () {
    var i = findSlug();
    if (i >= 0 && i !== cur) go(i);
  });

  var start = Math.max(0, findSlug());
  eager(start - 1); eager(start); eager(start + 1);
  if (slides[start].img) slides[start].img.fetchPriority = 'high';
  slides.forEach(place);
  reel.scrollLeft = start * reel.clientWidth;
  // a moment later, so the first picture settles in gently instead of appearing at once
  setTimeout(function () { activate(start); }, 60);
})();
