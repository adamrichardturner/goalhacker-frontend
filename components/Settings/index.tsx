'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useSettings, DateFormat } from '@/hooks/useSettings'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { settingsService } from '@/services/settingsService'
import { useUser } from '@/hooks/auth/useUser'

interface UserProfile {
  avatar_url?: string | null
  first_name: string
  last_name: string
}

const DATE_FORMATS: { value: DateFormat; label: string }[] = [
  { value: 'MMM d, yyyy', label: 'Jan 15, 2024' },
  { value: 'MM/dd/yyyy', label: '01/15/2024' },
  { value: 'dd/MM/yyyy', label: '15/01/2024' },
  { value: 'yyyy-MM-dd', label: '2024-01-15' },
]

export default function Settings() {
  const { user } = useUser()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const {
    settings,
    updateDateFormat,
    deleteAccount,
    updateProfile,
    isUpdatingDateFormat,
    isUpdatingProfile,
    isDeleting,
  } = useSettings()

  const [userProfile, setUserProfile] = useState<UserProfile>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    avatar_url: user?.avatar_url || null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isInCooldown, setIsInCooldown] = useState(false)
  const queryClient = useQueryClient()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  // Fetch profile on mount and when user changes
  useEffect(() => {
    if (user) {
      setUserProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        avatar_url: user.avatar_url || null,
      })
    }
  }, [user])

  const hasNameChanged =
    user &&
    (userProfile.first_name !== user.first_name ||
      userProfile.last_name !== user.last_name)

  // Check for existing cooldown on mount
  useEffect(() => {
    const lastResetTime = localStorage.getItem('lastPasswordResetRequest')
    if (lastResetTime) {
      const timeSinceLastReset = Date.now() - parseInt(lastResetTime)
      const cooldownMs = 10 * 60 * 1000 // 10 minutes
      if (timeSinceLastReset < cooldownMs) {
        setIsInCooldown(true)
        setTimeout(
          () => setIsInCooldown(false),
          cooldownMs - timeSinceLastReset
        )
      }
    }
  }, [])

  const handleProfileUpdate = async () => {
    if (!hasNameChanged) return

    try {
      await updateProfile({
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
      })
      setIsEditingName(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const response = await fetch(`${API_URL}/api/users/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload avatar')

      const data = await response.json()
      setUserProfile((prev) => ({ ...prev, avatar_url: data.avatar_url }))
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Avatar updated successfully')
    } catch (error) {
      toast.error('Failed to update avatar')
      console.error('Error uploading avatar:', error)
    }
  }

  const handlePasswordReset = async () => {
    try {
      await settingsService.requestPasswordReset()
      toast.success('Password reset email sent. Please check your inbox.')
      localStorage.setItem('lastPasswordResetRequest', Date.now().toString())
      setIsInCooldown(true)
      setTimeout(() => setIsInCooldown(false), 10 * 60 * 1000)
    } catch (error) {
      console.error('Error sending password reset email:', error)
      toast.error('Failed to send reset email. Please try again.')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-md sm:text-sm md:text-2xl leading-none font-semibold text-pretty'>
          Settings
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>First Name</Label>
              <Input
                placeholder='First Name'
                value={userProfile.first_name}
                onChange={(e) =>
                  setUserProfile((prev) => ({
                    ...prev,
                    first_name: e.target.value,
                  }))
                }
                disabled={!isEditingName || isUpdatingProfile}
              />
            </div>
            <div className='space-y-2'>
              <Label>Last Name</Label>
              <Input
                placeholder='Last Name'
                value={userProfile.last_name}
                onChange={(e) =>
                  setUserProfile((prev) => ({
                    ...prev,
                    last_name: e.target.value,
                  }))
                }
                disabled={!isEditingName || isUpdatingProfile}
              />
            </div>
          </div>
          <div className='flex justify-between gap-2'>
            <Button
              onClick={handleProfileUpdate}
              disabled={!isEditingName || isUpdatingProfile || !hasNameChanged}
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
            <div className='flex flex-col items-end gap-1 w-[100px]'>
              <Label
                htmlFor='edit-name'
                className='text-xs text-muted-foreground'
              >
                Edit Name
              </Label>
              <Switch
                id='edit-name'
                checked={isEditingName}
                onCheckedChange={setIsEditingName}
                disabled={isUpdatingProfile}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Click the avatar to update your profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4'>
          <input
            type='file'
            ref={fileInputRef}
            className='hidden'
            accept='image/*'
            onChange={handleFileChange}
          />
          <Avatar
            className='h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity'
            onClick={() => fileInputRef.current?.click()}
          >
            <AvatarImage src={userProfile.avatar_url || undefined} />
            <AvatarFallback>
              {settings?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            We&apos;ll send you an email with a secure link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant='outline'
            onClick={handlePasswordReset}
            disabled={isInCooldown}
          >
            {isInCooldown
              ? 'Try again in 10 minutes'
              : 'Send Password Reset Email'}
          </Button>
          {isInCooldown && (
            <p className='text-sm text-muted-foreground mt-2'>
              For security reasons, you can only request one password reset
              every 10 minutes.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date Format</CardTitle>
          <CardDescription>
            Choose how you want dates to be displayed
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1'>
            <Label>Format</Label>
            <Select
              value={settings?.date_format || 'MMM d, yyyy'}
              onValueChange={updateDateFormat}
              disabled={isUpdatingDateFormat}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant='destructive' disabled={isDeleting}>
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all associated data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    deleteAccount()
                  }}
                  className='bg-destructive hover:bg-destructive/90'
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
