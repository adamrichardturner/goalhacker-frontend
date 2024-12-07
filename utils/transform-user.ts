import { User, ApiUser } from '@/types/auth'

export const transformUserData = (apiUser: ApiUser | User): User => ({
  user_id: 'id' in apiUser ? apiUser.id : apiUser.user_id,
  email: apiUser.email,
  username: apiUser.username,
  first_name: apiUser.first_name,
  last_name: apiUser.last_name,
  plan_type: apiUser.plan_type,
  email_verified: apiUser.email_verified,
  avatar_url: apiUser.avatar_url,
  created_at: apiUser.created_at,
  updated_at: apiUser.updated_at,
})
