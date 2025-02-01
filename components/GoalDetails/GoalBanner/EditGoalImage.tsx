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
import { API_URL } from '@/config/api'

interface EditGoalImageProps {
  goal: Goal
}

type EditedGoal = {
  title: string
  aims: string
  target_date: string
  image_url: string
  category?: string
}

export function EditGoalImage({ goal }: EditGoalImageProps) {
  const router = useRouter()
  const { updateGoal, deleteGoal } = useGoal(goal.goal_id)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editedGoal, setEditedGoal] = useState<EditedGoal>({
    title: goal.title || '',
    aims: goal.aims || '',
    target_date: goal.target_date || '',
    image_url: goal.image_url || '',
    category: goal.category?.name,
  })

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true)

      // Create form data
      const formData = new FormData()
      formData.append('image', file)

      // Upload through our API
      const response = await fetch(
        `${API_URL}/api/goals/${goal.goal_id}/image`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to upload image')
      }

      const { signedUrl } = await response.json()

      // Update goal with the signed URL
      setEditedGoal((prev) => ({
        ...prev,
        image_url: signedUrl, // Store the signed URL directly
        category: undefined, // Clear category when custom image is uploaded
      }))

      // Update the ImageGallery with the signed URL for immediate display
      if (selectedImage) {
        selectedImage.url = signedUrl
      }

      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (!editedGoal.image_url) {
        toast.error('Please select or upload an image first')
        return
      }

      // Update with both image_url and user_id
      const updatePayload: Partial<Goal> = {
        image_url: editedGoal.image_url, // This is now the full API path
        user_id: goal.user_id, // Required for RLS
      }

      await updateGoal(updatePayload)
      setIsEditing(false)
      toast.success('Goal updated successfully')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to update goal')
    }
  }

  const handleImageSelect = useCallback(async (image: Image) => {
    try {
      setEditedGoal((prev) => ({
        ...prev,
        image_url: image.url, // Store the S3 URL for default gallery images
        category: image.category,
      }))
    } catch (error) {
      console.error('Error selecting image:', error)
      toast.error('Failed to select image')
    }
  }, [])

  const selectedImage = useMemo(() => {
    if (editedGoal.image_url) {
      return {
        id: editedGoal.image_url.split('/').pop()?.split('.')[0] || '',
        url: editedGoal.image_url, // Use the URL directly since it's already a signed URL
        category: editedGoal.category,
      }
    }
    return undefined
  }, [editedGoal.image_url, editedGoal.category])

  const handleGoalDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteGoal()
      toast.success('Goal deleted successfully')
      router.push('/goals')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete goal')
    }
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
        <DialogContent className='sm:px-4 bg-card max-w-3xl overflow-scroll sm:overflow-auto max-h-[70vh] sm:max-h-[100vh] rounded-2xl'>
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
              onImageUpload={handleImageUpload}
              isUploading={isUploading}
            />
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <Button
              variant='outline'
              className='bg-input hover:bg-input/98'
              onClick={() => setIsEditing(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUploading}>
              Save Changes
            </Button>
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
              goal and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsDeleting(false)}
              className='bg-input hover:bg-input/98'
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleGoalDelete}
              className='bg-destructive hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
