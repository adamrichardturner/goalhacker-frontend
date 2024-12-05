import { Goal } from '@/types/goal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
import ProgressNoteEditor from '../ProgressNote'
import { Trash2, Pen, ScrollText } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

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

  return (
    <Card>
      <CardHeader className='flex flex-row space-y-0 justify-between items-start'>
        <CardTitle className='text-2xl font-semibold'>Progress Notes</CardTitle>

        <Dialog open={showProgressNote} onOpenChange={setShowProgressNote}>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2 mt-0 pt-0'
            >
              <ScrollText className='h-4 w-4' />
              Add Progress Note
            </Button>
          </DialogTrigger>
          <DialogContent>
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
        {goal.progress_notes && goal.progress_notes.length > 0 && (
          <Accordion type='single' collapsible className='space-y-4'>
            {goal.progress_notes.map((note, index) => (
              <AccordionItem
                key={note.note_id || index}
                value={note.note_id || index.toString()}
                className='border rounded-lg'
              >
                <AccordionTrigger className='hover:no-underline px-4 w-full'>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-4'>
                      <h3 className='font-semibold text-lg'>{note.title}</h3>
                      <span className='text-xs text-muted-foreground'>
                        {note.created_at &&
                          `${formatDate(note.created_at, settings?.date_format)} at ${formatTime(note.created_at)}`}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='px-4'>
                  <div
                    className='prose prose-sm max-w-none'
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                  <div className='flex justify-end gap-2 mt-4'>
                    {onDeleteNote && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setDeletingNote(note.note_id || '')}
                        className='text-destructive hover:text-destructive'
                      >
                        <Trash2 className='h-4 w-4 mr-2' />
                        Delete
                      </Button>
                    )}
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setEditingNote(note.note_id || '')}
                    >
                      <Pen className='h-4 w-4 mr-2' />
                      Edit
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent>
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
