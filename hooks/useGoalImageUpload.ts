import { useState, useEffect } from 'react'
import { DefaultImage } from '@/types/goal'
import { useImageUrl } from './useImageUrl'
import { useDefaultImages } from './useDefaultImages'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface ImageUploadResult {
  image_url?: string
  default_image_key?: string
}

interface ImageUploadResponse {
  imageUrl: string
}

export function useGoalImageUpload(
  onImageChange: (result: ImageUploadResult) => void,
  initialImage?: string | null
) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { formatImageUrl } = useImageUrl()
  const { defaultImages, isLoading: isLoadingDefaultImages } =
    useDefaultImages()

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage)
    }
  }, [initialImage])

  const handleImageSelect = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/api/images/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to upload image')
      }

      const data = (await response.json()) as ImageUploadResponse
      const imageUrl = formatImageUrl(data.imageUrl)
      if (imageUrl) {
        setPreview(imageUrl)
        onImageChange({ image_url: data.imageUrl })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDefaultImageSelect = (image: DefaultImage) => {
    if (image.key) {
      const imageUrl = formatImageUrl(image.key)
      if (imageUrl) {
        setPreview(imageUrl)
        onImageChange({ default_image_key: image.key })
      }
    } else {
      setPreview(null)
      onImageChange({ default_image_key: undefined })
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange({ image_url: undefined, default_image_key: undefined })
  }

  const formattedDefaultImages: DefaultImage[] = defaultImages.map(
    (key: string) => {
      const url = formatImageUrl(key)
      return {
        key,
        url: url || '',
      }
    }
  )

  return {
    preview,
    isUploading,
    handleImageSelect,
    handleDefaultImageSelect,
    handleRemoveImage,
    defaultImages: formattedDefaultImages,
    isLoadingDefaultImages,
  }
}
