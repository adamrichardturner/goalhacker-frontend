export interface Goal {
  id: string
  title: string
  aims?: string
  target_date: string
  status: "not_started" | "in_progress" | "completed"
  progress: number
  steps_to_completion?: string
  measurement_method?: string
  user_id: string
  created_at: string
  updated_at: string
  category?: string
  priority: "low" | "medium" | "high"
  subgoals?: Subgoal[]
}

export interface Subgoal {
  id?: string
  goal_id?: string
  title?: string
  completed?: boolean
  due_date?: string
  created_at?: string
  updated_at?: string
}
