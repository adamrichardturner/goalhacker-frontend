'use client'

import { useState, useRef } from 'react'
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
import { useTheme } from 'next-themes'
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
import { API_URL } from '@/config'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

const DATE_FORMATS: { value: DateFormat; label: string }[] = [
  { value: 'MMM d, yyyy', label: 'Jan 15, 2024' },
  { value: 'MM/dd/yyyy', label: '01/15/2024' },
  { value: 'dd/MM/yyyy', label: '15/01/2024' },
  { value: 'yyyy-MM-dd', label: '2024-01-15' },
]

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { settings, updateDateFormat, deleteAccount, isLoading, isDeleting } =
    useSettings()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const queryClient = useQueryClient()

  // Fetch avatar on mount
  useState(() => {
    fetch(`${API_URL}/api/users/avatar`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setAvatarUrl(data.avatar_url))
      .catch(console.error)
  })

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    setIsUploadingAvatar(true)
    try {
      const response = await fetch(`${API_URL}/api/users/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload avatar')

      const data = await response.json()
      setAvatarUrl(data.avatar_url)
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Avatar updated successfully')
    } catch (error) {
      toast.error('Failed to update avatar')
      console.error('Error uploading avatar:', error)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Avatar */}
      <Card className='bg-paper'>
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
            onClick={handleAvatarClick}
          >
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback>
              {settings?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {isUploadingAvatar && (
            <p className='text-sm text-muted-foreground'>Uploading...</p>
          )}
        </CardContent>
      </Card>

      {/* Date Format */}
      <Card className='bg-paper'>
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
              disabled={isLoading}
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

      {/* Theme */}
      <Card className='bg-paper'>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how Goal Hacker looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1'>
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='light'>Light</SelectItem>
                <SelectItem value='dark'>Dark</SelectItem>
                <SelectItem value='system'>System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className='bg-paper'>
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
