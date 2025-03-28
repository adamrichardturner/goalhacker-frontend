'use client'

import { Goal } from '@/types/goal'
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'
import GoalBanner from './GoalBanner'
import ProgressGoals from './ProgressGoals'
import ProgressNotes from './ProgressNotes'
import { Summary } from './Summary'
import { AnimatedTabs } from '../ui/animated-tabs'
import { BackToInsights } from '../ui/back-to-insights'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'

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
  const [activeTab, setActiveTab] = useState('summary')
  const {
    updateProgressNote,
    addProgressNote,
    deleteProgressNote,
    progressNotes,
  } = useGoal(goal.goal_id)

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
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='bg-background'
    >
      <div className='max-w-7xl mx-auto'>
        <div className='space-y-4'>
          <GoalBanner goal={goal} />

          <div className='top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='max-w-7xl mx-auto'>
              <AnimatedTabs
                items={[
                  { id: 'summary', label: 'Summary' },
                  { id: 'progress', label: 'Progress' },
                  { id: 'notes', label: 'Notes' },
                ]}
                selected={activeTab}
                onChange={setActiveTab}
                layoutId='activeTabUnderline'
                className='h-12 inline-flex rounded-2xl bg-white px-6'
                variant='underline'
              />
            </div>
          </div>

          <div className='sm:pt-0'>
            {activeTab === 'summary' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Summary goal={goal} />
              </motion.div>
            )}

            {activeTab === 'progress' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProgressGoals goal={goal} />
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProgressNotes
                  progressNotes={progressNotes}
                  onEditNote={handleProgressNoteEdit}
                  onDeleteNote={handleProgressNoteDelete}
                  onAddNote={handleProgressNoteSave}
                />
              </motion.div>
            )}
          </div>
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
