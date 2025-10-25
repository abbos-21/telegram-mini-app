import apiClient from './axios'

export const gameService = {
  async mine() {
    const res = await apiClient.post('/game/mine')
    return res.data.data
  },
  async collect() {
    const res = await apiClient.post('/game/collect')
    return res.data.data
  },
}
