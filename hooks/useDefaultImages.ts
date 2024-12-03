import { useQuery } from '@tanstack/react-query'
import { DefaultImage } from '@/types/goal'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function useDefaultImages() {
  const {
    data: images = [],
    isLoading,
    error,
  } = useQuery<DefaultImage[]>({
    queryKey: ['defaultImages'],
    queryFn: async () => {
      try {
        // First, get the list of categories (directories)
        const categoriesResponse = await fetch(
          `${API_URL}/api/images/default-goal-images`,
          {
            credentials: 'include',
          }
        )

        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories')
        }

        const categories = await categoriesResponse.text()
        const categoryDirs = categories
          .split('\n')
          .filter((dir) => dir && !dir.includes('.'))

        // Then, get images for each category
        const allImages: DefaultImage[] = []

        for (const category of categoryDirs) {
          const categoryResponse = await fetch(
            `${API_URL}/api/images/default-goal-images/${category}`,
            {
              credentials: 'include',
            }
          )

          if (categoryResponse.ok) {
            const files = await categoryResponse.text()
            const imageFiles = files
              .split('\n')
              .filter((file) => file && !file.endsWith('.json'))

            imageFiles.forEach((file) => {
              allImages.push({
                key: `/default-goal-images/${category}/${file}`,
                url: `${API_URL}/api/images/default-goal-images/${category}/${file}`,
                category,
                alt: `${category} image`,
              })
            })
          }
        }

        return allImages
      } catch (err) {
        console.error('Error fetching default images:', err)
        toast.error('Failed to load default images')
        throw err
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  })

  const categories = [
    ...new Set(images.map((image) => image.category || 'uncategorized')),
  ]

  const imagesByCategory = images.reduce(
    (acc, image) => {
      const category = image.category || 'uncategorized'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(image)
      return acc
    },
    {} as Record<string, DefaultImage[]>
  )

  return {
    images,
    categories,
    imagesByCategory,
    isLoading,
    error,
  }
}
