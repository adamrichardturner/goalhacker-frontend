import { Goal } from '@/types/goal'
import { useMemo } from 'react'
import { Capacitor } from '@capacitor/core'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export default function useGoalImageDisplay(goal: Goal) {
  const getPlatform = () => {
    return Capacitor.getPlatform()
  }

  const handleImageDisplay = (imageUrl: string) => {
    const platform = getPlatform()

    // If it's a file:// URL, return as is for native platforms
    if (imageUrl.startsWith('file://')) {
      return imageUrl
    }

    // If it's a data URL or absolute URL, return as is
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) {
      return imageUrl
    }

    // For local public directory images, return as is
    if (imageUrl.startsWith('/')) {
      return imageUrl
    }

    return imageUrl
  }

  const imageUrl = useMemo(() => {
    if (!goal) return '/default-goal.jpg'

    // If the goal has an image_url, use it
    if (goal.image_url) {
      // If it's already a full URL or file:// URL, use it as is
      if (
        goal.image_url.startsWith('http') ||
        goal.image_url.startsWith('file://')
      ) {
        return goal.image_url
      }

      // In production, prepend /api/images to the path
      if (IS_PRODUCTION) {
        return `${API_URL}/api/images${goal.image_url}`
      }

      // In development, use the original path
      return `${API_URL}${goal.image_url}`
    }

    // If no image_url but has a default_image_key, construct the URL
    if (goal.default_image_key) {
      return `${API_URL}/api/images/default-goal-images/${goal.default_image_key}`
    }

    // If no image is set, use the default goal image from public directory
    return '/default-goal.jpg'
  }, [goal])

  return {
    imageUrl: handleImageDisplay(imageUrl),
    isLoading: false,
  }
}
