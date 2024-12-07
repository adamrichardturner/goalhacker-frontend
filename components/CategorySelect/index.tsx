'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategory } from '@/hooks/useCategory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { categoryService } from '@/services/categoryService'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface CategorySelectProps {
  value?: string
  onValueChange: (value: string) => void
}

export function CategorySelect({ value, onValueChange }: CategorySelectProps) {
  const { categories, isLoading } = useCategory()
  const [isOpen, setIsOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const queryClient = useQueryClient()

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name')
      return
    }

    setIsCreating(true)
    try {
      const category = await categoryService.createCategory({
        name: newCategory.trim(),
      })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onValueChange(category.category_id)
      setIsOpen(false)
      setNewCategory('')
      toast.success('Category created successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to create category')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className='flex gap-2 items-start'>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue
            placeholder={
              isLoading ? 'Loading categories...' : 'Select a category'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value='loading' disabled>
              Loading...
            </SelectItem>
          ) : (
            categories.map((category) => (
              <SelectItem
                key={category.category_id}
                value={category.category_id}
              >
                {category.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' size='icon' className='h-12 w-12'>
            <PlusCircle className='h-5 w-5' />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your goals.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                placeholder='Enter category name'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
