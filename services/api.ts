import axios, { AxiosError } from 'axios'
import { ApiError } from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.url)
  console.log('Request headers:', config.headers)
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    return Promise.reject({
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    })
  }
)
