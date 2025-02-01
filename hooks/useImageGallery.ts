import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { UploadImageResponse } from '@/types/image'
import { useState, useCallback } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const IMAGES_PER_PAGE = 6
const IMAGES_PER_CATEGORY = 12

interface DefaultImagesResponse {
  images: Array<{
    key: string
    url: string
    category: string
  }>
  categories: string[]
  total: number
}

interface FetchImagesParams {
  page: number
  per_page: number
  category?: string
}

export const useImageGallery = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage)
  const [selectedCategory, setSelectedCategory] = useState('')

  // Fetch default images with pagination
  const fetchImages = async ({ page, category }: FetchImagesParams) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: IMAGES_PER_PAGE.toString(),
      ...(category ? { category } : {}),
    })

    const response = await axios.get(
      `${API_URL}/api/images/default-goal-images?${params}`,
      { withCredentials: true }
    )
    return response.data
  }

  const {
    data,
    isLoading: isLoadingDefaultImages,
    isFetching,
  } = useQuery<DefaultImagesResponse>({
    queryKey: ['defaultImages', page, selectedCategory],
    queryFn: () =>
      fetchImages({
        page,
        per_page: IMAGES_PER_PAGE,
        category: selectedCategory || undefined,
      }),
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  })

  // Transform the API response into a more usable format
  const defaultImages = data?.images.map((img) => ({
    id: img.key,
    url: img.url,
    category: img.category,
  }))

  const categories = data?.categories || []

  // Upload image mutation
  const { mutateAsync: uploadImage, isPending: isUploading } = useMutation<
    UploadImageResponse,
    Error,
    File
  >({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('image', file)

      const response = await axios.post(
        `${API_URL}/api/images/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      )

      return response.data
    },
  })

  const changePage = useCallback(
    (newPage: number) => {
      // For categories, limit to 2 pages
      if (selectedCategory && newPage > 2) {
        return
      }
      setPage(newPage)
    },
    [selectedCategory]
  )

  const changeCategory = useCallback((category: string) => {
    setSelectedCategory(category)
    setPage(1) // Reset to first page when changing category
  }, [])

  // Calculate total pages based on whether a category is selected
  const totalPages = selectedCategory
    ? Math.min(Math.ceil((data?.total || 0) / IMAGES_PER_PAGE), 2)
    : Math.ceil((data?.total || 0) / IMAGES_PER_PAGE)

  return {
    defaultImages,
    categories,
    total: selectedCategory
      ? Math.min(data?.total || 0, IMAGES_PER_CATEGORY)
      : data?.total || 0,
    isLoadingDefaultImages,
    isLoadingNextPage: isFetching,
    uploadImage,
    isUploading,
    page,
    selectedCategory,
    changePage,
    changeCategory,
    totalPages,
  }
}
