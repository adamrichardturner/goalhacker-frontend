import { AxiosError } from 'axios'

type ErrorResponse = {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export function processAuthError(error: unknown): string {
  if (!error) return 'An unknown error occurred'

  // Handle axios error responses
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse

    // Handle validation errors
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0]
      if (firstError) return firstError
    }

    // Handle message or error string
    if (data?.message) return data.message
    if (data?.error) return data.error
  }

  // Handle error objects with message
  if (error instanceof Error) {
    return error.message
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}
