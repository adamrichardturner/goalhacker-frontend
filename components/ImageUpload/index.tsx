'use client'

import { DefaultImage } from '@/types/goal'
import { ImageGallery } from './ImageGallery'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onDefaultImageSelect: (image: DefaultImage) => void
  selectedImage?: string | null
}

export default function ImageUpload({
  onImageSelect,
  onDefaultImageSelect,
  selectedImage,
}: ImageUploadProps) {
  return (
    <ImageGallery
      selectedImage={selectedImage}
      onImageSelect={onImageSelect}
      onDefaultImageSelect={onDefaultImageSelect}
    />
  )
}
