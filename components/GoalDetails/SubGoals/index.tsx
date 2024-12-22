import { useState, useEffect } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useGoal } from '@/hooks/useGoal'
import { format } from 'date-fns'
import { Reorder } from 'framer-motion'
import { goalsService } from '@/services/goalsService'
import { startOfDay } from 'date-fns'

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

  const [localSubgoals, setLocalSubgoals] = useState(goal.subgoals || [])

  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [isDraggable, setIsDraggable] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 640)
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Update draggable state based on screen size and subgoal count
  useEffect(() => {
    setIsDraggable(isLargeScreen && localSubgoals.length > 1)
  }, [isLargeScreen, localSubgoals.length])

  const handleSubgoalCreate = async () => {
    if (!newSubgoal.title) return

    // Create optimistic subgoal
    const optimisticSubgoal = {
      subgoal_id: crypto.randomUUID(),
      goal_id: goal.goal_id!,
      title: newSubgoal.title,
      target_date: newSubgoal.target_date || undefined,
      status: newSubgoal.status,
      order: localSubgoals.length,
    }

    // Update UI immediately
    setLocalSubgoals([...localSubgoals, optimisticSubgoal])

    // Reset form
    setNewSubgoal({
      title: '',
      target_date: null,
      status: 'planned',
    })

    try {
      await createSubgoal({
        title: newSubgoal.title,
        target_date: newSubgoal.target_date,
        status: newSubgoal.status,
      })
    } catch (error) {
      // Revert on error
      setLocalSubgoals(localSubgoals)
      console.error('Error creating subgoal:', error)
    }
  }

  const handleSubgoalStatusChange = (
    subgoalId: string,
    status: SubgoalStatus
  ) => {
    // Optimistically update local state
    const previousSubgoals = [...localSubgoals]
    setLocalSubgoals(
      localSubgoals.map((sg) =>
        sg.subgoal_id === subgoalId ? { ...sg, status } : sg
      )
    )

    try {
      updateSubgoalStatus({ subgoalId, status })
    } catch (error) {
      // Revert on error
      setLocalSubgoals(previousSubgoals)
      console.error('Error updating subgoal status:', error)
    }
  }

  const handleEditSave = () => {
    if (!editing.subgoalId || !editing.title) return

    // Optimistically update local state
    const previousSubgoals = [...localSubgoals]
    setLocalSubgoals(
      localSubgoals.map((sg) =>
        sg.subgoal_id === editing.subgoalId
          ? { ...sg, title: editing.title }
          : sg
      )
    )
    setEditing({ subgoalId: null, title: '' })

    try {
      updateSubgoalTitle({
        subgoalId: editing.subgoalId,
        title: editing.title,
      })
    } catch (error) {
      // Revert on error
      setLocalSubgoals(previousSubgoals)
      console.error('Error updating subgoal title:', error)
    }
  }

  const handleDeleteClick = (subgoalId: string) => {
    setDeletingSubgoalId(subgoalId)
  }

  const handleDeleteConfirm = () => {
    if (!deletingSubgoalId) return

    // Optimistically remove from local state
    const previousSubgoals = [...localSubgoals]
    setLocalSubgoals(
      localSubgoals.filter((sg) => sg.subgoal_id !== deletingSubgoalId)
    )
    setDeletingSubgoalId(null)

    try {
      deleteSubgoal(deletingSubgoalId)
    } catch (error) {
      // Revert on error
      setLocalSubgoals(previousSubgoals)
      console.error('Error deleting subgoal:', error)
    }
  }

  const handleTargetDateChange = (subgoalId: string, date: Date | null) => {
    try {
      updateSubgoalTargetDate({
        subgoalId,
        target_date: date?.toISOString() || undefined,
      })
    } catch (error) {
      console.error('Error updating target date:', error)
    }
  }

  const handleReorder = async (reorderedSubgoals: typeof localSubgoals) => {
    if (!goal.goal_id) return
    setLocalSubgoals(reorderedSubgoals)
    const updates = reorderedSubgoals.map((subgoal, index) => ({
      subgoal_id: subgoal.subgoal_id!,
      order: index,
    }))
    try {
      await goalsService.updateSubgoalsOrder(goal.goal_id, updates)
    } catch (error) {
      setLocalSubgoals(goal.subgoals || [])
      console.error('Failed to update subgoal order:', error)
    }
  }

  // Add this function to check if we're in an editing state
  const isEditing = () => {
    return editing.subgoalId !== null || !!newSubgoal.target_date
  }

  const reorderHandler = (reorderedSubgoals: typeof localSubgoals) => {
    if (!isEditing()) {
      handleReorder(reorderedSubgoals)
    }
  }

  const handleSubgoalCreateFromDialog = async () => {
    await handleSubgoalCreate()
    setIsDialogOpen(false)
  }

  return (
    <div className='space-y-4'>
      {/* Mobile Add Button + Dialog */}
      <div className='sm:hidden'>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='w-full'>Add Subgoal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subgoal</DialogTitle>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <Input
                value={newSubgoal.title}
                onChange={(e) =>
                  setNewSubgoal({ ...newSubgoal, title: e.target.value })
                }
                placeholder='Enter subgoal title...'
                className='h-12'
              />
              <Select
                value={newSubgoal.status}
                onValueChange={(value: SubgoalStatus) =>
                  setNewSubgoal({ ...newSubgoal, status: value })
                }
              >
                <SelectTrigger className='w-full sm:w-[140px] h-12'>
                  <SelectValue
                    placeholder='Status'
                    className='text-muted-foreground'
                  />
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
                    className={cn(
                      'h-12 w-12 bg-accent justify-start bg-input',
                      newSubgoal.target_date && 'border-2 border-electricPurple'
                    )}
                  >
                    <CalendarIcon className='h-12 w-12 mr-2 bg-input' />
                    {newSubgoal.target_date
                      ? format(new Date(newSubgoal.target_date), 'MMM d, yyyy')
                      : 'Set target date'}
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
                    disabled={(date) =>
                      startOfDay(date) < startOfDay(new Date())
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubgoalCreateFromDialog}
                disabled={newSubgoal.title.length < 3}
                className='w-full'
              >
                Add Subgoal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Add Form */}
      <div className='hidden sm:flex flex-col sm:flex-row gap-3'>
        <Input
          value={newSubgoal.title}
          onChange={(e) =>
            setNewSubgoal({ ...newSubgoal, title: e.target.value })
          }
          placeholder='Add a new subgoal...'
          className='flex-1 h-12'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newSubgoal.title) {
              handleSubgoalCreate()
            }
          }}
        />
        <div className='flex flex-col sm:flex-row gap-3 sm:items-center'>
          <Select
            value={newSubgoal.status}
            onValueChange={(value: SubgoalStatus) =>
              setNewSubgoal({ ...newSubgoal, status: value })
            }
          >
            <SelectTrigger className='w-full sm:w-[140px] h-12'>
              <SelectValue
                placeholder='Status'
                className='text-muted-foreground'
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='planned'>Planned</SelectItem>
              <SelectItem value='in_progress'>In Progress</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className='flex gap-2 justify-between sm:justify-start'>
            <Popover>
              <PopoverTrigger asChild className='w-12 h-12 bg-input'>
                <Button
                  variant='ghost'
                  className={cn(
                    'h-12 w-12 bg-input',
                    newSubgoal.target_date &&
                      'border-2 bg-input border-electricPurple'
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
                  disabled={(date) => startOfDay(date) < startOfDay(new Date())}
                />
              </PopoverContent>
            </Popover>
            <Button
              className='flex-1 sm:flex-none h-12'
              onClick={handleSubgoalCreate}
              disabled={newSubgoal.title.length < 3}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Existing Subgoals - responsive layout */}
      <Reorder.Group
        axis='y'
        values={localSubgoals}
        onReorder={reorderHandler}
        className={cn(
          'space-y-3',
          isDraggable && !isEditing() && 'cursor-grab'
        )}
      >
        {localSubgoals.map((subgoal) => (
          <Reorder.Item
            key={subgoal.subgoal_id}
            value={subgoal}
            className={cn(
              'flex flex-col sm:flex-row gap-3 p-4 border rounded-lg',
              isDraggable && !isEditing() && 'cursor-grab'
            )}
            dragListener={isDraggable && !isEditing()}
            style={{ position: 'relative' }}
          >
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1'>
              <Select
                value={subgoal.status}
                onValueChange={(value: SubgoalStatus) =>
                  subgoal.subgoal_id &&
                  handleSubgoalStatusChange(subgoal.subgoal_id, value)
                }
              >
                <SelectTrigger className='w-full sm:w-[140px] h-12'>
                  <SelectValue
                    placeholder='Status'
                    className='text-muted-foreground'
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='planned'>Planned</SelectItem>
                  <SelectItem value='in_progress'>In Progress</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                </SelectContent>
              </Select>
              {editing.subgoalId === subgoal.subgoal_id ? (
                <form
                  className='flex-1 flex flex-col sm:flex-row gap-3 w-full'
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
                    className='flex-1 h-12'
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditing({ subgoalId: null, title: '' })
                      }
                    }}
                  />
                  <div className='flex gap-2 justify-end sm:justify-start'>
                    <Button type='submit' size='sm' className='h-12'>
                      Save
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='h-12'
                      onClick={() => setEditing({ subgoalId: null, title: '' })}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <span
                  className={cn(
                    'flex-1 text-sm',
                    subgoal.status === 'completed' &&
                      'line-through text-muted-foreground'
                  )}
                >
                  {subgoal.title}
                </span>
              )}
            </div>
            <div className='flex items-center gap-2 justify-end sm:justify-start'>
              {editing.subgoalId !== subgoal.subgoal_id && (
                <>
                  {subgoal.target_date && (
                    <span className='text-sm text-muted-foreground whitespace-nowrap'>
                      {format(new Date(subgoal.target_date), 'MMM d, yyyy')}
                    </span>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='ghost'
                        className={cn(
                          'h-12 w-12 p-0 bg-input',
                          subgoal.target_date &&
                            'border-2 border-electricPurple'
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
                          handleTargetDateChange(
                            subgoal.subgoal_id,
                            date || null
                          )
                        }
                        disabled={(date) =>
                          startOfDay(date) < startOfDay(new Date())
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditing({
                        subgoalId: subgoal.subgoal_id || null,
                        title: subgoal.title,
                      })
                    }}
                    className='bg-input h-12 w-12'
                  >
                    <Pen className='h-4 w-4 text-primary' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-12 w-12 bg-input'
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
          </Reorder.Item>
        ))}
      </Reorder.Group>

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
