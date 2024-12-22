'use client'

import { Goal } from '@/types/goal'
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'
import GoalBanner from './GoalBanner'
import ProgressGoals from './ProgressGoals'
import ProgressNotes from './ProgressNotes'
import { Summary } from './Summary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { BackToInsights } from '../ui/back-to-insights'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

interface GoalDetailsProps {
  goal: Goal
}

export const badgeBaseStyles =
  'px-2 py-1 font-[500] text-white rounded-full text-[10px] backdrop-blur'

export const targetBadgeStyles =
  'px-2 py-1 rounded-full pointer-events-none font-[500] text-[10px] bg-muted/40 text-white leading-[18px]'

export default function GoalDetails({ goal }: GoalDetailsProps) {
  const searchParams = useSearchParams()
  const fromInsights = searchParams.get('from') === 'insights'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen bg-background'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-8'>
          <GoalBanner goal={goal} />

          <Tabs defaultValue='summary' className='w-full'>
            <div className='sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border'>
              <div className='max-w-7xl mx-auto'>
                <TabsList className='h-16 w-full justify-start gap-8 bg-transparent border-b rounded-none relative'>
                  <TabsTrigger
                    value='summary'
                    className='relative h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary'
                  >
                    <span className='relative z-10'>Summary</span>
                    <motion.div
                      className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
                      initial={false}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </TabsTrigger>
                  <TabsTrigger
                    value='progress'
                    className='relative h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary'
                  >
                    <span className='relative z-10'>Progress</span>
                    <motion.div
                      className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
                      initial={false}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </TabsTrigger>
                  <TabsTrigger
                    value='notes'
                    className='relative h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary'
                  >
                    <span className='relative z-10'>Notes</span>
                    <motion.div
                      className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
                      initial={false}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className='mt-8'>
              <TabsContent
                value='summary'
                className='mt-0 border-none focus-visible:outline-none focus-visible:ring-0'
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Summary goal={goal} />
                </motion.div>
              </TabsContent>

              <TabsContent
                value='progress'
                className='mt-0 border-none focus-visible:outline-none focus-visible:ring-0'
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProgressGoals goal={goal} />
                </motion.div>
              </TabsContent>

              <TabsContent
                value='notes'
                className='mt-0 border-none focus-visible:outline-none focus-visible:ring-0'
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProgressNotes
                    goal={goal}
                    onEditNote={handleProgressNoteEdit}
                    onDeleteNote={handleProgressNoteDelete}
                    onAddNote={handleProgressNoteSave}
                  />
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {fromInsights && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='mt-8'
          >
            <BackToInsights />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
