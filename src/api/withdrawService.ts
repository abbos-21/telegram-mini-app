import apiClient from './axios'
import type { Withdrawal, ApiResponse } from './types'

export const withdrawService = {
  getWithdrawalHistory: async (): Promise<ApiResponse<Withdrawal[]>> => {
    const response = await apiClient.get<ApiResponse<Withdrawal[]>>('/withdrawals/history')
    return response.data
  },
}
