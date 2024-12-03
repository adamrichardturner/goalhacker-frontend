'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function useImageUpload(goalId: string) {
  const queryClient = useQueryClient()

  const { mutate: uploadImage, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('image', file)

      console.log('GOAL ID', goalId)

      const response = await fetch(`${API_URL}/api/goals/${goalId}/image`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      return data.image_url
    },
  })

  return {
    uploadImage,
    isLoading: isPending,
  }
}
