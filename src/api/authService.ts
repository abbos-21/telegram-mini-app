// src/api/authService.ts
import apiClient from './axios'
import type { ApiResponse, User } from './types'
import WebApp from '@twa-dev/sdk' // ✅ new import

export const authService = {
  async loginWithTelegram(): Promise<ApiResponse<{ token: string; user: User }>> {
    // 1️⃣ Get Telegram launch params from WebApp
    const initDataRaw = WebApp.initData
    const initDataUnsafe = WebApp.initDataUnsafe

    if (!initDataRaw || !initDataUnsafe?.user) {
      throw new Error('Telegram WebApp initData not available — are you running inside Telegram?')
    }

    // 2️⃣ Send initDataRaw to backend for verification
    const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
      '/auth/telegram',
      { initData: initDataRaw },
    )

    // 3️⃣ Save token for future API requests
    const { token, user } = response.data.data
    if (token) {
      localStorage.setItem('token', token)
    }

    return { data: { token, user }, success: true }
  },

  logout(): void {
    localStorage.removeItem('token')
  },
}
