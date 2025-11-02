import apiClient from './axios'
import WebApp from '@twa-dev/sdk'
import type { AuthApiResponse } from './types'

export const authService = {
  loginWithTelegram: async (): Promise<AuthApiResponse> => {
    const initData = WebApp.initData
    const ref = '1'

    if (!initData) throw new Error('Telegram WebApp initData is missing')

    const { data } = await apiClient.post<AuthApiResponse>('/auth', { initData, ref })

    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))

    return data
  },
}
