import apiClient from './axios'
import WebApp from '@twa-dev/sdk'
import type { ApiResponse, AuthResponse } from './types'

export const authService = {
  loginWithTelegram: async (): Promise<ApiResponse<AuthResponse>> => {
    try {
      const initData = WebApp.initData
      const ref = new URLSearchParams(window.location.search).get('ref')

      if (!initData) {
        throw new Error('Telegram WebApp initData is missing.')
      }

      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth', {
        initData,
        ref,
      })

      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))

      return response.data
    } catch (error) {
      console.error('Auth failed:', error)
      throw error
    }
  },
}
