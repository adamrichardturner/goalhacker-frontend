/* eslint-disable @next/next/no-img-element */
import { useState, memo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useImageGallery } from '@/hooks/useImageGallery'
import { Image } from '@/types/image'
import { cn } from '@/lib/utils'
import { Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategorySelector } from './CategorySelector'

interface ImageGalleryProps {
  onImageSelect: (image: Image) => void
  selectedImage?: Image
}

export const ImageGallery = memo(function ImageGallery({
  onImageSelect,
  selectedImage,
}: ImageGalleryProps) {
  const {
    defaultImages,
    categories,
    isLoadingDefaultImages,
    isLoadingNextPage,
    uploadImage,
    isUploading,
    page,
    selectedCategory,
    changePage,
    changeCategory,
    totalPages,
  } = useImageGallery()

  const [uploadPreview, setUploadPreview] = useState<string>('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const response = await uploadImage(file)
      onImageSelect({ id: response.id, url: response.url })
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  return (
    <Card className='w-full'>
      <CardContent className='p-6'>
        <Tabs defaultValue='upload' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 bg-muted-foreground/10'>
            <TabsTrigger value='upload'>Upload Image</TabsTrigger>
            <TabsTrigger value='default'>Default Images</TabsTrigger>
          </TabsList>

          <TabsContent value='upload' className='mt-4'>
            <div className='flex flex-col items-center space-y-4'>
              <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'>
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <Upload className='w-8 h-8 mb-2 text-gray-500' />
                  <p className='text-sm text-gray-500'>
                    {isUploading ? (
                      <span className='flex items-center'>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Uploading...
                      </span>
                    ) : (
                      'Click to upload or drag and drop'
                    )}
                  </p>
                </div>
                <input
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
              {uploadPreview && (
                <div className='mt-4'>
                  <img
                    src={uploadPreview}
                    alt='Upload preview'
                    className='max-w-xs rounded-lg shadow-md'
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='default' className='mt-4'>
            {isLoadingDefaultImages ? (
              <div className='flex items-center justify-center h-32'>
                <Loader2 className='w-6 h-6 animate-spin' />
              </div>
            ) : (
              <div className='space-y-4'>
                {categories && (
                  <CategorySelector
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={changeCategory}
                  />
                )}

                <ScrollArea className='h-[400px] relative'>
                  <div className='grid grid-cols-3 gap-4 p-1'>
                    {defaultImages?.map((image: Image) => (
                      <div
                        key={image.id}
                        className={cn(
                          'relative cursor-pointer rounded-lg overflow-hidden border-2',
                          'hover:border-primary transition-colors',
                          selectedImage?.id === image.id
                            ? 'border-primary'
                            : 'border-transparent'
                        )}
                        onClick={() => onImageSelect(image)}
                      >
                        <img
                          src={image.url}
                          alt={`${image.category} image`}
                          className='w-full h-32 object-cover'
                        />
                      </div>
                    ))}
                  </div>
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
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
})
