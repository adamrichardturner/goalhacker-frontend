import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DefaultImage } from '@/types/goal'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function useGoalImage(goalId: string) {
  const queryClient = useQueryClient()

  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/api/goals/${goalId}/image`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to upload image' }))
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      return {
        ...data,
        image_url: data.image_url ? `${API_URL}/api${data.image_url}` : null,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      toast.success('Image uploaded successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
      console.error('Error uploading image:', error)
    },
  })

  const { mutate: updateImage } = useMutation({
    mutationFn: async (image: {
      default_image_key?: string | null
      image_url?: string | null
    }) => {
      const response = await fetch(`${API_URL}/api/goals/${goalId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...image,
          // If setting a default image, clear the custom image_url
          image_url: image.default_image_key ? null : image.image_url,
          // If setting a custom image, clear the default_image_key
          default_image_key: image.image_url ? null : image.default_image_key,
        }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to update image' }))
        throw new Error(errorData.error || 'Failed to update image')
      }

      const data = await response.json()
      return {
        ...data,
        image_url: data.image_url ? `${API_URL}/api${data.image_url}` : null,
        default_image_key: data.default_image_key
          ? `${API_URL}/api${data.default_image_key}`
          : null,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      toast.success('Image updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
      console.error('Error updating image:', error)
    },
  })

  const handleImageUpload = async (file: File) => {
    uploadImage(file)
  }

  const handleImageSelect = (image: DefaultImage) => {
    updateImage({
      default_image_key: image.key,
      image_url: null,
    })
  }

  return {
    handleImageUpload,
    handleImageSelect,
    isUploading,
  }
}
