'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategory } from '@/hooks/useCategory'

interface CategorySelectProps {
  value?: string
  onValueChange: (value: string) => void
}

export function CategorySelect({ value, onValueChange }: CategorySelectProps) {
  const { categories, isLoading } = useCategory()

  return (
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
            <SelectItem key={category.category_id} value={category.category_id}>
              {category.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
