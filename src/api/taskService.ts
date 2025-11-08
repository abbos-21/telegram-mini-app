import apiClient from './axios'
import type { ApiResponse, TasksApiResponse } from './types'

export const taskService = {
  getTasks: async (): Promise<TasksApiResponse> => {
    const response = await apiClient.get<TasksApiResponse>('/task')
    return response.data
  },

  checkSubscription: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/task/check-subscription')
    return response.data
  },
}
