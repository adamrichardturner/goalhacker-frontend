import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

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
    <ScrollArea className='w-full whitespace-nowrap rounded-md border'>
      <div className='flex p-4 space-x-2'>
        <Button
          variant={selectedCategory === '' ? 'default' : 'outline'}
          onClick={() => onSelectCategory('')}
          className='flex-shrink-0'
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => onSelectCategory(category)}
            className='flex-shrink-0'
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
