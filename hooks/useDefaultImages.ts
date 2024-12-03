import { useQuery } from '@tanstack/react-query'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface DefaultImagesResponse {
  images: string[]
}

export function useDefaultImages() {
  const { data: defaultImages = [], isLoading } = useQuery<string[]>({
    queryKey: ['defaultImages'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/images/default-images`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch default images')
      }

      const { images } = (await response.json()) as DefaultImagesResponse
      return images
    },
  })

  return {
    defaultImages,
    isLoading,
  }
}
