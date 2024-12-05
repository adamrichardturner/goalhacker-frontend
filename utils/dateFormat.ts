import { format } from 'date-fns'
import { DateFormat } from '@/hooks/useSettings'

export const formatDate = (
  date: Date | string | null,
  userFormat?: DateFormat | null
): string => {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date
  const formatString = userFormat || 'dd/MM/yyyy' // European default

  try {
    return format(dateObj, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}
