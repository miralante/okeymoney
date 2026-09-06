/* ==========================================================================
   Okeymoney — Shared utilities
   Exposes window.App.utils
   Load with: <script src="assets/js/utils.js"></script>
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  /** Shortcut for querySelector. */
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  /** Shortcut for querySelectorAll (returns an Array). */
  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /** Today's date as 'YYYY-MM-DD' (local time). */
  function today() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  /** true if the user prefers less animation. */
  function reducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Generates a short, non-cryptographic unique id for local records. */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  var ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** Escapes free text (e.g. a goal name typed by the person) before it is
      concatenated into an innerHTML string or an HTML attribute. */
  function escapeHtml(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) { return ESCAPE_MAP[c]; });
  }

  /* ---------------------------------------------------------------
    * Shared footer injector.
    *
    * Replaces the hand-maintained <footer class="pie-app"> block
    * in site/index.html (the landing) with a canonical source.
    * The 8 tools/<slug>/index.html pages don't carry a footer
    * (single-activity app, footer lives in the shell); about/,
    * config/ and legal/ keep richer footer structures with extra
    * nav links that aren't shared with the landing.
    * --------------------------------------------------------------- */
  function inyectarPie() {
    if (!window.App || !window.App.i18n) return;
    var pies = document.querySelectorAll('footer[data-pie-app]');
    for (var i = 0; i < pies.length; i++) {
      var pie = pies[i];
      if (pie.childNodes && pie.childNodes.length > 0) continue;
      var base = pie.getAttribute('data-pie-base') || '../';
      var includeConfig = pie.getAttribute('data-pie-include-config') === 'true';
      var extraClass = pie.getAttribute('data-pie-class');
      if (extraClass) pie.className = (pie.className ? pie.className + ' ' : '') + extraClass;
      var html = '';
      if (includeConfig) {
        html += '<a href="' + base + 'config/" class="enlace-legal" data-i18n="core.config"></a>';
      }
      html += '<a href="' + base + 'legal/index.html" class="enlace-legal" data-i18n="core.dataProtection"></a>';
      pie.innerHTML = html;
      if (typeof window.App.i18n.apply === 'function') {
        window.App.i18n.apply(pie);
      }
    }
  }

  window.App.utils = {
    $: $,
    $$: $$,
    today: today,
    reducedMotion: reducedMotion,
    uid: uid,
    escapeHtml: escapeHtml,
    inyectarPie: inyectarPie
  };
})();
