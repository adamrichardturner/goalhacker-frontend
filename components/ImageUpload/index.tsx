'use client'

import { DefaultImage } from '@/types/goal'
import { ImageGallery } from './ImageGallery'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onDefaultImageSelect: (image: DefaultImage) => void
  selectedImage?: string | null
  goalId: string
}

export default function ImageUpload({
  onImageSelect,
  onDefaultImageSelect,
  selectedImage,
  goalId,
}: ImageUploadProps) {
  return (
    <ImageGallery
      goalId={goalId}
      selectedImage={selectedImage}
      onImageSelect={onImageSelect}
      onDefaultImageSelect={onDefaultImageSelect}
    />
  )
}
