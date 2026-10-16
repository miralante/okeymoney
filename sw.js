/* ============================================================
   Okeymoney — Service Worker
   Network-first strategy with a cache fallback (works offline).
   The server copy wins whenever the device is online, so a deploy
   reaches installed PWAs without anyone bumping VERSION by hand.
   When adding new files: add them to FILES and bump VERSION (the
   precache still needs the list for offline use).
   ============================================================ */
var VERSION = 'okeymoney-v132';

var FILES = [
  './tools/monthly-payments/',
  './tools/monthly-payments/app.js',
  './tools/monthly-payments/strings.es.js',
  './tools/monthly-payments/strings.en.js',
  './tools/compare-prices/',
  './tools/compare-prices/app.js',
  './tools/compare-prices/strings.es.js',
  './tools/compare-prices/strings.en.js',
  './tools/save-step-by-step/',
  './tools/save-step-by-step/app.js',
  './tools/save-step-by-step/strings.es.js',
  './tools/save-step-by-step/strings.en.js',
  './',
  './offline.html',
  './manifest.json',
  './app.js',
  './data.js',
  './strings.es.js',
  './strings.en.js',
  './styles.css',
  './legal/',
  './legal/styles.css',
  './legal/strings.es.js',
  './legal/strings.en.js',
  './config/',
  './config/app.js',
  './config/styles.css',
  './config/strings.es.js',
  './config/strings.en.js',
  './about/',
  './about/styles.css',
  './about/strings.es.js',
  './about/strings.en.js',
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/componentes.css',
  './assets/css/locale-picker.css',
  './assets/js/locale-picker.js',
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
  /* External scripts that used to be inline <script> blocks. The CSP is
     `script-src self`, so they must stay external: locale-picker-config
     (the okeymoney:locale key), sw-register (the PWA) and sw-refresh
     (offline.html). */
  './assets/js/locale-picker-config.js',
  './assets/js/sw-register.js',
  './assets/js/sw-refresh.js',
  './assets/css/activities.css',
  './assets/img/icono-euro.svg',

  /* Activities live in tools/<slug>/. When adding a new activity, append
     its files here AND bump VERSION so installed PWAs get the new shell. */
  './tools/concepts-money/',
  './tools/concepts-money/app.js',
  './tools/concepts-money/strings.es.js',
  './tools/concepts-money/strings.en.js',
  './tools/needs-vs-wants/',
  './tools/needs-vs-wants/app.js',
  './tools/needs-vs-wants/strings.es.js',
  './tools/needs-vs-wants/strings.en.js',
  './tools/budget-first/',
  './tools/budget-first/app.js',
  './tools/budget-first/strings.es.js',
  './tools/budget-first/strings.en.js',
  './tools/before-buying/',
  './tools/before-buying/app.js',
  './tools/before-buying/strings.es.js',
  './tools/before-buying/strings.en.js',
  './tools/go-shopping/',
  './tools/go-shopping/app.js',
  './tools/go-shopping/strings.es.js',
  './tools/go-shopping/strings.en.js',
  './tools/change-back/',
  './tools/change-back/app.js',
  './tools/change-back/strings.es.js',
  './tools/change-back/strings.en.js',
  './tools/my-shopping-day/',
  './tools/my-shopping-day/app.js',
  './tools/my-shopping-day/strings.es.js',
  './tools/my-shopping-day/strings.en.js',
  './tools/safe-money/',
  './tools/safe-money/app.js',
  './tools/safe-money/strings.es.js',
  './tools/safe-money/strings.en.js',

  /* Public landing site/. Added when /site/ was created; bump VERSION
     so installed PWAs refetch the shell and pick the new files. */
  './site/',
  './site/styles.css',
  './site/strings.es.js',
  './site/strings.en.js'
];

/* Cloudflare answers EVERY "/x.html" URL with a 307 to its extensionless form
   (/index.html -> /, /404.html -> /404, /offline.html -> /offline). Following
   that redirect yields a response with `redirected === true`, and the Cache API
   PRESERVES that flag across a store/load round trip, so cache.addAll()
   silently poisons the entry under its original key. Chrome refuses to hand
   such a response to a top-level navigation ("Response served by service
   worker has redirections").

   Rebuilding the response produces a brand-new object whose flag is false while
   keeping body, status and headers. */
function deRedirect(res) {
  if (!res || !res.redirected) return res;
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  });
}

/* addAll() stores the followed response as-is, so precache entry by entry and
   sanitise. Still all-or-nothing: a missing file rejects, as addAll did. */
function precache(cache, files) {
  return Promise.all(files.map(function (file) {
    /* cache: 'reload' avoids stale copies from the browser HTTP cache */
    return fetch(new Request(file, { cache: 'reload' })).then(function (res) {
      if (!res || !res.ok) throw new Error('precache failed: ' + file);
      return cache.put(file, deRedirect(res));
    });
  }));
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return precache(cache, FILES);
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
  /* localhost is the live development environment. Do not let an old
     app-shell cache hide source changes while testing there. */
  var isLocalDevelopment = self.location.hostname === 'localhost' ||
    self.location.hostname === '127.0.0.1';
  /* Network-first, cache fallback. Cache-first pinned installed clients to
     the first copy of every file, so deploys stayed invisible until the
     site data was cleared. The cache answers only when the network is
     unreachable. */
  event.respondWith(
    fetch(event.request, isLocalDevelopment ? { cache: 'no-store' } : undefined).then(function (r) {
      /* Cache same-origin resources, but never a redirect. Following one
         still yields status 200 with redirected === true, which is exactly
         the poisoned entry the precache comment above describes. */
      if (r.status === 200) {
        caches.open(VERSION).then(function (cache) {
          cache.put(event.request, deRedirect(r.clone()));
        });
      }
      return deRedirect(r);
    }).catch(function () {
      return caches.match(event.request).then(function (cached) {
        if (cached) return deRedirect(cached);
        /* Offline and not cached: serve offline.html (i18n-aware via the
           same strings.<locale>.js files cached at install), or a minimal
           fallback if even that misses in the cache. */
        return caches.match('./offline.html').then(function (offline) {
          /* This one IS a navigation response: a poisoned entry here is
             exactly the reported failure. Sanitise it. */
          if (offline) return deRedirect(offline);
          return new Response(
            '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<title>Offline</title></head><body>' +
            '<h1>Offline</h1>' +
            '<p><a href="./">Back to Okeymoney</a></p>' +
            '</body></html>',
            { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        });
      });
    })
  );
});
