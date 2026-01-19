
// A unique name for the cache - Bumped to v3 to force update
const CACHE_NAME = 'amaz-crm-cache-v3';

// A list of files to cache for offline use
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.tailwindcss.com',
];

// Install event: cache the app shell
self.addEventListener('install', event => {
  self.skipWaiting(); // Force new service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => console.log("Cache addAll failed:", err));
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all clients immediately
  );
});

// Fetch event: serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Push event: handle incoming push notifications
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
        data = event.data.json();
    } catch (e) {
        data = { body: event.data.text() };
    }
  }

  const title = data.title || 'Amaz CRM Notification';
  const options = {
    body: data.body || 'You have a new update.',
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  };

  if (data.type === 'alarm') {
      options.vibrate = [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500];
      options.tag = 'alarm-notification';
      options.renotify = true;
      options.requireInteraction = true;
  }

  event.waitUntil(self.registration.showNotification(title, options));
});
