/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import type { DefaultImage } from '@/types/goal'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '../ui/button'
import {
  ImagePlus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import useCategorizedImages from '@/hooks/useCategorizedImages'
import { useState } from 'react'
import { API_URL } from '@/config'

interface ImageGalleryProps {
  selectedImage: string | null
  onImageSelect: (file: File) => void
  onDefaultImageSelect: (image: DefaultImage) => void
  onRemoveImage: () => void
  isUploading: boolean
}

export function ImageGallery({
  selectedImage,
  onImageSelect,
  onDefaultImageSelect,
  onRemoveImage,
  isUploading,
}: ImageGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [currentPage, setCurrentPage] = useState(1)
  const [uploadValue, setUploadValue] = useState<string>('')
  const { images, isLoading, categories, totalPages, total } =
    useCategorizedImages(selectedCategory, currentPage)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      onImageSelect(file)
      setUploadValue('')
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  console.log('SELECTED IMAGE   ', selectedImage)

  return (
    <Tabs defaultValue='upload' className='w-full'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='upload' className='flex gap-2'>
          <Upload className='h-4 w-4' />
          Upload
        </TabsTrigger>
        <TabsTrigger value='gallery' className='flex gap-2'>
          <ImagePlus className='h-4 w-4' />
          Gallery
        </TabsTrigger>
      </TabsList>

      {selectedImage && (
        <div className='mt-4 flex justify-end'>
          <Button
            variant='destructive'
            size='sm'
            onClick={onRemoveImage}
            className='flex items-center gap-2'
          >
            <Trash2 className='h-4 w-4' />
            Remove Image
          </Button>
        </div>
      )}

      <TabsContent value='upload' className='mt-4'>
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Upload a custom image for your goal
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-center w-full'>
              <label
                htmlFor='image-upload'
                className={cn(
                  'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50 border-border',
                  isUploading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {selectedImage ? (
                  <>
                    <div className='relative w-full h-full'>
                      <img
                        src={selectedImage}
                        alt='Selected image'
                        className='absolute inset-0 w-full h-full object-cover rounded-lg'
                      />
                      <div className='absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-lg'>
                        <Upload className='h-8 w-8 mb-4 text-white' />
                        <p className='mb-2 text-sm text-white'>
                          <span className='font-semibold'>
                            Click to replace
                          </span>
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    {isUploading ? (
                      <Skeleton className='h-8 w-8 mb-4 rounded-full' />
                    ) : (
                      <Upload className='h-8 w-8 mb-4' />
                    )}
                    <p className='mb-2 text-sm'>
                      <span className='font-semibold'>Click to upload</span> or
                      drag and drop
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      PNG, JPG or GIF (max. 2MB)
                    </p>
                  </div>
                )}
                <input
                  id='image-upload'
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handleFileChange}
                  value={uploadValue}
                  disabled={isUploading}
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value='gallery' className='mt-4'>
        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
            <CardDescription>
              Choose from our collection of goal-specific images
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-12 w-full' />
                <div className='grid md:grid-cols-2 gap-4'>
                  {[...Array(12)].map((_, i) => (
                    <div key={`skeleton-${i}`} className='space-y-2'>
                      <Skeleton className='h-32 w-full' />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <ScrollArea className='w-full whitespace-nowrap rounded-md border mb-6'>
                  <div className='flex w-max space-x-4 p-4'>
                    <Button
                      variant={!selectedCategory ? 'secondary' : 'outline'}
                      className='shrink-0 capitalize'
                      onClick={() => {
                        setSelectedCategory(undefined)
                        setCurrentPage(1)
                      }}
                    >
                      All
                    </Button>
                    {categories.map((category: string) => (
                      <Button
                        key={`category-${category}`}
                        variant={
                          selectedCategory === category
                            ? 'secondary'
                            : 'outline'
                        }
                        className='shrink-0 capitalize'
                        onClick={() => {
                          setSelectedCategory(category)
                          setCurrentPage(1)
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation='horizontal' />
                </ScrollArea>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  {images.map((image: DefaultImage) => {
                    // No need to add '/api' to image.url
                    const isSelected = selectedImage?.endsWith(image.url)

                    console.log('IS SELECTED   ', isSelected)

                    return (
                      <div
                        key={`image-${image.key}`}
                        className={cn(
                          'group cursor-pointer relative overflow-hidden rounded-lg',
                          isSelected && 'border-[1.5px] border-[#9D4EDD]'
                        )}
                        onClick={() =>
                          onDefaultImageSelect({
                            key: image.key,
                            url: image.url,
                          })
                        }
                      >
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={image.url}
                            alt={`${image.category} image`}
                            className={cn(
                              'object-cover w-full h-full transition-all hover:scale-105',
                              isSelected &&
                                'border-[1.5px] border-electricPurple'
                            )}
                          />
                        </AspectRatio>
                        <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2'>
                          <p className='text-white text-sm font-medium text-center capitalize'>
                            {image.category}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {images?.length > 0 && (
                  <div className='flex items-center justify-between mt-6'>
                    <p className='text-sm text-muted-foreground'>
                      Showing {images.length} of {total} images
                    </p>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className='h-4 w-4' />
                      </Button>
                      <span className='text-sm'>
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value='default' className='mt-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className='aspect-square rounded-lg'
                    />
                  ))
                : images?.map((image: DefaultImage) => (
                    <div
                      key={image.url}
                      onClick={() => onDefaultImageSelect(image)}
                      className={cn(
                        'group cursor-pointer relative overflow-hidden rounded-lg',
                        (selectedImage === image.url ||
                          selectedImage === `/api${image.url}` ||
                          selectedImage === `${API_URL}/api${image.url}`) &&
                          'ring-2 ring-primary ring-offset-2'
                      )}
                    >
                      <img
                        src={`/api${image.url}`}
                        alt={image.category}
                        className='aspect-square object-cover w-full h-full'
                      />
                      <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                        <ImagePlus className='h-6 w-6 text-white' />
                      </div>
                    </div>
                  ))}
            </div>
            {images && images.length > 0 && (
              <div className='flex justify-between items-center mt-6'>
                <span className='text-sm text-muted-foreground'>
                  Page {currentPage} of {Math.ceil(images.length / 6)}
                </span>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className='h-4 w-4 mr-2' />
                    Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={
                      !images ||
                      currentPage >= Math.ceil(images.length / 6) ||
                      isLoading
                    }
                  >
                    Next
                    <ChevronRight className='h-4 w-4 ml-2' />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
