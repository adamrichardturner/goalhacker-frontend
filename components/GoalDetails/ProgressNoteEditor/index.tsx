'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import { useState, useRef, useEffect } from 'react'
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
  const [editorButtonState, setEditorButtonState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    bulletList: false,
    orderedList: false,
  })

  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
    },
    onSelectionUpdate: ({ editor }) => {
      setEditorButtonState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
      })
    },
  })

  useEffect(() => {
    if (editor) {
      setEditorButtonState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
      })
    }
  }, [editor])

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

  const handleButtonClick = (type: keyof typeof editorButtonState) => {
    if (!editor) return

    switch (type) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'underline':
        editor.chain().focus().toggleUnderline().run()
        break
      case 'strike':
        editor.chain().focus().toggleStrike().run()
        break
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run()
        break
    }

    setEditorButtonState((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  console.log(editorButtonState)

  return (
    <div className='space-y-6 bg-card rounded-2xl p-6 border shadow-sm'>
      <div className='space-y-2'>
        <Label htmlFor='title' className='text-sm font-medium'>
          Title
        </Label>
        <div
          className={cn(
            'rounded-lg',
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
            className={cn(
              'border-0 rounded-lg bg-input focus-visible:ring-primaryActive placeholder:text-muted-foreground/60',
              errors.title && 'border-destructive'
            )}
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label className='text-sm font-medium'>Content</Label>
        <div
          className={cn(
            'bg-input',
            errors.content && 'ring-1 ring-destructive'
          )}
        >
          <div className='border-b border-border/50 px-1 py-2 flex gap-2 bg-white backdrop-blur-sm'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => handleButtonClick('bold')}
              className={cn(
                'h-8 px-2 bg-input hover:bg-input/80 relative transition-all duration-200',
                editor?.isActive('bold')
                  ? 'ring-1 ring-primary ring-offset-1 text-primary bg-input/70 shadow-sm'
                  : 'ring-0'
              )}
            >
              <Bold className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => handleButtonClick('italic')}
              className={cn(
                'h-8 px-2 bg-input hover:bg-input/80 relative transition-all duration-200',
                editor?.isActive('italic')
                  ? 'ring-1 ring-primary ring-offset-1 text-primary bg-input/70 shadow-sm'
                  : 'ring-0'
              )}
            >
              <Italic className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => handleButtonClick('underline')}
              className={cn(
                'h-8 px-2 bg-input hover:bg-input/80 relative transition-all duration-200',
                editor?.isActive('underline')
                  ? 'ring-1 ring-primary ring-offset-1 text-primary bg-input/70 shadow-sm'
                  : 'ring-0'
              )}
            >
              <Underline className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => handleButtonClick('strike')}
              className={cn(
                'h-8 px-2 bg-input hover:bg-input/80 relative transition-all duration-200',
                editor?.isActive('strike')
                  ? 'ring-1 ring-primary ring-offset-1 text-primary bg-input/70 shadow-sm'
                  : 'ring-0'
              )}
            >
              <Strikethrough className='h-4 w-4' />
            </Button>
            <span className='w-px h-4 bg-border/50 my-auto mx-1' />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => handleButtonClick('bulletList')}
              className={cn(
                'h-8 px-2 bg-input hover:bg-input/80 relative transition-all duration-200',
                editor?.isActive('bulletList')
                  ? 'ring-1 ring-primary ring-offset-1 text-primary bg-input/70 shadow-sm'
                  : 'ring-0'
              )}
            >
              <List className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => handleButtonClick('orderedList')}
              className={cn(
                'h-8 px-2 bg-input hover:bg-input/80 relative transition-all duration-200',
                editor?.isActive('orderedList')
                  ? 'ring-1 ring-primary ring-offset-1 text-primary bg-input/70 shadow-sm'
                  : 'ring-0'
              )}
            >
              <ListOrdered className='h-4 w-4' />
            </Button>
          </div>
          <div
            ref={editorContainerRef}
            className='p-4 min-h-[120px] cursor-text mt-2.5 focus-visible:ring-primaryActive bg-input focus-within:ring-1 focus-within:ring-primaryActive rounded-lg'
            onClick={handleContainerClick}
          >
            <EditorContent
              editor={editor}
              className='prose prose-sm max-w-none mt-1 h-full s rounded-lg bg-input text-primary prose-p:leading-relaxed prose-p:my-1'
              onFocus={() => {
                if (editor?.getHTML().trim()) {
                  setErrors((prev) => ({ ...prev, content: false }))
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-end gap-2 pt-2'>
        <Button
          variant='outline'
          onClick={onCancel}
          className='hover:bg-input/90 bg-input'
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className='bg-primaryActive hover:bg-primaryActive/90'
        >
          Save Progress Note
        </Button>
      </div>
    </div>
  )
}
