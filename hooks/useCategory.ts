import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/services/categoryService'
import { Category } from '@/types/category'

export function useCategory() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  return {
    categories,
    isLoading,
    error,
  }
}
