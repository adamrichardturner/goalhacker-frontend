import { useState, memo, useCallback, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Image } from '@/types/image'
import { DefaultImagesGrid } from './DefaultImagesGrid'
import { Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useImages } from '@/hooks/useImages'

interface ImageGalleryProps {
  onImageSelect: (image: Image) => void
  selectedImage?: Image
  existingImage?: string
  onImageUpload: (file: File) => Promise<void>
  isUploading: boolean
}

export const ImageGallery = memo(function ImageGallery({
  onImageSelect,
  selectedImage,
  existingImage,
  onImageUpload,
  isUploading,
}: ImageGalleryProps) {
  const { getImagePreviewUrl } = useImages()
  const [uploadPreview, setUploadPreview] = useState<string>('')

  // Initialize preview when the component mounts or existingImage changes
  useEffect(() => {
    if (existingImage) {
      setUploadPreview(getImagePreviewUrl(existingImage))
    } else {
      setUploadPreview('')
    }
  }, [existingImage, getImagePreviewUrl])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      try {
        // Upload the image to S3
        await onImageUpload(file)
      } catch (error) {
        console.error('Failed to upload image:', error)
        setUploadPreview('')
      }
    },
    [onImageUpload]
  )

  return (
    <Card className='w-full p-0'>
      <CardContent className='p-2 sm:p-4'>
        <Tabs defaultValue='upload' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 gap-2 bg-muted-foreground/10'>
            <TabsTrigger value='upload' className='text-xs sm:text-sm py-2'>
              Upload
            </TabsTrigger>
            <TabsTrigger value='default' className='text-xs sm:text-sm py-2'>
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value='upload' className='mt-4'>
            <div className='flex flex-col items-center space-y-4'>
              <label
                className={cn(
                  'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer',
                  'hover:bg-gray-50 dark:hover:bg-gray-800 relative overflow-hidden',
                  uploadPreview ? 'border-primaryActive' : 'border-gray-300'
                )}
              >
                {uploadPreview ? (
                  <>
                    <img
                      src={uploadPreview}
                      alt='Upload preview'
                      className='absolute inset-0 w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-black/50 flex flex-col items-center justify-center'>
                      <Upload className='w-8 h-8 mb-2 text-white' />
                      <p className='text-sm text-white font-medium'>
                        {isUploading ? (
                          <span className='flex items-center'>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            Uploading...
                          </span>
                        ) : (
                          'Click to upload another'
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <Upload className='w-8 h-8 mb-2 text-gray-500' />
                    <p className='sm:text-sm text-xs text-center sm:text-left p-4 text-gray-500'>
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
                )}
                <input
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </TabsContent>

          <TabsContent value='default' className='mt-4 sm:h-[420px]'>
            <DefaultImagesGrid
              onImageSelect={onImageSelect}
              selectedImage={selectedImage}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
})
