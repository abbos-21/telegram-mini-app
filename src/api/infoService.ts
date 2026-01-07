import apiClient from './axios'
import type { ApiResponse, InfoNextRefillResponse } from './types'

export const infoService = {
  getNextRefillUpdate: async (): Promise<ApiResponse<InfoNextRefillResponse>> => {
    const response = await apiClient.get<ApiResponse<InfoNextRefillResponse>>('/next-refill-update')
    return response.data
  },
}
