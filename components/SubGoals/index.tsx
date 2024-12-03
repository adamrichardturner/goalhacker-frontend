import { useState } from 'react'
import { Goal, SubgoalStatus } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon, Trash2, Pen } from 'lucide-react'
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

interface EditingState {
  subgoalId: string | null
  title: string
}

export default function SubGoals({ goal }: SubGoalsProps) {
  const [newSubgoal, setNewSubgoal] = useState({
    status: 'planned',
    title: '',
    target_date: undefined as string | undefined,
  })
  const [editing, setEditing] = useState<EditingState>({
    subgoalId: null,
    title: '',
  })
  const { updateSubgoal, deleteSubgoal, createSubgoal } = useGoal(goal.goal_id)

  const handleSubgoalCreate = () => {
    if (!newSubgoal.title.trim()) {
      toast.error('Please enter a subgoal title')
      return
    }

    try {
      createSubgoal({
        status: newSubgoal.status as SubgoalStatus,
        title: newSubgoal.title,
        target_date: newSubgoal.target_date,
      })
      setNewSubgoal({
        status: 'planned',
        title: '',
        target_date: undefined,
      })
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

  const handleEditStart = (subgoal: NonNullable<Goal['subgoals']>[number]) => {
    setEditing({
      subgoalId: subgoal.subgoal_id ?? null,
      title: subgoal.title ?? '',
    })
  }

  const handleEditSave = async () => {
    if (!editing.subgoalId) return
    try {
      updateSubgoal({
        subgoalId: editing.subgoalId,
        title: editing.title,
      })
      setEditing({ subgoalId: null, title: '' })
      toast.success('Subgoal updated successfully')
    } catch (error) {
      console.error('Error updating subgoal:', error)
      toast.error('Failed to update subgoal')
    }
  }

  return (
    <div className='space-y-6'>
      {/* Create New Subgoal */}
      <div className='flex gap-2 h-12'>
        <div className='flex-1'>
          <Input
            placeholder='Add a new subgoal...'
            className='h-12 text-lg'
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
                'w-12 h-12 p-0',
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
        <Button onClick={handleSubgoalCreate} className='h-12'>
          Add Subgoal
        </Button>
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
              {editing.subgoalId === subgoal.subgoal_id ? (
                <form
                  className='flex-1 flex gap-2'
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleEditSave()
                  }}
                >
                  <Input
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                    className='flex-1'
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditing({ subgoalId: null, title: '' })
                      }
                    }}
                  />
                  <Button type='submit' size='sm'>
                    Save
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => setEditing({ subgoalId: null, title: '' })}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                <span
                  className={cn(
                    'flex-1',
                    subgoal.status === 'completed' &&
                      'line-through text-muted-foreground'
                  )}
                >
                  {subgoal.title}
                </span>
              )}
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
              {!editing.subgoalId && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleEditStart(subgoal)}
                >
                  <Pen className='h-4 w-4' />
                </Button>
              )}
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
