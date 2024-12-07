'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
  const [errors, setErrors] = useState({
    title: false,
    content: false,
  })
  const editorContainerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
    },
  })

  const handleSubmit = () => {
    if (!editor) return

    const newErrors = {
      title: !title.trim(),
      content: editor.getHTML() === '<p></p>' || !editor.getHTML().trim(),
    }
    setErrors(newErrors)

    if (newErrors.title || newErrors.content) {
      if (newErrors.title) {
        toast.error('Please enter a title')
      } else if (newErrors.content) {
        toast.error('Please enter some content')
      }
      return
    }

    onSubmit({
      title: title.trim(),
      content: editor.getHTML(),
    })
    editor.commands.clearContent()
    setTitle('')
    setErrors({ title: false, content: false })
    onCancel()
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === editorContainerRef.current) {
      editor?.chain().focus().run()
    }
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Title</Label>
        <div
          className={cn(
            'rounded-md',
            errors.title && 'ring-1 ring-destructive'
          )}
        >
          <Input
            id='title'
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, title: false }))
              }
            }}
            placeholder='Enter a title for your progress note'
            className={cn('border', errors.title && 'border-destructive')}
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label>Content</Label>
        <div
          className={cn(
            'border rounded-md',
            errors.content && 'border-destructive ring-1 ring-destructive'
          )}
        >
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
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={editor?.isActive('underline') ? 'bg-muted' : ''}
            >
              <Underline className='h-4 w-4' />
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
          <div
            ref={editorContainerRef}
            className='p-4 min-h-[200px] cursor-text'
            onClick={handleContainerClick}
          >
            <EditorContent
              editor={editor}
              className='prose prose-sm max-w-none'
              onFocus={() => {
                if (editor?.getHTML().trim()) {
                  setErrors((prev) => ({ ...prev, content: false }))
                }
              }}
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
