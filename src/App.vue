<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authService } from './api/authService'
import { RouterView, RouterLink } from 'vue-router'
import { HomeImage, ShopImage, TaskImage, FriendsImage } from '@/assets/images'
import { BgMusicAudio } from '@/assets/audios'
import { isMusicEnabled, setMusicPlaying, setMusicAvailable } from '@/stores/music'
import { toast } from 'vue3-toastify'

import LoaderComponent from './components/LoaderComponent.vue'

const loading = ref<boolean>(true)
const authFailed = ref<boolean>(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const authenticate = async () => {
  try {
    loading.value = true
    authFailed.value = false
    await authService.loginWithTelegram()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Auth error:', error)
    authFailed.value = true
    toast.error(error.message || 'Connection failed. Tap to retry.')
  } finally {
    loading.value = false
  }
}

const handleRetry = async () => {
  await authenticate()
}

// Auto authenticate on mount
onMounted(async () => {
  await authenticate()
})

// Music handlers
const handleAudioEnded = () => setMusicPlaying(false)
const handleAudioError = () => {
  console.log('Audio could not be loaded')
  setMusicPlaying(false)
}

const handleAudioLoaded = async () => {
  if (audioRef.value && isMusicEnabled.value) {
    try {
      audioRef.value.muted = false
      await audioRef.value.play()
      setMusicPlaying(true)
      setMusicAvailable(true)
    } catch {
      console.log('Autoplay prevented by browser.')
      setMusicPlaying(false)
      setMusicAvailable(false)
    }
  }
}
</script>

<template>
  <!-- Loading Screen -->
  <LoaderComponent v-if="loading" />

  <!-- Auth Failed - Retry Screen -->
  <div
    v-else-if="authFailed"
    class="fixed inset-0 bg-gradient-to-br from-black/90 via-[#1a1a2e]/90 to-[#16213e]/90 flex items-center justify-center z-50 px-4"
  >
    <div
      class="text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl max-w-sm w-full border border-white/20"
    >
      <div
        class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#D68C62] to-[#DAC7C0] rounded-full flex items-center justify-center"
      >
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-white mb-4">Connection Lost</h3>
      <p class="text-sm text-gray-300 mb-8 max-w-xs mx-auto leading-relaxed">
        Tap below to reconnect to the game
      </p>
      <button
        @click="handleRetry"
        class="w-full px-6 py-4 bg-gradient-to-r from-[#D68C62] to-[#DAC7C0] text-white font-bold rounded-xl shadow-lg hover:shadow-[#D68C62]/25 transition-all duration-300"
      >
        🔄 Tap to Reconnect
      </button>
      <p class="text-xs text-gray-400 mt-6">Works best on Telegram Mobile</p>
    </div>
  </div>

  <!-- Main App -->
  <div v-else class="app-container">
    <audio
      ref="audioRef"
      loop
      @ended="handleAudioEnded"
      @error="handleAudioError"
      preload="auto"
      muted
      @loadeddata="handleAudioLoaded"
    >
      <source :src="BgMusicAudio" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <div class="h-screen w-screen flex justify-center items-center">
      <div class="max-w-md w-full h-full relative">
        <RouterView />

        <!-- Bottom Navigation -->
        <div class="grid grid-cols-4 gap-2 absolute bottom-2 inset-x-0 px-2 max-w-md">
          <RouterLink to="/" class="nav-item nav-home">
            <img :src="HomeImage" alt="Home" class="w-8 h-8 object-contain" />
            <p class="font-bold text-sm mt-1">Home</p>
          </RouterLink>

          <RouterLink to="/shop" class="nav-item nav-shop">
            <img :src="ShopImage" alt="Shop" class="w-8 h-8 object-contain" />
            <p class="font-bold text-sm mt-1">Shop</p>
          </RouterLink>

          <RouterLink to="/task" class="nav-item nav-task">
            <img :src="TaskImage" alt="Task" class="w-8 h-8 object-contain" />
            <p class="font-bold text-sm mt-1">Task</p>
          </RouterLink>

          <RouterLink to="/friends" class="nav-item nav-friends">
            <img :src="FriendsImage" alt="Friends" class="w-8 h-8 object-contain" />
            <p class="font-bold text-sm mt-1">Friends</p>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}

.nav-item {
  @apply cursor-pointer flex flex-col items-center justify-center rounded-[10px] w-full h-16 border transition-all duration-300 hover:scale-105 active:scale-95;
}

.nav-home,
.nav-task {
  @apply bg-[#D68C62]/20 border-[#D68C62]/30 backdrop-blur-sm;
}

.nav-shop,
.nav-friends {
  @apply bg-[#DAC7C0]/20 border-[#DAC7C0]/30 backdrop-blur-sm;
}

.nav-home:hover,
.nav-task:hover {
  @apply bg-[#D68C62]/30 border-[#D68C62]/50;
}

.nav-shop:hover,
.nav-friends:hover {
  @apply bg-[#DAC7C0]/30 border-[#DAC7C0]/50;
}
</style>
