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
    status: 'planned' as SubgoalStatus,
    title: '',
    target_date: undefined as string | undefined,
  })
  const [editing, setEditing] = useState<EditingState>({
    subgoalId: null,
    title: '',
  })
  const [deletingSubgoal, setDeletingSubgoal] = useState<string | null>(null)
  const {
    createSubgoal,
    updateSubgoalStatus,
    updateSubgoalTitle,
    updateSubgoalTargetDate,
    deleteSubgoal,
  } = useGoal(goal.goal_id)

  const handleSubgoalCreate = async () => {
    if (!newSubgoal.title.trim()) {
      toast.error('Please enter a subgoal title')
      return
    }

    try {
      createSubgoal({
        status: newSubgoal.status,
        title: newSubgoal.title,
        target_date: newSubgoal.target_date,
      })
      setNewSubgoal({
        status: 'planned',
        title: '',
        target_date: undefined,
      })
    } catch (error) {
      console.error('Error creating subgoal:', error)
    }
  }

  const handleSubgoalStatusChange = async (
    subgoalId: string,
    status: SubgoalStatus
  ) => {
    try {
      await updateSubgoalStatus({
        subgoalId,
        status,
      })
    } catch (error) {
      console.error('Error updating subgoal status:', error)
    }
  }

  const handleSubgoalDelete = async (subgoalId: string) => {
    try {
      await deleteSubgoal(subgoalId)
      setDeletingSubgoal(null)
    } catch (error) {
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
      await updateSubgoalTitle({
        subgoalId: editing.subgoalId,
        title: editing.title,
      })
      setEditing({ subgoalId: null, title: '' })
    } catch (error) {
      console.error('Error updating subgoal title:', error)
    }
  }

  const handleTargetDateChange = async (
    subgoalId: string,
    date: Date | undefined
  ) => {
    try {
      await updateSubgoalTargetDate({
        subgoalId,
        target_date: date?.toISOString() || null,
      })
    } catch (error) {
      console.error('Error updating target date:', error)
    }
  }

  return (
    <div className='space-y-4'>
      {/* Add new subgoal form */}
      <div className='flex items-center gap-2'>
        <Input
          value={newSubgoal.title}
          onChange={(e) =>
            setNewSubgoal({ ...newSubgoal, title: e.target.value })
          }
          placeholder='Add a new sub-goal...'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newSubgoal.title) {
              handleSubgoalCreate()
            }
          }}
        />
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className={cn(newSubgoal.target_date && 'border border-input')}
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
        <Button onClick={handleSubgoalCreate}>Add</Button>
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

              {subgoal.target_date && (
                <span className='text-sm text-muted-foreground'>
                  {format(new Date(subgoal.target_date), 'MMM d, yyyy')}
                </span>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='ghost' size='icon'>
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
                      handleTargetDateChange(subgoal.subgoal_id, date)
                    }
                    disabled={(date) => date < new Date()}
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
                  subgoal.subgoal_id && setDeletingSubgoal(subgoal.subgoal_id)
                }
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!deletingSubgoal}
        onOpenChange={() => setDeletingSubgoal(null)}
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
            <AlertDialogCancel onClick={() => setDeletingSubgoal(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingSubgoal && handleSubgoalDelete(deletingSubgoal)
              }
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
