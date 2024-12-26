const CACHE_NAME = 'goalhacker-cache-v1';

// Add whichever assets you want to pre-cache here
const PRECACHE_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/favicon.svg',
    '/icons/favicon-192x192.png',
    '/icons/favicon-384x384.png',
    '/icons/favicon-512x512.png',
    '/default-goal.jpg'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if found
            if (response) {
                return response;
            }

            // Clone the request because it can only be used once
            const fetchRequest = event.request.clone();

            // Make network request and cache the response
            return fetch(fetchRequest).then((response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response because it can only be used once
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    // Don't cache API requests
                    if (!event.request.url.includes('/api/')) {
                        cache.put(event.request, responseToCache);
                    }
                });

                return response;
            });
        })
    );
}); 