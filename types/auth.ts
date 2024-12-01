export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
  username: string
  email: string
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
  user: User
}
