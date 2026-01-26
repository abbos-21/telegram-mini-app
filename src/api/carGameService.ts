import apiClient from './axios'
import type { ApiResponse, CarGameResponse } from './types'

export const carGameService = {
  getStatus: async (): Promise<ApiResponse<CarGameResponse>> => {
    const response = await apiClient.get<ApiResponse<CarGameResponse>>('/car-game/status')
    return response.data
  },

  // New Start Method
  startGame: async (): Promise<string> => {
    const response = await apiClient.post<ApiResponse<{ sessionId: string }>>('/car-game/start')
    return response.data.data.sessionId
  },

  // Updated Reward Method
  claimReward: async (payload: {
    sessionId: string
    coins: number
    score: number
  }): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/car-game/claim', payload)
    return response.data
  },
}
