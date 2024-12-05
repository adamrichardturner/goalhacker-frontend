import { Goal } from '@/types/goal'
import { Button } from '../../ui/button'
import { Pen, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { useState } from 'react'
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'
import { Image } from '@/types/image'
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
} from '../../ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { ImageGallery } from '../../ImageGallery'

interface EditGoalImageProps {
  goal: Goal
}

export function EditGoalImage({ goal }: EditGoalImageProps) {
  const router = useRouter()
  const { updateGoal, deleteGoal } = useGoal(goal.goal_id)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editedGoal, setEditedGoal] = useState({
    title: goal.title || '',
    aims: goal.aims || '',
    target_date: goal.target_date || '',
    default_image_key: goal.default_image_key || '',
    image_url: goal.image_url || '',
  })

  const handleSave = () => {
    try {
      updateGoal(editedGoal)
      setIsEditing(false)
      toast.success('Goal updated successfully')
    } catch {
      toast.error('Failed to update goal')
    }
  }

  const handleImageSelect = (image: Image) => {
    setEditedGoal({
      ...editedGoal,
      default_image_key: image.id,
      image_url: image.url,
    })
  }

  const handleGoalDelete = () => {
    setIsDeleting(true)
    deleteGoal()
    toast.success('Goal deleted successfully')
    router.push('/goals')
  }

  return (
    <>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button size='icon' className='bg-black/50 hover:bg-black/70 h-8 w-8'>
            <Pen className='h-4 w-4 text-white' />
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-3xl bg-card'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold text-primary'>
              Edit Goal Image
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <ImageGallery
              onImageSelect={handleImageSelect}
              selectedImage={
                editedGoal.default_image_key && editedGoal.image_url
                  ? {
                      id: editedGoal.default_image_key,
                      url: editedGoal.image_url,
                    }
                  : undefined
              }
              existingImage={editedGoal.image_url}
            />
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='outline' onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogTrigger asChild>
          <Button
            variant='destructive'
            size='sm'
            className='flex items-center gap-2 shrink-0 h-8 w-8'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              goal and all its subgoals.
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
    </>
  )
}
