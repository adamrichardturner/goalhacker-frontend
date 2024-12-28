'use client'

import { useEffect } from 'react'
import { Workbox } from 'workbox-window'

declare global {
  interface Window {
    workbox: Workbox
  }
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js')

      // Add event listeners
      wb.addEventListener('installed', (event) => {
        console.log(`Service Worker installed: ${event.type}`)
      })

      wb.addEventListener('waiting', () => {
        // New service worker is waiting to activate
        if (confirm('New version available! Update now?')) {
          wb.messageSkipWaiting()
          wb.addEventListener('controlling', () => {
            window.location.reload()
          })
        }
      })

      wb.register()
    }
  }, [])

  return null
}
