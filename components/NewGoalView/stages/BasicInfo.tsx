'use client'

import { Goal } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { CategorySelect } from '@/components/CategorySelect'

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
  const handleNext = () => {
    if (goalData.title) {
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
