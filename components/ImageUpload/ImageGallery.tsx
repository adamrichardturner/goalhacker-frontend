/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { DefaultImage } from '@/types/goal'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '../ui/button'
import { ImagePlus, Upload } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import useCategorizedImages, {
  ImageCategory,
} from '@/hooks/useCategorizedImages'
import { useState } from 'react'

interface ImageGalleryProps {
  selectedImage?: string | null
  onImageSelect: (file: File) => void
  onDefaultImageSelect: (image: DefaultImage) => void
}

export function ImageGallery({
  selectedImage,
  onImageSelect,
  onDefaultImageSelect,
}: ImageGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>()
  const { images, isLoading, categories } =
    useCategorizedImages(selectedCategory)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelect(file)
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
                className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50 border-border'
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <Upload className='h-8 w-8 mb-4 text-muted-foreground' />
                  <p className='mb-2 text-sm text-muted-foreground'>
                    <span className='font-semibold'>Click to upload</span> or
                    drag and drop
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id='image-upload'
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handleFileChange}
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
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {[...Array(8)].map((_, i) => (
                    <div key={`skeleton-${i}`} className='space-y-2'>
                      <Skeleton className='h-32 w-full' />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <ScrollArea className='w-full whitespace-nowrap rounded-md border'>
                  <div className='flex w-max space-x-4 p-4'>
                    <Button
                      variant={!selectedCategory ? 'secondary' : 'outline'}
                      className='shrink-0'
                      onClick={() => setSelectedCategory(undefined)}
                    >
                      All
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={`category-${category}`}
                        variant={
                          selectedCategory === category
                            ? 'secondary'
                            : 'outline'
                        }
                        className='shrink-0'
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation='horizontal' />
                </ScrollArea>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
                  {images.map((image) => (
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
                          alt={`${image.category} goal image`}
                          className='object-cover w-full h-full transition-all hover:scale-105'
                        />
                      </AspectRatio>
                      <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2'>
                        <p className='text-white text-sm font-medium text-center'>
                          Select Image
                        </p>
                        <p className='text-white/80 text-xs text-center'>
                          {image.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <CardFooter className='text-sm text-muted-foreground mt-4'>
                  {images.length} images available
                </CardFooter>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
