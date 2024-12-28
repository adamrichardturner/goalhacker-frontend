'use client'

import { Goal } from '@/types/goal'
import { Image } from '@/types/image'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { ImageGallery } from '@/components/ImageGallery'
import { Badge } from '@/components/ui/badge'
import { useCallback } from 'react'
import { formatDate } from '@/utils/dateFormat'
import { useSettings } from '@/hooks/useSettings'

interface ReviewProps {
  onBack?: () => void
  goalData: Partial<Goal>
  onSubmit?: () => Promise<void>
  isSubmitting?: boolean
  isLoading?: boolean
  updateGoalData: (data: Partial<Goal>) => void
  onNavigateToStep: (step: number) => void
}

export function Review({
  onBack,
  goalData,
  onSubmit,
  isSubmitting,
  isLoading = false,
  updateGoalData,
  onNavigateToStep,
}: ReviewProps) {
  const { settings } = useSettings()

  const handleImageSelect = useCallback(
    (image: Image) => {
      updateGoalData({
        ...goalData,
        image_url: image.url,
        default_image_key: image.id,
      })
    },
    [goalData, updateGoalData]
  )

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
          <div className='bg-card rounded-2xl p-6 space-y-4 border'>
            <div className='grid gap-6 sm:gap-4'>
              <div
                onClick={() => onNavigateToStep(1)}
                className='cursor-pointer shadow sm:shadow-none hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors'
              >
                <label className='text-sm font-medium text-primary cursor-pointer'>
                  Title
                </label>
                <p className='text-xs sm:text-sm text-muted-foreground'>
                  {goalData.title}
                </p>
              </div>

              <div
                onClick={() => onNavigateToStep(2)}
                className='cursor-pointer shadow sm:shadow-none hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors'
              >
                <label className='text-sm font-medium text-primary cursor-pointer'>
                  Aims
                </label>
                <p className='text-xs sm:text-sm text-muted-foreground'>
                  {goalData.aims}
                </p>
              </div>

              <div
                onClick={() => onNavigateToStep(3)}
                className='cursor-pointer shadow sm:shadow-none hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors'
              >
                <label className='text-sm font-medium text-primary cursor-pointer'>
                  How to measure
                </label>
                <div
                  className='text-xs sm:text-sm text-muted-foreground'
                  dangerouslySetInnerHTML={{
                    __html: goalData.measurement_method || '',
                  }}
                />
              </div>

              <div
                onClick={() => onNavigateToStep(4)}
                className='cursor-pointer shadow sm:shadow-none hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors'
              >
                <label className='text-sm font-medium text-primary cursor-pointer'>
                  Steps to completion
                </label>
                <div
                  className='text-xs sm:text-sm text-muted-foreground'
                  dangerouslySetInnerHTML={{
                    __html: goalData.steps_to_completion || '',
                  }}
                />
              </div>

              <div className='grid grid-cols-2 gap-6 sm:gap-4'>
                {goalData.target_date && (
                  <div
                    onClick={() => onNavigateToStep(3)}
                    className='cursor-pointer shadow sm:shadow-none hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors'
                  >
                    <label className='text-sm font-medium text-primary'>
                      Target Date
                    </label>
                    <p className='text-xs sm:text-sm text-muted-foreground'>
                      {formatDate(goalData.target_date, settings?.date_format)}
                    </p>
                  </div>
                )}

                <div
                  onClick={() => onNavigateToStep(3)}
                  className='cursor-pointer shadow sm:shadow-none hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors'
                >
                  <label className='text-sm font-medium text-primary'>
                    Priority
                  </label>
                  <p className='text-xs sm:text-sm text-muted-foreground capitalize'>
                    {goalData.priority}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {goalData.subgoals && goalData.subgoals.length > 0 && (
            <div
              onClick={() => onNavigateToStep(4)}
              className='bg-card rounded-2xl p-6 space-y-4 border cursor-pointer hover:bg-accent/50 transition-colors'
            >
              <h3 className='text-lg font-semibold'>Sub-goals</h3>
              <div className='grid gap-3'>
                {goalData.subgoals?.map((subgoal, index) => (
                  <div
                    key={index}
                    className='flex flex-col sm:flex-row sm:items-center sm:justify-between'
                  >
                    <span className='font-medium'>{subgoal.title}</span>
                    {subgoal.target_date && (
                      <Badge
                        variant='default'
                        className='text-xs text-primary-foreground bg-primaryActive p-2 self-end sm:self-auto'
                      >
                        🎯 {format(new Date(subgoal.target_date), 'PPP')}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='bg-card rounded-2xl p-6 space-y-4 border'>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Motivational Image</h3>
              <p className='text-sm text-muted-foreground'>
                Choose an image that represents your goal and will keep you
                motivated.
              </p>
            </div>

            <ImageGallery
              onImageSelect={handleImageSelect}
              selectedImage={
                goalData.image_url && goalData.default_image_key
                  ? {
                      id: goalData.default_image_key,
                      url: goalData.image_url,
                      category: 'default',
                    }
                  : undefined
              }
            />
          </div>
        </div>

        <div className='flex gap-2 pt-4'>
          <Button onClick={onBack} variant='outline' className='flex-1 h-12'>
            Go Back
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className='flex-1 h-12'
          >
            {isSubmitting ? 'Creating Goal...' : 'Create Goal'}
          </Button>
        </div>
      </div>
    </div>
  )
}
