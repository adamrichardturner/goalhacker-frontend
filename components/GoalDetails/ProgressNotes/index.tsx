import { Goal } from '@/types/goal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { formatDate } from '@/utils/dateFormat'
import { formatTime } from '@/utils/formatTime'
import ProgressNoteEditor from '../ProgressNoteEditor'
import { Trash2, Pen, ScrollText } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import { AnimatedAccordion } from '@/components/ui/animated-accordion'
import { truncateText } from '@/lib/utils'

interface ProgressNotesProps {
  goal: Goal
  onEditNote: (noteId: string, note: { title: string; content: string }) => void
  onDeleteNote?: (noteId: string) => void
  onAddNote: (note: { title: string; content: string }) => void
}

export default function ProgressNotes({
  goal,
  onEditNote,
  onDeleteNote,
  onAddNote,
}: ProgressNotesProps) {
  const { settings } = useSettings()
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [deletingNote, setDeletingNote] = useState<string | null>(null)
  const [showProgressNote, setShowProgressNote] = useState(false)
  const [openItem, setOpenItem] = useState<string | null>(null)

  const accordionItems =
    goal.progress_notes?.map((note) => ({
      id: note.note_id || '',
      title: (
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2'>
          <h3 className='text-base font-semibold'>{note.title}</h3>
          <span className='text-xs text-primary pr-2'>
            {note.created_at &&
              `${formatDate(note.created_at, settings?.date_format)} at ${formatTime(note.created_at)}`}
          </span>
        </div>
      ),
      content: (
        <>
          <div
            className='prose prose-sm max-w-none'
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
          <div className='flex justify-end gap-2 mt-4'>
            {onDeleteNote && (
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation()
                  setDeletingNote(note.note_id || '')
                }}
                className='hover:bg-destructive/10 bg-destructive/10 hover:text-destructive text-destructive/80'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
            <Button
              variant='ghost'
              size='icon'
              onClick={(e) => {
                e.stopPropagation()
                setEditingNote(note.note_id || '')
              }}
              className='bg-input hover:bg-input/95'
            >
              <Pen className='h-4 w-4 text-primary' />
            </Button>
          </div>
        </>
      ),
    })) || []

  return (
    <Card className='rounded-2xl'>
      <CardHeader className='flex flex-row justify-between items-center'>
        <CardTitle className='text-xl sm:text-2xl font-semibold'>
          Notes
        </CardTitle>

        <Dialog open={showProgressNote} onOpenChange={setShowProgressNote}>
          <DialogTrigger asChild>
            <Button
              size='sm'
              className='bg-primaryActive hover:bg-primaryActive/90'
            >
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Add Progress Note</DialogTitle>
            </DialogHeader>
            <ProgressNoteEditor
              onSubmit={onAddNote}
              onCancel={() => setShowProgressNote(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {accordionItems.length > 0 ? (
          <AnimatedAccordion
            items={accordionItems}
            openItem={openItem}
            onOpenChange={setOpenItem}
            className='text-primary'
          />
        ) : (
          <div className='flex flex-col items-center justify-center py-8 text-center space-y-2'>
            <ScrollText className='h-12 w-12 text-muted-foreground' />
            <p className='text-muted-foreground'>No progress notes yet.</p>
            <p className='text-sm text-muted-foreground'>
              Click &quot;Add Note&quot; to track your progress and milestones.
            </p>
          </div>
        )}

        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent className='sm:max-w-[600px] bg-white'>
            <DialogHeader>
              <DialogTitle>Edit Progress Note</DialogTitle>
            </DialogHeader>
            {editingNote && (
              <ProgressNoteEditor
                initialTitle={
                  goal.progress_notes?.find((n) => n.note_id === editingNote)
                    ?.title || ''
                }
                initialContent={
                  goal.progress_notes?.find((n) => n.note_id === editingNote)
                    ?.content || ''
                }
                onSubmit={(note) => {
                  onEditNote(editingNote, note)
                  setEditingNote(null)
                }}
                onCancel={() => setEditingNote(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!deletingNote}
          onOpenChange={() => setDeletingNote(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Progress Note</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this progress note? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingNote(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deletingNote && onDeleteNote) {
                    onDeleteNote(deletingNote)
                    setDeletingNote(null)
                  }
                }}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
