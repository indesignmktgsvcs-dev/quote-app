// INDesign Quotation System - service worker
// IMPORTANT: change CACHE_NAME every time index.html changes (v1 -> v2 ...),
// otherwise phones that already installed the app may keep the old version.
const CACHE_NAME = 'indesign-quote-app-v127-2';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-192-maskable.png',
    './icons/icon-512-maskable.png',
    './icons/apple-touch-icon.png'
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
            Promise.all(names.filter((n) => n.startsWith('indesign-quote-app-') && n !== CACHE_NAME).map((n) => caches.delete(n)))  // only our own old caches
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    const isSameOrigin = url.origin === self.location.origin;
    const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');

    if (isSameOrigin && isPage) {
        // The app page itself: NETWORK FIRST, so a new version on GitHub
        // shows up as soon as the phone is online; cached copy if offline.
        event.respondWith(
            // always ask GitHub for the newest page
            fetch(req.url, { cache: 'no-cache' }).then((response) => {
                if (response && response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                }
                return response;
            }).catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
        );
    } else if (isSameOrigin) {
        // Icons / manifest: cache first.
        event.respondWith(
            caches.match(req).then((cached) => cached || fetch(req).then((response) => {
                if (response && response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                }
                return response;
            }))
        );
    } else {
        // jsPDF from its CDN etc.: network first, cached copy if offline.
        event.respondWith(
            fetch(req).then((response) => {
                if (response && (response.ok || response.type === 'opaque')) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                }
                return response;
            }).catch(() => caches.match(req))
        );
    }
});
