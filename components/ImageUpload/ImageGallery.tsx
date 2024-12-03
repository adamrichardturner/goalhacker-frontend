/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { DefaultImage } from '@/types/goal'
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
import { ImagePlus, Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import useCategorizedImages from '@/hooks/useCategorizedImages'
import { useState } from 'react'
import { CategorizedImage } from '@/types/image'
import useImageUpload from '@/hooks/useImageUpload'

interface ImageGalleryProps {
  selectedImage?: string | null
  onImageSelect: (file: File) => void
  onDefaultImageSelect: (image: DefaultImage) => void
  goalId: string
}

export function ImageGallery({
  selectedImage,
  onImageSelect,
  onDefaultImageSelect,
  goalId,
}: ImageGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [currentPage, setCurrentPage] = useState(1)
  const [uploadValue, setUploadValue] = useState<string>('')
  const { images, isLoading, categories, totalPages, total } =
    useCategorizedImages(selectedCategory, currentPage)

  console.log('GOAL ID: ', goalId)

  const { uploadImage, isLoading: isUploading } = useImageUpload(goalId)

  console.log(images)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      uploadImage(file, {
        onSuccess: (data) => {
          if (typeof data.image_url === 'string') {
            onImageSelect(data.image_url)
            setUploadValue('')
          } else {
            console.error('Invalid response format: image_url is not a string')
          }
        },
        onError: (error) => {
          console.error('Failed to upload image:', error)
          // You might want to show an error toast here
        },
      })
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
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  {isUploading ? (
                    <div className='flex flex-col items-center'>
                      <span className='loading loading-spinner'></span>
                      <p className='text-sm text-muted-foreground mt-2'>
                        Uploading...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className='h-8 w-8 mb-4 text-muted-foreground' />
                      <p className='mb-2 text-sm text-muted-foreground'>
                        <span className='font-semibold'>Click to upload</span>{' '}
                        or drag and drop
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </>
                  )}
                </div>
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
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {images.map((image: CategorizedImage) => (
                    <div
                      key={`image-${image.key}`}
                      className={cn(
                        'group cursor-pointer relative overflow-hidden rounded-lg',
                        selectedImage === image.url &&
                          'ring-2 ring-primary ring-offset-2'
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
                          className='object-cover w-full h-full transition-all hover:scale-105'
                        />
                      </AspectRatio>
                      <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2'>
                        <p className='text-white text-sm font-medium text-center capitalize'>
                          {image.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {!selectedCategory && (
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
    </Tabs>
  )
}
