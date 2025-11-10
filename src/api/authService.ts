import apiClient from './axios'
import WebApp from '@twa-dev/sdk'
import type { AuthApiResponse } from './types'

const MAX_RETRIES = 10
const RETRY_DELAY_MS = 300

const waitForInitData = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const check = () => {
      const initData = WebApp.initData
      if (initData && initData.length > 0) {
        resolve(initData)
        return
      }

      if (attempts >= MAX_RETRIES) {
        reject(new Error('Telegram initData not available'))
        return
      }

      attempts++
      setTimeout(check, RETRY_DELAY_MS)
    }

    check()
  })
}

export const authService = {
  loginWithTelegram: async (): Promise<AuthApiResponse> => {
    try {
      // Signal WebApp is ready (critical for Desktop)
      WebApp.ready()
      WebApp.expand()

      // Wait for initData with retry
      const initData = await waitForInitData()
      const ref = WebApp.initDataUnsafe?.start_param || null

      if (!initData) {
        throw new Error('Failed to get Telegram initData')
      }

      // Authenticate with backend
      const { data } = await apiClient.post<AuthApiResponse>('/auth', {
        initData,
        ref,
      })

      // Store token & user
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      return data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Auth failed:', error)
      throw new Error(error?.message || 'Authentication failed')
    }
  },
}
