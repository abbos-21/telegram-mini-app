import apiClient from './axios'
import type { ApiResponse, GameCollectResponse, GameMineResponse } from './types'

export const gameService = {
  mine: async (): Promise<ApiResponse<GameMineResponse>> => {
    const response = await apiClient.post<ApiResponse<GameMineResponse>>('/game/mine')
    return response.data
  },
  collect: async (): Promise<ApiResponse<GameCollectResponse>> => {
    const response = await apiClient.post<ApiResponse<GameCollectResponse>>('/game/collect')
    return response.data
  },
}
