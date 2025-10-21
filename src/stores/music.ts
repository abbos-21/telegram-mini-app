import { ref } from 'vue'

// Global music state
export const isMusicPlaying = ref(false)
export const isMusicEnabled = ref(true)
export const isMusicAvailable = ref(true) // Tracks if music can be played (not blocked by browser)

// Music control functions
export const toggleMusic = () => {
  if (!isMusicAvailable.value) {
    // If music is not available due to browser policy, try to enable it
    isMusicEnabled.value = true
    return true
  }
  isMusicEnabled.value = !isMusicEnabled.value
  return isMusicEnabled.value
}

export const setMusicPlaying = (playing: boolean) => {
  isMusicPlaying.value = playing
}

export const setMusicEnabled = (enabled: boolean) => {
  isMusicEnabled.value = enabled
}

export const setMusicAvailable = (available: boolean) => {
  isMusicAvailable.value = available
  if (!available) {
    isMusicEnabled.value = false
    isMusicPlaying.value = false
  }
}
