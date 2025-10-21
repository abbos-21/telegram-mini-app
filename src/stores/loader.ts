import { ref } from 'vue'

// Global loader state
export const isLoading = ref(false)
export const progress = ref(0)
export const loadingMessage = ref('Loading...')

// Loader control functions
export const showLoader = (message = 'Loading...') => {
  isLoading.value = true
  progress.value = 0
  loadingMessage.value = message
}

export const hideLoader = () => {
  isLoading.value = false
  progress.value = 100
}

export const updateProgress = (newProgress: number, message?: string) => {
  progress.value = Math.min(100, Math.max(0, newProgress))
  if (message) {
    loadingMessage.value = message
  }
}

export const setLoadingMessage = (message: string) => {
  loadingMessage.value = message
}
