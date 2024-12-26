import axios from 'axios'
import { config } from '@/config/api'

const api = axios.create({
  baseURL: config.API_URL,
  withCredentials: config.withCredentials,
  headers: config.headers,
})

// Remove all interceptors
api.interceptors.request.clear()
api.interceptors.response.clear()

export { api }
