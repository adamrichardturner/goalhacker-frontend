export type PlanType = 'basic' | 'pro' | 'admin' | 'owner'

export interface User {
  user_id: string
  email: string
  username: string
  first_name: string
  last_name: string
  plan_type: PlanType
  email_verified: boolean
  created_at?: string
  updated_at?: string
}

export const isOwner = (user: User) => user.plan_type === 'owner'
export const isAdmin = (user: User) =>
  user.plan_type === 'admin' || user.plan_type === 'owner'
export const isPro = (user: User) => user.plan_type === 'pro' || isAdmin(user)

export interface ApiUser {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  plan_type: PlanType
  email_verified: boolean
  created_at?: string
  updated_at?: string
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
