const isProd = process.env.NODE_ENV === 'production'

export const API_URL = isProd
  ? 'https://api.goalhacker.app'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const config = {
  API_URL,
}
