export interface User {
  id: number
  telegramId: number
  username?: string
  firstName?: string
  createdAt: string
}

export interface ApiResponse<T> {
  data: T
  success?: boolean
}
