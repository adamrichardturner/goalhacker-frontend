import { useState, useCallback, useRef, useEffect } from 'react'
import { Goal } from '@/types/goal'
import { searchService } from '@/services/searchService'
import debounce from 'lodash/debounce'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const debouncedSearchRef = useRef(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setError(undefined)
        return
      }

      setIsLoading(true)
      setError(undefined)

      try {
        const { data, error } = await searchService.searchGoals(
          searchQuery.trim()
        )
        if (error) {
          setError(error)
          setResults([])
        } else {
          setResults(data)
        }
      } catch (error) {
        console.error('Search failed:', error)
        setError('Failed to search goals')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 750)
  ).current

  const search = useCallback(
    (searchQuery: string) => {
      debouncedSearchRef(searchQuery)
    },
    [debouncedSearchRef]
  )

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(undefined)
    debouncedSearchRef.cancel()
  }, [debouncedSearchRef])

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearchRef.cancel()
    }
  }, [debouncedSearchRef])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    search,
    clearSearch,
  }
}
