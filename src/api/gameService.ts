import apiClient from './axios'
import type { ApiResponse, User } from './types'

export const gameService = {
  async mine(): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>('/game/mine')
    return response.data.data
  },
}
