import apiClient from './axios'
import type { ApiResponse, StartGameResponse, UserStatus, OpenCardResponse } from './types'

export const boxService = {
  // GET /status
  getStatus: async () => {
    const { data } = await apiClient.get<ApiResponse<{ user: UserStatus }>>('/box/status')
    return data
  },

  // POST /pay-with-coins
  payWithCoins: async () => {
    const { data } = await apiClient.post<ApiResponse<null>>('/box/pay-with-coins')
    return data
  },

  // POST /start
  startGame: async () => {
    const { data } = await apiClient.post<ApiResponse<StartGameResponse>>('/box/start')
    return data
  },

  // POST /open
  // Backend expects: { sessionId, index }
  openCard: async (sessionId: string, index: number) => {
    const { data } = await apiClient.post<ApiResponse<OpenCardResponse>>('/box/open', {
      sessionId,
      index,
    })
    return data
  },

  // POST /claim
  // Backend expects: { sessionId }
  claimRewards: async (sessionId: string) => {
    const { data } = await apiClient.post<ApiResponse<null>>('/box/claim', {
      sessionId,
    })
    return data
  },
}
