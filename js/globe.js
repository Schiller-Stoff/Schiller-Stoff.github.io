/* ==========================================================================
   globe.html — the memory globe.

   One script, no dependency, loaded with `defer` after data/globe/derla-globe.js.
   Everything it adds is gated by `html.globe-ready`: without this file, or when
   the data is missing, the page keeps its static map, its state table and every
   count, and `html.globe-failed` shows the one sentence that says so.

   Plain module: camera → render → pointer → sheet → list → live region.
   No window.onload, no scroll listeners, no wheel, no inertia, no auto-rotation.
   The only rAF runs while a drag or a camera flight is active.
   ========================================================================== */
(function () {
  'use strict';

  var UI_FALLBACK = {
    wholeGlobe: 'Whole globe',
    backToAustria: 'Back to Austria',
    stateSummary: '{state}',
    stateRowMeta: '{n} records · {share} · {t} sites of terror',
    stateRowMetaOne: '{n} records · {share} · One site of terror',
    stateSheet: '{n} records · {share} of the country · {t} sites of terror',
    stateSheetOne: '{n} records · {share} of the country · One site of terror',
    nearCount: '{n} more records at this position',
    nearCountOne: 'One more record at this position',
    sheetRecord: 'DERLA record',
    sheetState: 'State',
    sheetEmpty: 'Select a point, a state, or a record.',
    openRecord: 'Open the DERLA record',
    noRecordLink: 'No record link in the dataset',
    showing: 'Showing {n} of {total} records',
    showingOne: 'Showing {n} of {total} record',
    more: 'Show {n} more records',
    moreOne: 'Show 1 more record',
    emptyFilter: 'No record in this state matches these filters.',
    emptySearch: 'No record matches that search.',
    emptyState: 'This state has no records in the extract.',
    statusStateSelected: '{state} selected. {n} records, {share} of the country.',
    statusRecordSelected: '{title} selected.',
    statusFiltered: '{n} records shown.',
    undated: 'Date not recorded',
    layerMissing: 'Layer not recorded',
    accessMissing: 'Access not recorded',
    addressMissing: 'Address not recorded',
    outsideAustria: 'Outside Austria',
    dataMissing: 'The record data could not be loaded. The static map and the state table are still complete.'
  };

  var TAU = Math.PI * 2;
  var D2R = Math.PI / 180;
  var R2D = 180 / Math.PI;
  var STEP = 120;
  var AT_LON = 14.15;
  var AT_LAT = 47.65;
  var MAX_R = 30;
  var MIN_R = 0.5;

  var root = document.documentElement;
  var lang = (root.lang || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  var isDE = lang === 'de';
  var nf = new Intl.NumberFormat(lang);
  var pf = new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 1 });

  var UI = loadUI();
  function loadUI() {
    var out = {};
    var key;
    for (key in UI_FALLBACK) {
      if (Object.prototype.hasOwnProperty.call(UI_FALLBACK, key)) out[key] = UI_FALLBACK[key];
    }
    var node = document.querySelector('script[data-ui-strings]');
    if (!node) return out;
    try {
      var parsed = JSON.parse(node.textContent);
      for (key in parsed) {
        if (Object.prototype.hasOwnProperty.call(parsed, key) && typeof parsed[key] === 'string') {
          out[key] = parsed[key];
        }
      }
    } catch (err) {
      /* A broken island leaves the English fallback, never a blank string. */
    }
    return out;
  }

  function fmt(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, key) {
      return vars[key] !== undefined && vars[key] !== null ? vars[key] : m;
    });
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function clamp(n, lo, hi) {
    return n < lo ? lo : n > hi ? hi : n;
  }

  var stage = byId('globe-stage');
  var canvas = byId('globe-canvas');
  var sheet = byId('globe-sheet');
  var sheetLabel = sheet && sheet.querySelector('.globe-sheet__label');
  var sheetTitle = byId('globe-sheet-title');
  var sheetSummary = byId('globe-sheet-summary');
  var sheetFacts = byId('globe-sheet-facts');
  var sheetNear = byId('globe-sheet-near');
  var sheetNearList = byId('globe-sheet-nearlist');
  var sheetLink = byId('globe-sheet-link');
  var sheetLinkA = sheetLink && sheetLink.querySelector('a');
  var sheetNoLink = byId('globe-sheet-nolink');
  var sheetClose = sheet && sheet.querySelector('[data-globe-close]');
  var live = byId('globe-status');
  var tip = byId('globe-tip');
  var pin = byId('globe-pin');
  var zoomOutBtn = document.querySelector('[data-globe-zoom="-1"]');
  var zoomInBtn = document.querySelector('[data-globe-zoom="1"]');
  var viewBtn = document.querySelector('[data-globe-view]');
  var listEl = byId('globe-list');
  var countEl = byId('globe-count');
  var emptyEl = byId('globe-empty');
  var moreRow = listEl && listEl.parentNode.querySelector('.globe-more-row');
  var moreBtn = byId('globe-more');
  var searchEl = byId('globe-search');
  var rowTpl = byId('globe-row-template');
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-globe-filter]'));

  var D = window.DERLA_GLOBE;
  var pts;
  var P;
  var forcedMQ = window.matchMedia('(forced-colors: active)');
  var rmMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarseMQ = window.matchMedia('(pointer: coarse)');

  var W = 0;
  var H = 0;
  var pixelRatio = 1;
  var maxPixels = 2800000;
  var lowPower = false;
  var slowFrames = 0;
  var R0 = 0;
  var CAM = { lon: AT_LON, lat: AT_LAT, R: 1, cx: 0, cy: 0 };
  var view = 'austria';
  var selectedState = -1;
  var selectedPos = null;
  var selectedRecord = -1;
  var hoverState = -1;
  var sheetMode = 'empty';
  var focusOwner = null;
  var scope = [];
  var limit = STEP;
  var filter = 'all';
  var query = '';
  var queryTimer = 0;
  var order = [];
  var stateNames = [];
  var stateCount = [];
  var stateTerror = [];
  var stateBBox = [];
  var terror = null;
  var recPos = null;
  var matchMem = null;
  var matchTer = null;

  var positions = [];
  var posByKey = new Map();
  var rows = [];
  var hay = [];
  var PAL = null;
  var ctx = null;
  var raf = 0;
  var flight = null;
  var drag = null;

  /* ---------------------------------------------------------------- camera */

  function sinLat() {
    return Math.sin(CAM.lat * D2R);
  }

  function cosLat() {
    return Math.cos(CAM.lat * D2R);
  }

  function project(lon, lat) {
    var s0 = sinLat();
    var c0 = cosLat();
    var l = (lon - CAM.lon) * D2R;
    var f = lat * D2R;
    var cf = Math.cos(f);
    var cosc = s0 * Math.sin(f) + c0 * cf * Math.cos(l);
    if (cosc < 0) return null;
    return {
      x: CAM.cx + CAM.R * cf * Math.sin(l),
      y: CAM.cy - CAM.R * (c0 * Math.sin(f) - s0 * cf * Math.cos(l)),
      z: cosc
    };
  }

  function unproject(px, py) {
    var x = (px - CAM.cx) / CAM.R;
    var y = (CAM.cy - py) / CAM.R;
    var rho = Math.sqrt(x * x + y * y);
    if (rho > 1) return null;
    if (rho < 1e-9) return [CAM.lon, CAM.lat];
    var s0 = sinLat();
    var c0 = cosLat();
    var c = Math.asin(rho);
    var sc = Math.sin(c);
    var cc = Math.cos(c);
    var lat = Math.asin(cc * s0 + (y * sc * c0) / rho);
    var lon = CAM.lon + Math.atan2(x * sc, rho * cc * c0 - y * sc * s0) * R2D;
    return [lon, lat * R2D];
  }

  /* `polys` is a country: [polygon[ring[lon,lat,…]]]. */
  function eachRing(polys, cb) {
    var i;
    var j;
    for (i = 0; i < polys.length; i++) {
      for (j = 0; j < polys[i].length; j++) cb(polys[i][j]);
    }
  }

  function allStatePolys() {
    var out = [];
    D.states.forEach(function (s) { out = out.concat(s.polys); });
    return out;
  }

  /* The projected bounding box about `lon0`/`lat0`. Austria is not symmetric
     about its central meridian, so the width has to be max − min, not twice
     the largest offset; the symmetric form shrinks the country to 61 % of the
     frame while the caption promises 74. */
  function extentOf(polys, lon0, lat0) {
    var s0 = Math.sin(lat0 * D2R);
    var c0 = Math.cos(lat0 * D2R);
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
    eachRing(polys, function (ring) {
      var i;
      for (i = 0; i < ring.length; i += 2) {
        var l = (ring[i] - lon0) * D2R;
        var f = ring[i + 1] * D2R;
        var cf = Math.cos(f);
        var x = cf * Math.sin(l);
        var y = c0 * Math.sin(f) - s0 * cf * Math.cos(l);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    });
    return { w: maxX - minX, h: maxY - minY };
  }

  function austriaRadius() {
    var ext = extentOf(allStatePolys(), AT_LON, AT_LAT);
    return Math.min((0.74 * W) / ext.w, (0.88 * H) / ext.h);
  }

  function stateTarget(i) {
    var s = D.states[i];
    var lon = s.centroid[0];
    var lat = s.centroid[1];
    var ext = extentOf(s.polys, lon, lat);
    var rx = (0.72 * W) / ext.w;
    var ry = (0.72 * H) / ext.h;
    return { lon: lon, lat: lat, R: clamp(Math.min(rx, ry), R0 * MIN_R, R0 * MAX_R) };
  }

  function austriaCamera() {
    return { lon: AT_LON, lat: AT_LAT, R: R0 };
  }

  function globeCamera() {
    return { lon: AT_LON, lat: AT_LAT, R: 0.42 * Math.min(W, H) };
  }

  /* ------------------------------------------------------------------ init */

  function fail() {
    root.classList.remove('globe-ready');
    root.classList.add('globe-failed');
    if (sheetLabel) sheetLabel.textContent = UI.sheetRecord;
    if (sheetTitle) sheetTitle.textContent = UI.dataMissing;
    if (sheetSummary) sheetSummary.textContent = '';
    if (sheetFacts) sheetFacts.hidden = true;
    if (sheetNear) sheetNear.hidden = true;
    if (sheetNearList) sheetNearList.hidden = true;
    if (sheetLink) sheetLink.hidden = true;
    if (sheetNoLink) sheetNoLink.hidden = true;
    if (sheetClose) sheetClose.hidden = true;
  }

  function init() {
    if (!D || !D.points || !D.states || !D.world || !D.meta || !D.points.lon || !D.points.lon.length) {
      return fail();
    }
    if (!canvas || !stage || !canvas.getContext) return fail();
    ctx = canvas.getContext('2d');
    if (!ctx || !window.Path2D) return fail();

    pts = D.points;
    P = D.meta.detail;
    buildData();
    PAL = palette();
    enhanceTable();
    buildList();
    bindSheet();
    bindCanvas();
    /* `globe-ready` docks the sheet beside the stage, so it has to be set
       before the stage is measured; no paint happens between these lines. */
    root.classList.add('globe-ready');
    setupCanvas(false);
    R0 = austriaRadius();
    CAM.R = R0;
    showEmpty();
    applyScope();
    bindControls();
    draw();
    requestDraw();
    if (forcedMQ.addEventListener) {
      forcedMQ.addEventListener('change', repaint);
    }
    if (rmMQ.addEventListener) {
      rmMQ.addEventListener('change', function () {
        if (flight) {
          CAM.lon = flight.to.lon;
          CAM.lat = flight.to.lat;
          CAM.R = flight.to.R;
          flight = null;
          requestDraw();
        }
      });
    }
  }

  function buildData() {
    var n = pts.lon.length;
    var i;
    var s;
    D.states.forEach(function (st) {
      stateCount.push(0);
      stateTerror.push(0);
      stateBBox.push(null);
      stateNames.push('');
    });
    terror = new Uint8Array(n);
    recPos = new Uint16Array(n);
    for (i = 0; i < n; i++) {
      var layer = pts.layer[i];
      var layerName = layer === null || layer === undefined ? '' : pts.layers[layer] || '';
      /* Classify by the layer's name, as the generator does, so a new layer
         inserted into the sorted table cannot silently reclassify records. */
      if (layerName.indexOf('Orte des Terrors') === 0) terror[i] = 1;
    }
    for (i = 0; i < n; i++) {
      s = pts.state[i];
      if (s !== null && s !== undefined && stateCount[s] !== undefined) {
        stateCount[s]++;
        if (terror[i]) stateTerror[s]++;
      }
    }
    D.states.forEach(function (st, idx) {
      stateBBox[idx] = bboxOf(st.polys);
    });
    for (i = 0; i < n; i++) {
      var key = keyOf(i);
      var pos = posByKey.get(key);
      if (!pos) {
        pos = { index: positions.length, lon: pts.lon[i], lat: pts.lat[i], list: [], memMask: 0, terrorMask: 0, hasMem: false, hasTerror: false };
        posByKey.set(key, pos);
        positions.push(pos);
      }
      pos.list.push(i);
      recPos[i] = pos.index;
      s = pts.state[i];
      if (s !== null && s !== undefined) {
        if (terror[i]) {
          pos.terrorMask |= 1 << s;
          pos.hasTerror = true;
        } else {
          pos.memMask |= 1 << s;
          pos.hasMem = true;
        }
      } else if (terror[i]) {
        pos.hasTerror = true;
      } else {
        pos.hasMem = true;
      }
    }
    order = new Array(n);
    for (i = 0; i < n; i++) order[i] = i;
    order.sort(function (a, b) {
      var sa = pts.state[a];
      var sb = pts.state[b];
      sa = sa === null || sa === undefined ? 9 : sa;
      sb = sb === null || sb === undefined ? 9 : sb;
      return sa - sb || a - b;
    });
    hay = new Array(n);
    for (i = 0; i < n; i++) {
      var st = pts.state[i];
      var place = st === null || st === undefined ? '' : D.states[st].nameEn + ' ' + D.states[st].name;
      hay[i] = normalise(pts.title[i] + ' ' + (pts.address[i] || '') + ' ' + place + ' ' + (pts.types[pts.type[i]] || ''));
    }
  }

  function normalise(str) {
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function bboxOf(polys) {
    var box = [180, 90, -180, -90];
    eachRing(polys, function (ring) {
      var i;
      for (i = 0; i < ring.length; i += 2) {
        var lon = ring[i];
        var lat = ring[i + 1];
        if (lon < box[0]) box[0] = lon;
        if (lat < box[1]) box[1] = lat;
        if (lon > box[2]) box[2] = lon;
        if (lat > box[3]) box[3] = lat;
      }
    });
    return box;
  }

  /* The generator rounds every point to 4 decimals (`POINT_DECIMALS`); the
     key must use the same precision or the 4,210 positions and their near
     lists silently change. */
  function keyOf(i) {
    return pts.lon[i].toFixed(4) + ',' + pts.lat[i].toFixed(4);
  }

  /* ----------------------------------------------------------------- table */

  function enhanceTable() {
    var rowsEl = document.querySelectorAll('.globe-states__row');
    Array.prototype.forEach.call(rowsEl, function (row) {
      var id = row.getAttribute('data-state');
      var idx = D.states.findIndex(function (s) { return s.id === id; });
      if (idx < 0) return;
      var cells = row.cells;
      if (cells.length < 4) return;
      var name = (cells[0].textContent || '').trim();
      if (name) stateNames[idx] = name;
      cells[0].textContent = '';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'globe-states__pick';
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = name;
      btn.addEventListener('click', function (ev) {
        selectState(idx, btn, ev.detail === 0);
      });
      var meta = document.createElement('span');
      meta.className = 'globe-states__meta';
      meta.textContent = stateMeta(idx);
      cells[0].appendChild(btn);
      cells[0].appendChild(meta);
      var share = D.states[idx].share;
      cells[2].textContent = '';
      var bar = document.createElement('span');
      bar.className = 'globe-states__share';
      bar.setAttribute('aria-hidden', 'true');
      var fill = document.createElement('span');
      fill.className = 'globe-states__share-fill';
      fill.style.setProperty('--v', (share * 100).toFixed(2));
      bar.appendChild(fill);
      var pct = document.createElement('span');
      pct.className = 'globe-states__pct';
      pct.textContent = pf.format(share);
      cells[2].appendChild(bar);
      cells[2].appendChild(pct);
      cells[1].textContent = nf.format(stateCount[idx]);
      cells[3].textContent = nf.format(stateTerror[idx]);
      row.__globe = { index: idx, button: btn };
      rows[idx] = row;
    });
    D.states.forEach(function (s, i) {
      if (!stateNames[i]) stateNames[i] = isDE ? s.name : s.nameEn || s.name;
    });
  }

  function stateMeta(idx) {
    return fmt(stateTerror[idx] === 1 ? UI.stateRowMetaOne : UI.stateRowMeta, {
      n: nf.format(stateCount[idx]),
      share: pf.format(D.states[idx].share),
      t: nf.format(stateTerror[idx])
    });
  }

  function stateSheetMeta(idx) {
    return fmt(stateTerror[idx] === 1 ? UI.stateSheetOne : UI.stateSheet, {
      n: nf.format(stateCount[idx]),
      share: pf.format(D.states[idx].share),
      t: nf.format(stateTerror[idx])
    });
  }

  function updateTableSelection() {
    rows.forEach(function (row, i) {
      if (!row) return;
      var on = i === selectedState;
      row.classList.toggle('is-selected', on);
      if (row.__globe) row.__globe.button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function syncRowHover() {
    rows.forEach(function (row, i) {
      if (row) row.classList.toggle('is-hover', i === hoverState && i !== selectedState);
    });
  }

  function clearHover() {
    hoverState = -1;
    syncRowHover();
    if (tip) tip.classList.remove('is-visible');
  }

  /* ---------------------------------------------------------------- canvas */

  function palette() {
    if (forcedMQ.matches) {
      var ink = sysColor('CanvasText');
      var paper = sysColor('Canvas');
      return {
        ocean: paper,
        landFill: paper,
        landStroke: ink,
        globeFill: paper,
        globeStroke: ink,
        grid: ink,
        gridAlpha: 0.5,
        stateFill: paper,
        hoverFill: paper,
        stateStroke: ink,
        national: ink,
        mem: ink,
        terrorist: ink,
        ring: ink
      };
    }
    return {
      ocean: token('--canvas'),
      landFill: token('--canvas'),
      landStroke: token('--rule'),
      globeFill: token('--surface-paper'),
      globeStroke: token('--rule-strong'),
      grid: 'rgba(11,11,20,0.07)',
      gridAlpha: 1,
      stateFill: token('--surface-paper'),
      hoverFill: token('--action-soft'),
      stateStroke: token('--rule-strong'),
      national: token('--ink-soft'),
      mem: token('--action'),
      terrorist: token('--ink'),
      ring: token('--action')
    };
  }

  function token(name) {
    return getComputedStyle(root).getPropertyValue(name).trim() || '#000';
  }

  var probe = null;
  function sysColor(name) {
    if (!probe) {
      probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden';
      stage.appendChild(probe);
    }
    probe.style.color = name;
    var value = getComputedStyle(probe).color;
    return value && value !== 'rgba(0, 0, 0, 0)' ? value : '#000';
  }

  function repaint() {
    PAL = palette();
    requestDraw();
  }

  function setupCanvas(gesture) {
    var w = stage.clientWidth || 1;
    var h = stage.clientHeight || 1;
    var dpr = Math.min(window.devicePixelRatio || 1, gesture ? 1.5 : 2);
    if (lowPower) dpr = 1;
    if (w * h * dpr * dpr > maxPixels) dpr = Math.max(1, Math.sqrt(maxPixels / (w * h)));
    W = w;
    H = h;
    pixelRatio = dpr;
    var bw = Math.max(1, Math.round(w * dpr));
    var bh = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== bw) canvas.width = bw;
    if (canvas.height !== bh) canvas.height = bh;
    CAM.cx = W / 2;
    CAM.cy = H / 2;
    if (!ctx) ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(now) {
    raf = 0;
    if (flight) {
      var f = flight;
      var t = clamp((now - f.t0) / f.dur, 0, 1);
      var e = 1 - Math.pow(1 - t, 3);
      CAM.lon = f.from.lon + (f.to.lon - f.from.lon) * e;
      CAM.lat = f.from.lat + (f.to.lat - f.from.lat) * e;
      CAM.R = Math.exp(Math.log(f.from.R) + (Math.log(f.to.R) - Math.log(f.from.R)) * e);
      if (t >= 1) {
        CAM.lon = f.to.lon;
        CAM.lat = f.to.lat;
        CAM.R = f.to.R;
        flight = null;
        updateZoom();
      }
      draw();
      if (flight) raf = window.requestAnimationFrame(frame);
    } else {
      draw();
    }
  }

  function requestDraw() {
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  function flyTo(target, dur) {
    var ms = rmMQ.matches ? 0 : dur;
    if (!ms) {
      CAM.lon = target.lon;
      CAM.lat = target.lat;
      CAM.R = target.R;
      flight = null;
      updateZoom();
      draw();
      return;
    }
    flight = { from: { lon: CAM.lon, lat: CAM.lat, R: CAM.R }, to: target, t0: performance.now(), dur: ms };
    updateZoom();
    requestDraw();
  }

  function trace(ring, path) {
    var pen = false;
    var clipped = false;
    var i;
    for (i = 0; i < ring.length; i += 2) {
      var p = project(ring[i], ring[i + 1]);
      if (!p) {
        pen = false;
        clipped = true;
        continue;
      }
      if (!pen) {
        path.moveTo(p.x, p.y);
        pen = true;
      } else {
        path.lineTo(p.x, p.y);
      }
    }
    /* The data rings are open; close the drawn ring so the 2.4px national
       stroke has no sub-pixel gap. A ring that crossed the limb stays open,
       otherwise the chord would print across the invisible half. */
    if (pen && !clipped) path.closePath();
  }

  function worldPath() {
    var path = new Path2D();
    /* D.world.polys is [country][polygon][ring], one level deeper than a
       state's [polygon][ring]; eachRing expects the latter. */
    D.world.polys.forEach(function (country) {
      eachRing(country, function (ring) { trace(ring, path); });
    });
    return path;
  }

  function statePaths(only) {
    var path = new Path2D();
    D.states.forEach(function (s, i) {
      if (only !== undefined && i !== only) return;
      eachRing(s.polys, function (ring) { trace(ring, path); });
    });
    return path;
  }

  function graticule(path, globe) {
    var step = globe ? 15 : 1;
    var spanLon = ((W / 2) / CAM.R) * R2D / Math.max(0.2, Math.abs(cosLat())) + step;
    var spanLat = ((H / 2) / CAM.R) * R2D + step;
    var lon0 = Math.floor((CAM.lon - spanLon) / step) * step;
    var lon1 = CAM.lon + spanLon;
    var lat0 = Math.max(-80, Math.floor((CAM.lat - spanLat) / step) * step);
    var lat1 = Math.min(80, CAM.lat + spanLat);
    var lon;
    var lat;
    var t;
    var guard = 0;
    for (lon = lon0; lon <= lon1 && guard < 400; lon += step, guard++) {
      var p = false;
      for (t = -80; t <= 80; t += 2) {
        var q = project(lon, t);
        if (!q) {
          p = false;
          continue;
        }
        if (!p) {
          path.moveTo(q.x, q.y);
          p = true;
        } else {
          path.lineTo(q.x, q.y);
        }
      }
    }
    for (lat = lat0; lat <= lat1 && guard < 800; lat += step, guard++) {
      var r = false;
      for (t = CAM.lon - 180; t <= CAM.lon + 180; t += 3) {
        var v = project(t, lat);
        if (!v) {
          r = false;
          continue;
        }
        if (!r) {
          path.moveTo(v.x, v.y);
          r = true;
        } else {
          path.lineTo(v.x, v.y);
        }
      }
    }
  }

  function markPaths() {
    var mem = new Path2D();
    var ter = new Path2D();
    var i;
    for (i = 0; i < positions.length; i++) {
      var pos = positions[i];
      var p = project(pos.lon, pos.lat);
      pos.visible = !!p;
      if (!p) continue;
      pos.sx = p.x;
      pos.sy = p.y;
      if (pos.hasMem) {
        mem.moveTo(p.x + 1.15, p.y);
        mem.arc(p.x, p.y, 1.15, 0, TAU);
      }
      if (pos.hasTerror) {
        ter.rect(p.x - 1.1, p.y - 1.1, 2.2, 2.2);
      }
    }
    return { mem: mem, ter: ter };
  }

  /* Screen-space pick for the cursor only: points are drawn once, and the
     canvas is static while the pointer is not dragging, so the last draw's
     projected coordinates are current. No per-dot tooltip. */
  function hitPoint(px, py) {
    var best = 64;
    var hit = false;
    var i;
    for (i = 0; i < positions.length; i++) {
      var pos = positions[i];
      if (!pos.visible) continue;
      var dx = px - pos.sx;
      var dy = py - pos.sy;
      var d = dx * dx + dy * dy;
      if (d <= best) {
        best = d;
        hit = true;
      }
    }
    return hit;
  }

  function markPathFor(kind, state, matchedOnly) {
    var path = new Path2D();
    var maskMatch = kind === 'mem' ? matchMem : matchTer;
    var i;
    for (i = 0; i < positions.length; i++) {
      var pos = positions[i];
      if (matchedOnly && (!maskMatch || !maskMatch[pos.index])) continue;
      if (kind === 'mem' ? !pos.hasMem : !pos.hasTerror) continue;
      if (state >= 0) {
        var mask = kind === 'mem' ? pos.memMask : pos.terrorMask;
        if (!(mask & (1 << state))) continue;
      }
      var p = project(pos.lon, pos.lat);
      if (!p) continue;
      if (kind === 'mem') {
        path.moveTo(p.x + 1.15, p.y);
        path.arc(p.x, p.y, 1.15, 0, TAU);
      } else {
        path.rect(p.x - 1.1, p.y - 1.1, 2.2, 2.2);
      }
    }
    return path;
  }

  function draw() {
    if (!ctx || !PAL) return;
    var t0 = drag || flight ? performance.now() : 0;
    var moving = !!(drag || flight);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = PAL.ocean;
    ctx.fillRect(0, 0, W, H);

    if (view === 'globe') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(CAM.cx, CAM.cy, CAM.R, 0, TAU);
      ctx.clip();
      var land = worldPath();
      ctx.fillStyle = PAL.globeFill;
      ctx.fill(land);
      ctx.strokeStyle = PAL.globeStroke;
      ctx.lineWidth = 0.8;
      ctx.lineJoin = 'round';
      ctx.stroke(land);
      ctx.strokeStyle = PAL.grid;
      ctx.globalAlpha = PAL.gridAlpha;
      ctx.lineWidth = 1;
      var grid = new Path2D();
      graticule(grid, true);
      ctx.stroke(grid);
      ctx.globalAlpha = 1;
      ctx.fillStyle = PAL.ring;
      ctx.fill(statePaths());
      ctx.restore();
      ctx.beginPath();
      ctx.arc(CAM.cx, CAM.cy, CAM.R, 0, TAU);
      ctx.strokeStyle = PAL.stateStroke;
      ctx.lineWidth = 1;
      ctx.stroke();
      updateChips();
      return;
    }

    var world = worldPath();
    ctx.strokeStyle = PAL.landStroke;
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.stroke(world);

    ctx.strokeStyle = PAL.grid;
    ctx.globalAlpha = PAL.gridAlpha;
    ctx.lineWidth = 1;
    var g = new Path2D();
    graticule(g, false);
    ctx.stroke(g);
    ctx.globalAlpha = 1;

    var states = statePaths();
    ctx.strokeStyle = PAL.national;
    ctx.lineWidth = 2.4;
    ctx.stroke(states);
    ctx.fillStyle = PAL.stateFill;
    ctx.fill(states);
    ctx.strokeStyle = PAL.stateStroke;
    ctx.lineWidth = 1;
    ctx.stroke(states);

    if (hoverState >= 0 && hoverState !== selectedState) {
      var hp = statePaths(hoverState);
      ctx.fillStyle = PAL.hoverFill;
      ctx.fill(hp);
      ctx.strokeStyle = PAL.ring;
      ctx.lineWidth = 1.5;
      ctx.stroke(hp);
    }
    if (selectedState >= 0) {
      var sp = statePaths(selectedState);
      ctx.fillStyle = PAL.hoverFill;
      ctx.fill(sp);
      ctx.strokeStyle = PAL.ring;
      ctx.lineWidth = 2;
      ctx.stroke(sp);
    }

    var marks = markPaths();
    var force = forcedMQ.matches;
    var dim = selectedState >= 0 && !moving;
    var filtering = !moving && (filter !== 'all' || !!query);
    if (dim) {
      /* In forced colours the unselected marks are dropped rather than
         washed out: opacity must not carry the distinction. */
      if (!force) drawMarks(marks.mem, marks.ter, 0.2, 0.3);
      if (filtering) {
        drawMarks(markPathFor('mem', selectedState, true), markPathFor('ter', selectedState, true), 0.55, 0.85);
      } else {
        drawMarks(markPathFor('mem', selectedState), markPathFor('ter', selectedState), 0.55, 0.85);
      }
    } else if (filtering) {
      if (!force) drawMarks(marks.mem, marks.ter, 0.15, 0.15);
      drawMarks(markPathFor('mem', -1, true), markPathFor('ter', -1, true), 0.55, 0.85);
    } else {
      drawMarks(marks.mem, marks.ter, 0.55, 0.85);
    }

    if (selectedPos) {
      var sel = project(selectedPos.lon, selectedPos.lat);
      if (sel) {
        ctx.beginPath();
        ctx.arc(sel.x, sel.y, 8.5, 0, TAU);
        ctx.strokeStyle = PAL.ring;
        ctx.globalAlpha = forcedMQ.matches ? 1 : 0.35;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(sel.x, sel.y, 5.5, 0, TAU);
        ctx.fillStyle = PAL.ocean;
        ctx.fill();
        ctx.strokeStyle = PAL.ring;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    updateChips();
    if (t0) {
      var dt = performance.now() - t0;
      if (dt > 24) {
        slowFrames++;
        if (slowFrames >= 3 && !lowPower) {
          lowPower = true;
          setupCanvas(false);
        }
      } else {
        slowFrames = 0;
      }
    }
  }

  function drawMarks(mem, ter, memAlpha, terAlpha) {
    var force = forcedMQ.matches;
    ctx.globalAlpha = force ? 1 : memAlpha;
    ctx.fillStyle = PAL.mem;
    ctx.fill(mem);
    ctx.globalAlpha = force ? 1 : terAlpha;
    ctx.strokeStyle = PAL.terrorist;
    ctx.lineWidth = 2.2;
    ctx.stroke(ter);
    ctx.globalAlpha = 1;
  }

  function updateChips() {
    if (!pin || !tip) return;
    if (selectedRecord >= 0 && view !== 'globe') {
      var pos = selectedPos;
      var p = pos && project(pos.lon, pos.lat);
      if (p) {
        pin.textContent = shorten(pts.title[selectedRecord], 34);
        pin.style.left = p.x + 'px';
        pin.style.top = p.y + 'px';
        pin.classList.add('is-visible');
      } else {
        pin.classList.remove('is-visible');
      }
    } else {
      pin.classList.remove('is-visible');
    }
  }

  function shorten(str, n) {
    str = String(str);
    return str.length > n ? str.slice(0, n - 1) + '…' : str;
  }

  /* --------------------------------------------------------------- pointer */

  function bindCanvas() {
    if (!canvas) return;
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onCancel);
    canvas.addEventListener('pointerleave', function () {
      if (hoverState !== -1) {
        hoverState = -1;
        syncRowHover();
        requestDraw();
      }
      if (tip) tip.classList.remove('is-visible');
      canvas.style.cursor = '';
    });
    if (window.ResizeObserver) {
      var pending = 0;
      new ResizeObserver(function () {
        if (pending) return;
        pending = window.requestAnimationFrame(function () {
          pending = 0;
          onResize();
        });
      }).observe(stage);
    } else {
      window.addEventListener('resize', onResize);
    }
  }

  function onDown(ev) {
    if (!ev.isPrimary || ev.button !== 0) return;
    clearHover();
    drag = {
      id: ev.pointerId,
      x: ev.offsetX,
      y: ev.offsetY,
      startX: ev.offsetX,
      startY: ev.offsetY,
      t: performance.now(),
      moved: 0
    };
    canvas.classList.add('is-dragging');
    if (canvas.setPointerCapture) canvas.setPointerCapture(ev.pointerId);
    setupCanvas(true);
    requestDraw();
  }

  function onMove(ev) {
    if (!drag) {
      if (view === 'globe') {
        canvas.style.cursor = '';
        return;
      }
      var st = hitState(ev.offsetX, ev.offsetY);
      canvas.style.cursor = hitPoint(ev.offsetX, ev.offsetY) ? 'pointer' : '';
      if (st !== hoverState) {
        hoverState = st;
        syncRowHover();
        requestDraw();
      }
      if (tip) {
        if (st >= 0) {
          tip.textContent = stateNames[st];
          tip.style.left = clamp(ev.offsetX, 40, W - 40) + 'px';
          tip.style.top = Math.max(24, ev.offsetY) + 'px';
          tip.classList.add('is-visible');
        } else {
          tip.classList.remove('is-visible');
        }
      }
      return;
    }
    ev.preventDefault();
    var dx = ev.offsetX - drag.x;
    var dy = ev.offsetY - drag.y;
    drag.x = ev.offsetX;
    drag.y = ev.offsetY;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    var cl = Math.max(0.2, Math.abs(cosLat()));
    CAM.lon -= dx / (CAM.R * cl) * R2D;
    CAM.lat += dy / CAM.R * R2D;
    CAM.lat = clamp(CAM.lat, -85, 85);
    CAM.lon = ((CAM.lon + 540) % 360) - 180;
    requestDraw();
  }

  function onUp(ev) {
    if (!drag || drag.id !== ev.pointerId) return;
    var tap = drag.moved < 8 && performance.now() - drag.t < 300;
    drag = null;
    canvas.classList.remove('is-dragging');
    if (canvas.releasePointerCapture && canvas.hasPointerCapture && canvas.hasPointerCapture(ev.pointerId)) {
      canvas.releasePointerCapture(ev.pointerId);
    }
    setupCanvas(false);
    if (tap) {
      ev.preventDefault();
      /* In the whole-globe pose no points are drawn, so a tap must not pick
         an invisible record. Austria is the only object there; a tap on it
         returns to the country view, where states and points are legible. */
      if (view === 'globe') {
        if (hitState(ev.offsetX, ev.offsetY) >= 0) toggleView();
      } else {
        var pos = pickPosition(ev.offsetX, ev.offsetY);
        if (pos) {
          selectPoint(pos.list[0], null, false);
        } else {
          var st = hitState(ev.offsetX, ev.offsetY);
          if (st >= 0) selectState(st, null, false);
        }
      }
    }
    requestDraw();
  }

  function onCancel(ev) {
    if (!drag) return;
    drag = null;
    canvas.classList.remove('is-dragging');
    setupCanvas(false);
    requestDraw();
  }

  function onResize() {
    var old = R0;
    setupCanvas(false);
    R0 = austriaRadius();
    if (view === 'globe') {
      CAM.R = globeCamera().R;
    } else {
      var ratio = old ? CAM.R / old : 1;
      CAM.R = clamp(R0 * ratio, R0 * MIN_R, R0 * MAX_R);
    }
    PAL = palette();
    updateZoom();
    draw();
  }

  function pickPosition(px, py) {
    var limitPx = coarseMQ.matches ? 14 : 8;
    var best = null;
    var bestD = limitPx * limitPx;
    var i;
    for (i = 0; i < positions.length; i++) {
      var pos = positions[i];
      var p = project(pos.lon, pos.lat);
      if (!p) continue;
      var dx = p.x - px;
      var dy = p.y - py;
      var d = dx * dx + dy * dy;
      if (d <= bestD) {
        bestD = d;
        best = pos;
      }
    }
    return best;
  }

  function hitState(px, py) {
    if (!D.states.length) return -1;
    var ll = unproject(px, py);
    if (!ll) return -1;
    var lon = ll[0];
    var lat = ll[1];
    var i;
    for (i = 0; i < D.states.length; i++) {
      var box = stateBBox[i];
      if (lon < box[0] || lon > box[2] || lat < box[1] || lat > box[3]) continue;
      if (inPolys(D.states[i].polys, lon, lat)) return i;
    }
    return -1;
  }

  function inPolys(polys, lon, lat) {
    var i;
    var j;
    var hits;
    for (i = 0; i < polys.length; i++) {
      /* Even-odd across a polygon's rings, so a hole (Vienna inside Lower
         Austria) is excluded. OR-ing every ring would put Vienna in both. */
      hits = 0;
      for (j = 0; j < polys[i].length; j++) {
        if (inRing(polys[i][j], lon, lat)) hits++;
      }
      if (hits % 2 === 1) return true;
    }
    return false;
  }

  function inRing(ring, x, y) {
    var inside = false;
    var i;
    var j;
    for (i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
      var xi = ring[i];
      var yi = ring[i + 1];
      var xj = ring[j];
      var yj = ring[j + 1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  /* -------------------------------------------------------------- controls */

  function bindControls() {
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', function () { zoom(-1); });
    if (zoomInBtn) zoomInBtn.addEventListener('click', function () { zoom(1); });
    if (viewBtn) viewBtn.addEventListener('click', toggleView);
    if (moreBtn) moreBtn.addEventListener('click', function () {
      limit += STEP;
      renderList();
    });
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filter = btn.getAttribute('data-globe-filter');
        filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        limit = STEP;
        applyScope();
        announce(scope.length === 0 ? emptyMessage() : fmt(UI.statusFiltered, { n: nf.format(scope.length) }));
      });
    });
    if (searchEl) {
      searchEl.addEventListener('input', function () {
        var value = searchEl.value;
        window.clearTimeout(queryTimer);
        queryTimer = window.setTimeout(function () {
          query = normalise(value.trim());
          limit = STEP;
          applyScope();
          if (scope.length === 0) announce(emptyMessage());
        }, 120);
      });
    }
    updateZoom();
    setPill();
  }

  function zoom(dir) {
    if (view === 'globe') return;
    var target = clamp(CAM.R * (dir > 0 ? 1.5 : 1 / 1.5), R0 * MIN_R, R0 * MAX_R);
    flyTo({ lon: CAM.lon, lat: CAM.lat, R: target }, 180);
  }

  function updateZoom() {
    var lo = R0 * MIN_R;
    var hi = R0 * MAX_R;
    if (zoomOutBtn) zoomOutBtn.disabled = view === 'globe' || CAM.R <= lo + 0.5;
    if (zoomInBtn) zoomInBtn.disabled = view === 'globe' || CAM.R >= hi - 0.5;
  }

  function setPill() {
    if (!viewBtn) return;
    viewBtn.textContent = view === 'globe' ? UI.backToAustria : UI.wholeGlobe;
    viewBtn.setAttribute('aria-pressed', view === 'globe' ? 'true' : 'false');
  }

  function toggleView() {
    if (view === 'globe') {
      view = 'austria';
      setPill();
      flyTo(austriaCamera(), 520);
      return;
    }
    view = 'globe';
    selectedState = -1;
    clearRecord();
    updateTableSelection();
    clearHover();
    applyScope();
    showEmpty();
    setPill();
    flyTo(globeCamera(), 520);
  }

  /* ------------------------------------------------------------------ list */

  function buildList() {
    if (!rowTpl || !listEl) return;
    filters.forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-globe-filter') === 'all' ? 'true' : 'false');
    });
  }

  function applyScope() {
    var q = query;
    scope = [];
    var i;
    for (i = 0; i < order.length; i++) {
      var idx = order[i];
      var st = pts.state[idx];
      if (selectedState >= 0 && st !== selectedState) continue;
      if (filter === 'memorial' && terror[idx]) continue;
      if (filter === 'terror' && !terror[idx]) continue;
      if (q && hay[idx].indexOf(q) < 0) continue;
      scope.push(idx);
    }
    matchMem = new Uint8Array(positions.length);
    matchTer = new Uint8Array(positions.length);
    for (i = 0; i < scope.length; i++) {
      var ridx = scope[i];
      if (terror[ridx]) matchTer[recPos[ridx]] = 1;
      else matchMem[recPos[ridx]] = 1;
    }
    renderList();
    if (ctx) requestDraw();
  }

  function renderList() {
    if (!listEl) return;
    var total = scope.length;
    var shown = Math.min(limit, total);
    var frag = document.createDocumentFragment();
    var i;
    for (i = 0; i < shown; i++) frag.appendChild(makeRow(scope[i]));
    listEl.textContent = '';
    listEl.appendChild(frag);
    if (countEl) {
      countEl.textContent = fmt(total === 1 ? UI.showingOne : UI.showing, {
        n: nf.format(shown),
        total: nf.format(total)
      });
    }
    if (moreRow) moreRow.hidden = total <= shown;
    if (moreBtn) {
      var rest = Math.min(STEP, total - shown);
      if (rest > 0) moreBtn.textContent = rest === 1 ? UI.moreOne : fmt(UI.more, { n: nf.format(rest) });
    }
    if (emptyEl) {
      emptyEl.classList.toggle('is-visible', total === 0);
      emptyEl.textContent = total === 0 ? emptyMessage() : '';
    }
    if (selectedRecord >= 0) markRow(selectedRecord);
  }

  function emptyMessage() {
    if (query) return UI.emptySearch;
    if (selectedState >= 0) return UI.emptyFilter;
    if (filter !== 'all') return UI.emptyFilter;
    return UI.emptyState;
  }

  function makeRow(i) {
    var li = rowTpl.content.firstElementChild.cloneNode(true);
    var btn = li.firstElementChild;
    btn.setAttribute('data-index', String(i));
    var title = btn.querySelector('.globe-row__title');
    var meta = btn.querySelector('.globe-row__meta');
    meta.id = 'globe-row-meta-' + i;
    btn.setAttribute('aria-describedby', meta.id);
    german(title, pts.title[i], true);
    german(meta, rowMeta(i), rowMetaGerman(i));
    btn.addEventListener('click', function (ev) {
      selectPoint(i, btn, ev.detail === 0);
    });
    return li;
  }

  function rowMeta(i) {
    var place = placeOf(i);
    var type = pts.types[pts.type[i]];
    var year = yearOf(i);
    var parts = [];
    if (place) parts.push(place);
    if (type) parts.push(type);
    parts.push(year || UI.undated);
    return parts.join(' · ');
  }

  /* The meta line mixes German proper nouns and types with two English
     fallbacks (`Date not recorded`, `Outside Austria`); mark it German only
     when no fallback is in the string. A record outside Austria may carry a
     foreign address, so it stays untagged too. */
  function rowMetaGerman(i) {
    if (!yearOf(i)) return false;
    var st = pts.state[i];
    return st !== null && st !== undefined;
  }

  function placeOf(i) {
    var address = pts.address[i];
    if (address && address.trim()) {
      var parts = address.split(',');
      return parts[parts.length - 1].trim();
    }
    var st = pts.state[i];
    return st === null || st === undefined ? UI.outsideAustria : stateNames[st];
  }

  function yearOf(i) {
    var v = pts.dates[pts.date[i]];
    return v && /^(18|19|20)\d\d$/.test(v) ? v : null;
  }

  function german(node, text, de) {
    if (!node) return;
    node.textContent = text;
    if (!isDE && de) node.lang = 'de';
    else node.removeAttribute('lang');
  }

  function markRow(index) {
    var nodes = listEl.querySelectorAll('.globe-row');
    Array.prototype.forEach.call(nodes, function (node) {
      var on = Number(node.getAttribute('data-index')) === index;
      node.parentNode.classList.toggle('is-selected', on);
    });
  }

  /* ----------------------------------------------------------------- sheet */

  function bindSheet() {
    if (sheetClose) sheetClose.addEventListener('click', closeSheet);
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape' || sheetMode === 'empty') return;
      if (ev.target === searchEl) {
        /* Esc belongs to the field while it has focus: clear the query, do
           not take the sheet away from the reader. */
        if (searchEl.value) {
          searchEl.value = '';
          window.clearTimeout(queryTimer);
          query = '';
          limit = STEP;
          applyScope();
        }
        return;
      }
      ev.preventDefault();
      closeSheet();
    });
  }

  function selectState(idx, owner, keyboard) {
    clearHover();
    if (idx === selectedState) {
      deselectState();
      return;
    }
    selectedState = idx;
    limit = STEP;
    clearRecord();
    if (view === 'globe') {
      view = 'austria';
      setPill();
    }
    updateTableSelection();
    applyScope();
    showState(idx);
    focusOwner = keyboard ? owner : null;
    flyTo(stateTarget(idx), 420);
    announce(fmt(UI.statusStateSelected, {
      state: stateNames[idx],
      n: nf.format(stateCount[idx]),
      share: pf.format(D.states[idx].share)
    }));
    openSheetKeyboard();
  }

  function deselectState() {
    selectedState = -1;
    limit = STEP;
    clearRecord();
    updateTableSelection();
    applyScope();
    showEmpty();
    focusOwner = null;
    flyTo(austriaCamera(), 520);
  }

  function showEmpty() {
    sheetMode = 'empty';
    if (sheet) sheet.classList.remove('is-open');
    if (sheetLabel) sheetLabel.textContent = UI.sheetRecord;
    if (sheetTitle) german(sheetTitle, UI.sheetEmpty, false);
    if (sheetSummary) sheetSummary.textContent = '';
    toggleFacts(false);
  }

  function showState(idx) {
    sheetMode = 'state';
    if (sheet) sheet.classList.add('is-open');
    if (sheetLabel) sheetLabel.textContent = UI.sheetState;
    if (sheetTitle) german(sheetTitle, fmt(UI.stateSummary, { state: stateNames[idx] }), false);
    if (sheetSummary) sheetSummary.textContent = stateSheetMeta(idx);
    toggleFacts(false);
    if (sheet) sheet.scrollTop = 0;
  }

  function showRecord(i) {
    sheetMode = 'record';
    if (sheet) sheet.classList.add('is-open');
    if (sheetLabel) sheetLabel.textContent = UI.sheetRecord;
    if (sheetTitle) german(sheetTitle, pts.title[i], true);
    if (sheetSummary) sheetSummary.textContent = '';
    toggleFacts(true);

    setFact('type', pts.types[pts.type[i]], true);
    var layer = pts.layers[pts.layer[i]];
    if (layer === 'NOT_FOUND_ERR') layer = null;
    setFact('layer', layer || UI.layerMissing, !!layer);
    setFact('address', pts.address[i] && pts.address[i].trim() ? pts.address[i] : UI.addressMissing, !!(pts.address[i] && pts.address[i].trim()));
    setFact('date', yearOf(i) || UI.undated, !!yearOf(i));
    setFact('access', pts.publics[pts.public[i]] || UI.accessMissing, !!pts.publics[pts.public[i]]);

    var pos = selectedPos;
    var others = pos ? pos.list.filter(function (n) { return n !== i; }) : [];
    if (sheetNear) {
      sheetNear.hidden = others.length === 0;
      sheetNear.textContent = others.length === 0 ? ''
        : others.length === 1 ? UI.nearCountOne
        : fmt(UI.nearCount, { n: nf.format(others.length) });
    }
    if (sheetNearList) {
      sheetNearList.textContent = '';
      sheetNearList.hidden = others.length === 0;
      others.forEach(function (idx) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'globe-sheet__nearlink';
        german(btn, pts.title[idx], true);
        btn.addEventListener('click', function (ev) {
          selectPoint(idx, btn, ev.detail === 0);
        });
        li.appendChild(btn);
        sheetNearList.appendChild(li);
      });
    }

    var suffix = pts.pidSuffix[i];
    var hasLink = !!(suffix && P && P.url);
    if (sheetLink) sheetLink.hidden = !hasLink;
    if (sheetNoLink) sheetNoLink.hidden = hasLink;
    if (hasLink) {
      sheetLinkA.href = P.url.replace('{pid}', P.pidPrefix + suffix);
      sheetLinkA.setAttribute('target', '_blank');
      sheetLinkA.setAttribute('rel', 'noopener');
    }
    if (sheet) sheet.scrollTop = 0;
  }

  function toggleFacts(on) {
    if (sheetFacts) sheetFacts.hidden = !on;
    if (!on) {
      if (sheetNear) sheetNear.hidden = true;
      if (sheetNearList) {
        sheetNearList.hidden = true;
        sheetNearList.textContent = '';
      }
      if (sheetLink) sheetLink.hidden = true;
      if (sheetNoLink) sheetNoLink.hidden = true;
    }
  }

  function setFact(name, value, de) {
    var node = sheetFacts && sheetFacts.querySelector('[data-globe-fact="' + name + '"]');
    if (node) german(node, value, de);
  }

  function selectPoint(i, owner, keyboard) {
    clearHover();
    selectedRecord = i;
    selectedPos = posByKey.get(keyOf(i)) || null;
    if (view === 'globe') {
      view = 'austria';
      setPill();
      flyTo(austriaCamera(), 520);
    }
    markRow(i);
    showRecord(i);
    focusOwner = keyboard ? owner : null;
    announce(fmt(UI.statusRecordSelected, { title: pts.title[i] }));
    openSheetKeyboard();
    requestDraw();
  }

  function clearRecord() {
    selectedRecord = -1;
    selectedPos = null;
    markRow(-1);
    if (pin) pin.classList.remove('is-visible');
  }

  function openSheetKeyboard() {
    if (focusOwner && document.activeElement !== sheet) {
      sheet.focus({ preventScroll: true });
    }
    if (window.innerWidth > 1120 || !sheet) return;
    var box = sheet.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) {
      sheet.scrollIntoView({ block: 'nearest', behavior: rmMQ.matches ? 'auto' : 'smooth' });
    }
  }

  function closeSheet() {
    var owner = focusOwner;
    focusOwner = null;
    if (sheetMode === 'record') {
      clearRecord();
      if (selectedState >= 0) showState(selectedState);
      else showEmpty();
      requestDraw();
    } else if (sheetMode === 'state') {
      deselectState();
    } else {
      showEmpty();
    }
    if (owner && owner.isConnected) owner.focus();
    else if (searchEl) searchEl.focus({ preventScroll: true });
  }

  function announce(text) {
    if (!live) return;
    live.textContent = '';
    live.textContent = text;
  }

  /* ------------------------------------------------------------------ boot */

  try {
    init();
  } catch (err) {
    fail();
  }
})();
