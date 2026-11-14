/* Builds the project blocks from data/projects.js, and runs the lightbox and email button. */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var SIZES = window.IMG_SIZES || {};

  // one picture: small copy on the page, big copy in the lightbox
  function pic(slug, name, alt, eager) {
    var base = "img/" + slug + "/" + name;
    var size = SIZES[slug + "/" + name] || [4, 3];
    var dims = ' width="' + size[0] + '" height="' + size[1] + '"';
    return '<button class="pic" type="button" data-full="' + base + '.webp" style="--ar:' + (size[0] / size[1]).toFixed(4) + '">' +
      '<img src="' + base + '-s.webp"' + dims + ' alt="' + esc(alt) + '"' + (eager ? "" : ' loading="lazy"') + ' decoding="async"></button>';
  }

  function project(p, i) {
    var meta = "";
    if (p.role) meta += "<div><dt>Role</dt><dd>" + esc(p.role) + "</dd></div>";
    if (p.type) meta += "<div><dt>Type</dt><dd>" + esc(p.type) + "</dd></div>";
    var html = '<article class="project" id="' + esc(p.slug) + '">' +
      '<div class="p-info"><div>' +
        '<p class="p-kicker">' + esc(p.kicker) + "</p>" +
        '<h2 class="p-title">' + esc(p.title) + "</h2>" +
      "</div><div>" +
        '<p class="p-desc">' + esc(p.desc) + "</p>" +
        (meta ? '<dl class="p-meta">' + meta + "</dl>" : "") +
      "</div></div>";
    if (p.hero) html += '<figure class="p-hero">' + pic(p.slug, p.hero, p.title, i < 2) + "</figure>";
    if (p.sketches && p.sketches.length) {
      html += '<div class="p-sketches"><p class="p-label">Sketches</p><div class="row">' +
        p.sketches.map(function (n) { return pic(p.slug, n, p.title + " 스케치"); }).join("") + "</div></div>";
    }
    if (p.gallery && p.gallery.length) {
      html += '<div class="p-grid">' + p.gallery.map(function (n) { return pic(p.slug, n, p.title); }).join("") + "</div>";
    }
    return html + "</article>";
  }

  // several works shown as one project (CeREELs): a short opening, links to each work, then the works in order
  function group(p) {
    var links = p.parts.map(function (q) {
      return '<a href="#' + esc(q.slug) + '">' + esc(q.title) + "</a>";
    }).join("");
    return '<header class="g-head" id="' + esc(p.slug) + '">' +
        '<p class="p-kicker">' + esc(p.kicker) + "</p>" +
        '<h1 class="g-title">' + esc(p.title) + "</h1>" +
        '<p class="g-desc">' + esc(p.desc) + "</p>" +
        (p.type ? '<p class="g-type">' + esc(p.type) + "</p>" : "") +
        '<nav class="g-nav" aria-label="' + esc(p.title) + ' 작업 바로가기">' + links + "</nav>" +
      "</header>" +
      p.parts.map(function (q, j) { return project(q, j); }).join("");
  }
  function render(p, i) { return p.parts ? group(p) : project(p, i); }

  var box = document.getElementById("projects");
  var ALL = window.PROJECTS || [];
  if (box && box.classList.contains("single")) {
    // work.html?p=<slug> : one project, with links to the ones before and after
    var slug = new URLSearchParams(location.search).get("p");
    var i = 0;
    for (var k = 0; k < ALL.length; k++) {
      // an old address of a work that is now inside a bigger project still finds it
      var inside = (ALL[k].parts || []).some(function (q) { return q.slug === slug; });
      if (ALL[k].slug === slug || inside) i = k;
    }
    var p = ALL[i];
    if (p) {
      box.innerHTML = render(p, 0);
      document.title = p.title + " · Kim Gaeun";
      if (p.color) document.body.style.setProperty("--pc", p.color);
      var back = document.querySelector(".back-home");
      if (back) back.href = "./#" + encodeURIComponent(p.slug);
      var pager = document.querySelector(".pager");
      var link = function (j, cls, label) {
        if (j < 0 || j >= ALL.length) return "";
        return '<a class="' + cls + '" href="work.html?p=' + encodeURIComponent(ALL[j].slug) + '"><small>' + label + "</small>" + esc(ALL[j].title) + "</a>";
      };
      if (pager) pager.innerHTML = link(i - 1, "prev", "← 이전") + link(i + 1, "next", "다음 →");
      var part = slug && slug !== p.slug && document.getElementById(slug);
      if (part && !location.hash) part.scrollIntoView();
    }
  } else if (box) {
    box.innerHTML = ALL.map(render).join("");
  }

  // ---------- lightbox: arrows / keys / swipe move within one project
  var lb = document.querySelector(".lb");
  if (lb) {
    var img = lb.querySelector("img"), cap = lb.querySelector("figcaption");
    var list = [], at = 0, lastFocus = null;
    function show(k) {
      at = (k + list.length) % list.length;
      var b = list[at];
      img.src = b.getAttribute("data-full");
      img.alt = b.querySelector("img").alt;
      var title = b.closest(".project").querySelector(".p-title").textContent;
      cap.textContent = title + "  " + (at + 1) + " / " + list.length;
    }
    function open(btn) {
      lastFocus = btn;
      list = Array.prototype.slice.call(btn.closest(".project").querySelectorAll(".pic"));
      show(list.indexOf(btn));
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      lb.querySelector(".lb-close").focus();
    }
    function close() {
      lb.hidden = true;
      img.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".pic");
      if (b) open(b);
    });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(at - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(at + 1); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(at - 1);
      else if (e.key === "ArrowRight") show(at + 1);
    });
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // ---------- email shown only after a click (fewer spam robots)
  document.querySelectorAll(".reveal").forEach(function (b) {
    b.addEventListener("click", function () {
      var a = b.getAttribute("data-user") + "@" + b.getAttribute("data-domain");
      var link = document.createElement("a");
      link.href = "mailto:" + a;
      link.textContent = a;
      b.replaceWith(link);
      link.focus();
    });
  });
})();
