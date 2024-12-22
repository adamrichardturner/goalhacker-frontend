import { Category } from '@/types/category'
import { api } from './api'

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/api/categories', {
      withCredentials: true,
    })
    return response.data
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await api.post('/api/categories', data, {
      withCredentials: true,
    })
    return response.data
  },

  async updateCategory(categoryId: string, data: Partial<Category>): Promise<Category> {
    const response = await api.put(`/api/categories/${categoryId}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  async deleteCategory(categoryId: string): Promise<void> {
    await api.delete(`/api/categories/${categoryId}`, {
      withCredentials: true,
    })
  },
}
