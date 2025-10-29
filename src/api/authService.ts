import apiClient from './axios'
import WebApp from '@twa-dev/sdk'
import type { ApiResponse, AuthResponse } from './types'

export const authService = {
  loginWithTelegram: async (): Promise<ApiResponse<AuthResponse>> => {
    const initData = WebApp.initData
    const ref = new URLSearchParams(window.location.search).get('ref')

    if (!initData) throw new Error('Telegram WebApp initData is missing.')

    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth', { initData, ref })

    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))

    return data
  },
}
