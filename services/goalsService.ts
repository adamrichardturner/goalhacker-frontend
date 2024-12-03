import { Goal } from '@/types/goal'
import { API_URL } from '@/config'

export const goalsService = {
  // Image handling methods
  formatImageUrl(url: string | null | undefined): string | null {
    console.log('formatImageUrl input:', url)
    if (!url) {
      return null
    }

    // If it starts with a slash, it's a relative path
    if (url.startsWith('/')) {
      const fullUrl = `${API_URL}${url}`
      console.log('formatImageUrl output:', fullUrl)
      return fullUrl
    }

    try {
      // Check if it's already a valid URL
      new URL(url)
      console.log('formatImageUrl output:', url)
      return url
    } catch {
      // If not a valid URL and doesn't start with slash, prepend API_URL with slash
      const fullUrl = `${API_URL}/${url}`
      console.log('formatImageUrl output:', fullUrl)
      return fullUrl
    }
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_URL}/api/images/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to upload image')
      }

      const data = await response.json()
      if (!data.imageUrl) {
        throw new Error('No image URL returned from server')
      }

      return this.formatImageUrl(data.imageUrl) || ''
    } catch (error) {
      throw error
    }
  },

  async getDefaultImages(): Promise<string[]> {
    try {
      const response = await fetch(`${API_URL}/api/images/default-images`, {
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch default images')
      }

      const { images } = await response.json()
      return images.map((image: string) => this.formatImageUrl(image) || '')
    } catch (error) {
      throw error
    }
  },

  // Goal handling methods
  formatGoalImages(goal: Goal): Goal {
    const formatted = {
      ...goal,
      image_url: this.formatImageUrl(goal.image_url),
      default_image_key: goal.default_image_key,
    }
    return formatted
  },

  // Image selection methods
  handleImageSelect(file: File | null): Promise<string | null> {
    if (!file) return Promise.resolve(null)
    return this.uploadImage(file)
  },

  handleDefaultImageSelect(imageKey: string): string {
    return this.formatImageUrl(imageKey) || ''
  },

  stripApiUrl(url: string | null | undefined): string | null {
    if (!url) return null

    try {
      const urlObj = new URL(url)
      if (urlObj.origin === API_URL) {
        const stripped = urlObj.pathname
        console.log('Stripped to:', stripped)
        return stripped
      }
      return url
    } catch {
      // If URL parsing fails, it's probably a key, not a URL
      console.log('Not a URL, returning as-is:', url)
      return url
    }
  },

  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    try {
      // Only strip API_URL from image_url, leave default_image_key as-is
      const strippedData = {
        ...goalData,
        image_url: this.stripApiUrl(goalData.image_url),
        default_image_key: goalData.default_image_key,
      }

      const response = await fetch(`${API_URL}/api/goals`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(strippedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create goal')
      }

      const goal = await response.json()
      return this.formatGoalImages(goal)
    } catch (error) {
      throw error
    }
  },

  async getGoals(): Promise<Goal[]> {
    try {
      const response = await fetch(`${API_URL}/api/goals`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch goals')
      }

      const rawGoals = await response.json()
      console.log('Raw goals from API:', rawGoals)

      const formattedGoals = rawGoals.map((goal: Goal) =>
        this.formatGoalImages(goal)
      )
      console.log('Goals after formatting:', formattedGoals)

      return formattedGoals
    } catch (error) {
      throw error
    }
  },

  async getGoalById(id: string): Promise<Goal | null> {
    try {
      const response = await fetch(`${API_URL}/api/goals/${id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch goal')
      }

      const rawGoal = await response.json()
      console.log('Raw goal from API in getGoalById:', rawGoal)

      // Log the goal before and after formatting
      console.log('Before formatGoalImages:', rawGoal)
      const formattedGoal = this.formatGoalImages(rawGoal)
      console.log('After formatGoalImages:', formattedGoal)

      return formattedGoal
    } catch (error) {
      console.error('Error fetching goal:', error)
      throw error
    }
  },

  async deleteGoal(goalId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/goals/${goalId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete goal')
      }
    } catch (error) {
      throw error
    }
  },
}
