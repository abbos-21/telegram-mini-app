import apiClient from './axios'
import type { ApiResponse, WithdrawalHistoryResponse } from './types'

export const withdrawService = {
  getWithdrawalHistory: async (): Promise<ApiResponse<WithdrawalHistoryResponse>> => {
    const response =
      await apiClient.get<ApiResponse<WithdrawalHistoryResponse>>('/withdrawals/history')
    return response.data
  },
}
