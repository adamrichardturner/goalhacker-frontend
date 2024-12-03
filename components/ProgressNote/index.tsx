'use client'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

interface ProgressNoteEditorProps {
  onSubmit: (note: { title: string; content: string }) => void
  onCancel: () => void
  initialTitle?: string
  initialContent?: string
}

export default function ProgressNoteEditor({
  onSubmit,
  onCancel,
  initialTitle = '',
  initialContent = '',
}: ProgressNoteEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
  })

  const handleSubmit = () => {
    if (!editor) return
    onSubmit({
      title,
      content: editor.getHTML(),
    })
    editor.commands.clearContent()
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter a title for your progress note'
        />
      </div>
      <div className='space-y-2'>
        <Label>Content</Label>
        <div className='border rounded-md p-4'>
          <EditorContent
            editor={editor}
            className='prose prose-sm max-w-none'
          />
        </div>
      </div>
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save Progress Note</Button>
      </div>
    </div>
  )
}
