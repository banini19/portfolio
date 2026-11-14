/* Pictures that appear only where the mouse has moved, as if they were being drawn.
   Used by the paper cover on the front page (CeREELs). The words are a separate picture and always show.

   drawReveal(area, stage, canvas, base)
     area    where mouse movement counts (the whole slide)
     stage   the box the drawing is fitted to (same shape as the picture)
     canvas  where the revealed drawing is painted
     base    picture path without ".webp" (a "-s" copy is used on small screens)
   returns { sweep(), fill() }: sweep draws the whole picture by itself once (for phones). */
(function () {
  'use strict';
  window.drawReveal = function (area, stage, canvas, base) {
    var ctx = canvas.getContext('2d'), mask = document.createElement('canvas'), pen = mask.getContext('2d');
    var art = new Image(), ready = false, frame = 0, last = null, swept = false;

    function paint() {
      frame = 0;
      if (!ready || !canvas.width) return;
      ctx.globalCompositeOperation = 'copy';
      ctx.drawImage(mask, 0, 0);
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(art, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }
    function later() { if (!frame) frame = requestAnimationFrame(paint); }
    function size() {
      var r = stage.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
      var w = Math.round(r.width * d), h = Math.round(r.height * d);
      if (!w || !h || (w === canvas.width && h === canvas.height)) return;
      var old = null;
      if (mask.width) {   // keep what was already drawn
        old = document.createElement('canvas'); old.width = mask.width; old.height = mask.height;
        old.getContext('2d').drawImage(mask, 0, 0);
      }
      canvas.width = mask.width = w; canvas.height = mask.height = h;
      if (old) pen.drawImage(old, 0, 0, w, h);
      if (!art.src) art.src = base + (w > 1000 ? '' : '-s') + '.webp';
      later();
    }
    // a few uneven strokes side by side, like colouring in with a soft pencil
    function stroke(a, b, scale) {
      var r = mask.width * 0.055 * (scale || 1);
      pen.lineCap = pen.lineJoin = 'round'; pen.strokeStyle = '#000'; pen.globalAlpha = 0.55;
      for (var k = 0; k < 7; k++) {
        var ox = (Math.random() - 0.5) * r, oy = (Math.random() - 0.5) * r;
        pen.lineWidth = r * (0.55 + Math.random() * 0.5);
        pen.beginPath(); pen.moveTo(a.x + ox, a.y + oy); pen.lineTo(b.x + ox + 0.1, b.y + oy); pen.stroke();
      }
      pen.globalAlpha = 1;
      later();
    }
    function fill(times) {   // finish the picture softly
      var n = 0;
      (function step() {
        pen.globalAlpha = 0.25; pen.fillRect(0, 0, mask.width, mask.height); pen.globalAlpha = 1; later();
        if (++n < (times || 4)) requestAnimationFrame(step);
      })();
    }
    function sweep() {   // one zig-zag pass over the whole picture, then the rest fills in
      if (swept) return;
      swept = true;
      var rows = 5, start = performance.now(), dur = 2400, prev = null;
      requestAnimationFrame(function step(now) {
        var k = Math.min(1, (now - start) / dur), pos = k * rows, row = Math.min(rows - 1, Math.floor(pos)), f = pos - row;
        var p = {
          x: ((row % 2 ? 1 - f : f) * 1.1 - 0.05) * mask.width,
          y: ((row + 0.5) / rows + Math.sin(f * Math.PI * 3) * 0.04) * mask.height
        };
        if (prev) stroke(prev, p, 2.4);
        prev = p;
        if (k < 1) requestAnimationFrame(step); else fill(10);
      });
    }

    area.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || !mask.width) return;
      var r = stage.getBoundingClientRect();
      var p = { x: (e.clientX - r.left) / r.width * mask.width, y: (e.clientY - r.top) / r.height * mask.height, t: e.timeStamp };
      stroke(last && p.t - last.t < 120 ? last : p, p);
      last = p;
    });
    area.addEventListener('pointerleave', function () { last = null; });
    art.onload = function () { ready = true; later(); };
    size();
    window.addEventListener('resize', size);
    return { sweep: sweep, fill: fill, size: size };
  };
})();
