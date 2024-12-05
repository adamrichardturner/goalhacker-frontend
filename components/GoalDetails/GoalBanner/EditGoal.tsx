import { Goal } from '@/types/goal'
import { Button } from '../../ui/button'
import { CalendarIcon, Pen, Trash2 } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { ImageGallery } from '../../ImageGallery'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface EditGoalProps {
  goal: Goal
}

export function EditGoal({ goal }: EditGoalProps) {
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
              Edit Goal
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue='details'>
            <TabsList className='bg-muted-foreground/10 p-2 space-x-2'>
              <TabsTrigger value='details'>Details</TabsTrigger>
              <TabsTrigger value='image'>Background Image</TabsTrigger>
            </TabsList>
            <TabsContent value='details' className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  value={editedGoal.title}
                  onChange={(e) =>
                    setEditedGoal({ ...editedGoal, title: e.target.value })
                  }
                  className='bg-card'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='aims'>Aims</Label>
                <Textarea
                  id='aims'
                  value={editedGoal.aims}
                  onChange={(e) =>
                    setEditedGoal({ ...editedGoal, aims: e.target.value })
                  }
                  className='bg-card'
                />
              </div>
              <div className='space-y-2 w-1/2'>
                <Label htmlFor='target_date'>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
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
                      onSelect={(selectedDate) =>
                        setEditedGoal({
                          ...editedGoal,
                          target_date: selectedDate?.toISOString() || '',
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TabsContent>
            <TabsContent value='image' className='py-4'>
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
              />
            </TabsContent>
          </Tabs>
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
