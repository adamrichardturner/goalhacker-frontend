'use client'

import { Goal } from '@/types/goal'
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'
import GoalDetailsInfo from '../GoalDetailsInfo'
import ProgressGoals from '../ProgressGoals'
import ProgressNotes from '../ProgressNotes'

interface GoalDetailsProps {
  goal: Goal
}

export default function GoalDetails({ goal }: GoalDetailsProps) {
  const { updateProgressNote, addProgressNote, deleteProgressNote } = useGoal(
    goal.goal_id
  )

  const handleProgressNoteEdit = (
    noteId: string,
    note: { title: string; content: string }
  ) => {
    try {
      updateProgressNote({ noteId, title: note.title, content: note.content })
      toast.success('Progress note updated')
    } catch (error) {
      toast.error('Failed to update progress note')
      console.error('Error updating progress note:', error)
    }
  }

  const handleProgressNoteSave = (note: { title: string; content: string }) => {
    try {
      addProgressNote(note)
      toast.success('Progress note saved')
    } catch (error) {
      toast.error('Failed to save progress note')
      console.error('Error saving progress note:', error)
    }
  }

  const handleProgressNoteDelete = (noteId: string) => {
    try {
      deleteProgressNote(noteId)
      toast.success('Progress note deleted')
    } catch (error) {
      toast.error('Failed to delete progress note')
      console.error('Error deleting progress note:', error)
    }
  }

  return (
    <div className='space-y-6'>
      <GoalDetailsInfo goal={goal} />
      <ProgressGoals goal={goal} />
      <ProgressNotes
        goal={goal}
        onEditNote={handleProgressNoteEdit}
        onDeleteNote={handleProgressNoteDelete}
        onAddNote={handleProgressNoteSave}
      />
    </div>
  )
}
