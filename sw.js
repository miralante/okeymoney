/* ============================================================
   Okeymoney — Service Worker
   Cache-first strategy for the app shell (works offline).
   When adding new files: add them to FILES and bump VERSION.
   ============================================================ */
var VERSION = 'okeymoney-v52';

var FILES = [
  './index.html',
  './offline.html',
  './manifest.json',
  './app.js',
  './data.js',
  './strings.es.js',
  './strings.en.js',
  './styles.css',
  './legal/index.html',
  './legal/styles.css',
  './legal/strings.es.js',
  './legal/strings.en.js',
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/componentes.css',
  './assets/fonts/atkinson-hyperlegible-400.woff2',
  './assets/fonts/atkinson-hyperlegible-700.woff2',
  './assets/fonts/nunito-variable.woff2',
  './assets/js/utils.js',
  './assets/js/i18n.js',
  './assets/js/tts.js',
  './assets/js/storage.js',
  './assets/js/feedback.js',
  './assets/js/money.js',
  './assets/js/wallet.js',
  './assets/js/activity-runtime.js',
  './assets/css/activities.css',
  './assets/img/icono-euro.svg',

  /* Activities live in tools/<slug>/. When adding a new activity, append
     its files here AND bump VERSION so installed PWAs get the new shell. */
  './tools/concepts-money/index.html',
  './tools/concepts-money/app.js',
  './tools/concepts-money/strings.es.js',
  './tools/concepts-money/strings.en.js',
  './tools/needs-vs-wants/index.html',
  './tools/needs-vs-wants/app.js',
  './tools/needs-vs-wants/strings.es.js',
  './tools/needs-vs-wants/strings.en.js',
  './tools/budget-first/index.html',
  './tools/budget-first/app.js',
  './tools/budget-first/strings.es.js',
  './tools/budget-first/strings.en.js',
  './tools/go-shopping/index.html',
  './tools/go-shopping/app.js',
  './tools/go-shopping/strings.es.js',
  './tools/go-shopping/strings.en.js',
  './tools/change-back/index.html',
  './tools/change-back/app.js',
  './tools/change-back/strings.es.js',
  './tools/change-back/strings.en.js',
  './tools/my-shopping-day/index.html',
  './tools/my-shopping-day/app.js',
  './tools/my-shopping-day/strings.es.js',
  './tools/my-shopping-day/strings.en.js',
  './tools/safe-money/index.html',
  './tools/safe-money/app.js',
  './tools/safe-money/strings.es.js',
  './tools/safe-money/strings.en.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      /* cache: 'reload' avoids storing stale copies from the browser's HTTP cache */
      var requests = FILES.map(function (a) {
        return new Request(a, { cache: 'reload' });
      });
      return cache.addAll(requests);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== VERSION; })
          .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (r) {
        /* Also cache new same-origin resources — but never cache a
           redirect. Safari (and the Fetch spec) rejects a top-level
           navigation served by a SW that carries a Location header
           ("Response served by service worker has redirections"), so we
           follow the redirect and cache only the final 200. */
        if (r.status === 200) {
          var copy = r.clone();
          caches.open(VERSION).then(function (cache) {
            cache.put(event.request, copy);
          });
        }
        return r;
      }).catch(function () {
        /* Offline / network failure: serve offline.html (i18n-aware via
           the same strings.<locale>.js files cached at install), or a
           minimal fallback if even that misses in the cache. */
        return caches.match('./offline.html').then(function (offline) {
          if (offline) return offline;
          return new Response(
            '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<title>Offline</title></head><body>' +
            '<h1>Offline</h1>' +
            '<p><a href="./index.html">Back to Okeymoney</a></p>' +
            '</body></html>',
            { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        });
      });
    })
  );
});
