import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useGoal } from '@/hooks/useGoal'
import { Goal, GoalStatus } from '@/types/goal'
import { Label } from '@/components/ui/label'

interface GoalStatusEditorProps {
  goal: Goal
  onStatusUpdate?: () => void
}

const GOAL_STATUSES: { label: string; value: GoalStatus }[] = [
  { label: 'Planned', value: 'planned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
]

export function GoalStatusEditor({ goal, onStatusUpdate }: GoalStatusEditorProps) {
  const [selectedStatus, setSelectedStatus] = useState<GoalStatus>(goal.status)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { updateGoal } = useGoal(goal.goal_id)

  const handleStatusChange = (newStatus: GoalStatus) => {
    setSelectedStatus(newStatus)
  }

  const handleSaveClick = () => {
    setIsDialogOpen(true)
  }

  const handleConfirmStatusChange = () => {
    try {
      updateGoal({ status: selectedStatus })
      onStatusUpdate?.()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to update goal status:', error)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:w-[192px] w-full rounded-lg">
      <div className="flex flex-col items-end gap-1">
        <Label className="text-xs">Goal Status</Label>
        <div className="flex items-center justify-start gap-2">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[118px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {GOAL_STATUSES.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSaveClick} disabled={selectedStatus === goal.status}>
            Save
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Goal Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of this goal to{' '}
              {GOAL_STATUSES.find(s => s.value === selectedStatus)?.label}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmStatusChange}>Confirm Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
