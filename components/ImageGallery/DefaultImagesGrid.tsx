import { memo } from 'react'
import { Image } from '@/types/image'
import { useImageGallery } from '@/hooks/useImageGallery'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CategorySelector } from './CategorySelector'
import { Skeleton } from '@/components/ui/skeleton'

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

  const gridItems =
    isLoadingDefaultImages || isLoadingNextPage
      ? Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className='relative rounded-lg overflow-hidden border-2 border-transparent p-[0.5px] aspect-[16/9]'
          >
            <Skeleton className='w-full h-full rounded-lg' />
          </div>
        ))
      : defaultImages?.map((image: Image) => (
          <div
            key={image.id}
            className={cn(
              'relative cursor-pointer rounded-lg overflow-hidden border-2 border-electricPurple p-[0.5px] aspect-[16/9]',
              'hover:border-electricPurple transition-all duration-200',
              selectedImage?.id === image.id
                ? 'border-electricPurple'
                : 'border-transparent'
            )}
            onClick={() => onImageSelect(image)}
          >
            <img
              src={image.url}
              alt={`${image.category} image`}
              className='w-full h-full object-cover rounded-lg sm:transition-transform duration-200 sm:hover:scale-105'
            />
          </div>
        ))

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
        <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 p-1 transition-all duration-300 ease-in-out'>
          {gridItems}
        </div>
      </ScrollArea>

      {totalPages > 1 && (
        <div className='flex justify-center gap-2 mt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => changePage(page - 1)}
            disabled={page === 1 || isLoadingNextPage}
          >
            Prev
          </Button>
          <span className='flex text-xs sm:text-sm items-center px-3'>
            {page}/{totalPages}
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
