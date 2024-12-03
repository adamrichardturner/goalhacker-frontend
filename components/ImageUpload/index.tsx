'use client'

import { useGoalImage } from '@/hooks/useGoalImage'
import { DefaultImage } from '@/types/goal'
import { ImageGallery } from './ImageGallery'
import { useState, useEffect } from 'react'

interface ImageUploadProps {
  goalId?: string
  currentImage?: string | null
  onImageChange: (result: {
    image_url?: string
    default_image_key?: string
  }) => void
}

export default function ImageUpload({
  goalId,
  currentImage,
  onImageChange,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const { isUploading, handleImageSelect, handleDefaultImageSelect } =
    useGoalImage(goalId)

  // Set initial preview if currentImage exists
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage)
    }
  }, [currentImage])

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleImageUpload = async (file: File) => {
    try {
      const result = await handleImageSelect(file)
      if (result.preview_url) {
        setPreview(result.preview_url)
        onImageChange({
          image_url: result.image_url,
          default_image_key: result.default_image_key,
        })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleDefaultImage = (image: DefaultImage) => {
    const result = handleDefaultImageSelect(image)
    if (result.preview_url) {
      setPreview(result.preview_url)
    } else {
      setPreview(null)
    }
    onImageChange({
      image_url: result.image_url,
      default_image_key: result.default_image_key,
    })
  }

  const handleRemoveImage = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    onImageChange({ image_url: undefined, default_image_key: undefined })
  }

  return (
    <ImageGallery
      selectedImage={preview}
      onImageSelect={handleImageUpload}
      onDefaultImageSelect={handleDefaultImage}
      onRemoveImage={handleRemoveImage}
      isUploading={isUploading}
    />
  )
}
