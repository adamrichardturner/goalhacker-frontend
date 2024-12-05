import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { API_URL } from '@/config'
import { useRouter } from 'next/navigation'

export type DateFormat =
  | 'MMM d, yyyy'
  | 'MM/dd/yyyy'
  | 'dd/MM/yyyy'
  | 'yyyy-MM-dd'

interface UserSettings {
  date_format: DateFormat | null
  username?: string
}

export function useSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { data: settings, refetch } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/users/preferences/date-format`,
        {
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      return response.json()
    },
  })

  const { mutateAsync: updateDateFormat } = useMutation({
    mutationFn: async (format: DateFormat) => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${API_URL}/api/users/preferences/date-format`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ date_format: format }),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to update date format')
        }

        await refetch()
        toast.success('Date format updated successfully')
      } catch (error) {
        toast.error('Failed to update date format')
        throw error
      } finally {
        setIsLoading(false)
      }
    },
  })

  const { mutateAsync: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/api/users/delete`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }
    },
    onSuccess: () => {
      toast.success('Your account has been deleted')
      router.push('/')
    },
    onError: (error) => {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    },
  })

  return {
    settings,
    isLoading,
    isDeleting,
    updateDateFormat,
    deleteAccount,
  }
}
