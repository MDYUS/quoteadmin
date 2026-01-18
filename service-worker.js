
// A unique name for the cache
const CACHE_NAME = 'amaz-crm-cache-v2';

// A list of files to cache for offline use
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json', // Ensure the manifest is cached
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.tailwindcss.com',
];

// Install event: cache the app shell
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache).catch(err => console.log("Cache addAll failed for some resources:", err));
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
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
  console.log('[Service Worker] Push Received.');

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
    icon: '/icon-192.png', // Icon to display in the notification
    badge: '/icon-192.png' // Icon for the notification tray
  };

  // If specific vibration pattern is requested (e.g., for Warning Alarm)
  if (data.type === 'alarm') {
      // Long vibration pattern: Vibrate 500ms, pause 100ms, vibrate 500ms...
      options.vibrate = [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500];
      options.tag = 'alarm-notification';
      options.renotify = true;
      options.requireInteraction = true; // Keep notification on screen until user interacts
  }

  event.waitUntil(self.registration.showNotification(title, options));
});
