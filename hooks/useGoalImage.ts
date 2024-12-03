import { useState } from 'react'
import { DefaultImage } from '@/types/goal'
import { useImageUrl } from './useImageUrl'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface ImageUploadResult {
  image_url?: string
  default_image_key?: string
  preview_url?: string
}

export function useGoalImage(goalId?: string) {
  const [isUploading, setIsUploading] = useState(false)
  const { formatImageUrl } = useImageUrl()

  const uploadImage = async (file: File): Promise<ImageUploadResult> => {
    setIsUploading(true)
    try {
      const previewUrl = URL.createObjectURL(file)

      const formData = new FormData()
      formData.append('image', file)

      const endpoint = goalId
        ? `${API_URL}/api/goals/${goalId}/image`
        : `${API_URL}/api/goals/upload`

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      return {
        image_url: data.image_url,
        default_image_key: undefined,
        preview_url: previewUrl,
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageSelect = async (file: File) => {
    try {
      return await uploadImage(file)
    } catch (error) {
      console.error('Error handling image select:', error)
      throw error
    }
  }

  const handleDefaultImageSelect = (image: DefaultImage): ImageUploadResult => {
    if (!image.key) {
      return {
        image_url: undefined,
        default_image_key: undefined,
        preview_url: undefined,
      }
    }

    const previewUrl = formatImageUrl(`/api${image.key}`)
    return {
      image_url: undefined,
      default_image_key: image.key,
      preview_url: previewUrl || undefined,
    }
  }

  return {
    isUploading,
    handleImageSelect,
    handleDefaultImageSelect,
  }
}
