export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}
