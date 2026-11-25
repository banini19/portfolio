/* Front page, below the reel: a wall of the works, big and close together, without words.
   Animated projects are short silent clips that play while they are on screen (video/tiles, tools/make_tile_clips.py);
   the others are their main pictures. Pointing at a tile shows the project's name and what was done on it.
   Clicking opens the project page. Tiles are cropped to fit the wall; the project pages show whole pictures. */
(function () {
  'use strict';
  var projects = window.PROJECTS || [], box = document.getElementById('works');
  if (!box || !projects.length) return;

  // every project and every CeREELs work, by slug
  var bySlug = {};
  projects.forEach(function (p) {
    bySlug[p.slug] = { p: p, group: p };
    (p.parts || []).forEach(function (q) { bySlug[q.slug] = { p: q, group: p }; });
  });

  // The wall, in order. w x h = columns x half-rows on a 6-column grid (3 x 4 is a 16:9 tile).
  // clip: a moving tile (video/tiles/<slug>.mp4); pic: the picture shown (also the clip's still before it plays).
  // The sizes are chosen so the tiles fill the wall with no holes; keep each block adding up when changing them.
  var WALL = [
    { slug: 'odie-seoul-inferno', clip: true, pic: 'odie-seoul-inferno/background-02', w: 3, h: 4 },
    { slug: 'asteroid', clip: true, pic: 'asteroid/scene-moon', w: 3, h: 4 },
    { slug: 'odie-odyssey', pic: 'odie-odyssey/poster-final', w: 2, h: 7 },
    { slug: 'drawing', pic: 'drawing/drawing-main', w: 4, h: 3 },
    { slug: 'character-design', pic: 'character-design/lineup-beach', w: 4, h: 4 },
    { slug: 'snow-goblin', clip: true, pic: 'snow-goblin/scene-forest', w: 3, h: 4 },
    { slug: 'circus-wonderland', clip: true, pic: 'circus-wonderland/scene-giant', w: 3, h: 4 },
    { slug: 'ssukki-haeppugi', pic: 'ssukki-haeppugi/characters', w: 3, h: 8 },
    { slug: 'monggae-monggae', clip: true, pic: 'monggae-monggae/scene-underwater', w: 3, h: 4 },
    { slug: 'myoya-gokdong', clip: true, pic: 'myoya-gokdong/scene-cats', w: 3, h: 4 },
    { slug: 'circus-world', clip: true, pic: 'circus-world/scene-circus', w: 3, h: 4 },
    { slug: 'odie-middle-school', pic: 'odie-middle-school/concept-01', w: 3, h: 4 },
    { slug: 'cereels-new-ip', pic: 'cereels-new-ip/concept-01', w: 2, h: 7 },
    { slug: 'cereels-other-ips', pic: 'cereels-other-ips/ella-gator-01', w: 4, h: 4 },
    { slug: 'character-design', pic: 'character-design/circus-performers', w: 4, h: 3 }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var sizes = window.IMG_SIZES || {}, seen = {};
  box.innerHTML = WALL.map(function (t) {
    var hit = bySlug[t.slug];
    if (!hit) return '';
    var p = hit.p, size = sizes[t.pic] || [16, 9];
    // names this tile answers to when coming back from a project page (index.html#slug)
    var keys = [];
    [t.slug, hit.group.slug].forEach(function (k) { if (!seen[k]) { seen[k] = 1; keys.push(k); } });
    var media = t.clip
      ? '<video muted loop playsinline preload="none" poster="img/' + esc(t.pic) + '-s.webp" data-src="video/tiles/' + esc(t.slug) + '.mp4" aria-hidden="true"></video>'
      : '<img src="img/' + esc(t.pic) + '-s.webp" alt="" loading="lazy" decoding="async">';
    return '<a class="tile" href="work.html?p=' + encodeURIComponent(t.slug) + '" data-key="' + esc(keys.join(' ')) + '"' +
      ' style="--w:' + t.w + ';--h:' + t.h + ';--ar:' + (size[0] / size[1]).toFixed(4) + '" aria-label="' + esc(p.title) + '">' + media +
      '<span class="tile-info"><b>' + esc(p.title) + '</b><span>' + esc(p.role || p.type || '') + '</span></span></a>';
  }).join('');

  // clips play only while on screen (and not at all if the visitor asked for less motion)
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clips = [].slice.call(box.querySelectorAll('video'));
  if (reduce || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (!v.src) v.src = v.getAttribute('data-src');
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else v.pause();
    });
  }, { rootMargin: '120px 0px', threshold: .2 });
  clips.forEach(function (v) { io.observe(v); });
})();
