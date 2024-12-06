/* eslint-disable @next/next/no-img-element */
'use client'

import { Goal } from '@/types/goal'
import { Image } from '@/types/image'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { ImageGallery } from '@/components/ImageGallery'

interface ReviewProps {
  onBack?: () => void
  goalData: Partial<Goal>
  onSubmit?: () => Promise<void>
  isSubmitting?: boolean
  isLoading?: boolean
  updateGoalData: (data: Partial<Goal>) => void
}

export function Review({
  onBack,
  goalData,
  onSubmit,
  isSubmitting,
  isLoading = false,
  updateGoalData,
}: ReviewProps) {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex gap-2'>
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-full' />
          </div>
          <Skeleton className='h-44 w-44' />
        </div>
        <div className='space-y-4'>
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex gap-2 items-center'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 flex-1' />
              </div>
            ))}
          </div>
          <div className='flex gap-2'>
            <Skeleton className='h-10 flex-1' />
            <Skeleton className='h-10 flex-1' />
          </div>
        </div>
      </div>
    )
  }

  const handleImageSelect = (image: Image) => {
    updateGoalData({
      ...goalData,
      image_url: image.url,
    })
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2 pt-6'>
          <div className='text-xs text-muted space-y-2'>
            <h2 className='text-xl text-primary font-semibold'>
              Step 5: Review and Customize
            </h2>
            <p>Review your goal details and add a motivational image.</p>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <h3 className='text-sm font-medium'>Goal Details</h3>
            <div className='space-y-2 text-sm'>
              <p>
                <strong>Title:</strong> {goalData.title}
              </p>
              <p>
                <strong>Aims:</strong> {goalData.aims}
              </p>
              <p>
                <strong>How to measure:</strong> {goalData.measurement_method}
              </p>
              <p>
                <strong>Steps to completion:</strong>{' '}
                {goalData.steps_to_completion}
              </p>
              {goalData.target_date && (
                <p>
                  <strong>Target Date:</strong>{' '}
                  {format(new Date(goalData.target_date), 'PPP')}
                </p>
              )}
              <p>
                <strong>Priority:</strong>{' '}
                <span className='capitalize'>{goalData.priority}</span>
              </p>
            </div>
          </div>

          {goalData.subgoals && goalData.subgoals.length > 0 && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Sub-goals</h3>
              <div className='space-y-2'>
                {goalData.subgoals?.map((subgoal, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <span>{subgoal.title}</span>
                    {subgoal.target_date && (
                      <span className='text-xs text-muted-foreground'>
                        (Due: {format(new Date(subgoal.target_date), 'PPP')})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='space-y-2'>
            <h3 className='text-sm font-medium'>Add a Motivational Image</h3>
            <p className='text-xs text-muted'>
              Choose an image that represents your goal and will keep you
              motivated.
            </p>

            <ImageGallery
              onImageSelect={handleImageSelect}
              selectedImage={
                goalData.image_url
                  ? { id: goalData.image_url, url: goalData.image_url }
                  : undefined
              }
            />
          </div>
        </div>

        <div className='flex gap-2'>
          <Button onClick={onBack} variant='outline' className='flex-1'>
            Go Back
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting} className='flex-1'>
            {isSubmitting ? 'Creating Goal...' : 'Create Goal'}
          </Button>
        </div>
      </div>
    </div>
  )
}
