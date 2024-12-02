export interface User {
  user_id: string
  email: string
  username: string
  first_name: string
  last_name: string
  email_verified: boolean
}

export interface ApiUser {
  id: string
  email: string
  username: string
  first_name?: string
  last_name?: string
  email_verified?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  username: string
  first_name: string
  last_name: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user: ApiUser
}

export interface ProfileResponse {
  success: boolean
  user: ApiUser
}
