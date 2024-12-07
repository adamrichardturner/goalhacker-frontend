import { Goal } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Pen, CalendarIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { CategorySelect } from '@/components/CategorySelect'
import { api } from '@/services/api'

interface EditSummaryProps {
  goal: Goal
}

export function EditSummary({ goal }: EditSummaryProps) {
  const { updateGoal } = useGoal(goal.goal_id)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState({
    title: goal.title || '',
    aims: goal.aims || '',
    steps_to_completion: goal.steps_to_completion || '',
    measurement_method: goal.measurement_method || '',
    target_date: goal.target_date || undefined,
    priority: goal.priority || 'medium',
    category_id: goal.category?.category_id || '',
  })

  const handleSave = async () => {
    try {
      // First update the category if it changed
      if (editedGoal.category_id !== goal.category?.category_id) {
        await api.patch(`/api/goals/${goal.goal_id}/category`, {
          category_id: editedGoal.category_id,
        })
      }

      // Then update other goal fields
      const updatedGoal = {
        title: editedGoal.title,
        aims: editedGoal.aims,
        steps_to_completion: editedGoal.steps_to_completion,
        measurement_method: editedGoal.measurement_method,
        target_date: editedGoal.target_date,
        priority: editedGoal.priority,
      }

      updateGoal(updatedGoal)
      setIsEditing(false)
      toast.success('Goal summary updated successfully')
    } catch (error) {
      console.error('Error updating goal:', error)
      toast.error('Failed to update goal summary')
    }
  }

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogTrigger asChild>
        <Button
          size='icon'
          className='absolute top-4 right-4 bg-black/50 hover:bg-black/70 h-8 w-8'
        >
          <Pen className='h-4 w-4 text-white' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Edit Goal Summary</DialogTitle>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              value={editedGoal.title}
              onChange={(e) =>
                setEditedGoal((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder='Enter goal title'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='aims'>Aims</Label>
            <Input
              id='aims'
              value={editedGoal.aims}
              onChange={(e) =>
                setEditedGoal((prev) => ({ ...prev, aims: e.target.value }))
              }
              placeholder='What are you aiming to achieve?'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='steps'>Steps to Completion</Label>
            <RichTextEditor
              value={editedGoal.steps_to_completion}
              onChange={(value) =>
                setEditedGoal((prev) => ({
                  ...prev,
                  steps_to_completion: value,
                }))
              }
              placeholder='What steps will you take to complete this goal?'
              className='min-h-[100px]'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='measurement'>Measurement Method</Label>
            <RichTextEditor
              value={editedGoal.measurement_method}
              onChange={(value) =>
                setEditedGoal((prev) => ({
                  ...prev,
                  measurement_method: value,
                }))
              }
              placeholder='How will you measure progress towards this goal?'
              className='min-h-[100px]'
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !editedGoal.target_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {editedGoal.target_date ? (
                      format(new Date(editedGoal.target_date), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={
                      editedGoal.target_date
                        ? new Date(editedGoal.target_date)
                        : undefined
                    }
                    onSelect={(date) =>
                      setEditedGoal((prev) => ({
                        ...prev,
                        target_date: date?.toISOString(),
                      }))
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='space-y-2'>
              <Label>Priority</Label>
              <Select
                value={editedGoal.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setEditedGoal((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Category</Label>
            <CategorySelect
              value={editedGoal.category_id}
              onValueChange={(value) =>
                setEditedGoal((prev) => ({ ...prev, category_id: value }))
              }
            />
          </div>
        </div>
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
