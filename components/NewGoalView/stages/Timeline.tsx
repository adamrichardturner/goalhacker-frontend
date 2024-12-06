'use client'

import { Goal } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'

interface TimelineProps {
  onNext: () => void
  onBack?: () => void
  updateGoalData: (data: Partial<Goal>) => void
  goalData: Partial<Goal>
  isLoading?: boolean
}

export function Timeline({
  onNext,
  onBack,
  updateGoalData,
  goalData,
  isLoading = false,
}: TimelineProps) {
  const handleNext = () => {
    if (goalData.aims) {
      onNext()
    }
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
            </div>
          </div>
          <Skeleton className='h-44 w-44' />
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-32 w-full' />
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
          <div className='text-sm text-muted-foreground space-y-6 pb-6'>
            <h2 className='text-xl text-primary font-semibold pb-2'>
              Step 2: What do you want to achieve?
            </h2>
            <div className='space-y-2'>
              <p>Explain the specific outcome you want to accomplish.</p>
              <p>
                Be detailed and clear about what success looks like, such as
                &apos;Complete a 5K race in under 30 minutes&apos; or &apos;Save
                £500 for a holiday by July 2024.&apos;
              </p>
            </div>
          </div>
        </div>
        <div className='space-y-1'>
          <Label>What do you want to achieve?</Label>
          <Textarea
            placeholder='Complete a 5K race in under 30 minutes'
            value={goalData.aims || ''}
            onChange={(e) => updateGoalData({ aims: e.target.value })}
            required
            maxLength={200}
            className='max-h-40 resize-none text-sm'
          />
        </div>
        <div className='flex gap-2 mt-2'>
          <Button onClick={onBack} variant='outline' className='flex-1 h-12'>
            Go Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!goalData.aims}
            className='flex-1 h-12'
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
}
