/* Front page: a reel of the films plays full screen, without sound, over and over (see tools/make_reel.py).
   On the first visit the page waits while the opening (6 s of 소행성) plays: then KIM GAEUN and About fade in,
   an arrow at the bottom bobs up and down, and the page can be scrolled down to the works gallery.
   A click during the opening skips the wait. Coming back in the same tab (or from a project page) doesn't wait.
   If the browser will not play the video by itself (or the visitor asked for less motion), a still shows instead. */
(function () {
  'use strict';
  var page = document.body, hero = document.getElementById('top'), video = document.getElementById('intro');
  var still = document.getElementById('intro-still'), down = document.getElementById('down'), works = document.getElementById('works');
  if (!video) return;
  var OPENING = 6, KEY = 'intro-seen';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hash = '';
  try { hash = decodeURIComponent(location.hash.slice(1)); } catch (_) {}
  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (_) {}

  function finish() {
    if (page.classList.contains('done')) return;
    page.classList.add('done');
    page.classList.remove('locked');
    try { sessionStorage.setItem(KEY, '1'); } catch (_) {}
  }
  function showStill() {
    video.pause();
    video.hidden = true;
    if (still) still.hidden = false;
    finish();
  }

  if (seen || hash) finish();
  if (reduce) showStill();
  else {
    video.addEventListener('timeupdate', function () { if (video.currentTime >= OPENING) finish(); });
    video.addEventListener('error', showStill, true);   // also errors on the <source> elements
    var tried = video.play();
    if (tried && tried.catch) tried.catch(showStill);
  }

  // skip the opening with a click
  hero.addEventListener('click', function (e) {
    if (page.classList.contains('done') || e.target.closest('a')) return;
    if (video.duration > OPENING) video.currentTime = OPENING;
    finish();
  });

  // the arrow scrolls down to the works, and hides once the page has been scrolled
  if (down && works) {
    down.addEventListener('click', function (e) {
      e.preventDefault();
      works.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  }
  function scrolled() {
    page.classList.toggle('scrolled', window.scrollY > 40);
    page.classList.toggle('below', window.scrollY > hero.offsetHeight - 50);   // the name turns dark over the gallery
  }
  window.addEventListener('scroll', scrolled, { passive: true });
  scrolled();

  // the reel rests while it is out of sight
  if ('IntersectionObserver' in window && !reduce) {
    new IntersectionObserver(function (entries) {
      if (video.hidden) return;
      if (entries[0].isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
      else video.pause();
    }).observe(hero);
  }

  // coming back from a project page (index.html#slug): show where that project's pictures are
  var here = null;
  if (hash) {
    here = document.getElementById(hash);
    [].forEach.call(document.querySelectorAll('[data-key]'), function (t) {
      if (!here && (' ' + t.getAttribute('data-key') + ' ').indexOf(' ' + hash + ' ') >= 0) here = t;
    });
  }
  if (here) here.scrollIntoView({ block: hash === 'works' ? 'start' : 'center' });
})();
