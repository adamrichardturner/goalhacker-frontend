import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { settingsService } from '@/services/settingsService'

export type DateFormat =
  | 'MMM d, yyyy'
  | 'MM/dd/yyyy'
  | 'dd/MM/yyyy'
  | 'yyyy-MM-dd'

export function useSettings() {
  const router = useRouter()
  const queryClient = useQueryClient()

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
        toast.success('Date format updated successfully')
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
        toast.success('Profile updated successfully')
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
        toast.error('Failed to send reset email. Please try again.')
      },
    })

  const { mutateAsync: resetPassword, isPending: isResettingPassword } =
    useMutation({
      mutationFn: ({ token, password }: { token: string; password: string }) =>
        settingsService.resetPassword(token, password),
      onSuccess: () => {
        toast.success('Password reset successful')
        router.push('/login')
      },
      onError: () => {
        throw new Error('Failed to reset password. Please try again.')
      },
    })

  const { mutateAsync: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: () => settingsService.deleteAccount(),
    onSuccess: () => {
      toast.success('Your account has been deleted')
      router.push('/')
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
    isResettingPassword,
    isDeleting,
    updateDateFormat,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    deleteAccount,
  }
}
