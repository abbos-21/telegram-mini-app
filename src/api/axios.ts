// src/api/axios.ts
import axios, { type AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') + '/api' ||
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// ✅ Attach JWT from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ✅ Handle 401s globally (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // optionally redirect to login
    }
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default apiClient
