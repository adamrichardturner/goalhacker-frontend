const CACHE_NAME = 'goalhacker-v1'

// Add URLs to cache
const urlsToCache = [
    '/',
    '/goals',
    '/dashboard',
    '/manifest.json',
    '/icons/favicon-192x192.png',
    '/icons/favicon-512x512.png'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache)
        })
    )
})

self.addEventListener('fetch', (event) => {
    // For API requests, try network first, then cache
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Clone the response before caching
                    const responseToCache = response.clone()
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache)
                    })
                    return response
                })
                .catch(() => {
                    // If network fails, try cache
                    return caches.match(event.request)
                })
        )
        return
    }

    // For other requests, try cache first, then network
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response
            }
            return fetch(event.request).then((response) => {
                // Don't cache if not a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response
                }

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
        method: operation.type,
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