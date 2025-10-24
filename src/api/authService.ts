// src/api/authService.ts
import apiClient from './axios'
import WebApp from '@twa-dev/sdk'

interface TelegramAuthResponse {
  token: string
  user: unknown
}

export const authService = {
  async loginWithTelegram() {
    try {
      // Ensure Telegram WebApp is ready
      const initData = WebApp.initData
      const ref = new URLSearchParams(window.location.search).get('ref')

      if (!initData) {
        throw new Error('Telegram WebApp initData is missing.')
      }

      const response = await apiClient.post<{ data: TelegramAuthResponse }>('/auth/telegram', {
        initData,
        ref,
      })

      const { token, user } = response.data.data

      // Save token locally
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return { token, user }
    } catch (error) {
      console.error('Auth failed:', error)
      throw error
    }
  },
}
