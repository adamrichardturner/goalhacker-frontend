export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const config = {
  API_URL,
  IS_PRODUCTION,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} 