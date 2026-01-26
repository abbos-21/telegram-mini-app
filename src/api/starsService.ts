import apiClient from './axios'
import type { ApiResponse, InvoiceLinkResponse } from './types'

export const starsService = {
  getBoxGameInvoiceLink: async (): Promise<ApiResponse<InvoiceLinkResponse>> => {
    const response = await apiClient.post<ApiResponse<InvoiceLinkResponse>>('/stars/create-invoice')
    return response.data
  },

  getCarGameInvoiceLink: async (): Promise<ApiResponse<InvoiceLinkResponse>> => {
    const response = await apiClient.post<ApiResponse<InvoiceLinkResponse>>(
      '/stars/create-car-game-invoice',
    )
    return response.data
  },
}
