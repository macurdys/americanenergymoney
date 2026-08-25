/* ═══════════════════════════════════════════════════════════════════════
   AMERICAN ENERGY MONEY — SHARED BEHAVIOUR
   ───────────────────────────────────────────────────────────────────────
   Every block below is optional and self-guarding: if the markup it needs
   is absent, it does nothing. Drop this on any page using aem-theme.css.

     Scroll reveal   any .rise element
     Rail progress   #railFill, .rmark links whose href points at a section
     Nav state       #nav gains .stuck past 40px
     Video           #briefVideo + #btnPlay + #btnMute, audio starts OFF

   Load before </body>:  <script src="aem-theme.js"></script>
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── reveal on scroll ── */
  var rises = document.querySelectorAll('.rise');
  // Arm the hidden state only now that JS is confirmed running. Without this
  // class the CSS leaves every .rise visible, so a failed script degrades to
  // a static page rather than a blank one.
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-anim');
  }
  if (reduce || !('IntersectionObserver' in window)) {
    rises.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    rises.forEach(function (el) { io.observe(el); });
  }

  /* ── rail progress + active section + nav state ── */
  var fill   = document.getElementById('railFill');
  var navEl  = document.getElementById('nav');
  var marks  = Array.prototype.slice.call(document.querySelectorAll('.rmark'));
  var secs   = marks.map(function (m) { return document.querySelector(m.getAttribute('href')); });
  var ticking = false;

  function frame() {
    ticking = false;
    var y   = window.scrollY !== undefined ? window.scrollY : window.pageYOffset || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (fill) fill.style.height = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (navEl) navEl.classList.toggle('stuck', y > 40);

    var mid = y + window.innerHeight * 0.42, active = 0;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= mid) active = i; });
    marks.forEach(function (m, i) { m.classList.toggle('on', i === active); });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* ── video: play/pause + audio (starts off) ── */
  var v = document.getElementById('briefVideo');
  var play = document.getElementById('btnPlay');
  var mute = document.getElementById('btnMute');
  if (!v) return;
  v.muted = true;

  function syncPlay() {
    var on = !v.paused && !v.ended;
    play.classList.toggle('is-on', on);
    play.setAttribute('aria-pressed', on ? 'true' : 'false');
    play.setAttribute('aria-label', on ? 'Pause video' : 'Play video');
  }
  function syncMute() {
    mute.classList.toggle('is-on', !v.muted);
    mute.setAttribute('aria-pressed', v.muted ? 'false' : 'true');
    mute.setAttribute('aria-label', v.muted ? 'Unmute video' : 'Mute video');
  }
  function tryPlay() { var p = v.play(); if (p && p.catch) p.catch(syncPlay); }

  if (v.readyState >= 2) tryPlay();
  v.addEventListener('loadeddata', tryPlay);

  var userPaused = false;
  play.addEventListener('click', function () {
    if (v.paused) { userPaused = false; tryPlay(); }
    else { userPaused = true; v.pause(); }
  });
  mute.addEventListener('click', function () {
    v.muted = !v.muted;
    if (!v.muted && v.paused && !userPaused) tryPlay();
    syncMute();
  });
  ['play', 'pause', 'ended'].forEach(function (e) { v.addEventListener(e, syncPlay); });
  v.addEventListener('volumechange', syncMute);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && v.paused && !userPaused) tryPlay();
  });

  function fail() {
    var f = document.getElementById('briefFrame');
    if (!f || f.dataset.failed) return;
    f.dataset.failed = '1';
    var box = document.createElement('div');
    box.className = 'brief-error';
    box.innerHTML = 'Video did not load. Confirm <code>images/uniform-distribution.mp4</code> and ' +
      '<code>images/uniform-distribution-poster.jpg</code> are uploaded, that the folder is ' +
      'lowercase <code>images</code>, and that the page is served over http rather than opened ' +
      'from the file system.';
    f.replaceWith(box);
  }
  v.addEventListener('error', fail, true);
  var src = v.querySelector('source');
  if (src) src.addEventListener('error', fail);

  syncPlay(); syncMute();
})();
