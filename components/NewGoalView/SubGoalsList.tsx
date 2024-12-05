'use client'

import { Goal, Subgoal } from '@/types/goal'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

interface SubGoalsListProps {
  goalData: Partial<Goal>
  updateGoalData: (data: Partial<Goal>) => void
  isCreating: boolean
}

export function SubGoalsList({
  goalData,
  updateGoalData,
  isCreating,
}: SubGoalsListProps) {
  const [newSubgoal, setNewSubgoal] = useState<Partial<Subgoal>>({
    goal_id: '',
    title: '',
    status: 'planned',
  })

  const handleAddSubgoal = () => {
    if (!newSubgoal.title) return

    const updatedSubgoals = [
      ...(goalData.subgoals || []),
      {
        goal_id: goalData.goal_id || '',
        title: newSubgoal.title,
        status: 'planned' as const,
        target_date: newSubgoal.target_date,
      },
    ]

    updateGoalData({ subgoals: updatedSubgoals })
    setNewSubgoal({
      goal_id: '',
      title: '',
      status: 'planned',
      target_date: undefined,
    })
  }

  return (
    <div className='space-y-4'>
      {goalData.subgoals?.map((subgoal, index) => (
        <div key={index} className='flex items-center gap-2'>
          <Input
            value={subgoal.title}
            onChange={(e) => {
              const updatedSubgoals = [...(goalData.subgoals || [])]
              updatedSubgoals[index] = {
                ...subgoal,
                title: e.target.value,
              }
              updateGoalData({ subgoals: updatedSubgoals })
            }}
            placeholder='Enter a sub-goal...'
          />
          <div className='flex items-center gap-2'>
            {!isCreating && subgoal.target_date && (
              <span className='text-sm text-muted-foreground whitespace-nowrap'>
                {format(new Date(subgoal.target_date), 'MMM d, yyyy')}
              </span>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className={cn(
                    'h-8 w-8',
                    subgoal.target_date && 'border-primary'
                  )}
                >
                  <CalendarIcon className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='end'>
                <Calendar
                  mode='single'
                  selected={
                    subgoal.target_date
                      ? new Date(subgoal.target_date)
                      : undefined
                  }
                  onSelect={(date) => {
                    const updatedSubgoals = [...(goalData.subgoals || [])]
                    updatedSubgoals[index] = {
                      ...subgoal,
                      target_date: date?.toISOString(),
                    }
                    updateGoalData({ subgoals: updatedSubgoals })
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ))}

      <div className='flex items-center gap-2'>
        <Input
          value={newSubgoal.title}
          onChange={(e) =>
            setNewSubgoal({ ...newSubgoal, title: e.target.value })
          }
          placeholder='Add a new sub-goal...'
          required
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newSubgoal.title) {
              handleAddSubgoal()
            }
          }}
        />
        <div className='flex items-center gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                className={cn(
                  'h-12 w-12 p-0',
                  newSubgoal.target_date && 'border-2 border-electricPurple'
                )}
              >
                {!isCreating && newSubgoal.target_date ? (
                  <span className='text-xs'>
                    {format(new Date(newSubgoal.target_date), 'MMM d')}
                  </span>
                ) : (
                  <CalendarIcon className='h-4 w-4' />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={
                  newSubgoal.target_date
                    ? new Date(newSubgoal.target_date)
                    : undefined
                }
                onSelect={(date) =>
                  setNewSubgoal({
                    ...newSubgoal,
                    target_date: date?.toISOString(),
                  })
                }
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button
        onClick={(e) => {
          e.preventDefault()
          if (newSubgoal.title) {
            handleAddSubgoal()
          }
        }}
        disabled={!newSubgoal.title}
      >
        Add Sub-goal
      </Button>
    </div>
  )
}
