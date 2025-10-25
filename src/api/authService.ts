import apiClient from './axios'
import WebApp from '@twa-dev/sdk'
import type { TelegramAuthResponse } from './types'

export const authService = {
  async loginWithTelegram() {
    try {
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

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return { token, user }
    } catch (error) {
      console.error('Auth failed:', error)
      throw error
    }
  },
}
