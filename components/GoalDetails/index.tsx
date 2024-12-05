'use client'

import { Goal } from '@/types/goal'
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'
import GoalBanner from './GoalBanner'
import ProgressGoals from './ProgressGoals'
import ProgressNotes from './ProgressNotes'
import { Summary } from './Summary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { GoalStatusEditor } from './GoalStatusEditor'

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
      <GoalBanner goal={goal} />
      <div className='space-y-0'>
        <Tabs defaultValue='summary' className='w-full'>
          <div className='flex justify-between items-start mb-4'>
            <TabsList className='grid sm:w-[400px] w-full grid-cols-3 bg-card'>
              <TabsTrigger value='summary'>Summary</TabsTrigger>
              <TabsTrigger value='progress'>Progress</TabsTrigger>
              <TabsTrigger value='notes'>Notes</TabsTrigger>
            </TabsList>
            <GoalStatusEditor goal={goal} />
          </div>

          <TabsContent value='summary'>
            <Summary goal={goal} />
          </TabsContent>
          <TabsContent value='progress'>
            <ProgressGoals goal={goal} />
          </TabsContent>
          <TabsContent value='notes'>
            <ProgressNotes
              goal={goal}
              onEditNote={handleProgressNoteEdit}
              onDeleteNote={handleProgressNoteDelete}
              onAddNote={handleProgressNoteSave}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
