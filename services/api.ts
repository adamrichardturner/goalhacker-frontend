import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Remove all interceptors
api.interceptors.request.clear()
api.interceptors.response.clear()

export { api }
