import apiClient from './axios'
import type { ApiResponse, GameCollectResponse, GameMineResponse, User } from './types'

export const gameService = {
  mine: async (): Promise<ApiResponse<GameMineResponse>> => {
    const response = await apiClient.post<ApiResponse<GameMineResponse>>('/game/start-mining')
    return response.data
  },
  collect: async (): Promise<ApiResponse<GameCollectResponse>> => {
    const response = await apiClient.post<ApiResponse<GameCollectResponse>>('/game/collect-coins')
    return response.data
  },
  sync: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/game/sync')
    return response.data
  },
  recoverHealth: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/game/recover-health')
    return response.data
  },
  recoverEnergy: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/game/recover-energy')
    return response.data
  },
}
