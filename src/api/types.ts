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
}

export interface ApiResponse<T> {
  data: T
  success?: boolean
}
