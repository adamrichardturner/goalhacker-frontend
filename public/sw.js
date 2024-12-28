const CACHE_NAME = 'goalhacker-v1'

// Add URLs to cache
const urlsToCache = [
    '/',
    '/goals',
    '/dashboard',
    '/manifest.json',
    '/icons/favicon-192x192.png',
    '/icons/favicon-512x512.png',
    '/icons/apple-touch-icon.png',
    '/_next/static/**/*',
    '/api/goals',
    '/api/insights'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cache all static routes
            return cache.addAll([
                '/',
                '/goals',
                '/dashboard',
                '/manifest.json',
                '/icons/favicon-192x192.png',
                '/icons/favicon-512x512.png',
                '/icons/apple-touch-icon.png'
            ]).then(() => {
                // Cache Next.js chunks and static files
                return caches.open(CACHE_NAME).then((cache) => {
                    return fetch('/_next/static/chunks/pages-manifest.json')
                        .then((response) => response.json())
                        .then((manifest) => {
                            const urls = Object.values(manifest).map(
                                (path) => '/_next/' + path
                            )
                            return cache.addAll(urls)
                        })
                        .catch((error) => {
                            console.error('Failed to cache Next.js files:', error)
                        })
                })
            })
        })
    )
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
    self.clients.claim()
})

self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return

    // Handle navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(event.request)
                        .then((response) => {
                            if (response) return response
                            // If no cached page found, return cached home page
                            return caches.match('/')
                        })
                })
        )
        return
    }

    // For Next.js static files
    if (event.request.url.includes('/_next/static/')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((response) => {
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

    // For API requests, try network first, then cache
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const responseToCache = response.clone()
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache)
                    })
                    return response
                })
                .catch(() => {
                    return caches.match(event.request).then((response) => {
                        if (response) return response
                        // If no cached API response, return empty data with offline flag
                        return new Response(JSON.stringify({ offline: true, data: [] }), {
                            headers: { 'Content-Type': 'application/json' }
                        })
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