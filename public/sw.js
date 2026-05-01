// جمالكِ (Jamalik) Service Worker - Enhanced for Offline
// Cache versioning - bump this when updating static assets
const CACHE_VERSION = 'musalsalat-cache-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Static assets to pre-cache (app shell)
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon.svg',
];

// Install event - pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Fallback: cache individually if batch fails
        return Promise.allSettled(
          STATIC_ASSETS.map((url) =>
            fetch(url).then((response) => {
              if (response.ok) cache.put(url, response);
            }).catch(() => {})
          )
        );
      });
    })
  );
  // Activate new service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - routing strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (except images from external CDNs)
  if (url.origin !== location.origin && !request.url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
    return;
  }

  // API calls - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets (JS, CSS, fonts, images) - Cache first, fallback to network
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigation requests (HTML pages) - Network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else - Stale while revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// Cache-first strategy for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    // Return offline fallback
    return getOfflineFallback();
  }
}

// Network-first strategy for pages and API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/');
      if (offlinePage) return offlinePage;
    }
    return getOfflineFallback();
  }
}

// Stale-while-revalidate strategy for other resources
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Offline fallback response
function getOfflineFallback() {
  return new Response(
    '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مسلسلات أونلاين - غير متصل</title><style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0a0a0a;color:#fff;text-align:center;padding:20px}svg{margin-bottom:16px;opacity:.5}h1{font-size:1.5rem;margin:0 0 8px}p{color:#888;margin:0}button{margin-top:20px;padding:10px 24px;border-radius:12px;border:none;background:linear-gradient(135deg,#e11d48,#f43f5e);color:#fff;font-weight:bold;cursor:pointer;font-size:14px}</style></head><body><div><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/></svg><h1>غير متصل بالإنترنت</h1><p>يبدو أنك غير متصل. تحقق من اتصالك وحاول مرة أخرى.</p><button onclick="location.reload()">إعادة المحاولة</button></div></body></html>',
    {
      status: 503,
      statusText: 'Offline',
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}

// Check if the request is for a static asset
function isStaticAsset(url) {
  return url.match(/\.(js|css|woff2?|ttf|eot|png|jpg|jpeg|gif|webp|svg|ico|json)$/i) !== null;
}
