/* ==========================================================================
   Okeymoney — service worker refresh.
   Used by offline.html, which is the fallback shown when the app is not
   reachable. External for the same CSP reason as assets/js/sw-register.js:
   `_headers` sets `script-src 'self'`, so the inline block was blocked and
   a returning user stayed on a stale cached version. Loading it here asks
   the browser to re-check sw.js as soon as connectivity is back.
   ========================================================================== */
(function () {
  'use strict';
  if (!navigator.serviceWorker || !navigator.serviceWorker.controller) return;
  navigator.serviceWorker.getRegistration().then(function (reg) {
    if (reg) reg.update();
  }).catch(function () {});
})();
