import { Goal } from '@/types/goal'
import { useMemo } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export default function useGoalImageDisplay(goal: Goal) {
  const imageUrl = useMemo(() => {
    if (!goal) return null

    // If the goal has an image_url, use it
    if (goal.image_url) {
      // If it's already a full URL, use it as is
      if (goal.image_url.startsWith('http')) {
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

    return null
  }, [goal])

  return {
    imageUrl,
    isLoading: false,
  }
}
