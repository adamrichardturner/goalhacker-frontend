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
import { useState, useCallback, useMemo } from 'react'
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

  const handleImageSelect = useCallback((image: Image) => {
    setEditedGoal((prev) => ({
      ...prev,
      default_image_key: image.id,
      image_url: image.url,
    }))
  }, [])

  const selectedImage = useMemo(() => {
    if (editedGoal.default_image_key && editedGoal.image_url) {
      return {
        id: editedGoal.default_image_key,
        url: editedGoal.image_url,
      }
    }
    return undefined
  }, [editedGoal.default_image_key, editedGoal.image_url])

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
          <Button
            variant='ghost'
            size='icon'
            className='bg-input hover:bg-input/98 h-8 w-8'
          >
            <Pen className='h-4 w-4 text-primary' />
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:px-0 bg-card max-w-5xl overflow-scroll sm:overflow-auto max-h-[70vh] sm:max-h-[100vh] rounded-lg'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold text-primary'>
              Edit Goal Image
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <ImageGallery
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              existingImage={editedGoal.image_url}
            />
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <Button
              variant='outline'
              className='bg-input hover:bg-input/98'
              onClick={() => setIsEditing(false)}
            >
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
            size='icon'
            className='flex items-center gap-2 shrink-0 h-8 w-8'
          >
            <Trash2 className='text-xl font-semibold h-4 w-4' />
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
