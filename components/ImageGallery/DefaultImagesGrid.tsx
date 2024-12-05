import { memo } from 'react'
import { Image } from '@/types/image'
import { useImageGallery } from '@/hooks/useImageGallery'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategorySelector } from './CategorySelector'

interface DefaultImagesGridProps {
  onImageSelect: (image: Image) => void
  selectedImage?: Image
}

export const DefaultImagesGrid = memo(function DefaultImagesGrid({
  onImageSelect,
  selectedImage,
}: DefaultImagesGridProps) {
  const {
    defaultImages,
    categories,
    isLoadingDefaultImages,
    isLoadingNextPage,
    page,
    selectedCategory,
    changePage,
    changeCategory,
    totalPages,
  } = useImageGallery()

  return (
    <div className='space-y-4'>
      {categories && (
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={changeCategory}
        />
      )}

      <ScrollArea className='relative'>
        <div className='grid grid-cols-3 gap-4 p-1'>
          {defaultImages?.map((image: Image) => (
            <div
              key={image.id}
              className={cn(
                'relative cursor-pointer rounded-lg overflow-hidden border-2 border-electricPurple p-[0.5px]',
                'hover:border-electricPurple transition-colors',
                selectedImage?.id === image.id
                  ? 'border-electricPurple'
                  : 'border-transparent'
              )}
              onClick={() => onImageSelect(image)}
            >
              <img
                src={image.url}
                alt={`${image.category} image`}
                className='w-full h-32 object-cover rounded-lg'
              />
            </div>
          ))}
        </div>
        {isLoadingDefaultImages && (
          <div className='flex items-center justify-center h-32'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        )}
        {isLoadingNextPage && (
          <div className='absolute inset-0 bg-black/10 flex items-center justify-center'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        )}
      </ScrollArea>

      {totalPages > 1 && (
        <div className='flex justify-center gap-2 mt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => changePage(page - 1)}
            disabled={page === 1 || isLoadingNextPage}
          >
            Previous
          </Button>
          <span className='flex items-center px-3 text-sm'>
            Page {page} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages || isLoadingNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
})
