'use client'

import { Goal } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { CategorySelect } from '@/components/CategorySelect'
import { ImageGallery } from '@/components/ImageGallery'
import { useState } from 'react'
import { API_URL } from '@/config/api'
import { toast } from 'sonner'
import { Image } from '@/types/image'

interface BasicInfoProps {
  onNext: () => void
  updateGoalData: (data: Partial<Goal>) => void
  goalData: Partial<Goal>
  isLoading?: boolean
}

export function BasicInfo({
  onNext,
  updateGoalData,
  goalData,
  isLoading = false,
}: BasicInfoProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleNext = () => {
    if (goalData.title) {
      onNext()
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true)

      // Create form data
      const formData = new FormData()
      formData.append('image', file)

      // Upload through our API
      const response = await fetch(`${API_URL}/api/goals/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to upload image')
      }

      const { imageUrl, signedUrl } = await response.json()

      // Update goal with the signed URL
      updateGoalData({ image_url: signedUrl })

      // Update the ImageGallery with the signed URL for immediate display
      const selectedImage = { url: signedUrl } as Image
      handleImageSelect(selectedImage)

      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageSelect = (image: Image) => {
    // For default gallery images, store the URL as is
    // For uploaded images, the URL is already in the correct format
    updateGoalData({ image_url: image.url })
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex gap-2'>
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-8 w-48' />
            <div className='space-y-1'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-5/6' />
            </div>
          </div>
          <Skeleton className='h-44 w-44' />
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2 pt-6'>
          <div className='text-sm text-muted-foreground space-y-6 pb-6'>
            <h2 className='text-xl text-primary font-semibold pb-2'>
              Step 1: What is your goal?
            </h2>
            <div className='space-y-2'>
              <p>
                Your goal should be defined clearly. It should be achievable,
                realistic and measurable.{' '}
              </p>
              <p>
                Focus on what you want to achieve, avoiding vague statements.
              </p>
              <p>
                For example, instead of saying &apos;Get healthy,&apos; say
                &apos;Exercise three times a week to improve fitness.&apos;
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-6 pb-2'>
          <div className='space-y-1'>
            <Label>Goal Title</Label>
            <Input
              placeholder='Exercise three times a week to improve fitness'
              value={goalData.title || ''}
              onChange={(e) => updateGoalData({ title: e.target.value })}
              required
            />
          </div>
        </div>

        <div className='space-y-1 pb-2'>
          <Label>Category (Optional)</Label>
          <CategorySelect
            value={goalData.category_id}
            onValueChange={(categoryId) =>
              updateGoalData({ category_id: categoryId })
            }
          />
        </div>

        <div className='space-y-1 pb-6'>
          <Label>Goal Image (Optional)</Label>
          <ImageGallery
            onImageSelect={handleImageSelect}
            selectedImage={
              goalData.image_url
                ? ({
                    url: goalData.image_url, // Use the URL directly since it's already a signed URL
                  } as Image)
                : undefined
            }
            existingImage={goalData.image_url || undefined}
            onImageUpload={handleImageUpload}
            isUploading={isUploading}
          />
        </div>

        <Button
          variant='default'
          size='lg'
          onClick={handleNext}
          disabled={!goalData.title}
          className='w-full'
        >
          Next Step
        </Button>
      </div>
    </div>
  )
}
