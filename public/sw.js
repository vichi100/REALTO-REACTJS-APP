self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // Add a call to skipWaiting here if you want to force the waiting service worker to become the active service worker
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
    // Simple pass-through fetch handler
    // This is required for PWA installability criteria
    event.respondWith(fetch(event.request));
});
