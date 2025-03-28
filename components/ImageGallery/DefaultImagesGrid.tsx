import { memo } from 'react'
import { Image } from '@/types/image'
import { useImages } from '@/hooks/useImages'
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
    galleryImages,
    categories,
    isLoadingGallery,
    isFetchingGallery,
    page,
    selectedCategory,
    changePage,
    changeCategory,
    totalPages,
  } = useImages()

  const gridItems =
    isLoadingGallery || isFetchingGallery
      ? Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className='relative rounded-2xl overflow-hidden border-2 border-transparent p-[0.5px] sm:aspect-[16/9]'
          >
            <Skeleton className='w-full h-full rounded-2xl' />
          </div>
        ))
      : galleryImages?.map((image: Image) => (
          <div
            key={image.id}
            className={cn(
              'relative cursor-pointer rounded-2xl overflow-hidden border-2 p-[0.5px] sm:aspect-[16/9]',
              'hover:border-primaryActive',
              selectedImage?.id === image.id
                ? 'border-primaryActive'
                : 'border-transparent'
            )}
            onClick={() => onImageSelect(image)}
          >
            <img
              src={image.url}
              alt={`${image.category} image`}
              className='w-full h-full object-cover object-center rounded-2xl'
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
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 p-1 sm:transition-all sm:duration-300 sm:ease-in-out'>
          {gridItems}
        </div>
      </ScrollArea>

      {totalPages > 1 && (
        <div className='flex justify-center gap-2 mt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => changePage(page - 1)}
            disabled={page === 1 || isFetchingGallery}
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
            disabled={page === totalPages || isFetchingGallery}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
})
