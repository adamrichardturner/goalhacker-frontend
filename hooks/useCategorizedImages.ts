'use client'

import { DefaultImage } from '@/types/goal'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const IMAGES_PER_PAGE = 6

export default function useCategorizedImages(
  category?: string,
  page: number = 1
) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['defaultImages', category, page],
    queryFn: async () => {
      const baseUrl = `${API_URL}/api/images/default-goal-images`
      const params = new URLSearchParams()

      if (category) {
        params.append('category', category)
      } else {
        params.append('page', page.toString())
        params.append('per_page', IMAGES_PER_PAGE.toString())
      }

      const url = `${baseUrl}?${params.toString()}`

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

  const paginateImages = (images: DefaultImage[]) => {
    if (!category) return images
    const startIndex = (page - 1) * IMAGES_PER_PAGE
    return images.slice(startIndex, startIndex + IMAGES_PER_PAGE)
  }

  return {
    images: paginateImages(data?.images || []),
    categories: data?.categories || [],
    total: data?.total || 0,
    totalPages: category
      ? Math.ceil((data?.images?.length || 0) / IMAGES_PER_PAGE)
      : Math.ceil((data?.total || 0) / IMAGES_PER_PAGE),
    isLoading,
    refreshImages,
  }
}
