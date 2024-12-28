import { useState, useEffect, useCallback } from 'react'
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
import { Reorder, AnimatePresence, motion } from 'framer-motion'
import { startOfDay } from 'date-fns'
import debounce from 'lodash/debounce'

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
    // Note: Provide a bool or check for isLoading in createSubgoal
    // if you want to show loading state for newly created subgoals:
    // isCreatingSubgoal,
    updateSubgoalsOrder,
  } = useGoal(goal.goal_id)

  // Local state for subgoals to handle immediate reordering
  const [localSubgoals, setLocalSubgoals] = useState(goal.subgoals || [])

  // Debounced server update
  const debouncedUpdateOrder = useCallback(
    debounce((reorderedSubgoals: typeof localSubgoals) => {
      const updates = reorderedSubgoals.map((subgoal, index) => ({
        subgoal_id: subgoal.subgoal_id!,
        order: index,
      }))
      updateSubgoalsOrder(updates)
    }, 750),
    [updateSubgoalsOrder]
  )

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateOrder.cancel()
    }
  }, [debouncedUpdateOrder])

  // Update local subgoals when goal.subgoals changes
  useEffect(() => {
    if (goal.subgoals) {
      setLocalSubgoals(goal.subgoals)
    }
  }, [goal.subgoals])

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
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [isDraggable, setIsDraggable] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Update draggable state based on screen size and subgoal count
  useEffect(() => {
    setIsDraggable(isLargeScreen && (goal.subgoals?.length || 0) > 1)
  }, [isLargeScreen, goal.subgoals?.length])

  const handleSubgoalCreate = () => {
    if (!newSubgoal.title) return

    createSubgoal({
      title: newSubgoal.title,
      target_date: newSubgoal.target_date,
      status: newSubgoal.status,
    })

    // Reset form immediately for better UX
    setNewSubgoal({
      title: '',
      target_date: null,
      status: 'planned',
    })
  }

  const handleSubgoalStatusChange = (
    subgoalId: string,
    status: SubgoalStatus
  ) => {
    updateSubgoalStatus({ subgoalId, status })
  }

  const handleEditSave = () => {
    if (!editing.subgoalId || !editing.title) return

    updateSubgoalTitle({
      subgoalId: editing.subgoalId,
      title: editing.title,
    })
    setEditing({ subgoalId: null, title: '' })
  }

  const handleDeleteClick = (subgoalId: string) => {
    setDeletingSubgoalId(subgoalId)
  }

  const handleDeleteConfirm = () => {
    if (!deletingSubgoalId) return
    deleteSubgoal(deletingSubgoalId)
    setDeletingSubgoalId(null)
  }

  const handleTargetDateChange = (subgoalId: string, date: Date | null) => {
    updateSubgoalTargetDate({
      subgoalId,
      target_date: date?.toISOString(),
    })
  }

  const handleReorder = (reorderedSubgoals: typeof localSubgoals) => {
    if (isEditing()) return

    // Update local state immediately
    setLocalSubgoals(reorderedSubgoals)

    // Trigger debounced server update
    debouncedUpdateOrder(reorderedSubgoals)
  }

  const isEditing = () => {
    return editing.subgoalId !== null
  }

  const handleSubgoalCreateFromDialog = () => {
    handleSubgoalCreate()
    setIsDialogOpen(false)
  }

  return (
    <motion.div layout className='space-y-4'>
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
                      'h-12 w-full bg-accent justify-start bg-input',
                      newSubgoal.target_date && 'border-2 border-primaryActive'
                    )}
                  >
                    <CalendarIcon className='h-4 w-4 mr-2 bg-input' />
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
      <div className='hidden sm:flex flex-col sm:flex-row bg-paper z-10 gap-3'>
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
        <div className='flex flex-col sm:flex-row bg-paper gap-3 sm:items-center'>
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
                      'border-2 bg-input border-primaryActive'
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

      {/* Existing Subgoals - with animated transitions */}
      <motion.div
        layout
        className='pt-[20px] sm:pt-0 overflow-hidden'
        transition={{
          height: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
          layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
        }}
      >
        <motion.div layout>
          <Reorder.Group
            axis='y'
            values={localSubgoals}
            onReorder={handleReorder}
            className={cn(
              'space-y-3',
              isDraggable && !isEditing() && 'cursor-grab'
            )}
          >
            <AnimatePresence mode='sync' initial={false}>
              {localSubgoals.map((subgoal) => (
                <Reorder.Item
                  key={subgoal.subgoal_id}
                  value={subgoal}
                  layout='position'
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      ease: 'easeOut',
                    },
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      ease: 'easeOut',
                    },
                  }}
                  className={cn(
                    'flex flex-col sm:flex-row gap-3 p-4 border rounded-2xl bg-white',
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

                    {/* Editing Title */}
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
                            onClick={() =>
                              setEditing({ subgoalId: null, title: '' })
                            }
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

                  {/* Right-side controls */}
                  <div className='flex items-center gap-2 justify-end sm:justify-start'>
                    {editing.subgoalId !== subgoal.subgoal_id && (
                      <>
                        {subgoal.target_date && (
                          <span className='text-sm text-muted-foreground whitespace-nowrap'>
                            {format(
                              new Date(subgoal.target_date),
                              'MMM d, yyyy'
                            )}
                          </span>
                        )}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='ghost'
                              className={cn(
                                'h-12 w-12 p-0 bg-input',
                                subgoal.target_date &&
                                  'border-2 border-primaryActive'
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
            </AnimatePresence>
          </Reorder.Group>
        </motion.div>
      </motion.div>

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
    </motion.div>
  )
}
