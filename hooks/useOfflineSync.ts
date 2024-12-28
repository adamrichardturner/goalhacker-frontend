'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface QueuedOperation {
  type: 'create' | 'update' | 'delete'
  endpoint: string
  data: any
  timestamp: number
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    // Update online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const queueOperation = async (operation: QueuedOperation) => {
    try {
      // Store operation in IndexedDB
      const db = await openDB()
      const tx = db.transaction('operations', 'readwrite')
      const store = tx.objectStore('operations')
      await store.add(operation)

      // If we're online, try to sync immediately
      if (navigator.onLine) {
        await syncOperations()
      }
    } catch (error) {
      console.error('Error queueing operation:', error)
    }
  }

  const syncOperations = async () => {
    if (!navigator.onLine) return

    try {
      const db = await openDB()
      const tx = db.transaction('operations', 'readwrite')
      const store = tx.objectStore('operations')
      const request = store.getAll()

      const operations: QueuedOperation[] = await new Promise(
        (resolve, reject) => {
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => reject(request.error)
        }
      )

      // Sort operations by timestamp
      operations.sort(
        (a: QueuedOperation, b: QueuedOperation) => a.timestamp - b.timestamp
      )

      for (const operation of operations) {
        try {
          await performOperation(operation)
          await store.delete(operation.timestamp)
        } catch (error) {
          console.error('Error performing operation:', error)
        }
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    } catch (error) {
      console.error('Error syncing operations:', error)
    }
  }

  return {
    isOnline,
    queueOperation,
    syncOperations,
  }
}

// IndexedDB helper functions
async function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('GoalHackerOffline', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('operations')) {
        db.createObjectStore('operations', { keyPath: 'timestamp' })
      }
    }
  })
}

async function performOperation(operation: QueuedOperation) {
  const response = await fetch(operation.endpoint, {
    method:
      operation.type === 'create'
        ? 'POST'
        : operation.type === 'update'
          ? 'PUT'
          : 'DELETE',
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
