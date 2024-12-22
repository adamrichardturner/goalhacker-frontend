import { Goal } from '@/types/goal'
import { useMemo } from 'react'
import { Capacitor } from '@capacitor/core'

// Get the API URL based on platform and environment
const getApiUrl = () => {
  const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'development'

  if (Capacitor.isNativePlatform()) {
    // For native platforms (iOS/Android)
    if (isDev) {
      // Development: use localhost for iOS and 10.0.2.2 for Android
      return Capacitor.getPlatform() === 'ios'
        ? process.env.NEXT_PUBLIC_DEV_API_URL || 'http://localhost:5000'
        : 'http://10.0.2.2:5000' // Android emulator special case
    }
    // Production: use the production API URL
    return process.env.NEXT_PUBLIC_PROD_API_URL || 'https://api.goalhacker.app'
  }

  // For web platform
  return isDev
    ? process.env.NEXT_PUBLIC_DEV_API_URL || 'http://localhost:5000'
    : process.env.NEXT_PUBLIC_PROD_API_URL || 'https://api.goalhacker.app'
}

const API_URL = getApiUrl()
const IS_PRODUCTION = process.env.NEXT_PUBLIC_APP_ENV === 'production'

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
      if (goal.image_url.startsWith('http') || goal.image_url.startsWith('file://')) {
        return goal.image_url
      }

      // Always prepend the API URL for image paths
      return `${API_URL}/api/images${goal.image_url}`
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
