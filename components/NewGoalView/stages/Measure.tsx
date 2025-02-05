'use client'

import { Goal } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from '@/components/ui/calendar'
import { formatDate } from '@/utils/dateFormat'
import { useSettings } from '@/hooks/useSettings'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { startOfDay } from 'date-fns'

interface MeasureProps {
  onNext: () => void
  onBack?: () => void
  updateGoalData: (data: Partial<Goal>) => void
  goalData: Partial<Goal>
  isLoading?: boolean
}

export function Measure({
  onNext,
  onBack,
  updateGoalData,
  goalData,
  isLoading = false,
}: MeasureProps) {
  const { settings } = useSettings()

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
          <div className='space-y-2'>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-32 w-full' />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>
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
        <div className='flex gap-2 justify-between pt-6'>
          <div className='text-sm text-muted-foreground space-y-2'>
            <h2 className='text-xl text-primary font-semibold pb-2'>
              Step 3: Measure the goal
            </h2>
            <p>Define how you&apos;ll track progress and measure success.</p>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='space-y-6'>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>
                Use clear metrics to measure your progress. For example:
              </p>
              <ul className='text-sm text-muted-foreground list-disc pl-4 space-y-1'>
                <li>Number of workouts completed per week</li>
                <li>Monthly savings amount tracked in a spreadsheet</li>
              </ul>
            </div>
            <div className='space-y-1'>
              <Label>How will you measure your progress?</Label>
              <RichTextEditor
                placeholder='I will track...'
                value={goalData.measurement_method || ''}
                onChange={(value) =>
                  updateGoalData({ measurement_method: value })
                }
                className='max-h-40'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>
                Will you set a deadline? (Optional)
              </label>
              <Popover>
                <PopoverTrigger asChild className='w-full h-12'>
                  <Button
                    variant='outline'
                    size='lg'
                    className={cn(
                      'w-full justify-start h-12 text-left font-normal dark:text-white',
                      !goalData.target_date &&
                        'text-muted h-12 bg-card hover:bg-card'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {goalData.target_date ? (
                      formatDate(goalData.target_date, settings?.date_format)
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0 bg-paper' align='start'>
                  <Calendar
                    mode='single'
                    selected={
                      goalData.target_date
                        ? new Date(goalData.target_date)
                        : undefined
                    }
                    onSelect={(date) =>
                      updateGoalData({
                        target_date: date ? date.toISOString() : undefined,
                      })
                    }
                    disabled={(date) =>
                      startOfDay(date) < startOfDay(new Date())
                    }
                    initialFocus
                    className='text-lg text-primary'
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='space-y-1'>
              <label className='text-sm font-medium'>
                How important is this goal?
              </label>
              <Select
                value={goalData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  updateGoalData({ priority: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className='flex gap-2 mt-6'>
          <Button onClick={onBack} variant='outline' className='flex-1 h-12'>
            Go Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!goalData.measurement_method}
            className='flex-1 h-12'
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
}
