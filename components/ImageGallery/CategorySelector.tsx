import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface CategorySelectorProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='category'>Category</Label>
      <Select
        value={selectedCategory || 'all'}
        onValueChange={(value) =>
          onSelectCategory(value === 'all' ? '' : value)
        }
      >
        <SelectTrigger className='w-[180px]' id='category'>
          <SelectValue placeholder='Select category'>
            {selectedCategory
              ? selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)
              : 'All Categories'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
