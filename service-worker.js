// INDesign Quotation System — service worker
// Offline is "nice to have": caches the app shell so it opens even
// with a weak/no signal, and lets everything else (like the jsPDF
// library from its CDN) fall through to the network normally.

const CACHE_NAME = 'indesign-quote-app-v1';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-192-maskable.png',
    './icons/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch((err) => {
            console.error('Service worker install/cache error:', err);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);
    const isSameOrigin = url.origin === self.location.origin;

    if (req.method !== 'GET') return;

    if (isSameOrigin) {
        event.respondWith(
            caches.match(req).then((cached) => {
                if (cached) return cached;
                return fetch(req).then((response) => {
                    if (response && response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    }
                    return response;
                }).catch(() => cached);
            })
        );
    } else {
        event.respondWith(
            fetch(req).then((response) => {
                if (response && response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                }
                return response;
            }).catch(() => caches.match(req))
        );
    }
});
