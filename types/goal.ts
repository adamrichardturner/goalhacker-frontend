import { Category } from './category'

export type SubgoalStatus = 'planned' | 'in_progress' | 'completed'

export interface ProgressNote {
  note_id?: string
  goal_id: string
  title: string
  content: string
  created_at?: string
  updated_at?: string
}

export interface Subgoal {
  subgoal_id?: string
  goal_id: string
  title: string
  target_date?: string
  status: SubgoalStatus
  created_at?: string
  updated_at?: string
  order?: number
}

export interface DefaultImage {
  key: string
  url: string
  category?: string
  alt?: string
}

export interface Goal {
  goal_id?: string
  user_id: string
  title: string
  aims: string
  target_date?: string
  status: 'completed' | 'in_progress' | 'archived' | 'planned'
  progress: number
  steps_to_completion: string
  measurement_method: string
  created_at: string
  updated_at: string
  category_id?: string
  category?: Category
  priority: 'low' | 'medium' | 'high'
  subgoals?: Subgoal[]
  progress_notes?: ProgressNote[]
  image_url: string | null
}

export type GoalStatus = Goal['status']
