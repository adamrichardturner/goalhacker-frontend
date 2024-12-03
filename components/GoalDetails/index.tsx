'use client'

import { Goal } from '@/types/goal'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { calculateGoalProgress } from '@/utils/goalProgress'
import { getGoalStatus } from '@/utils/goalStatus'
import { Button } from '../ui/button'
import { Trash2, Pen } from 'lucide-react'
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { getPriorityConfig } from '@/utils/goalPriority'
import { formatDate } from '../../utils/formatDate'
import SubGoals from '../SubGoals'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface GoalDetailsProps {
  goal: Goal
}

const badgeBaseStyles =
  'px-2 py-1 font-[500] rounded-full text-[10px] backdrop-blur'

const targetBadgeStyles =
  'px-2 py-1 rounded-full font-[500] text-[10px] bg-muted/40 text-white leading-[18px]'

export default function GoalDetails({ goal }: GoalDetailsProps) {
  const router = useRouter()
  const { deleteGoal, updateGoal } = useGoal(goal.goal_id)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState({
    title: goal.title,
    aims: goal.aims,
    target_date: goal.target_date,
  })

  const { progress, completedSteps, totalSteps } = calculateGoalProgress(goal)
  const hasProgress = progress !== null && totalSteps > 0
  const { label: statusLabel, className: statusClass } = getGoalStatus(
    goal?.status || 'planned'
  )
  const { label: priorityLabel, className: priorityClass } = getPriorityConfig(
    goal?.priority || 'low'
  )

  const handleGoalDelete = () => {
    try {
      deleteGoal()
      toast.success('Goal deleted successfully')
      router.push('/goals')
    } catch (error) {
      toast.error('Failed to delete goal')
      console.error('Error deleting goal:', error)
    }
  }

  const handleSave = () => {
    try {
      updateGoal(editedGoal)
      setIsEditing(false)
      toast.success('Goal updated successfully')
    } catch {
      toast.error('Failed to update goal')
    }
  }

  return (
    <div className='flex flex-col'>
      <div
        className='h-[300px] w-full bg-cover bg-center relative rounded-t-lg'
        style={{
          backgroundImage: `url(${goal.image_url || '/default-goal.jpg'})`,
          backgroundSize: 'cover',
        }}
      >
        <div className='absolute flex items-start p-6 justify-end gap-2 inset-0 bg-black/40 rounded-t-lg'>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button size='icon' className='bg-black/50 hover:bg-black/70'>
                <Pen className='h-4 w-4 text-white' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='text-xl font-semibold text-primary'>
                  Edit Goal
                </DialogTitle>
              </DialogHeader>
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    id='title'
                    value={editedGoal.title}
                    onChange={(e) =>
                      setEditedGoal({ ...editedGoal, title: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='aims'>Aims</Label>
                  <Input
                    id='aims'
                    value={editedGoal.aims}
                    onChange={(e) =>
                      setEditedGoal({ ...editedGoal, aims: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='target_date'>Target Date</Label>
                  <Input
                    id='target_date'
                    type='date'
                    value={editedGoal.target_date}
                    onChange={(e) =>
                      setEditedGoal({
                        ...editedGoal,
                        target_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='flex justify-end gap-2 pt-4'>
                  <Button variant='outline' onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
            <AlertDialogTrigger asChild>
              <Button
                variant='destructive'
                size='sm'
                className='flex items-center gap-2 shrink-0'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your goal and all its subgoals.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleting(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleGoalDelete}
                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                >
                  Delete Goal
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className='absolute bottom-6 left-6 right-6 text-white'>
            <div className='flex items-center gap-2'>
              <Badge
                className={`${badgeBaseStyles} ${statusClass} pointer-events-none`}
              >
                {statusLabel}
              </Badge>
              <Badge
                className={`${badgeBaseStyles} ${priorityClass} pointer-events-none`}
              >
                {priorityLabel}
              </Badge>
              {goal.target_date && (
                <Badge className={targetBadgeStyles}>
                  🎯 {formatDate(goal.target_date)}
                </Badge>
              )}
            </div>
            <h1 className='text-3xl font-bold mt-2 line-clamp-2'>
              {goal.title}
            </h1>
          </div>
        </div>
      </div>

      <div className='p-6 space-y-8 bg-card rounded-b-lg'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
          <div className='flex-1 min-w-0'>
            <h2 className='text-xl font-semibold mb-3'>Aims</h2>
            <p className='text-muted-foreground break-words'>{goal.aims}</p>
          </div>
        </div>

        {hasProgress && (
          <div>
            <h2 className='text-xl font-semibold mb-3'>Progress</h2>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>
                  {completedSteps} of {totalSteps} steps completed
                </span>
                <span>{progress}%</span>
              </div>
              <Progress
                value={progress}
                className='h-2'
                indicatorClassName='bg-electricPurple rounded-lg'
              />
            </div>
          </div>
        )}

        <div>
          <h2 className='text-xl font-semibold mb-3'>Subgoals</h2>
          <SubGoals goal={goal} />
        </div>
      </div>
    </div>
  )
}
