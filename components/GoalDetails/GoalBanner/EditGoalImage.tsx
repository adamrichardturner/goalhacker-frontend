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

type UpdateGoalPayload = Omit<Goal, 'category'> & {
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

      // Get signed URL for upload
      const response = await fetch(`${API_URL}/api/images/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Failed to get upload URL')

      const { uploadUrl, key } = await response.json()

      // Upload to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) throw new Error('Failed to upload to S3')

      // Get the signed URL for the uploaded image
      const signedUrlResponse = await fetch(
        `${API_URL}/api/images/goals/${key}`,
        {
          credentials: 'include',
        }
      )

      if (!signedUrlResponse.ok) throw new Error('Failed to get signed URL')
      const { url: signedUrl } = await signedUrlResponse.json()

      // Update goal with the new image key and URL
      setEditedGoal((prev) => ({
        ...prev,
        image_url: key, // Store the S3 key
        category: undefined, // Clear category when custom image is uploaded
      }))

      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Only update the image_url
      const updatePayload: Partial<Goal> = {
        image_url: editedGoal.image_url,
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
    if (editedGoal.image_url && editedGoal.category) {
      return {
        id: editedGoal.image_url.split('/').pop()?.split('.')[0] || '',
        url: editedGoal.image_url,
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
