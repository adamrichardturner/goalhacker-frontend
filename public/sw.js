const CACHE_NAME = 'goalhacker-v1'
const BASE_URL = 'https://www.goalhacker.app'

// Add URLs to cache
const urlsToCache = [
    '/',
    '/goals',
    '/dashboard',
    '/login',
    '/manifest.json',
    '/icons/favicon-192x192.png',
    '/icons/favicon-512x512.png',
    '/icons/apple-touch-icon.png'
].map(url => `${BASE_URL}${url}`)

// Cache the app shell (HTML, CSS, JS)
const appShellFiles = [
    '/_next/static/css/',
    '/_next/static/chunks/',
    '/_next/static/media/',
    '/_next/static/images/'
].map(url => `${BASE_URL}${url}`)

// API endpoints to cache
const apiEndpoints = [
    '/api/goals',
    '/api/insights',
    '/api/goals/*/notes',
    '/api/goals/*/subgoals',
    '/api/goals/*'
].map(url => `${BASE_URL}${url}`)

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cache static routes and app shell
            return Promise.all([
                cache.addAll(urlsToCache),
                cache.addAll(appShellFiles),
                // Pre-cache API endpoints
                ...apiEndpoints.map(endpoint =>
                    fetch(endpoint, {
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => cache.put(endpoint, response))
                        .catch(error => console.log('Failed to cache:', endpoint, error))
                )
            ])
        })
    )
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName)
                        }
                    })
                )
            }),
            self.clients.claim()
        ])
    )
})

self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return

    // Handle navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                const url = new URL(event.request.url)
                try {
                    // Try network first for navigation
                    const networkResponse = await fetch(event.request)
                    const cache = await caches.open(CACHE_NAME)
                    cache.put(event.request, networkResponse.clone())
                    return networkResponse
                } catch (error) {
                    const cache = await caches.open(CACHE_NAME)

                    // Try to match the exact URL first
                    const cachedResponse = await cache.match(event.request.url)
                    if (cachedResponse) return cachedResponse

                    // For goal detail pages, try to match the specific goal page
                    if (url.pathname.startsWith('/goals/')) {
                        const goalId = url.pathname.split('/').pop()
                        const goalResponse = await cache.match(`${BASE_URL}/api/goals/${goalId}`)
                        if (goalResponse) return goalResponse
                    }

                    // Try matching just the pathname
                    const pathnameResponse = await cache.match(`${BASE_URL}${url.pathname}`)
                    if (pathnameResponse) return pathnameResponse

                    // If no cached page found, return cached home page
                    const homeResponse = await cache.match(`${BASE_URL}/`)
                    if (homeResponse) return homeResponse

                    // If all else fails, return a custom offline page
                    return new Response(
                        `<!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <title>Offline - Goal Hacker</title>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <meta name="theme-color" content="#0c121d">
                                <link rel="manifest" href="/manifest.json">
                                <link rel="icon" href="/icons/favicon-192x192.png">
                                <style>
                                    :root {
                                        color-scheme: dark;
                                    }
                                    body {
                                        font-family: system-ui, -apple-system, sans-serif;
                                        margin: 0;
                                        padding: 0;
                                        min-height: 100vh;
                                        background: #0c121d;
                                        color: #fff;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                    }
                                    .container {
                                        max-width: 28rem;
                                        width: 100%;
                                        padding: 1rem;
                                        text-align: center;
                                    }
                                    .icon-container {
                                        width: 6rem;
                                        height: 6rem;
                                        margin: 0 auto 2rem;
                                        background: rgba(255,255,255,0.1);
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                    }
                                    .icon {
                                        width: 3rem;
                                        height: 3rem;
                                        color: rgba(255,255,255,0.5);
                                    }
                                    h1 {
                                        color: #744afc;
                                        font-size: 1.875rem;
                                        line-height: 2.25rem;
                                        font-weight: 700;
                                        letter-spacing: -0.025em;
                                        margin: 0 0 1.5rem;
                                    }
                                    .message {
                                        color: rgba(255,255,255,0.5);
                                        margin: 0 0 2rem;
                                        font-size: 0.875rem;
                                    }
                                    .buttons {
                                        display: flex;
                                        flex-direction: column;
                                        gap: 1rem;
                                        align-items: center;
                                    }
                                    .button {
                                        display: inline-block;
                                        padding: 0.75rem 1.5rem;
                                        border-radius: 0.5rem;
                                        font-weight: 500;
                                        text-decoration: none;
                                        transition: all 0.2s;
                                        cursor: pointer;
                                    }
                                    .primary {
                                        background: #744afc;
                                        color: white;
                                    }
                                    .primary:hover {
                                        background: #6037e0;
                                    }
                                    .secondary {
                                        background: transparent;
                                        color: rgba(255,255,255,0.5);
                                    }
                                    .secondary:hover {
                                        color: white;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="icon-container">
                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                                            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                                            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                                            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                                            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                                            <line x1="12" y1="20" x2="12.01" y2="20"></line>
                                        </svg>
                                    </div>
                                    <h1>No Internet Connection</h1>
                                    <div class="message">
                                        <p>We couldn't load the content you requested.</p>
                                        <p>Please check your internet connection and try again. Your changes will be saved and synced when you're back online.</p>
                                    </div>
                                    <div class="buttons">
                                        <button onclick="window.location.reload()" class="button primary">Try Again</button>
                                        <button onclick="window.history.back()" class="button secondary">Go Back</button>
                                    </div>
                                </div>
                                <script>
                                    // Listen for online status changes
                                    window.addEventListener('online', () => window.location.reload());
                                </script>
                            </body>
                        </html>`,
                        {
                            headers: { 'Content-Type': 'text/html' }
                        }
                    )
                }
            })()
        )
        return
    }

    // For API requests, try network first, then cache
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME)
                try {
                    // Try network first
                    const networkResponse = await fetch(event.request)
                    // Clone the response before caching
                    const responseToCache = networkResponse.clone()

                    // Cache the successful response
                    if (networkResponse.ok) {
                        await cache.put(event.request, responseToCache)
                    }

                    return networkResponse
                } catch (error) {
                    // If network fails, try cache
                    const cachedResponse = await cache.match(event.request)
                    if (cachedResponse) {
                        return cachedResponse
                    }

                    // For goal-specific requests, try to find related cached data
                    const url = new URL(event.request.url)
                    if (url.pathname.includes('/api/goals/')) {
                        const pathParts = url.pathname.split('/')
                        const goalId = pathParts[pathParts.length - 2] // Account for trailing slash

                        // Try to find cached goal data
                        const cachedGoal = await cache.match(`${BASE_URL}/api/goals/${goalId}`)
                        if (cachedGoal) {
                            const goalData = await cachedGoal.json()

                            // Return appropriate subset of data based on the request
                            if (url.pathname.endsWith('/notes')) {
                                return new Response(
                                    JSON.stringify(goalData.progress_notes || []),
                                    { headers: { 'Content-Type': 'application/json' } }
                                )
                            } else if (url.pathname.endsWith('/subgoals')) {
                                return new Response(
                                    JSON.stringify(goalData.subgoals || []),
                                    { headers: { 'Content-Type': 'application/json' } }
                                )
                            }

                            return new Response(
                                JSON.stringify(goalData),
                                { headers: { 'Content-Type': 'application/json' } }
                            )
                        }
                    }

                    // Return empty data with offline flag
                    return new Response(
                        JSON.stringify({
                            offline: true,
                            data: [],
                            message: 'You are currently offline. Changes will sync when you reconnect.'
                        }),
                        {
                            headers: { 'Content-Type': 'application/json' }
                        }
                    )
                }
            })()
        )
        return
    }

    // For Next.js static files and other assets
    if (event.request.url.includes('/_next/') || event.request.url.includes('/static/')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) return response

                return fetch(event.request).then((response) => {
                    if (!response || response.status !== 200) return response

                    const responseToCache = response.clone()
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache)
                    })
                    return response
                })
            })
        )
        return
    }

    // For all other requests, try cache first, then network
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) return response

            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200) return response

                const responseToCache = response.clone()
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache)
                })
                return response
            })
        })
    )
})

// Background sync for offline mutations
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-goals') {
        event.waitUntil(syncGoals())
    }
})

async function syncGoals() {
    try {
        const offlineData = await getOfflineData()
        for (const operation of offlineData) {
            await performOperation(operation)
        }
        await clearOfflineData()
    } catch (error) {
        console.error('Error syncing goals:', error)
    }
}

// Helper functions for IndexedDB operations
async function getOfflineData() {
    const db = await openDB()
    const tx = db.transaction('operations', 'readonly')
    const store = tx.objectStore('operations')
    return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

async function performOperation(operation) {
    const response = await fetch(operation.endpoint, {
        method: operation.type === 'create' ? 'POST' :
            operation.type === 'update' ? 'PUT' : 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation.data),
    })

    if (!response.ok) {
        throw new Error('Operation failed')
    }

    return response.json()
}

async function clearOfflineData() {
    const db = await openDB()
    const tx = db.transaction('operations', 'readwrite')
    const store = tx.objectStore('operations')
    return store.clear()
}

async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('GoalHackerOffline', 1)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
        request.onupgradeneeded = (event) => {
            const db = event.target.result
            if (!db.objectStoreNames.contains('operations')) {
                db.createObjectStore('operations', { keyPath: 'timestamp' })
            }
        }
    })
}

self.addEventListener('push', function (event) {
    if (!event.data) {
        return;
    }

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: data.icon,
        badge: '/icons/badge.png',
        data: data.data,
        actions: [
            {
                action: 'view',
                title: 'View',
            },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'view') {
        const data = event.notification.data;
        let url = '/goals';

        if (data.type === 'goal') {
            url = `/goals/${data.goalId}`;
        } else if (data.type === 'subgoal') {
            url = `/goals/${data.goalId}?subgoal=${data.subgoalId}`;
        }

        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(function (clientList) {
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    }
}); 