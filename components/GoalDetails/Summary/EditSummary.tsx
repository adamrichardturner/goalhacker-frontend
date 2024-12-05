import { Goal } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Pen } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'

interface EditSummaryProps {
  goal: Goal
}

export function EditSummary({ goal }: EditSummaryProps) {
  const { updateGoal } = useGoal(goal.goal_id)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState({
    aims: goal.aims || '',
    steps_to_completion: goal.steps_to_completion || '',
    measurement_method: goal.measurement_method || '',
  })

  const handleSave = () => {
    try {
      updateGoal(editedGoal)
      setIsEditing(false)
      toast.success('Goal summary updated successfully')
    } catch {
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
            <Label htmlFor='aims'>Aims</Label>
            <Textarea
              id='aims'
              value={editedGoal.aims}
              onChange={(e) =>
                setEditedGoal((prev) => ({ ...prev, aims: e.target.value }))
              }
              placeholder='What are you aiming to achieve?'
              className='min-h-[100px]'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='steps'>Steps to Completion</Label>
            <Textarea
              id='steps'
              value={editedGoal.steps_to_completion}
              onChange={(e) =>
                setEditedGoal((prev) => ({
                  ...prev,
                  steps_to_completion: e.target.value,
                }))
              }
              placeholder='What steps will you take to complete this goal?'
              className='min-h-[100px]'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='measurement'>Measurement Method</Label>
            <Textarea
              id='measurement'
              value={editedGoal.measurement_method}
              onChange={(e) =>
                setEditedGoal((prev) => ({
                  ...prev,
                  measurement_method: e.target.value,
                }))
              }
              placeholder='How will you measure progress towards this goal?'
              className='min-h-[100px]'
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
