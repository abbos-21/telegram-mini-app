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
  referredById: number
  referredBy: User
  referrals: User[]
  lastMiningTick: string
  tempCoins: number
  vaultCapacity: number
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
  vaultFull?: boolean
  message: string
}

export interface GameCollectResponse {
  totalCoins: number
  level: number
}
