import apiClient from './axios'
import type { User, ApiResponse } from './types'

export const userService = {
  getAll: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users')
    return response.data
  },
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`)
    return response.data
  },
}
