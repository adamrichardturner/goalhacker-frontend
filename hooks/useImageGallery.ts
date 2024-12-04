import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { UploadImageResponse } from '@/types/image'
import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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
  const fetchImages = async ({
    page,
    per_page,
    category,
  }: FetchImagesParams) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(category ? { category } : {}),
    })

    const response = await axios.get(
      `${API_URL}/api/images/default-goal-images?${params}`,
      { withCredentials: true }
    )
    return response.data
  }

  const { data, isLoading: isLoadingDefaultImages } =
    useQuery<DefaultImagesResponse>({
      queryKey: ['defaultImages', page, selectedCategory],
      queryFn: () =>
        fetchImages({
          page,
          per_page: selectedCategory ? 12 : 6,
          category: selectedCategory || undefined,
        }),
    })

  // Transform the API response into a more usable format
  const defaultImages = data?.images.map((img) => ({
    id: img.key,
    url: `${API_URL}${img.url}`,
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

  const changePage = (newPage: number) => {
    setPage(newPage)
  }

  const changeCategory = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }

  return {
    defaultImages,
    categories,
    total: data?.total || 0,
    isLoadingDefaultImages,
    uploadImage,
    isUploading,
    page,
    selectedCategory,
    changePage,
    changeCategory,
  }
}
