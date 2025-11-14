const CACHE_NAME = 'cyclerroute-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/css/styles.css',
  '/manifest.json',
  '/src/app.js',
  '/src/ui.js',
  '/src/router.js',
  '/src/config.js',
  '/src/utils/distance.js',
  '/src/map/map-init.js',
  '/src/map/route-creator.js',
  '/src/map/route-loader.js',
  '/src/storage/db.js',
  '/src/storage/route-store.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch(() => {
          // Se algum asset falhar, continua mesmo assim
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - offline-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Offline-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Se encontrou no cache, retorna
        if (cachedResponse) {
          return cachedResponse;
        }

        // Senão, tenta fetch da rede
        return fetch(request)
          .then((response) => {
            // Se resposta válida, caches e retorna
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone a response
            const responseToCache = response.clone();

            // Cache dynamic requests (mapas, etc)
            if (url.hostname.includes('tile') || url.hostname.includes('leaflet')) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // Se falhar rede e não tem cache, retorna offline page
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            return null;
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
