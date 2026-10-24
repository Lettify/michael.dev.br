const CACHE_NAME = 'ms-portfolio-v1.0.2';

// Core shell assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache non-critical error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests and http/https schemes
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Bypass third-party analytics and API serverless routes
  if (url.hostname.includes('vercel-insights.com') || url.hostname.includes('vercel-scripts.com') || url.pathname.startsWith('/api/')) {
    return;
  }

  // Strategy 1: HTML Navigation (Network-First with Cache Fallback)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Strategy 2: Static Assets (Same-Origin Stale-While-Revalidate with Cache-First Fallback)
  // Assets include JS, CSS, Web Fonts (woff2), PNG, SVG, WebP, audio fx
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cachedRes) => {
      // Revalidate in background
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          // Offline fallback
          return cachedRes;
        });

      return cachedRes || fetchPromise;
    })
  );
});
