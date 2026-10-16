/* ==========================================================================
   Okeymoney — Service worker registration.
   Shared by every entry point (root, 404, about/, legal/, config/,
   tools/<slug>/, offline) so it can run as an external file: the CSP in
   `_headers` is `script-src 'self'` with no `unsafe-inline`, so an inline
   <script> here is silently blocked by the browser and the PWA never
   installs. Uses an absolute path so the same file works at any depth.

   The URL and options MUST stay identical to the ones in app.js, which also
   registers (config/index.html loads app.js but not this file). A registration
   is keyed by SCOPE, not by script URL, so registering "sw.js?build=72" here
   and "/sw.js" there means each page load flips the registered script and
   forces a second full precache. Same rule that made ludia's sw.js and
   sw-v10.js fight over the root scope.
   ========================================================================== */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;

  /* Reload once when a NEW worker takes control. Only when a worker already
     controlled this page: the very first install claims the page without a
     reload. Same logic as app.js; the registration itself stays identical. */
  var hadController = !!navigator.serviceWorker.controller;
  var reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController || reloaded) return;
    reloaded = true;
    location.reload();
  });

  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
    .then(function (registration) {
      /* Ask for a new sw.js whenever the tab comes back into view. */
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') registration.update().catch(function () {});
      });
    })
    .catch(function () {});
})();
