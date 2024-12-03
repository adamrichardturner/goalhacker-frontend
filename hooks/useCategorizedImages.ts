'use client'

import { useQuery } from '@tanstack/react-query'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const categories = [
  'Fitness',
  'Business',
  'Education',
  'Travel',
  'Health',
  'Finance',
  'Creative',
  'Technology',
] as const

export type ImageCategory = (typeof categories)[number]

interface CategorizedImage {
  key: string
  url: string
  category: ImageCategory
}

interface ImagesResponse {
  images: CategorizedImage[]
}

export default function useCategorizedImages(category?: ImageCategory) {
  const { data, isLoading } = useQuery({
    queryKey: ['defaultImages', category],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/images/default-images`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = (await response.json()) as ImagesResponse
      if (category) {
        return data.images.filter((img) => img.category === category)
      }
      return data.images
    },
  })

  return {
    images: data || [],
    isLoading,
    categories,
  }
}
