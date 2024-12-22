export interface Category {
  category_id: string
  name: string
  description?: string
  user_id?: string
  is_default: boolean
  created_at: Date
  updated_at: Date
}

export type CategoryCreateInput = Pick<Category, 'name' | 'description'>

export type CategoryUpdateInput = Partial<Pick<Category, 'name' | 'description'>>

export interface CategoryWithGoalCount extends Category {
  goal_count: number
}
