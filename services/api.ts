import axios from 'axios'
import { Network } from '@capacitor/network'
import { Preferences } from '@capacitor/preferences'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Add network state handling
api.interceptors.request.use(async (config) => {
  const networkStatus = await Network.getStatus()

  if (!networkStatus.connected) {
    // Store request for later if it's a mutation (POST, PUT, DELETE)
    if (
      ['post', 'put', 'delete'].includes(config.method?.toLowerCase() || '')
    ) {
      const requests = await Preferences.get({ key: 'pendingRequests' })
      const pendingRequests = requests.value ? JSON.parse(requests.value) : []
      await Preferences.set({
        key: 'pendingRequests',
        value: JSON.stringify([...pendingRequests, config]),
      })
    }
    throw new Error('No network connection')
  }

  // Check connection type for potential bandwidth limitations
  if (networkStatus.connectionType === 'cellular') {
    // Optionally handle cellular connection differently
    // e.g., reduce image quality, limit video streaming, etc.
  }

  return config
})

// Network status change listener
Network.addListener('networkStatusChange', async (status) => {
  if (status.connected) {
    // Process pending requests when connection is restored
    try {
      const requests = await Preferences.get({ key: 'pendingRequests' })
      if (requests.value) {
        const pendingRequests = JSON.parse(requests.value)
        // Clear pending requests
        await Preferences.remove({ key: 'pendingRequests' })
        // Retry pending requests
        for (const request of pendingRequests) {
          try {
            await api(request)
          } catch (error) {
            console.error('Failed to process pending request:', error)
          }
        }
      }
    } catch (error) {
      console.error('Error processing pending requests:', error)
    }
  }
})

// Remove all interceptors
api.interceptors.request.clear()
api.interceptors.response.clear()

// Need to handle offline scenarios
// Add request queueing for offline support
// Add token-based auth instead of cookies

export { api }
