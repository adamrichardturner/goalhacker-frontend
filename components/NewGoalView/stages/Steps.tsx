'use client'

import { Goal } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { SubGoalsList } from '../SubGoalsList'
import { useState } from 'react'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

interface StepsProps {
  onNext: () => void
  onBack?: () => void
  updateGoalData: (data: Partial<Goal>) => void
  goalData: Partial<Goal>
  isLoading?: boolean
}

export default function Steps({
  onNext,
  onBack,
  updateGoalData,
  goalData,
  isLoading = false,
}: StepsProps) {
  const [useSubGoals, setUseSubGoals] = useState(false)

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
          <Skeleton className='h-8 w-48' />
          <div className='space-y-2'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
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
          <div className='text-sm text-muted-foreground space-y-4'>
            <h2 className='text-xl text-primary font-semibold pb-2'>
              Step 4: What steps will you take?
            </h2>
            <div className='space-y-2'>
              <p>
                Consider the resources, time, or skills you&apos;ll need and
                whether your goal is realistic given your current circumstances.
              </p>
              <p>
                If it feels challenging, you can enable Sub Steps below to break
                the goal down into smaller more manageable targets.
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-6 pt-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>
              What steps will you take to reach this goal?
            </label>
            <RichTextEditor
              placeholder="List the key actions you'll take..."
              value={goalData.steps_to_completion || ''}
              onChange={(value) =>
                updateGoalData({ steps_to_completion: value })
              }
              className='mt-2'
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              checked={useSubGoals}
              onCheckedChange={setUseSubGoals}
              id='use-sub-goals'
            />
            <Label htmlFor='use-sub-goals'>Break down into sub-goals</Label>
          </div>

          {useSubGoals && (
            <SubGoalsList
              goalData={goalData}
              updateGoalData={updateGoalData}
              isCreating={true}
            />
          )}
        </div>

        <div className='flex gap-2'>
          <Button
            onClick={onBack}
            variant='outline'
            className='flex-1'
            size='lg'
          >
            Go Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!goalData.steps_to_completion}
            className='flex-1'
            size='lg'
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
}
