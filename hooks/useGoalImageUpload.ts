import { useState, useEffect, useCallback } from 'react'
import { DefaultImage } from '@/types/goal'
import { useImageUrl } from './useImageUrl'
import { useDefaultImages } from './useDefaultImages'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface ImageUploadResult {
  image_url?: string
  default_image_key?: string
}

export function useGoalImageUpload(
  onImageChange: (result: ImageUploadResult) => void,
  initialImage?: string | null
) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { formatImageUrl } = useImageUrl()
  const { images: defaultImages = [], isLoading: isLoadingDefaultImages } =
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
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      const imageUrl = formatImageUrl(`/api${data.image_url}`)

      if (imageUrl) {
        setPreview(imageUrl)
        onImageChange({ image_url: data.image_url })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDefaultImageSelect = (image: DefaultImage) => {
    if (image.key) {
      onImageChange({ default_image_key: image.key })
      const previewUrl = formatImageUrl(`/api${image.key}`)
      setPreview(previewUrl)
    } else {
      setPreview(null)
      onImageChange({ default_image_key: undefined })
    }
  }

  const handleImageChange = useCallback(
    (result: ImageUploadResult) => {
      console.log('Image change in hook:', result) // Debug log
      onImageChange({
        image_url: result.image_url || undefined,
        default_image_key: result.default_image_key || undefined,
      })
    },
    [onImageChange]
  )

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange({ image_url: undefined, default_image_key: undefined })
  }

  return {
    preview,
    isUploading,
    handleImageSelect,
    handleDefaultImageSelect,
    handleRemoveImage,
    handleImageChange,
    defaultImages,
    isLoadingDefaultImages,
  }
}
