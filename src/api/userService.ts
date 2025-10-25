import apiClient from './axios'
import type { User, ApiResponse } from './types'

export const userService = {
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/user/me')
    return response.data
  },
}
