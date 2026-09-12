// Service Worker for Manga / Comic Action FPS PWA
const CACHE_NAME = 'manga-fps-v17';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './manifest.webmanifest',
  './icon-192.svg',
  './icon-512.svg',
  './src/main.js',
  './src/render.js',
  './src/player.js',
  './src/weapons.js',
  './src/enemies.js',
  './src/level.js',
  './src/effects.js',
  './src/audio.js',
  './src/input.js',
  './src/mobile.js',
  './src/ui.js',
  './src/constants.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('PWA Pre-cache skipped some dynamic resources:', err);
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

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    }).catch(() => {
      return fetch(event.request);
    })
  );
});
