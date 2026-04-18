/* ============================================================
   CRIMSON HOSTING — Service Worker
   Cache-first for static assets, network-first for HTML
   ============================================================ */

const CACHE = 'crimson-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/Logo.webp',
  '/headshot.webp',
  '/headshot2.webp',
  '/After Chilangos.webp',
  '/Chilangos Before.webp',
  '/Creama After.webp',
  '/Creama Before.webp',
  '/Joy In Christ After.webp',
  '/Joy In Christ Before.webp',
  '/moreinfo/index.html',
  '/tos/index.html',
];

/* ── Install: pre-cache all static assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* ── Activate: purge old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── Fetch: cache-first for assets, network-first for HTML ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests (e.g. fonts, formspree)
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  const isHTML = request.headers.get('Accept')?.includes('text/html');

  if (isHTML) {
    // Network-first for HTML so content updates are always fresh
    event.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache-first for CSS, JS, images — serve instantly, update in background
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(res => {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        });
        return cached || network;
      })
    );
  }
});
