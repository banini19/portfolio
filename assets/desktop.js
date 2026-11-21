/* Front page: a computer desktop.
   Every project (data/projects.js) has a folder icon and a window showing its main pictures ("picks").
   Windows move by their title bar, and can be made full size, minimised to the taskbar or closed;
   a closed window opens again from its folder (double-click, or one tap on a phone).
   Clicking a picture opens that project's page. The start button opens the About panel (text from about.html).
   Where the windows are is kept for this browser tab, so coming back from a project page looks the same. */
(function () {
  'use strict';
  var projects = window.PROJECTS || [], sizes = window.IMG_SIZES || {};
  var desk = document.getElementById('desk'), iconBox = document.getElementById('icons'), taskBox = document.getElementById('tasks');
  if (!desk || !iconBox || !taskBox || !projects.length) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'desk-v3';   // change the number when the layout changes, so old saved positions are ignored

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // 8 x 8 pixel glyphs for the window buttons
  var GLYPH = {
    min: 'M1 6h6v2H1z',
    max: 'M0 0h8v2H0zM0 2h1v6H0zM7 2h1v6H7zM1 7h6v1H1z',
    restore: 'M3 0h5v1H3zM7 1h1v4H7zM3 1h1v2H3zM6 4h1v1H6zM0 3h6v2H0zM0 5h1v3H0zM5 5h1v3H5zM1 7h4v1H1z',
    close: 'M0 0h2v1H0zM6 0h2v1H6zM1 1h2v1H1zM5 1h2v1H5zM2 2h4v1H2zM3 3h2v2H3zM2 5h4v1H2zM1 6h2v1H1zM5 6h2v1H5zM0 7h2v1H0zM6 7h2v1H6z'
  };
  function glyph(name) { return '<svg viewBox="0 0 8 8" aria-hidden="true"><path d="' + GLYPH[name] + '"/></svg>'; }

  // ---------------------------------------------------------------- build icons, windows and taskbar buttons
  var wins = {}, order = [];   // order: back -> front
  projects.forEach(function (p) {
    var picks = p.picks && p.picks.length ? p.picks : (p.hero ? [p.hero] : []);
    var paths = picks.map(function (n) { return n.indexOf('/') >= 0 ? n : p.slug + '/' + n; });
    var items = paths.map(function (path, k) {
      // "folder/name" inside CeREELs opens the project page at that work
      var part = (p.parts || []).filter(function (q) { return q.slug === path.split('/')[0]; })[0];
      var size = sizes[path] || [4, 3];
      return '<a class="w-pic" href="work.html?p=' + encodeURIComponent(part ? part.slug : p.slug) + '" style="--ar:' + (size[0] / size[1]).toFixed(4) + '">' +
        '<img src="img/' + esc(path) + '-s.webp" width="' + size[0] + '" height="' + size[1] + '" alt="' + esc(part ? part.title : p.title) + '"' +
        (k < 4 ? '' : ' loading="lazy"') + ' decoding="async" draggable="false">' +
        (part ? '<span class="w-label">' + esc(part.title) + '</span>' : '') + '</a>';
    }).join('');

    var el = document.createElement('section');
    el.className = 'win';
    el.id = 'w-' + p.slug;
    el.hidden = true;
    el.tabIndex = -1;
    el.setAttribute('aria-label', p.title);
    el.innerHTML =
      '<header class="win-bar"><span class="mini" aria-hidden="true"></span><h2 class="win-title">' + esc(p.title) + '</h2>' +
      '<span class="win-grip" aria-hidden="true"></span><div class="win-btns">' +
      '<button class="w-btn" type="button" data-act="min" aria-label="최소화">' + glyph('min') + '</button>' +
      '<button class="w-btn" type="button" data-act="max" aria-label="크게 보기">' + glyph('max') + '</button>' +
      '<button class="w-btn" type="button" data-act="close" aria-label="닫기">' + glyph('close') + '</button></div></header>' +
      '<div class="win-body"><div class="win-grid">' + items + '</div></div>' +
      '<footer class="win-status"><span>' + esc(p.kicker || '') + '</span>' +
      '<a class="win-open" href="work.html?p=' + encodeURIComponent(p.slug) + '">Open ▸</a></footer>';
    desk.appendChild(el);

    var icon = document.createElement('button');
    icon.type = 'button';
    icon.className = 'd-icon';
    icon.setAttribute('data-slug', p.slug);
    icon.innerHTML = '<span class="fold" aria-hidden="true">' +
      (paths[0] ? '<img src="img/' + esc(paths[0]) + '-s.webp" alt="" decoding="async" draggable="false">' : '') +
      '<i></i></span><span class="d-name">' + esc(p.title) + '</span>';
    iconBox.appendChild(icon);

    var task = document.createElement('button');
    task.type = 'button';
    task.className = 'task';
    task.hidden = true;
    task.title = p.title;
    task.setAttribute('data-slug', p.slug);
    task.innerHTML = '<span class="mini" aria-hidden="true"></span><span>' + esc(p.title) + '</span>';
    taskBox.appendChild(task);

    wins[p.slug] = { slug: p.slug, el: el, icon: icon, task: task, open: true, min: false, max: false, fx: null, fy: null };
    order.unshift(p.slug);   // the first project starts in front
  });

  // ---------------------------------------------------------------- where each window starts
  // The windows fill the whole desktop like tiles (covering the folder icons), with a small gap between them.
  // Closing or minimising windows uncovers the folders.
  // Each spot is [column, row, columns wide, rows tall], in projects.js order (CeREELs first and biggest).
  // rows: relative height of each row. Change these to rearrange.
  var GRIDS = {
    wide: {     // computer screens
      cols: 5, rows: [1, 1, 1], gap: 14,
      spots: [[0, 0, 2, 2], [2, 0, 1, 1], [3, 0, 1, 1], [4, 0, 1, 1], [2, 1, 1, 1], [3, 1, 1, 1], [4, 1, 1, 1], [0, 2, 2, 1], [2, 2, 1, 1], [3, 2, 2, 1]]
    },
    medium: {   // small laptops, tablets on their side
      cols: 4, rows: [1.2, 1, 1], gap: 12,
      spots: [[0, 0, 2, 1], [2, 0, 1, 1], [3, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1], [2, 1, 1, 1], [3, 1, 1, 1], [0, 2, 2, 1], [2, 2, 1, 1], [3, 2, 1, 1]]
    },
    tall: {     // upright tablets
      cols: 3, rows: [1.2, 1, 1, 1], gap: 10,
      spots: [[0, 0, 2, 1], [2, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1], [2, 1, 1, 1], [0, 2, 1, 1], [1, 2, 1, 1], [0, 3, 2, 1], [2, 2, 1, 1], [2, 3, 1, 1]]
    }
  };
  var D = { W: 0, H: 0 }, lay = {};

  function evenGrid(n, ratio) {   // used only if the number of projects no longer matches the spots above
    var cols = Math.max(1, Math.round(Math.sqrt(n * ratio / 1.4))), rows = Math.ceil(n / cols), g = { cols: cols, rows: [], gap: 12, spots: [] };
    for (var r = 0; r < rows; r++) g.rows.push(1);
    for (var i = 0; i < n; i++) g.spots.push([i % cols, Math.floor(i / cols), 1, 1]);
    return g;
  }

  function layout() {
    D.W = desk.clientWidth;
    D.H = desk.clientHeight;
    var n = projects.length;
    lay = {};
    // folder icons stay in one column when they fit; smaller icons when the screen is not tall enough
    var room = D.W >= 700 ? D.H - 20 : Infinity;
    iconBox.classList.toggle('compact', room < n * 90 && room >= n * 72);
    iconBox.classList.toggle('tiny', room < n * 72);
    if (D.W < 700) {   // phone: icons on top, windows stacked like cards below them
      var y0 = iconBox.offsetTop + iconBox.offsetHeight + 8;
      var step = clamp((D.H - y0 - 260) / Math.max(1, n - 1), 8, 24);
      var h = Math.max(220, D.H - y0 - 8 - step * (n - 1));
      projects.forEach(function (p, i) {
        lay[p.slug] = { x: 10, y: y0 + step * (n - 1 - i), w: D.W - 20, h: h };
      });
      return;
    }
    var x0 = 12, y0 = 12;   // same margin on every side; the folder icons stay underneath
    var RW = D.W - x0 - 12, RH = D.H - y0 - 12;
    var g = RW / RH < .95 ? GRIDS.tall : RW >= 1150 ? GRIDS.wide : GRIDS.medium;
    if (g.spots.length !== n) g = evenGrid(n, RW / RH);
    var G = g.gap, colW = (RW - G * (g.cols - 1)) / g.cols;
    var unit = (RH - G * (g.rows.length - 1)) / g.rows.reduce(function (a, b) { return a + b; }, 0);
    var tops = [], y = y0;
    g.rows.forEach(function (r) { tops.push(y); y += r * unit + G; });
    projects.forEach(function (p, i) {
      var s = g.spots[i], h = G * (s[3] - 1);
      for (var k = s[1]; k < s[1] + s[3]; k++) h += g.rows[k] * unit;
      lay[p.slug] = { x: x0 + s[0] * (colW + G), y: tops[s[1]], w: colW * s[2] + G * (s[2] - 1), h: h };
    });
  }

  function place(o) {
    var L = lay[o.slug], x = o.fx != null ? o.fx * D.W : L.x, y = o.fy != null ? o.fy * D.H : L.y;
    var st = o.el.style;
    st.left = Math.round(clamp(x, 90 - L.w, D.W - 90)) + 'px';
    st.top = Math.round(clamp(y, 0, D.H - 34)) + 'px';
    st.width = Math.round(L.w) + 'px';
    st.height = Math.round(L.h) + 'px';
  }

  // ---------------------------------------------------------------- window state
  function front() {
    for (var i = order.length - 1; i >= 0; i--) { var o = wins[order[i]]; if (o.open && !o.min) return o; }
    return null;
  }
  function restack() {
    var top = front();
    order.forEach(function (s, i) {
      var o = wins[s];
      o.el.style.zIndex = 10 + i;
      o.el.classList.toggle('on', o === top);
      o.task.classList.toggle('on', o === top);
      o.task.classList.toggle('min', o.min);
      o.task.hidden = !o.open;
      o.task.setAttribute('aria-pressed', o === top ? 'true' : 'false');
    });
  }
  function raise(o) {
    order.splice(order.indexOf(o.slug), 1);
    order.push(o.slug);
    restack();
  }
  function play(el, cls, done) {
    if (reduce) { if (done) done(); return; }
    var finished = false;
    el.classList.remove('pop', 'closing', 'minimizing');
    void el.offsetWidth;
    el.classList.add(cls);
    function end() {
      if (finished) return;
      finished = true;
      el.classList.remove(cls);
      if (done) done();
    }
    el.addEventListener('animationend', end, { once: true });
    setTimeout(end, 450);
  }
  function setMax(o, on) {
    o.max = on;
    o.el.classList.toggle('is-max', on);
    var b = o.el.querySelector('[data-act="max"]');
    b.innerHTML = glyph(on ? 'restore' : 'max');
    b.setAttribute('aria-label', on ? '원래 크기로' : '크게 보기');
  }

  function openWin(o) {
    var was = o.open && !o.min;
    o.open = true;
    o.min = false;
    o.el.hidden = false;
    raise(o);
    if (!was) play(o.el, 'pop');
    o.el.focus({ preventScroll: true });
    save();
  }
  function closeWin(o) {
    o.open = false;
    setMax(o, false);
    restack();
    play(o.el, 'closing', function () { if (!o.open) o.el.hidden = true; });
    save();
  }
  function minWin(o) {
    o.min = true;
    restack();
    play(o.el, 'minimizing', function () { if (o.min) o.el.hidden = true; });
    save();
  }
  function toggleMax(o) {
    if (!reduce) {
      o.el.classList.add('anim');
      setTimeout(function () { o.el.classList.remove('anim'); }, 220);
    }
    setMax(o, !o.max);
    raise(o);
    save();
  }

  // ---------------------------------------------------------------- remember the desktop for this tab
  function save() {
    var s = { order: order, w: {} };
    Object.keys(wins).forEach(function (k) {
      var o = wins[k];
      s.w[k] = [o.open ? 1 : 0, o.min ? 1 : 0, o.max ? 1 : 0, o.fx, o.fy];
    });
    try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (_) {}
  }
  function load() {
    var s = null;
    try { s = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (_) {}
    if (!s || !s.w) return false;
    var known = (s.order || []).filter(function (k) { return wins[k]; });
    if (known.length === order.length) order = known;
    Object.keys(s.w).forEach(function (k) {
      var o = wins[k], v = s.w[k];
      if (!o || !v) return;
      o.open = !!v[0];
      o.min = !!v[1];
      o.max = !!v[2];
      o.fx = typeof v[3] === 'number' ? v[3] : null;
      o.fy = typeof v[4] === 'number' ? v[4] : null;
    });
    return true;
  }
  function fromHash() {   // index.html#slug (the project page's "← Works" link) brings that window to the front
    var h = '';
    try { h = decodeURIComponent(location.hash.slice(1)); } catch (_) {}
    if (!h) return null;
    for (var i = 0; i < projects.length; i++) {
      var p = projects[i];
      if (p.slug === h || (p.parts || []).some(function (q) { return q.slug === h; })) return wins[p.slug];
    }
    return null;
  }

  // ---------------------------------------------------------------- start
  var returning = load();
  layout();
  Object.keys(wins).forEach(function (k) {
    var o = wins[k];
    place(o);
    setMax(o, o.max);
    o.el.hidden = !(o.open && !o.min);
  });
  var target = fromHash();
  if (target) {
    target.open = true;
    target.min = false;
    target.el.hidden = false;
    raise(target);
    save();
    try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {}
  }
  restack();
  if (!returning && !reduce) {   // first visit: windows pop up one after another, back to front
    order.forEach(function (s, i) {
      var el = wins[s].el;
      el.style.animationDelay = (i * 55) + 'ms';
      el.classList.add('pop');
      el.addEventListener('animationend', function () { el.classList.remove('pop'); el.style.animationDelay = ''; }, { once: true });
    });
  }

  var pending = 0;
  window.addEventListener('resize', function () {
    if (pending) return;
    pending = requestAnimationFrame(function () {
      pending = 0;
      layout();
      Object.keys(wins).forEach(function (k) { place(wins[k]); });
    });
  });

  // ---------------------------------------------------------------- mouse and touch
  var selected = null, lastPointer = 'mouse';
  function select(icon) {
    if (selected) selected.classList.remove('sel');
    selected = icon;
    if (icon) icon.classList.add('sel');
  }
  iconBox.addEventListener('pointerdown', function (e) { lastPointer = e.pointerType || 'mouse'; }, true);
  iconBox.addEventListener('click', function (e) {
    var b = e.target.closest('.d-icon');
    if (!b) return;
    select(b);
    // keyboard (Enter/Space) and touch open with one press; a mouse needs a double-click, like a real desktop
    if (e.detail === 0 || lastPointer !== 'mouse') openWin(wins[b.getAttribute('data-slug')]);
  });
  iconBox.addEventListener('dblclick', function (e) {
    var b = e.target.closest('.d-icon');
    if (b) openWin(wins[b.getAttribute('data-slug')]);
  });

  function winOf(node) {
    var el = node.closest && node.closest('.win');
    return el ? wins[el.id.slice(2)] : null;
  }
  desk.addEventListener('pointerdown', function (e) {
    if (e.target === desk || e.target === iconBox) { select(null); return; }
    var o = winOf(e.target);
    if (!o) return;
    if (front() !== o) raise(o);
    var bar = e.target.closest('.win-bar');
    if (!bar || e.target.closest('.w-btn') || o.max || e.button !== 0) return;

    // drag the window by its title bar
    e.preventDefault();
    var el = o.el, sx = e.clientX, sy = e.clientY, l = el.offsetLeft, t = el.offsetTop, moved = false;
    try { bar.setPointerCapture(e.pointerId); } catch (_) {}
    el.classList.add('dragging');
    function move(ev) {
      if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 3) return;
      moved = true;
      el.style.left = Math.round(clamp(l + ev.clientX - sx, 90 - el.offsetWidth, D.W - 90)) + 'px';
      el.style.top = Math.round(clamp(t + ev.clientY - sy, 0, D.H - 34)) + 'px';
    }
    function up() {
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', up);
      bar.removeEventListener('pointercancel', up);
      el.classList.remove('dragging');
      if (moved) {
        o.fx = el.offsetLeft / D.W;
        o.fy = el.offsetTop / D.H;
        save();
      }
    }
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up);
    bar.addEventListener('pointercancel', up);
  });
  desk.addEventListener('dblclick', function (e) {
    var bar = e.target.closest('.win-bar');
    if (bar && !e.target.closest('.w-btn')) toggleMax(winOf(bar));
  });
  desk.addEventListener('click', function (e) {
    var b = e.target.closest('.w-btn');
    if (!b) return;
    var o = winOf(b), act = b.getAttribute('data-act');
    if (act === 'min') minWin(o);
    else if (act === 'max') toggleMax(o);
    else if (act === 'close') closeWin(o);
  });
  desk.addEventListener('focusin', function (e) {
    var o = winOf(e.target);
    if (o && front() !== o) raise(o);
  });
  // remember the layout just before leaving for a project page
  desk.addEventListener('click', function (e) { if (e.target.closest('a')) save(); }, true);

  taskBox.addEventListener('click', function (e) {
    var b = e.target.closest('.task');
    if (!b) return;
    var o = wins[b.getAttribute('data-slug')];
    if (o.min) openWin(o);
    else if (front() === o) minWin(o);
    else { raise(o); o.el.focus({ preventScroll: true }); save(); }
  });

  // ---------------------------------------------------------------- start button: About panel
  var startBtn = document.getElementById('start'), menu = document.getElementById('start-menu'), menuBody = document.getElementById('sm-body');
  var aboutState = 0;   // 0 not loaded, 1 loading, 2 done
  function loadAbout() {
    if (aboutState || !window.fetch || !window.DOMParser) return;
    aboutState = 1;
    fetch('about.html').then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (text) {
      var doc = new DOMParser().parseFromString(text, 'text/html');
      var lead = doc.querySelector('.about-intro .lead'), cols = doc.querySelector('.about-cols');
      var html = (lead ? '<p class="sm-lead">' + lead.innerHTML + '</p>' : '') + (cols ? '<div class="sm-cols">' + cols.innerHTML + '</div>' : '');
      if (html) menuBody.innerHTML = html;
      aboutState = 2;
    }).catch(function () { aboutState = 0; });
  }
  function toggleStart(open) {
    if (!startBtn || !menu) return;
    menu.hidden = !open;
    startBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { loadAbout(); menu.focus({ preventScroll: true }); }
  }
  if (startBtn && menu) {
    menu.tabIndex = -1;
    startBtn.addEventListener('click', function () { toggleStart(menu.hidden); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('[data-act="close-start"]')) { toggleStart(false); startBtn.focus(); return; }
      var r = e.target.closest('.reveal');   // e-mail address shows only after a click
      if (r) {
        var a = r.getAttribute('data-user') + '@' + r.getAttribute('data-domain');
        var link = document.createElement('a');
        link.href = 'mailto:' + a;
        link.textContent = a;
        r.replaceWith(link);
        link.focus();
      }
    });
    document.addEventListener('pointerdown', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !startBtn.contains(e.target)) toggleStart(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { toggleStart(false); startBtn.focus(); }
    });
    setTimeout(loadAbout, 1500);
  }

  // ---------------------------------------------------------------- clock
  var clock = document.getElementById('clock');
  function tick() {
    var d = new Date();
    clock.textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    clock.setAttribute('datetime', d.toISOString());
  }
  if (clock) { tick(); setInterval(tick, 15000); }
})();
