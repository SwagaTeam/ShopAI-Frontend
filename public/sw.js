self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Базовый обработчик fetch для соответствия требованиям PWA
  event.respondWith(fetch(event.request));
});
