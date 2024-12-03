import { useState } from 'react'
import { Goal, SubgoalStatus } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon, Trash2 } from 'lucide-react'
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
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'

interface SubGoalsProps {
  goal: Goal
}

export default function SubGoals({ goal }: SubGoalsProps) {
  const [newSubgoal, setNewSubgoal] = useState({
    title: '',
    target_date: undefined as string | undefined,
  })
  const { updateSubgoal, deleteSubgoal, createSubgoal } = useGoal(goal.goal_id)

  const handleSubgoalCreate = async () => {
    if (!newSubgoal.title.trim()) {
      toast.error('Please enter a subgoal title')
      return
    }

    try {
      await createSubgoal({
        title: newSubgoal.title,
        target_date: newSubgoal.target_date,
      })
      setNewSubgoal({ title: '', target_date: undefined })
      toast.success('Subgoal created successfully')
    } catch (error) {
      toast.error('Failed to create subgoal')
      console.error('Error creating subgoal:', error)
    }
  }

  const handleSubgoalStatusChange = (
    subgoalId: string,
    status: SubgoalStatus
  ) => {
    try {
      updateSubgoal({ subgoalId, status })
    } catch (error) {
      toast.error('Failed to update subgoal')
      console.error('Error updating subgoal:', error)
    }
  }

  const handleSubgoalDelete = (subgoalId: string) => {
    try {
      deleteSubgoal(subgoalId)
      toast.success('Subgoal deleted successfully')
    } catch (error) {
      toast.error('Failed to delete subgoal')
      console.error('Error deleting subgoal:', error)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Create New Subgoal */}
      <div className='flex gap-2'>
        <div className='flex-1'>
          <Input
            placeholder='Add a new subgoal...'
            value={newSubgoal.title}
            onChange={(e) =>
              setNewSubgoal({ ...newSubgoal, title: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubgoalCreate()
              }
            }}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className={cn(
                'w-10 p-0',
                !newSubgoal.target_date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='h-4 w-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='end'>
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
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button onClick={handleSubgoalCreate}>Add Subgoal</Button>
      </div>

      {/* Existing Subgoals */}
      <div className='space-y-3'>
        {goal.subgoals?.map((subgoal) => (
          <div
            key={subgoal.subgoal_id}
            className='flex items-center justify-between p-4 border rounded-lg'
          >
            <div className='flex items-center gap-3 flex-1'>
              <Select
                value={subgoal.status}
                onValueChange={(value: SubgoalStatus) =>
                  subgoal.subgoal_id &&
                  handleSubgoalStatusChange(subgoal.subgoal_id, value)
                }
              >
                <SelectTrigger className='w-[140px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='planned'>Planned</SelectItem>
                  <SelectItem value='in_progress'>In Progress</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                </SelectContent>
              </Select>
              <span
                className={cn(
                  'flex-1',
                  subgoal.status === 'completed' &&
                    'line-through text-muted-foreground'
                )}
              >
                {subgoal.title}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className={cn(
                      'w-9 p-0',
                      !subgoal.target_date && 'text-muted-foreground'
                    )}
                  >
                    {subgoal.target_date ? (
                      <span className='text-xs'>
                        {format(new Date(subgoal.target_date), 'MM/dd')}
                      </span>
                    ) : (
                      <CalendarIcon className='h-4 w-4' />
                    )}
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
                    onSelect={(date) =>
                      subgoal.subgoal_id &&
                      updateSubgoal({
                        subgoalId: subgoal.subgoal_id,
                        target_date: date?.toISOString(),
                      })
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant='ghost'
                size='icon'
                onClick={() =>
                  subgoal.subgoal_id && handleSubgoalDelete(subgoal.subgoal_id)
                }
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
