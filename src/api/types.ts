export interface User {
  id: number
  telegramId: string
  username?: string
  firstName?: string
  lastName?: string
  languageCode?: string
  isBot: boolean
  createdAt: string
  updatedAt: string
  coins: number
  level: number
  miningRate: number
  referredById: number | null
  referredBy?: User
  referrals?: User[]
  lastMiningTick: string | null
  isMining: boolean
  tempCoins: number
  vaultCapacity: number
  currentHealth: number
  maxHealth: number
  currentEnergy: number
  maxEnergy: number
  healthPerSecond: number
  energyPerSecond: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export type UserDataResponse = {
  user: User
}

export type AuthResponseData = {
  token: string
  user: User
}
export type AuthApiResponse = ApiResponse<AuthResponseData>

export type GameStartMiningResponseData = UserDataResponse
export type GameStartMiningApiResponse = ApiResponse<GameStartMiningResponseData>

export type GameStopMiningResponseData = UserDataResponse
export type GameStopMiningApiResponse = ApiResponse<GameStopMiningResponseData>

export type GameSyncResponseData = UserDataResponse
export type GameSyncApiResponse = ApiResponse<GameSyncResponseData>

export type GameCollectCoinsResponseData = UserDataResponse & {
  coinsCollected: number
}
export type GameCollectCoinsApiResponse = ApiResponse<GameCollectCoinsResponseData>

export type GameRecoveryResponseData = UserDataResponse
export type GameRecoveryApiResponse = ApiResponse<GameRecoveryResponseData>

export interface GameSpinWheelStatusApiResponse {
  status: string
  data: {
    canSpin: boolean
    remaining?: {
      hours: number
      minutes: number
    }
  }
}

export interface GameSpinWheelSpinApiResponse {
  status: string
  data: {
    prize: number
    nextSpinAt: string
  }
}

export interface AdResponse {
  text_html: string
  click_url: string
  button_name: string
  image_url: string
  button_reward_name: string
  reward_url: string
}

export interface InviteLinkResponse {
  link: string
}

export interface ReferralsResponse {
  count: number
  referralEarnings: number
  referralRewards: {
    [referrals: number]: number
  }
  referrals?: User[]
}
