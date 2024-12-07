import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      if (error.response.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (error.response.status >= 500) {
        // Server errors - redirect to error page
        window.location.href = '/error'
        return Promise.reject(error)
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      window.location.href = '/error'
      return Promise.reject(error)
    }

    // Something else happened in setting up the request
    return Promise.reject(error)
  }
)

export { api }
