'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import { useState, useRef } from 'react'
import { Bold, Italic, List, ListOrdered, Strikethrough, Underline } from 'lucide-react'
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
    <div className="space-y-6 bg-card rounded-xl p-6 border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title
        </Label>
        <div
          className={cn('rounded-lg overflow-hidden', errors.title && 'ring-2 ring-destructive')}
        >
          <Input
            id="title"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, title: false }))
              }
            }}
            placeholder="Enter a title for your progress note"
            className={cn(
              'border-0 bg-input focus-visible:ring-1 focus-visible:ring-electricPurple placeholder:text-muted-foreground/60',
              errors.title && 'border-destructive'
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Content</Label>
        <div
          className={cn(
            'rounded-lg overflow-hidden bg-muted/50',
            errors.content && 'ring-2 ring-destructive'
          )}
        >
          <div className="border-b border-border/50 p-2 flex gap-1 bg-background/50 backdrop-blur-sm">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={cn(
                'h-8 px-2 hover:bg-muted',
                editor?.isActive('bold') && 'bg-muted text-primary'
              )}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={cn(
                'h-8 px-2 hover:bg-muted',
                editor?.isActive('italic') && 'bg-muted text-primary'
              )}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={cn(
                'h-8 px-2 hover:bg-muted',
                editor?.isActive('underline') && 'bg-muted text-primary'
              )}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={cn(
                'h-8 px-2 hover:bg-muted',
                editor?.isActive('strike') && 'bg-muted text-primary'
              )}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <span className="w-px h-4 bg-border/50 my-auto mx-1" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={cn(
                'h-8 px-2 hover:bg-muted',
                editor?.isActive('bulletList') && 'bg-muted text-primary'
              )}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={cn(
                'h-8 px-2 hover:bg-muted',
                editor?.isActive('orderedList') && 'bg-muted text-primary'
              )}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
          <div
            ref={editorContainerRef}
            className="p-4 min-h-[200px] cursor-text bg-transparent"
            onClick={handleContainerClick}
          >
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1"
              onFocus={() => {
                if (editor?.getHTML().trim()) {
                  setErrors(prev => ({ ...prev, content: false }))
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} className="hover:bg-muted/50">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-electricPurple hover:bg-electricPurple/90">
          Save Progress Note
        </Button>
      </div>
    </div>
  )
}
