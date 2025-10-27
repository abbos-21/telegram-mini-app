export interface User {
  id: number
  telegramId: number
  username?: string
  firstName?: string
  lastName?: string
  languageCode?: string
  isBot: boolean
  createdAt: string
  updatedAt: string
  coins: number
  level: number
  miningStarted: string
  miningRate: number
  referredById: number
  referredBy: User
  referrals: User[]
  lastMiningTick: string
  tempCoins: number
  vaultCapacity: number
  energy: number
  health: number
  energyMax: number
  healthMax: number
}

export interface ApiResponse<T> {
  data: T
  success?: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

export interface GameMineResponse extends User {
  mined?: number
  vaultFull?: boolean
  message: string
}

export interface GameCollectResponse extends User {
  collected?: number
  message?: string
}
