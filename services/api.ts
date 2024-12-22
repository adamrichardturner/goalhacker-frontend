import axios from 'axios'
import { Network } from '@capacitor/network'
import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'

// Get the API URL based on platform and environment
const getApiUrl = () => {
  const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'development'

  if (Capacitor.isNativePlatform()) {
    if (isDev) {
      return Capacitor.getPlatform() === 'ios' ? 'http://127.0.0.1:5000' : 'http://10.0.2.2:5000'
    }
    return 'https://api.goalhacker.app'
  }

  return isDev ? 'http://localhost:5000' : 'https://api.goalhacker.app'
}

// Store session ID
const storeSessionId = async (sessionId: string) => {
  await Preferences.set({ key: 'goalhacker.sid', value: sessionId })
}

// Get stored session ID
const getStoredSessionId = async () => {
  const { value } = await Preferences.get({ key: 'goalhacker.sid' })
  return value || null
}

// Clear session
const clearSession = async () => {
  await Preferences.remove({ key: 'goalhacker.sid' })
}

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Add request interceptor for session and network handling
api.interceptors.request.use(async config => {
  console.log('🚀 Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
  })

  const networkStatus = await Network.getStatus()

  if (!networkStatus.connected) {
    console.log('❌ No network connection')
    if (['post', 'put', 'delete'].includes(config.method?.toLowerCase() || '')) {
      const requests = await Preferences.get({ key: 'pendingRequests' })
      const pendingRequests = requests.value ? JSON.parse(requests.value) : []
      await Preferences.set({
        key: 'pendingRequests',
        value: JSON.stringify([...pendingRequests, config]),
      })
    }
    throw new Error('No network connection')
  }

  // Add session ID if available
  const sessionId = await getStoredSessionId()
  if (sessionId) {
    console.log('🔑 Using stored session:', sessionId)
    config.headers['Cookie'] = `goalhacker.sid=${sessionId}`
  }

  return config
})

// Add response interceptor for session handling
api.interceptors.response.use(
  async response => {
    console.log('✅ Response:', {
      status: response.status,
      headers: response.headers,
    })

    // Extract and store session ID from Set-Cookie header
    const setCookie = response.headers['set-cookie']
    if (setCookie && Array.isArray(setCookie)) {
      const sessionCookie = setCookie.find(cookie => cookie.includes('goalhacker.sid='))
      if (sessionCookie) {
        const match = sessionCookie.match(/goalhacker\.sid=([^;]+)/)
        if (match && match[1]) {
          const sessionId = match[1]
          console.log('🔒 Storing new session:', sessionId)
          await storeSessionId(sessionId)
        }
      }
    }

    return response
  },
  async error => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    })
    if (error.response?.status === 401) {
      console.log('🔓 Clearing session due to 401')
      await clearSession()
    }
    return Promise.reject(error)
  }
)

// Network status change listener
Network.addListener('networkStatusChange', async status => {
  if (status.connected) {
    try {
      const requests = await Preferences.get({ key: 'pendingRequests' })
      if (requests.value) {
        const pendingRequests = JSON.parse(requests.value)
        await Preferences.remove({ key: 'pendingRequests' })
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

export { api, getApiUrl, clearSession }
