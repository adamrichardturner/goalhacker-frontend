'use client'

import { useState } from 'react'
import {
  Search as SearchIcon,
  Loader2,
  SearchX,
  Search as SearchLucide,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/hooks/useSearch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { query, setQuery, results, isLoading, error, search, clearSearch } =
    useSearch()

  const handleGoalClick = (goalId: string) => {
    setIsOpen(false)
    clearSearch()
    router.push(`/goals/${goalId}`)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setQuery('')
          clearSearch()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9'>
          <SearchIcon className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Search Goals</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <Input
            placeholder='Search goals...'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              search(e.target.value)
            }}
            className='w-full'
            autoFocus
          />
        </div>
        <ErrorBoundary fallback={<div>Error</div>}>
          <ScrollArea className='min-h-[200px] -mx-4 px-4'>
            <AnimatePresence mode='wait'>
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='flex items-center justify-center py-4'
                >
                  <Loader2 className='h-4 w-4 animate-spin' />
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='text-sm text-destructive py-3'
                >
                  {error}
                </motion.div>
              ) : results.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='space-y-1'
                >
                  {results.map((goal) => (
                    <motion.button
                      key={goal.goal_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className='w-full text-left px-4 py-3 text-sm rounded-md transition-colors hover:bg-paper hover:shadow-sm'
                      onClick={() =>
                        goal.goal_id && handleGoalClick(goal.goal_id)
                      }
                    >
                      {goal.title}
                    </motion.button>
                  ))}
                </motion.div>
              ) : query.trim() ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground'
                >
                  <SearchX className='h-8 w-8' />
                  <p className='text-sm'>No goals found</p>
                  <p className='text-xs'>
                    Try searching with different keywords
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground'
                >
                  <SearchLucide className='h-8 w-8' />
                  <p className='text-sm'>Search your goals</p>
                  <p className='text-xs'>Type to start searching...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  )
}
