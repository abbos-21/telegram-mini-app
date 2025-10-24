// src/api/gameService.ts
import apiClient from './axios'

export const gameService = {
  async mine() {
    try {
      const res = await apiClient.post('/game/mine')
      console.log('Mining tick:', res.data)
      return res.data
    } catch (err) {
      console.error('Mining error:', err)
    }
  },
}
