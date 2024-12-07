'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { settingsService } from '@/services/settingsService'
import { useState } from 'react'

export type DateFormat =
  | 'MMM d, yyyy'
  | 'MM/dd/yyyy'
  | 'dd/MM/yyyy'
  | 'yyyy-MM-dd'

export function useSettings() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isRouting, setIsRouting] = useState(false)

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
  })

  const { mutateAsync: updateDateFormat, isPending: isUpdatingDateFormat } =
    useMutation({
      mutationFn: (format: DateFormat) =>
        settingsService.updateDateFormat(format),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['settings'] })
        toast.success('Date format updated')
      },
      onError: () => {
        toast.error('Failed to update date format')
      },
    })

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: (data: { firstName: string; lastName: string }) =>
        settingsService.updateProfile(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] })
        toast.success('Profile updated')
      },
      onError: () => {
        toast.error('Failed to update profile')
      },
    })

  const { mutateAsync: requestPasswordReset, isPending: isRequestingReset } =
    useMutation({
      mutationFn: () => settingsService.requestPasswordReset(),
      onSuccess: () => {
        toast.success('Password reset email sent. Please check your inbox.')
      },
      onError: () => {
        toast.error('Failed to send reset email')
      },
    })

  const { mutateAsync: resetPassword, isPending: isResettingPassword } =
    useMutation({
      mutationFn: async ({
        token,
        password,
      }: {
        token: string
        password: string
      }) => {
        setIsRouting(true)
        await settingsService.resetPassword(token, password)
        toast.success('Password reset successful')

        // Route to /goals after 1.5s
        setTimeout(() => {
          router.push('/goals')
        }, 1500)

        // Keep button disabled for 3s
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setIsRouting(false)
      },
      onError: () => {
        setIsRouting(false)
        throw new Error('Failed to reset password. Please try again.')
      },
    })

  const { mutateAsync: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: () => settingsService.deleteAccount(),
    onSuccess: () => {
      queryClient.clear() // Clear all queries
      toast.success('Account deleted successfully')
      window.location.href = '/' // Use hard redirect to ensure clean state
    },
    onError: () => {
      toast.error('Failed to delete account')
    },
  })

  return {
    settings,
    isUpdatingDateFormat,
    isUpdatingProfile,
    isRequestingReset,
    isResettingPassword: isResettingPassword || isRouting,
    isDeleting,
    deleteAccount,
    updateDateFormat,
    updateProfile,
    requestPasswordReset,
    resetPassword,
  }
}
