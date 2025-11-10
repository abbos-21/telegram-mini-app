<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { authService } from './api/authService'
import { RouterView, RouterLink } from 'vue-router'
import { HomeImage, ShopImage, TaskImage, FriendsImage } from '@/assets/images'
import { BgMusicAudio } from '@/assets/audios'
import {
  setAudioElement,
  isMusicEnabled,
  isMusicAvailable,
  setMusicPlaying,
  setMusicAvailable,
} from '@/stores/music'
import { toast } from 'vue3-toastify'

import LoaderComponent from './components/LoaderComponent.vue'

const loading = ref<boolean>(true)
const authFailed = ref<boolean>(false)
const audioRef = ref<HTMLAudioElement | null>(null)

watch(audioRef, (newEl) => {
  setAudioElement(newEl)
})

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

onMounted(async () => {
  await authenticate()
  document.addEventListener('touchstart', resumeOnInteraction)
  document.addEventListener('click', resumeOnInteraction)
})

const resumeOnInteraction = () => {
  if (!isMusicAvailable.value && isMusicEnabled.value && audioRef.value) {
    audioRef.value
      .play()
      .then(() => {
        setMusicAvailable(true)
        setMusicPlaying(true)
      })
      .catch(() => {})
    document.removeEventListener('touchstart', resumeOnInteraction)
    document.removeEventListener('click', resumeOnInteraction)
  }
}

const handleAudioLoaded = async () => {
  if (audioRef.value && isMusicEnabled.value && isMusicAvailable.value) {
    try {
      audioRef.value.muted = false
      await audioRef.value.play()
      setMusicPlaying(true)
    } catch {
      console.log('Autoplay prevented by browser.')
      setMusicPlaying(false)
      setMusicAvailable(false)
    }
  }
}

const handleAudioEnded = () => {
  setMusicPlaying(false)
}

const handleAudioError = () => {
  console.log('Audio could not be loaded')
  setMusicPlaying(false)
  setMusicAvailable(false)
}
</script>

<template>
  <LoaderComponent v-if="loading" />

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

  <div v-else class="app-container">
    <audio
      ref="audioRef"
      loop
      preload="auto"
      :muted="!isMusicEnabled || !isMusicAvailable"
      @loadeddata="handleAudioLoaded"
      @ended="handleAudioEnded"
      @error="handleAudioError"
    >
      <source :src="BgMusicAudio" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <div class="h-screen w-screen flex justify-center items-center">
      <div class="max-w-md w-full h-full relative">
        <RouterView />

        <div class="grid grid-cols-4 gap-2 absolute bottom-2 inset-x-0 px-2 max-w-md">
          <RouterLink
            to="/"
            class="cursor-pointer flex flex-col items-center justify-center bg-[#D68C62] rounded-[10px] w-full h-16 border border-[#FBEFE7]"
          >
            <img :src="HomeImage" alt="" class="w-8 h-8 object-contain" />
            <p class="font-bold">Home</p>
          </RouterLink>
          <RouterLink
            to="/shop"
            class="cursor-pointer flex flex-col items-center justify-center bg-[#DAC7C0] rounded-[10px] w-full h-16 border border-[#FBEFE7]"
          >
            <img :src="ShopImage" alt="" class="w-8 h-8 object-contain" />
            <p class="font-bold">Shop</p>
          </RouterLink>
          <RouterLink
            to="/task"
            class="cursor-pointer flex flex-col items-center justify-center bg-[#D68C62] rounded-[10px] w-full h-16 border border-[#FBEFE7]"
          >
            <img :src="TaskImage" alt="" class="w-8 h-8 object-contain" />
            <p class="font-bold">Task</p>
          </RouterLink>
          <RouterLink
            to="/friends"
            class="cursor-pointer flex flex-col items-center justify-center bg-[#DAC7C0] rounded-[10px] w-full h-16 border border-[#FBEFE7]"
          >
            <img :src="FriendsImage" alt="" class="w-8 h-8 object-contain" />
            <p class="font-bold">Friends</p>
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
}
</style>
