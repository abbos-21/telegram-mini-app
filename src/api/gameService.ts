import apiClient from './axios'
import type {
  GameStartMiningApiResponse,
  GameCollectCoinsApiResponse,
  GameSyncApiResponse,
  GameRecoveryApiResponse,
} from './types'

export const gameService = {
  mine: async (): Promise<GameStartMiningApiResponse> => {
    const response = await apiClient.post<GameStartMiningApiResponse>('/game/start-mining')
    return response.data
  },
  collect: async (): Promise<GameCollectCoinsApiResponse> => {
    const response = await apiClient.post<GameCollectCoinsApiResponse>('/game/collect-coins')
    return response.data
  },
  sync: async (): Promise<GameSyncApiResponse> => {
    const response = await apiClient.post<GameSyncApiResponse>('/game/sync')
    return response.data
  },
  recoverHealth: async (): Promise<GameRecoveryApiResponse> => {
    const response = await apiClient.post<GameRecoveryApiResponse>('/game/recover-health')
    return response.data
  },
  recoverEnergy: async (): Promise<GameRecoveryApiResponse> => {
    const response = await apiClient.post<GameRecoveryApiResponse>('/game/recover-energy')
    return response.data
  },
}
