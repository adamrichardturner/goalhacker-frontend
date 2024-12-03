import { DefaultImage, Goal } from '@/types/goal'
import { Card, CardContent } from '../ui/card'
import { getPriorityConfig } from '@/utils/goalPriority'
import { Badge } from '../ui/badge'
import { formatDate } from '@/utils/formatDate'
import { Button } from '../ui/button'
import { Pen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
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
} from '../ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import useCategorizedImages from '@/hooks/useCategorizedImages'
import ImageUpload from '../ImageUpload'

interface GoalDetailsInfoProps {
  goal: Goal
}

const badgeBaseStyles =
  'px-2 py-1 font-[500] rounded-full text-[10px] backdrop-blur'
const targetBadgeStyles =
  'px-2 py-1 rounded-full font-[500] text-[10px] bg-muted/40 text-white leading-[18px]'

export default function GoalDetailsInfo({ goal }: GoalDetailsInfoProps) {
  const router = useRouter()
  const { deleteGoal, updateGoal } = useGoal(goal.goal_id)
  const { images: defaultImages } = useCategorizedImages()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState({
    title: goal.title,
    aims: goal.aims,
    target_date: goal.target_date,
    default_image_key: goal.default_image_key,
    image_url: goal.image_url,
  })

  const priorityConfig = getPriorityConfig(goal.priority)

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
    <div>
      <div
        className='h-[300px] w-full bg-cover bg-center relative rounded-t-lg'
        style={{
          backgroundImage: `url(${
            editedGoal.image_url ||
            (editedGoal.default_image_key &&
              defaultImages?.find(
                (img: DefaultImage) => img.key === editedGoal.default_image_key
              )?.url) ||
            '/default-goal.jpg'
          })`,
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
            <DialogContent className='max-w-3xl'>
              <DialogHeader>
                <DialogTitle className='text-xl font-semibold text-primary'>
                  Edit Goal
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue='details'>
                <TabsList>
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
                </TabsContent>
                <TabsContent value='image' className='py-4 max-w-2xl'>
                  <ImageUpload
                    goalId={goal.goal_id}
                    currentImage={editedGoal.image_url}
                    onImageChange={(result) => {
                      console.log('Image change result:', result)
                      setEditedGoal({
                        ...editedGoal,
                        image_url: result.image_url || null,
                        default_image_key: result.default_image_key || null,
                      })
                    }}
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
                className={`${badgeBaseStyles} ${goal.status === 'completed' ? 'bg-green-500/20' : goal.status === 'in_progress' ? 'bg-blue-500/20' : goal.status === 'archived' ? 'bg-gray-500/20' : 'bg-yellow-500/20'}`}
              >
                {goal.status}
              </Badge>
              <Badge className={`${badgeBaseStyles} ${priorityConfig.color}`}>
                {goal.priority}
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

      <Card className='rounded-t-none'>
        <CardContent className='pt-6 space-y-6'>
          <div>
            <h3 className='font-semibold mb-2'>Aims</h3>
            <p className='text-muted-foreground'>{goal.aims}</p>
          </div>
          <div>
            <h3 className='font-semibold mb-2'>Steps to Completion</h3>
            <p className='text-muted-foreground'>{goal.steps_to_completion}</p>
          </div>
          <div>
            <h3 className='font-semibold mb-2'>Measurement Method</h3>
            <p className='text-muted-foreground'>{goal.measurement_method}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
