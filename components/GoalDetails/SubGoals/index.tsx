import { useState } from 'react'
import { Goal, SubgoalStatus } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { useGoal } from '@/hooks/useGoal'
import { format } from 'date-fns'

interface SubGoalsProps {
  goal: Goal
}

interface EditingState {
  subgoalId: string | null
  title: string
}

export default function SubGoals({ goal }: SubGoalsProps) {
  const {
    createSubgoal,
    updateSubgoalStatus,
    updateSubgoalTitle,
    updateSubgoalTargetDate,
    deleteSubgoal,
  } = useGoal(goal.goal_id)

  const [newSubgoal, setNewSubgoal] = useState<{
    title: string
    target_date?: string | null
    status: SubgoalStatus
  }>({
    title: '',
    target_date: null,
    status: 'planned',
  })

  const [editing, setEditing] = useState<EditingState>({
    subgoalId: null,
    title: '',
  })
  const [deletingSubgoalId, setDeletingSubgoalId] = useState<string | null>(
    null
  )

  const handleSubgoalCreate = () => {
    if (!newSubgoal.title) return

    try {
      createSubgoal({
        title: newSubgoal.title,
        target_date: newSubgoal.target_date,
        status: newSubgoal.status,
      })
      setNewSubgoal({
        title: '',
        target_date: null,
        status: 'planned',
      })
    } catch (error) {
      console.error('Error creating subgoal:', error)
    }
  }

  const handleSubgoalStatusChange = (
    subgoalId: string,
    status: SubgoalStatus
  ) => {
    try {
      updateSubgoalStatus({ subgoalId, status })
    } catch (error) {
      console.error('Error updating subgoal status:', error)
    }
  }

  const handleEditClick = (subgoalId: string, title: string) => {
    setEditing({ subgoalId, title })
  }

  const handleEditSave = () => {
    if (!editing.subgoalId || !editing.title) return

    try {
      updateSubgoalTitle({
        subgoalId: editing.subgoalId,
        title: editing.title,
      })
      setEditing({ subgoalId: null, title: '' })
    } catch (error) {
      console.error('Error updating subgoal title:', error)
    }
  }

  const handleDeleteClick = (subgoalId: string) => {
    setDeletingSubgoalId(subgoalId)
  }

  const handleDeleteConfirm = () => {
    if (!deletingSubgoalId) return

    try {
      deleteSubgoal(deletingSubgoalId)
      setDeletingSubgoalId(null)
    } catch (error) {
      console.error('Error deleting subgoal:', error)
    }
  }

  const handleTargetDateChange = (subgoalId: string, date: Date | null) => {
    try {
      updateSubgoalTargetDate({
        subgoalId,
        target_date: date?.toISOString() || null,
      })
    } catch (error) {
      console.error('Error updating target date:', error)
    }
  }

  const sortedSubgoals = [...(goal.subgoals || [])].sort((a, b) => {
    // If both have target dates, compare them
    if (a.target_date && b.target_date) {
      return (
        new Date(a.target_date).getTime() - new Date(b.target_date).getTime()
      )
    }
    // If only one has a target date, put the one with date first
    if (a.target_date) return -1
    if (b.target_date) return 1
    // If neither has a target date, maintain their original order
    return 0
  })

  return (
    <div className='space-y-4'>
      {/* Add new subgoal */}
      <div className='flex items-center gap-2'>
        <Input
          value={newSubgoal.title}
          onChange={(e) =>
            setNewSubgoal({ ...newSubgoal, title: e.target.value })
          }
          placeholder='Add a new subgoal...'
          className='flex-1'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newSubgoal.title) {
              handleSubgoalCreate()
            }
          }}
        />
        <div className='flex items-center gap-2'>
          <Select
            value={newSubgoal.status}
            onValueChange={(value: SubgoalStatus) =>
              setNewSubgoal({ ...newSubgoal, status: value })
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
                  <CalendarIcon className='h-4 w-4' />
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
          <Button onClick={handleSubgoalCreate}>Add</Button>
        </div>
      </div>

      {/* Existing Subgoals */}
      <div className='space-y-3'>
        {sortedSubgoals.map((subgoal) => (
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
                    className='max-w-2/5'
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
                    'flex-1 text-sm pr-2',
                    subgoal.status === 'completed' &&
                      'line-through text-muted-foreground'
                  )}
                >
                  {subgoal.title}
                </span>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {editing.subgoalId !== subgoal.subgoal_id &&
                subgoal.target_date && (
                  <span className='text-sm text-muted-foreground whitespace-nowrap'>
                    {format(new Date(subgoal.target_date), 'MMM d, yyyy')}
                  </span>
                )}
              {editing.subgoalId !== subgoal.subgoal_id && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='ghost'
                      className={cn(
                        'h-8 w-8 p-0',
                        subgoal.target_date && 'border-2 border-electricPurple'
                      )}
                    >
                      <CalendarIcon className='h-4 w-4' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={
                        subgoal.target_date
                          ? new Date(subgoal.target_date)
                          : undefined
                      }
                      onSelect={(date) =>
                        subgoal.subgoal_id &&
                        handleTargetDateChange(subgoal.subgoal_id, date || null)
                      }
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
              {editing.subgoalId !== subgoal.subgoal_id && (
                <>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() =>
                      subgoal.subgoal_id &&
                      handleEditClick(subgoal.subgoal_id, subgoal.title)
                    }
                  >
                    <Pen className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 hover:bg-destructive hover:text-destructive-foreground'
                    onClick={() =>
                      subgoal.subgoal_id &&
                      handleDeleteClick(subgoal.subgoal_id)
                    }
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!deletingSubgoalId}
        onOpenChange={() => setDeletingSubgoalId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subgoal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subgoal? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSubgoalId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
