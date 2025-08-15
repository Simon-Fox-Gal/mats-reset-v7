// sw.js for Mats Reset v7c (manual update)
const CACHE = 'mats-reset-v7c-2';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if (k.startsWith('mats-reset-') && k !== CACHE) return caches.delete(k);
    }))).then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Network-first for HTML so updates are immediate when user presses "Check updates"
  if (url.pathname.endsWith('/index.html') || url.pathname === '/' ) {
    e.respondWith(fetch(e.request).then(r => { caches.open(CACHE).then(c=>c.put(e.request, r.clone())); return r; }).catch(()=>caches.match(e.request)));
    return;
  }
  // Cache-first for static assets, fallback to network
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).then(r => {
      caches.open(CACHE).then(c=>c.put(e.request, r.clone()));
      return r;
    }).catch(()=>caches.match('./')))
  );
});
