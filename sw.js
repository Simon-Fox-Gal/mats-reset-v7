// Simple cache-first service worker for v7
const CACHE = 'mats-reset-v7-cache';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).catch(()=>caches.match('./')))
  );
});
