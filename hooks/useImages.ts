import { API_URL } from '@/config/api'
import { Image } from '@/types/image'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useCallback } from 'react'

// Constants
const IMAGES_PER_PAGE = 6
const IMAGES_PER_CATEGORY = 12

// Types
interface FetchGalleryParams {
  page: number
  per_page: number
  category?: string
}

interface GalleryResponse {
  images: Array<{
    key: string
    url: string
    category: string
  }>
  categories: string[]
  total: number
}

export interface UploadImageResponse {
  imageUrl: string
  signedUrl: string
}

/**
 * The main hook for handling all image-related operations
 */
export function useImages() {
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')

  // Normalize image paths for storage
  const normalizeImagePathForStorage = (url: string): string => {
    // If it's a default gallery image
    if (url.includes('default-goal-images')) {
      const pathParts = url.split('default-goal-images/')
      if (pathParts.length > 1) {
        // Store only the category/filename part, with consistent format
        const cleanPath = pathParts[1].startsWith('/')
          ? pathParts[1].substring(1)
          : pathParts[1]
        return `default-goal-images/${cleanPath}`
      }
    }
    return url
  }

  // Get display URL for an image
  const getDisplayUrl = async (imagePath: string): Promise<string | null> => {
    if (!imagePath) {
      return null
    }

    // If it's already a full URL, return it directly
    if (imagePath.startsWith('http')) {
      return imagePath
    }

    // For default gallery images
    if (imagePath.includes('default-goal-images')) {
      // Split by 'default-goal-images/' and take the second part to avoid double paths
      const pathComponent = imagePath.includes('default-goal-images/')
        ? imagePath.split('default-goal-images/')[1]
        : imagePath.replace('default-goal-images', '')

      // Ensure no double slashes in the URL
      const cleanPath = pathComponent.startsWith('/')
        ? pathComponent.substring(1)
        : pathComponent
      return `${API_URL}/api/images/default-goal-images/${cleanPath}`
    }

    try {
      // For custom uploaded images, get a signed URL
      const response = await fetch(`${API_URL}/api/images/goals/${imagePath}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('Failed to get signed URL:', await response.text())
        return null
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error fetching image URL:', error)
      return null
    }
  }

  // Get display URL for an image using React Query
  const useImageDisplay = (imagePath: string | undefined) => {
    return useQuery({
      queryKey: ['image', imagePath],
      queryFn: () => getDisplayUrl(imagePath || ''),
      enabled: !!imagePath,
    })
  }

  // Fetch default gallery images
  const fetchGalleryImages = async ({ page, category }: FetchGalleryParams) => {
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

  // Gallery images query
  const {
    data: galleryData,
    isLoading: isLoadingGallery,
    isFetching: isFetchingGallery,
  } = useQuery<GalleryResponse>({
    queryKey: ['galleryImages', page, selectedCategory],
    queryFn: () =>
      fetchGalleryImages({
        page,
        per_page: IMAGES_PER_PAGE,
        category: selectedCategory || undefined,
      }),
    refetchOnWindowFocus: false,
  })

  // Transform the API response
  const galleryImages =
    galleryData?.images.map((img) => ({
      id: img.key,
      url: img.url,
      category: img.category,
    })) || []

  const categories = galleryData?.categories || []

  // Upload image mutation
  const { mutateAsync: uploadImage, isPending: isUploading } = useMutation({
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

  // Upload image to a specific goal
  const uploadGoalImage = async (goalId: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/api/goals/${goalId}/image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to upload image')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  // Gallery pagination
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

  // Calculate total pages
  const totalPages = selectedCategory
    ? Math.min(Math.ceil((galleryData?.total || 0) / IMAGES_PER_PAGE), 2)
    : Math.ceil((galleryData?.total || 0) / IMAGES_PER_PAGE)

  // Handle image selection (returns the normalized path for storage)
  const handleImageSelect = (image: Image): string => {
    if (!image || !image.url) {
      return ''
    }
    return normalizeImagePathForStorage(image.url)
  }

  return {
    // Gallery data
    galleryImages,
    categories,
    total: selectedCategory
      ? Math.min(galleryData?.total || 0, IMAGES_PER_CATEGORY)
      : galleryData?.total || 0,
    isLoadingGallery,
    isFetchingGallery,
    page,
    selectedCategory,
    changePage,
    changeCategory,
    totalPages,

    // Image operations
    uploadImage,
    uploadGoalImage,
    isUploading,

    // Display and path handling
    useImageDisplay,
    getDisplayUrl,
    normalizeImagePathForStorage,
    handleImageSelect,
  }
}
