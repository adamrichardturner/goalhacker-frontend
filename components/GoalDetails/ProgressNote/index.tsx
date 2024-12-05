'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'

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
        <div className='border rounded-md'>
          <div className='border-b p-2 flex gap-1'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive('bold') ? 'bg-muted' : ''}
            >
              <Bold className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive('italic') ? 'bg-muted' : ''}
            >
              <Italic className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={editor?.isActive('strike') ? 'bg-muted' : ''}
            >
              <Strikethrough className='h-4 w-4' />
            </Button>
            <span className='w-px h-4 bg-border my-auto mx-1' />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive('bulletList') ? 'bg-muted' : ''}
            >
              <List className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={editor?.isActive('orderedList') ? 'bg-muted' : ''}
            >
              <ListOrdered className='h-4 w-4' />
            </Button>
          </div>
          <div className='p-4'>
            <EditorContent
              editor={editor}
              className='prose prose-sm max-w-none min-h-[200px]'
            />
          </div>
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
