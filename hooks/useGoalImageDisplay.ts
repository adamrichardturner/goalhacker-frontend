'use client'

import { useState, useCallback } from 'react'
import { Goal } from '@/types/goal'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// High-quality, goal-oriented placeholder from Unsplash
const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'

interface UseGoalImageDisplayReturn {
  imageUrl: string
  isLoading: boolean
  handleImageLoad: () => void
  handleImageLoadStart: () => void
  handleImageError: () => void
}

export const useGoalImageDisplay = (goal: Goal): UseGoalImageDisplayReturn => {
  const [isLoading, setIsLoading] = useState(false)

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

  const getInitialImageUrl = useCallback(
    (goal: Goal): string => {
      if (!goal) return PLACEHOLDER_IMAGE

      // If there's a custom uploaded image
      if (goal.image_url) {
        return formatImageUrl(goal.image_url) || PLACEHOLDER_IMAGE
      }

      // If there's a default image key
      if (goal.default_image_key) {
        return formatImageUrl(goal.default_image_key) || PLACEHOLDER_IMAGE
      }

      // Fallback to placeholder image
      return PLACEHOLDER_IMAGE
    },
    [formatImageUrl]
  )

  const handleImageLoadStart = useCallback(() => {
    setIsLoading(true)
  }, [])

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleImageError = useCallback(() => {
    setIsLoading(false)
  }, [])

  return {
    imageUrl: getInitialImageUrl(goal),
    isLoading,
    handleImageLoad,
    handleImageLoadStart,
    handleImageError,
  }
}

export default useGoalImageDisplay
