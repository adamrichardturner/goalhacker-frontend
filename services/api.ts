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
    // Store request for later
    const requests = await Preferences.get({ key: 'pendingRequests' })
    const pendingRequests = requests.value ? JSON.parse(requests.value) : []
    await Preferences.set({
      key: 'pendingRequests',
      value: JSON.stringify([...pendingRequests, config]),
    })
    throw new Error('No network connection')
  }

  return config
})

// Remove all interceptors
api.interceptors.request.clear()
api.interceptors.response.clear()

// Need to handle offline scenarios
// Add request queueing for offline support
// Add token-based auth instead of cookies

export { api }
