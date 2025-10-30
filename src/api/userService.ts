import apiClient from './axios'
import type { ApiResponse, UserDataResponse } from './types'

export const userService = {
  getCurrentUser: async (): Promise<ApiResponse<UserDataResponse>> => {
    const response = await apiClient.get<ApiResponse<UserDataResponse>>('/user/me')
    return response.data
  },
}
