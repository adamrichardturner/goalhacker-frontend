import { useCallback } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const useImageUrl = () => {
  const formatImageUrl = useCallback(
    (url: string | null | undefined): string | null => {
      if (!url) return null

      // If it starts with a slash, it's a relative path
      if (url.startsWith('/')) {
        return `${API_URL}${url}`
      }

      try {
        // Check if it's already a valid URL
        new URL(url)
        return url
      } catch {
        // If not a valid URL and doesn't start with slash, prepend API_URL with slash
        return `${API_URL}/${url}`
      }
    },
    []
  )

  const stripApiUrl = useCallback(
    (url: string | null | undefined): string | null => {
      if (!url) return null

      try {
        const urlObj = new URL(url)
        if (urlObj.origin === API_URL) {
          return urlObj.pathname
        }
        return url
      } catch {
        return url
      }
    },
    []
  )

  return {
    formatImageUrl,
    stripApiUrl,
  }
}

export default useImageUrl
