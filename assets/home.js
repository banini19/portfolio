/* Front page: the works as rounded cards of different sizes (draft C "벤토 카드", chosen 2026-11-22), shown first.
   Animated works and the metaverse game are short silent clips that play while on screen (video/tiles, tools/make_tile_clips.py).
   Two cards each play two works one after another (the two circus films; 몽개몽개 + 묘야곡동): the name, year and link
   follow whichever part is playing. The category, name and year show only while the pointer is on a card.
   Words come from data/projects.js (titles, years). Projects without a card are not shown (work.html only sends old
   links here since 2026-11-22).
   Under the works, one screen down: About me (intro, timeline, what I do, also, contact). */
(function () {
  'use strict';
  var box = document.getElementById('cards');
  if (!box) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bySlug = {}, groupOf = {};
  (window.PROJECTS || []).forEach(function (p) {
    if (p.parts) p.parts.forEach(function (q) { bySlug[q.slug] = q; groupOf[q.slug] = p; });
    else bySlug[p.slug] = p;
  });
  var CAT = { animation: 'Animation', game: 'Game', character: 'Character', drawing: 'Drawing' };

  // The cards, in order, on a 4-column grid (w x h = columns x half-rows; a plain card is 2 half-rows high,
  // the two big cards on the left (game above, Odie below) are 3 each so they come out the same height). parts: the works in the card;
  // at: when each part starts in the clip (s). pic: the picture shown (also the clip's look before it plays).
  // title / year: for a work that is not in data/projects.js; page: false when it has no project page yet (no link).
  var CARDS = [
    { parts: ['metaverse'], cat: 'game', clip: 'metaverse', pic: 'video/tiles/metaverse.webp', w: 2, h: 3 },
    { parts: ['asteroid'], cat: 'animation', clip: 'asteroid', pic: 'img/asteroid/scene-moon-s.webp', w: 1, h: 2 },
    { parts: ['snow-goblin'], cat: 'animation', clip: 'snow-goblin', pic: 'img/snow-goblin/scene-forest-s.webp', w: 1, h: 2 },
    { parts: ['character-design'], cat: 'character', pic: 'img/character-design/lineup-beach.webp', w: 2, h: 2 },
    { parts: ['odie-seoul-inferno'], cat: 'animation', clip: 'odie-seoul-inferno', pic: 'img/odie-seoul-inferno/background-02-s.webp', w: 2, h: 3 },
    { parts: ['circus-wonderland', 'circus-world'], at: [0, 8], cat: 'animation', clip: 'circus', pic: 'img/circus-wonderland/scene-giant-s.webp', w: 1, h: 2 },
    { parts: ['monggae-monggae', 'myoya-gokdong'], at: [0, 5], cat: 'animation', clip: 'monggae-myoya', pic: 'img/monggae-monggae/scene-underwater-s.webp', w: 1, h: 2 }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var YEAR = /(\d{4})(?:\.\d+)?(?:\s*[–-]\s*(\d{4}))?/;
  function yearOf(slug) {
    var p = bySlug[slug] || {}, g = groupOf[slug];
    var m = YEAR.exec(p.kicker || '') || (g && YEAR.exec(g.kicker || ''));
    return m ? (m[2] ? m[1] + '–' + m[2].slice(2) : m[1]) : '';
  }
  function titleOf(slug) { return (bySlug[slug] || {}).title || slug; }
  // a card's link opens the same details in place (#slug), also in a new tab; there is no second project page any more
  function href(slug) { return '#' + encodeURIComponent(slug); }
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';

  // ---------- the works
  box.innerHTML = CARDS.map(function (c, i) {
    var first = c.parts[0], y = c.year || yearOf(first), name = c.title || titleOf(first);
    var tag = c.page === false ? 'div' : 'a';
    var media = c.clip
      ? '<video muted loop playsinline preload="none" poster="' + c.pic + '" data-src="video/tiles/' + c.clip + '.mp4" aria-hidden="true"></video>'
      : '<img src="' + c.pic + '" alt="" loading="' + (i < 7 ? 'eager' : 'lazy') + '" decoding="async">';
    return '<' + tag + ' class="card work' + (c.w > 1 ? ' wide' : '') + (tag === 'div' ? ' nolink' : '') + '"' + (tag === 'a' ? ' href="' + href(first) + '"' : '') +
      ' data-i="' + i + '" data-key="' + c.parts.join(' ') +
      (c.parts.indexOf('odie-seoul-inferno') >= 0 ? ' cereels' : '') + '" style="--w:' + c.w + ';--h:' + c.h + '"' +
      ' aria-label="' + esc(c.title || c.parts.map(titleOf).join(', ')) + '">' + media +
      '<span class="cat c-' + c.cat + '"><i></i>' + CAT[c.cat] + '</span>' + (tag === 'a' ? '<span class="go">' + ARROW + '</span>' : '') +
      '<span class="label"><b>' + esc(name) + '</b>' + (y ? '<em>' + y + '</em>' : '<em hidden></em>') +
      (c.parts.length > 1 ? '<span class="pips">' + c.parts.map(function (_, k) { return '<i' + (k ? '' : ' class="on"') + '></i>'; }).join('') + '</span>' : '') +
      '</span></' + tag + '>';
  }).join('');

  // cards with two works: name, year and link follow the part that is playing
  [].forEach.call(box.querySelectorAll('.work'), function (el) {
    var c = CARDS[+el.getAttribute('data-i')], v = el.querySelector('video');
    if (!v || c.parts.length < 2) return;
    var shown = 0, b = el.querySelector('.label b'), em = el.querySelector('.label em'), pips = el.querySelectorAll('.pips i');
    v.addEventListener('timeupdate', function () {
      var k = 0;
      for (var j = 0; j < c.at.length; j++) if (v.currentTime >= c.at[j]) k = j;
      if (k === shown) return;
      shown = k;
      var s = c.parts[k], y = yearOf(s);
      el.href = href(s);
      b.textContent = titleOf(s);
      em.textContent = y;
      em.hidden = !y;
      [].forEach.call(pips, function (p, n) { p.classList.toggle('on', n === k); });
    });
  });


  // ---------- About me (the screen under the works)
  // what I do: every role written in the projects
  var roles = [];
  (window.PROJECTS || []).forEach(function (p) {
    [p].concat(p.parts || []).forEach(function (q) {
      (q.role || '').split(' · ').forEach(function (r) { if (r && r !== '개인 작업' && roles.indexOf(r) < 0) roles.push(r); });
    });
  });
  var skills = document.getElementById('skills');
  if (skills) skills.innerHTML = roles.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
  var nRoles = document.getElementById('n-roles');
  if (nRoles) nRoles.textContent = roles.length;
  // timeline: works by year (years and titles from data/projects.js; the last column says what kind of work it was)
  var TIMELINE = [
    ['metaverse', '메타버스 게임'],
    ['cereels', '청담미디어 · 회사'],
    ['asteroid', '단편 애니메이션 · 개인'],
    ['circus-wonderland', 'Circus Cabaret · 의뢰'],
    ['circus-world', 'Circus Cabaret · 의뢰'],
    ['snow-goblin', '단편 애니메이션 · 개인'],
    ['myoya-gokdong', '단편 애니메이션 · 개인'],
    ['monggae-monggae', '단편 애니메이션 · 개인']
  ];
  var tl = document.getElementById('timeline');
  if (tl) {
    var top = {};
    (window.PROJECTS || []).forEach(function (p) { top[p.slug] = p; });
    tl.innerHTML = TIMELINE.map(function (t) {
      var p = top[t[0]] || bySlug[t[0]] || {};
      var m = /(\d{4}(?:\.\d+)?)(?:\s*[–-]\s*(\d{4}(?:\.\d+)?))?/.exec(p.kicker || '');
      var when = m ? (m[2] ? m[1] + ' – ' + m[2] : m[1]) : '';
      return '<li><span class="when">' + esc(when) + '</span><b>' + esc(p.title || t[0]) + '</b><span class="what">' + esc(t[1]) + '</span></li>';
    }).join('');
  }
  // email shown only after a click (fewer spam robots)
  [].forEach.call(document.querySelectorAll('.reveal'), function (b) {
    b.addEventListener('click', function () {
      var a = b.getAttribute('data-user') + '@' + b.getAttribute('data-domain');
      var link = document.createElement('a');
      link.className = 'mail';
      link.href = 'mailto:' + a;
      link.textContent = a;
      b.replaceWith(link);
      link.focus();
    });
  });
  // the cards come up one after another when the About screen comes in
  var about = document.getElementById('about');
  if (about && !reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('rise');
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) about.classList.add('in'); });
    }, { threshold: .3 }).observe(about);
  }

  // ---------- clips play only while on screen (and not at all if the visitor asked for less motion)
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src) v.src = v.getAttribute('data-src');
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (v.src) v.pause();
      });
    }, { rootMargin: '120px', threshold: .1 });
    [].forEach.call(document.querySelectorAll('video[data-src]'), function (v) { io.observe(v); });
  }

  // jumps inside the page (the menu): page by page on wide screens, else a smooth scroll
  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-go]');
    if (!go) return;
    var id = go.getAttribute('data-go'), to = document.getElementById(id);
    if (!to) return;
    e.preventDefault();
    if (pagerOn()) goPage(id === 'top' || id === 'works' ? 0 : pages.indexOf(to.closest('#works, .about')));
    else to.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  // ---------- a card opens over the works: it turns over while it grows into a window, and its back holds the work's
  // details (the card's clip is not in the details). Close (outside the window, ×, Esc, the browser's back) turns it back
  // into the card. index.html#<slug> opens that work straight away (a new tab, a shared link, or an old work.html?p=<slug> link).
  var sizes = window.IMG_SIZES || {};
  var ease = 'cubic-bezier(.2, .7, .2, 1)', SPEED = reduce ? 0 : 620, FLIP = reduce ? 0 : 560;   // FLIP: the card turning (ms; 11/22 user: faster)
  var open = null;   // { card, c, k, media, el, panel, flip, spin, playing, stepped, cardRad, panelRad }

  function cardFor(slug) {
    var hit = null;
    [].forEach.call(box.querySelectorAll('.work'), function (t) {
      if (!hit && (' ' + t.getAttribute('data-key') + ' ').indexOf(' ' + slug + ' ') >= 0) hit = t;
    });
    return hit;
  }
  function partNow(card) {   // which work of the card is showing now (two-work cards)
    var c = CARDS[+card.getAttribute('data-i')], v = card.querySelector('video'), k = 0;
    if (c.at && v) for (var j = 0; j < c.at.length; j++) if (v.currentTime >= c.at[j]) k = j;
    return k;
  }
  function full(n, slug) { return n.indexOf('/') >= 0 ? n : slug + '/' + n; }
  function pic(name, cls) {   // --ar (width / height) lets a row of pictures share one height (.d-rows)
    var sz = sizes[name] || [4, 3];
    return '<button class="d-pic' + (cls ? ' ' + cls : '') + '" type="button" data-full="img/' + name + '.webp" style="--ar:' + (sz[0] / sz[1]).toFixed(3) + '">' +
      '<img src="img/' + name + '-s.webp" width="' + sz[0] + '" height="' + sz[1] + '" alt="" loading="lazy" decoding="async"></button>';
  }
  var ARROW_R = '<svg class="d-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  // the back of the card: the project's name (heroName), a black bar (subtitle on the left, what was done on the right),
  // then the work's material. Sections show only when the project has them:
  // story (기획 의도 · 줄거리), the whole film (YouTube), versions (Ver 1 → Ver 2 → …), turntables (characters turning,
  // same scale), process pictures, footage, the main picture, sketches, the gallery, then the process steps (a title over
  // a row of pictures). Pictures in rows share one height, so many pictures stay small and tidy; click one to see it big.
  function heroName(c, k) { var s = c.parts[k]; return (bySlug[s] || {}).title || s; }

  // ---------- dress-up (Metaverse): pictures rendered in Blender (tools/make_dressup.py), never the 3D model.
  // One picture per hair x outfit x shoes x direction, and see-through layers on top for the mouth, eyes, bag and glasses.
  // The choices are pictures (d.icons, make_dressup.py --icons), one row per kind, all in one place (no tabs, 11/23 user);
  // the chosen one gets a coloured background. Odie first stands turned a little to the side (direction 1, 11/23 user).
  var DR_GROUPS = [['hair', '머리'], ['outfit', '옷'], ['shoes', '신발'], ['eyes', '눈'], ['mouth', '입']];
  var DR_START = 1;
  var DR_LAYERS = ['base', 'bag', 'mouth', 'eyes', 'glasses'];   // bottom to top
  var CHEV = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>'; };
  function dressHtml(d) {
    var item = function (k, i, name, on, pic) {   // the name is said by screen readers and shows on hover
      return '<button type="button" class="dr-item" data-dr="' + k + '" data-v="' + i + '" aria-pressed="' + on + '" aria-label="' + esc(name) + '" title="' + esc(name) + '">' +
        '<img src="' + d.icons + pic + '.webp" alt="" loading="lazy" decoding="async"></button>';
    };
    var groups = DR_GROUPS.map(function (g) {
      return '<div class="dr-row" role="group" aria-label="' + g[1] + '">' +
        (d[g[0]] || []).map(function (name, i) { return item(g[0], i, name, i === 0, g[0] + '-' + i); }).join('') + '</div>';
    }).join('') + '<div class="dr-row" role="group" aria-label="소품">' + item('bag', 1, '가방', false, 'bag') + item('glasses', 1, '안경', false, 'glasses') + '</div>';
    return '<section class="d-sec"><p class="d-label">Dress up</p><div class="d-dress">' +
      '<div class="dr-stage" tabindex="0" role="img" aria-label="오디 옷 입혀보기. 끌거나 왼쪽·오른쪽 화살표 키로 돌려 봅니다.">' +
      '<div class="dr-pic" style="aspect-ratio:' + d.size[0] + '/' + d.size[1] + '">' +
      DR_LAYERS.map(function (n) { return '<img class="dr-l" data-l="' + n + '" alt="" hidden>'; }).join('') + '</div>' +
      '<button class="dr-turn left" type="button" data-turn="1" aria-label="왼쪽으로 돌리기">' + CHEV('M15 5l-7 7 7 7') + '</button>' +
      '<button class="dr-turn right" type="button" data-turn="-1" aria-label="오른쪽으로 돌리기">' + CHEV('M9 5l7 7-7 7') + '</button>' +
      '</div><div class="dr-opts">' + groups + '</div></div></section>';
  }
  function initDress(root, d) {
    var w = root.querySelector('.d-dress');
    if (!w || !d) return;
    var st = { hair: 0, outfit: 0, shoes: 0, eyes: 0, mouth: 0, bag: 0, glasses: 0, a: DR_START % d.angles }, token = 0;
    var img = {};
    [].forEach.call(w.querySelectorAll('.dr-l'), function (i) { img[i.getAttribute('data-l')] = i; });
    function url(n, a) {
      var h = 'h' + st.hair;
      return d.path + (n === 'base' ? 'b-' + h + 'o' + st.outfit + 's' + st.shoes : n === 'bag' ? 'bag-' + h + 'o' + st.outfit :
        n === 'glasses' ? 'g-' + h : n === 'eyes' ? 'e' + st.eyes + '-' + h : 'm' + st.mouth + '-' + h) + '-' + a + '.webp';
    }
    function layers() {
      return DR_LAYERS.filter(function (n) { return n !== 'bag' && n !== 'glasses' || st[n]; });
    }
    function show() {   // load the whole new look first, then swap every layer at once (no half-changed frame)
      var my = ++token, list = layers();
      Promise.all(list.map(function (n) {
        return new Promise(function (ok) { var i = new Image(); i.onload = i.onerror = ok; i.src = url(n, st.a); });
      })).then(function () {
        if (my !== token) return;
        DR_LAYERS.forEach(function (n) {
          var on = list.indexOf(n) >= 0;
          img[n].hidden = !on;
          if (on) img[n].src = url(n, st.a);
        });
        setTimeout(function () {   // the other directions of this look, so turning is instant
          if (my === token) list.forEach(function (n) { for (var a = 0; a < d.angles; a++) new Image().src = url(n, a); });
        }, 300);
      });
    }
    function turn(n) { st.a = ((st.a + n) % d.angles + d.angles) % d.angles; show(); }
    w.addEventListener('click', function (e) {
      var b = e.target.closest('[data-dr]');
      if (b) {
        var k = b.getAttribute('data-dr');
        if (k === 'bag' || k === 'glasses') {
          st[k] = st[k] ? 0 : 1;
          b.setAttribute('aria-pressed', String(!!st[k]));
        } else {
          st[k] = +b.getAttribute('data-v');
          [].forEach.call(b.parentNode.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        }
        show();
        return;
      }
      var t = e.target.closest('[data-turn]');
      if (t) turn(+t.getAttribute('data-turn'));
    });
    // drag sideways to turn him: the side you drag towards is where his front goes
    var stage = w.querySelector('.dr-stage'), x0 = null, a0 = 0;
    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('[data-turn]') || e.button) return;
      x0 = e.clientX; a0 = st.a;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('drag');
    });
    stage.addEventListener('pointermove', function (e) {
      if (x0 === null) return;
      var a = ((a0 - Math.round((e.clientX - x0) / 40)) % d.angles + d.angles) % d.angles;
      if (a !== st.a) { st.a = a; show(); }
    });
    function end() { x0 = null; stage.classList.remove('drag'); }
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); turn(e.key === 'ArrowLeft' ? 1 : -1); }
    });
    show();
  }
  function paras(t) { return String(t).split('\n\n').map(function (x) { return '<p>' + esc(x) + '</p>'; }).join(''); }
  function details(c, k) {
    var slug = c.parts[k], p = bySlug[slug] || {}, g = groupOf[slug];
    var roles = (p.role || '').split(' · ').filter(function (r) { return r && r !== '개인 작업'; });
    var type = p.type || (g && g.type) || '';
    var h = '<div class="d-bar"><span class="d-tag">' + esc(p.tagline || p.kicker || '') + '</span>' +
      '<span class="d-did">' + roles.map(esc).join('<i>|</i>') + '</span></div>';
    if (c.parts.length > 1) {
      h += '<div class="d-switch">' + c.parts.map(function (s, j) {
        return '<button type="button" data-part="' + j + '"' + (j === k ? ' class="on"' : '') + '>' + esc(titleOf(s)) + '</button>';
      }).join('') + '</div>';
    }
    if (p.desc || type) h += '<div class="d-about">' + (p.desc ? '<p class="d-desc">' + esc(p.desc) + '</p>' : '') + (type ? '<p class="d-type">' + esc(type) + '</p>' : '') + '</div>';
    if (p.logline || p.intent || (p.synopsis && p.synopsis.length)) {
      h += '<section class="d-sec"><p class="d-label">Story</p>' +
        (p.logline ? '<p class="d-logline">“' + esc(p.logline) + '”</p>' : '') + '<div class="d-story">' +
        (p.intent ? '<div><h3>기획 의도</h3>' + paras(p.intent) + '</div>' : '') +
        (p.synopsis && p.synopsis.length ? '<div><h3>줄거리</h3>' + p.synopsis.map(paras).join('') + '</div>' : '') +
        '</div></section>';
    }
    if (p.film) {   // the whole film on YouTube; the player loads only when it comes near the screen
      h += '<section class="d-sec"><p class="d-label">Film</p><div class="d-film"><iframe src="https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(p.film) + '?rel=0" title="' + esc((p.title || slug) + ' 전체 영상') + '" loading="lazy"' +
        ' allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div></section>';
    }
    if (p.versions && p.versions.length) {
      h += '<section class="d-sec"><p class="d-label">Version</p><div class="d-vers">' + p.versions.map(function (n, j) {
        return (j ? ARROW_R : '') + '<figure><figcaption>Ver ' + (j + 1) + '</figcaption>' + pic(full(n, slug)) + '</figure>';
      }).join('') + '</div></section>';
    }
    if (p.turntables && p.turntables.length) {   // all at one scale (the videos are made that way), standing on one line
      var sumW = p.turntables.reduce(function (n, t) { return n + (t.size || [1, 1])[0]; }, 0);
      h += '<section class="d-sec"><p class="d-label">Turntable</p><div class="d-turn" style="--sum:' + sumW + ';--n:' + (p.turntables.length - 1) + '">' + p.turntables.map(function (t) {
        var sz = t.size || [1, 1];
        return '<video src="' + esc(t.src) + '"' + (t.poster ? ' poster="' + esc(t.poster) + '"' : '') + ' style="--w:' + sz[0] + ';--h:' + sz[1] + '"' +
          ' muted loop playsinline preload="metadata"' + (reduce ? '' : ' autoplay') + ' aria-hidden="true"></video>';
      }).join('') + '</div></section>';
    }
    if (p.dressup) h += dressHtml(p.dressup);
    if (p.process && p.process.length) {
      h += '<section class="d-sec"><p class="d-label">Process</p><div class="d-process">' + p.process.map(function (n) { return pic(full(n, slug)); }).join('') + '</div></section>';
    }
    if (p.videos && p.videos.length && !c.clip) {   // a card with its own clip shows that footage on its front, not again here
      h += '<div class="d-videos">' + p.videos.map(function (v) {
        var sz = v.size || [16, 9];
        return '<video src="' + esc(v.src) + '"' + (v.poster ? ' poster="' + esc(v.poster) + '"' : '') + ' style="aspect-ratio:' + sz[0] + '/' + sz[1] + '"' +
          ' controls muted loop playsinline preload="metadata"' + (reduce ? '' : ' autoplay') + '></video>';
      }).join('') + '</div>';
    }
    var hero = p.hero ? full(p.hero, slug) : '';
    if (hero && c.pic.indexOf('img/' + hero) !== 0) h += '<div class="d-main">' + pic(hero) + '</div>';
    var sk = (p.sketches || []).map(function (n) { return full(n, slug); });
    if (sk.length) h += '<section class="d-sec"><p class="d-label">Sketches</p><div class="d-sketches">' + sk.map(function (n) { return pic(n); }).join('') + '</div></section>';
    var ga = (p.gallery || []).map(function (n) { return full(n, slug); });
    if (ga.length) h += '<section class="d-sec"><p class="d-label">Gallery</p><div class="d-rows">' + ga.map(function (n) { return pic(n); }).join('') + '</div></section>';
    if (p.steps && p.steps.length) {   // each step: its title, then its pictures in rows of one height (or a grid of `cols`)
      h += '<section class="d-sec"><p class="d-label">Process</p>' + p.steps.map(function (s) {
        var pics = (s.pics || []).map(function (n) { return pic(full(n, slug)); }).join('');
        return '<div class="d-step"><h3>' + esc(s.title) + '</h3>' +
          (s.cols ? '<div class="d-cols" style="--cols:' + s.cols + '">' : '<div class="d-rows">') + pics + '</div></div>';
      }).join('') + '</section>';
    }
    return h;
  }
  function fade(el, a, b, ms) {
    if (SPEED && el.animate) el.animate([{ opacity: a }, { opacity: b }], { duration: ms || SPEED * .8, easing: 'ease', fill: 'forwards' });
    else el.style.opacity = b;
  }
  function play(v) { var pl = v.play(); if (pl && pl.catch) pl.catch(function () {}); }

  // The card turns over: from the click on it grows into the window and turns round (0 → 180°) at the same time —
  // moving and turning share one timing, so it is standing edge-on exactly half-way and never moves first, turns later
  // (11/22 user: that looked jumpy). Its front is the card's own picture / clip, its back the empty window with the name;
  // the details come up once it has turned. from / to: screen boxes; back: true turns it the other way (closing).
  var FLIP_EASE = 'cubic-bezier(.33, .35, .2, 1)';   // starts moving at once, settles softly
  function flip(o, from, to, back, done) {
    if (!SPEED || !o.flip.animate) { done(); return; }
    var t = { duration: back ? FLIP * .9 : FLIP, easing: FLIP_EASE, fill: 'forwards' };
    function box(r, rad) { return { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: rad }; }
    o.flip.style.visibility = 'visible';
    o.flip.animate([box(from, back ? o.panelRad : o.cardRad), box(to, back ? o.cardRad : o.panelRad)], t);
    o.spin.animate(back ? [{ transform: 'rotateY(180deg)' }, { transform: 'rotateY(0deg)' }]
      : [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(180deg)' }], t).finished.then(done, function () {});
  }

  // The window has the card's own shape (as on the main page), as big as fits with 28px around it. Phones keep a sheet
  // from the bottom (home.css), as a card's shape there would leave too little room to read.
  var phoneMq = window.matchMedia && matchMedia('(max-width: 760px)');
  function fitPanel(o) {
    var s = o.panel.style;
    if (phoneMq && phoneMq.matches) { s.left = s.top = s.width = s.height = ''; return; }
    var r = o.card.getBoundingClientRect(), ar = r.width / r.height, m = 28;
    var w = Math.min(o.el.clientWidth - 2 * m, (o.el.clientHeight - 2 * m) * ar), h = w / ar;
    s.left = Math.round((o.el.clientWidth - w) / 2) + 'px'; s.top = Math.round((o.el.clientHeight - h) / 2) + 'px';
    s.width = Math.round(w) + 'px'; s.height = Math.round(h) + 'px';
    var sc = o.panel.querySelector('.d-scroll');   // the name on the card's back keeps the same room as in the window (scroll bar)
    o.flip.style.setProperty('--gut', (sc.offsetWidth - sc.clientWidth) / 2 + 'px');
  }

  // The details open in a window over the works (the page stays behind, dimmed); the card's place stays empty meanwhile.
  // push: add a history step (a click). stepped: this history step was added by a click before (back / forward).
  function openCard(card, k, push, stepped) {
    if (open) return;
    var c = CARDS[+card.getAttribute('data-i')];
    if (k == null) k = partNow(card);
    var media = card.querySelector('video, img');
    var from = card.getBoundingClientRect();
    var el = document.createElement('div');
    el.className = 'detail';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'd-title');
    el.innerHTML = '<div class="d-bg"></div><div class="d-panel"><div class="d-scroll"><h2 class="d-name" id="d-title">' + esc(heroName(c, k)) + '</h2>' +
      '<div class="d-body">' + details(c, k) + '</div></div>' +
      '<button class="d-close" type="button" aria-label="닫기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="d-flip" aria-hidden="true"><div class="d-spin"><div class="d-front"></div><div class="d-back"><p class="d-name">' + esc(heroName(c, k)) + '</p></div></div></div>';
    document.body.appendChild(el);
    initDress(el, (bySlug[c.parts[k]] || {}).dressup);
    document.documentElement.classList.add('d-open');
    var panel = el.querySelector('.d-panel'), flipEl = el.querySelector('.d-flip');
    // the clips rest while the details are open (the card's own clip keeps playing until it has turned)
    var playing = [].filter.call(box.querySelectorAll('video'), function (v) { return !v.paused; });
    playing.forEach(function (v) { if (v !== media) v.pause(); });
    var zoom = getComputedStyle(media).transform;   // the picture is a little zoomed while the pointer is on the card
    el.querySelector('.d-front').appendChild(media);   // the card's own picture / clip is the front of the turning card
    if (zoom && zoom !== 'none' && FLIP && media.animate) media.animate([{ transform: zoom }, { transform: 'none' }], { duration: FLIP, easing: FLIP_EASE });   // ease out of it, no jump
    card.classList.add('away');
    open = { card: card, c: c, k: k, media: media, el: el, panel: panel, flip: flipEl, spin: flipEl.firstChild, playing: playing, stepped: !!(push || stepped),
      cardRad: getComputedStyle(card).borderRadius, panelRad: getComputedStyle(panel).borderRadius };
    var o = open;
    fitPanel(o);
    fade(el.querySelector('.d-bg'), 0, 1);
    flip(o, from, panel.getBoundingClientRect(), false, function () {
      if (open !== o) return;
      o.flip.style.visibility = 'hidden';
      if (media.tagName === 'VIDEO') media.pause();
      el.classList.add('ready');   // the window takes the card's place, the details come up
      el.querySelector('.d-close').focus({ preventScroll: true });
    });
    if (push) history.pushState({ detail: c.parts[k] }, '', '#' + encodeURIComponent(c.parts[k]));
  }

  function closeCard() {
    if (!open) return;
    var o = open;
    open = null;
    closeLightbox();
    var el = o.el, shown = el.classList.contains('ready');
    // the details go first, then the empty window turns back into the card and drops into its place
    el.classList.remove('ready');
    if (shown) el.classList.add('leaving');
    var from = o.panel.getBoundingClientRect(), to = o.card.getBoundingClientRect();
    if (o.media.tagName === 'VIDEO' && o.playing.indexOf(o.media) >= 0) play(o.media);
    setTimeout(function () {
      el.classList.remove('leaving');
      fade(el.querySelector('.d-bg'), 1, 0, FLIP * .9);
      flip(o, from, to, true, function () {
        o.card.insertBefore(o.media, o.card.firstChild);
        o.card.classList.remove('away');
        el.remove();
        document.documentElement.classList.remove('d-open');
        o.playing.forEach(function (v) { if (v !== o.media) play(v); });
        o.card.focus({ preventScroll: true });
      });
    }, shown && SPEED ? 120 : 0);
  }
  function closeFromPage() {   // the × button and Esc: go back if the details added a history step
    if (!open) return;
    if (open.stepped) history.back();   // the popstate below closes it
    else { history.replaceState(null, '', location.pathname + location.search); closeCard(); }
  }

  // a small viewer for the pictures in the details
  var lbx = null;
  function closeLightbox() { if (lbx) { lbx.remove(); lbx = null; } }
  function lightbox(src) {
    closeLightbox();
    lbx = document.createElement('div');
    lbx.className = 'lbx';
    lbx.innerHTML = '<img src="' + src + '" alt="">';
    lbx.addEventListener('click', closeLightbox);
    document.body.appendChild(lbx);
  }

  box.addEventListener('click', function (e) {
    var card = e.target.closest('.work');
    if (!card || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;   // a new tab opens ./#slug, which opens the same details there
    e.preventDefault();
    openCard(card, null, true);
  });
  document.addEventListener('click', function (e) {
    if (!open) return;
    if (e.target.closest('.d-close') || e.target.classList.contains('d-bg')) return closeFromPage();   // ×, or outside the window
    var sw = e.target.closest('.d-switch button');
    if (sw) {   // two-work card: show the other work's details
      open.k = +sw.getAttribute('data-part');
      open.el.querySelector('.d-body').innerHTML = details(open.c, open.k);
      initDress(open.el, (bySlug[open.c.parts[open.k]] || {}).dressup);
      [].forEach.call(open.el.querySelectorAll('.d-name'), function (n) { n.textContent = heroName(open.c, open.k); });   // window and card back
      history.replaceState({ detail: open.c.parts[open.k] }, '', '#' + encodeURIComponent(open.c.parts[open.k]));
      return;
    }
    var b = e.target.closest('.d-pic');
    if (b) lightbox(b.getAttribute('data-full'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (lbx) closeLightbox();
    else closeFromPage();
  });
  window.addEventListener('resize', function () { if (open && open.el.classList.contains('ready')) fitPanel(open); });
  window.addEventListener('popstate', function () {
    var want = history.state && history.state.detail;
    if (!want && open) closeCard();
    else if (want && !open) {
      var card = cardFor(want);
      if (card) openCard(card, Math.max(0, CARDS[+card.getAttribute('data-i')].parts.indexOf(want)), false, true);
    }
  });
  // index.html#slug (a card opened in a new tab, a shared link, or an old work.html link): open that work
  var hash = '';
  try { hash = decodeURIComponent(location.hash.slice(1)); } catch (_) {}
  var start = hash && cardFor(hash);
  if (start) {
    history.replaceState({ detail: hash }, '', location.href);
    openCard(start, Math.max(0, CARDS[+start.getAttribute('data-i')].parts.indexOf(hash)), false);
  }

  // ---------- page by page (wide screens): one wheel turn, arrow key or menu click moves a whole screen,
  // slowly starting and slowly stopping (1 s). Phones, small windows and "less motion" keep the normal scroll.
  var pages = [document.getElementById('works'), document.getElementById('about')].filter(Boolean);
  var wideMq = window.matchMedia && matchMedia('(min-width: 761px) and (min-height: 560px)');
  var moving = false, quietUntil = 0, MOVE = 1000;
  function pagerOn() {
    if (reduce || !wideMq || !wideMq.matches || pages.length < 2) return false;
    return pages.every(function (p) { return p.offsetHeight <= window.innerHeight + 2; });   // every screen fits
  }
  function pageNow() {
    var k = 0;
    pages.forEach(function (p, i) { if (window.scrollY >= p.offsetTop - window.innerHeight / 2) k = i; });
    return k;
  }
  function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function goPage(i) {
    i = Math.max(0, Math.min(pages.length - 1, i));
    var from = window.scrollY, to = pages[i].offsetTop;
    if (moving || Math.abs(to - from) < 2) return;
    moving = true;
    var t0 = performance.now();
    requestAnimationFrame(function step(now) {
      var t = Math.min(1, (now - t0) / MOVE);
      window.scrollTo(0, from + (to - from) * easeInOut(t));
      depth();
      if (t < 1) requestAnimationFrame(step);
      else { moving = false; quietUntil = performance.now() + 300; }
    });
  }
  window.addEventListener('wheel', function (e) {
    if (open || lbx || e.ctrlKey || !pagerOn()) return;
    e.preventDefault();
    // a touchpad keeps sending small turns after a swipe: wait until they stop before the next move
    if (moving || performance.now() < quietUntil) { quietUntil = Math.max(quietUntil, performance.now() + 140); return; }
    if (Math.abs(e.deltaY) < 3) return;
    goPage(pageNow() + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });
  document.addEventListener('keydown', function (e) {
    if (open || lbx || !pagerOn() || e.altKey || e.ctrlKey || e.metaKey) return;
    var step = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (e.key === ' ' && !e.target.closest('a, button, input, textarea')) step = e.shiftKey ? -1 : 1;
    if (e.key === 'Home') step = -9;
    if (e.key === 'End') step = 9;
    if (!step) return;
    e.preventDefault();
    goPage(pageNow() + step);
  });
  // how far between the two screens (0 works … 1 About): the works sink back as About slides over them
  function depth() {
    var p = Math.max(0, Math.min(1, window.scrollY / (pages[1] ? pages[1].offsetTop : 1)));
    document.body.style.setProperty('--p', p.toFixed(4));
  }
  window.addEventListener('scroll', depth, { passive: true });
  window.addEventListener('resize', function () {
    if (pagerOn() && !moving && !open) window.scrollTo(0, pages[pageNow()].offsetTop);
    depth();
  });
  depth();

  // the project-name font is used only in the details: fetch it once the page has loaded, so an opened card shows it at once
  if (document.fonts && document.fonts.load) {
    window.addEventListener('load', function () { document.fonts.load('40px "Griun Sarang"').catch(function () {}); });
  }
})();
