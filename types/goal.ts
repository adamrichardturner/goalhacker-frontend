export interface Goal {
  goal_id?: string
  user_id: string
  title: string
  aims?: string
  target_date?: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  steps_to_completion?: string
  measurement_method?: string
  created_at?: string
  updated_at?: string
  category?: string
  priority: 'low' | 'medium' | 'high'
  subgoals?: Subgoal[]
}

export interface Subgoal {
  subgoal_id?: string
  goal_id: string
  title: string
  due_date?: string
  completion_status?: boolean
  created_at?: string
}
