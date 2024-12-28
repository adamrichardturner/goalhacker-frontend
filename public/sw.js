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
    '/_next/static/media/'
].map(url => `${BASE_URL}${url}`)

// API endpoints to cache
const apiEndpoints = [
    '/api/goals',
    '/api/insights'
].map(url => `${BASE_URL}${url}`)

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cache static routes and app shell
            return Promise.all([
                cache.addAll(urlsToCache),
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

                    // For goal detail pages, return the goals page
                    if (url.pathname.startsWith('/goals/')) {
                        const goalsResponse = await cache.match(`${BASE_URL}/goals`)
                        if (goalsResponse) return goalsResponse
                    }

                    // Try matching just the pathname
                    const pathnameResponse = await cache.match(`${BASE_URL}${url.pathname}`)
                    if (pathnameResponse) return pathnameResponse

                    // If no cached page found, return cached home page
                    const homeResponse = await cache.match(`${BASE_URL}/`)
                    if (homeResponse) return homeResponse

                    // If all else fails, return a custom offline page
                    return new Response(
                        `
                        <!DOCTYPE html>
                        <html>
                            <head>
                                <title>Offline - Goal Hacker</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <style>
                                    body {
                                        font-family: system-ui, -apple-system, sans-serif;
                                        padding: 2rem;
                                        max-width: 600px;
                                        margin: 0 auto;
                                        text-align: center;
                                        background: #0c121d;
                                        color: #fff;
                                    }
                                    h1 { color: #744afc; }
                                    .message { margin: 2rem 0; }
                                    .action {
                                        display: inline-block;
                                        padding: 0.75rem 1.5rem;
                                        background: #744afc;
                                        color: white;
                                        text-decoration: none;
                                        border-radius: 0.5rem;
                                        margin-top: 1rem;
                                    }
                                </style>
                            </head>
                            <body>
                                <h1>You're Offline</h1>
                                <div class="message">
                                    <p>Please check your internet connection and try again.</p>
                                    <p>Your changes will sync when you're back online.</p>
                                </div>
                                <a href="/" class="action">Return Home</a>
                            </body>
                        </html>
                        `,
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
                try {
                    const networkResponse = await fetch(event.request)
                    const cache = await caches.open(CACHE_NAME)
                    await cache.put(event.request, networkResponse.clone())
                    return networkResponse
                } catch (error) {
                    const cache = await caches.open(CACHE_NAME)

                    // Try exact match first
                    const cachedResponse = await cache.match(event.request)
                    if (cachedResponse) return cachedResponse

                    // If it's a goals request, return cached goals
                    if (event.request.url.includes('/api/goals')) {
                        const cachedGoals = await cache.match(`${BASE_URL}/api/goals`)
                        if (cachedGoals) return cachedGoals
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

    // For Next.js static files
    if (event.request.url.includes('/_next/static/')) {
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