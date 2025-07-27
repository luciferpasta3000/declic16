const CACHE_NAME = 'matteos-declic-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Installation
self.addEventListener('install', event => {
  console.log('🔮 SW: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('🔮 SW: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('🔮 SW: Fichiers mis en cache');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ SW: Erreur installation:', error);
      })
  );
});

// Activation
self.addEventListener('activate', event => {
  console.log('🔮 SW: Activation...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('🔮 SW: Suppression cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🔮 SW: Activé');
        return self.clients.claim();
      })
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

console.log('🔮 Service Worker chargé');const CACHE_NAME = 'matteos-declic-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('🔮 Service Worker: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('🔮 Mise en cache...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('🔮 Installation terminée');
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('🔮 Service Worker: Activation...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('🔮 Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🔮 Activation terminée');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retour cache si disponible
        if (response) {
          return response;
        }
        
        // Sinon fetch réseau
        return fetch(event.request)
          .then(response => {
            // Vérification validité
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone pour cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback pour navigation
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

console.log('🔮 Service Worker chargé');