'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const IMAGES_PER_PAGE = 12

export default function useCategorizedImages(
  category?: string,
  page: number = 1
) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['defaultImages', category, page],
    queryFn: async () => {
      const url = category
        ? `${API_URL}/api/images/default-goal-images?category=${category}`
        : `${API_URL}/api/images/default-goal-images?page=${page}&per_page=${IMAGES_PER_PAGE}`

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      return data
    },
  })

  const refreshImages = () => {
    queryClient.invalidateQueries({
      queryKey: ['defaultImages', category, page],
    })
  }

  return {
    images: data?.images || [],
    categories: data?.categories || [],
    total: data?.total || 0,
    totalPages: Math.ceil((data?.total || 0) / IMAGES_PER_PAGE),
    isLoading,
    refreshImages,
  }
}
