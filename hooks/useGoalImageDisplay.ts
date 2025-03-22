import { Goal } from '@/types/goal'
import { API_URL } from '@/config/api'
import { useQuery } from '@tanstack/react-query'

export function useGoalImageDisplay(goal: Goal) {
  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ['goalImage', goal.image_url],
    queryFn: async () => {
      if (!goal.image_url) return null

      // If it's already a full URL, return it directly
      if (goal.image_url.startsWith('http')) {
        return goal.image_url
      }

      // Get signed URL for custom uploaded image
      const response = await fetch(
        `${API_URL}api/images/goals/${goal.image_url}`,
        {
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error('Failed to get signed URL')
      const data = await response.json()
      return data.url
    },
    enabled: !!goal.image_url,
  })

  console.log('imageUrl', imageUrl)

  return { imageUrl, isLoading }
}
