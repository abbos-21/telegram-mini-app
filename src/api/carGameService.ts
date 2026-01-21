import apiClient from './axios'
import type { ApiResponse, CarGameResponse } from './types'

export const carGameService = {
  getStatus: async (): Promise<ApiResponse<CarGameResponse>> => {
    const response = await apiClient.get<ApiResponse<CarGameResponse>>('/car-game/status')
    return response.data
  },

  reward: async (payload: { coins: number }): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/car-game/reward', payload)
    return response.data
  },
}
