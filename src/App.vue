<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import WebApp from '@twa-dev/sdk'
import { toast } from 'vue3-toastify'

import { authService } from './api/authService'
import LoaderComponent from './components/LoaderComponent.vue'
import { BgMusicAudio } from '@/assets/audios'
import {
  setAudioElement,
  isMusicEnabled,
  isMusicAvailable,
  setMusicPlaying,
  setMusicAvailable,
} from '@/stores/music'

import {
  MenuItemFriendsImage,
  MenuItemHomeImage,
  MenuItemShopImage,
  MenuItemTasksImage,
} from './assets/images/winter'

/* -------------------- STATE -------------------- */
const loading = ref(true)
const authFailed = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

/* -------------------- USER / BIGGIE -------------------- */
const BIGGIES = new Set<number>([5035538171, 1031081189, 352641904, 1701438929])

const telegramUserId = computed<number | null>(() => WebApp.initDataUnsafe?.user?.id ?? null)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isUserBiggie = computed(
  () => telegramUserId.value !== null && BIGGIES.has(telegramUserId.value),
)

/* -------------------- AUDIO -------------------- */
watch(audioRef, (el) => {
  if (el) setAudioElement(el)
})

const resumeOnInteraction = () => {
  if (!audioRef.value || !isMusicEnabled.value || isMusicAvailable.value) return

  audioRef.value
    .play()
    .then(() => {
      setMusicAvailable(true)
      setMusicPlaying(true)
      removeInteractionListeners()
    })
    .catch(() => {
      /* ignored – browser blocked autoplay */
    })
}

const addInteractionListeners = () => {
  document.addEventListener('click', resumeOnInteraction)
  document.addEventListener('touchstart', resumeOnInteraction)
}

const removeInteractionListeners = () => {
  document.removeEventListener('click', resumeOnInteraction)
  document.removeEventListener('touchstart', resumeOnInteraction)
}

const handleAudioLoaded = async () => {
  if (!audioRef.value || !isMusicEnabled.value) return

  try {
    audioRef.value.muted = false
    await audioRef.value.play()
    setMusicAvailable(true)
    setMusicPlaying(true)
  } catch {
    setMusicAvailable(false)
    setMusicPlaying(false)
    addInteractionListeners()
  }
}

const handleAudioEnded = () => {
  setMusicPlaying(false)
}

const handleAudioError = () => {
  setMusicAvailable(false)
  setMusicPlaying(false)
}

/* -------------------- AUTH -------------------- */
const authenticate = async () => {
  loading.value = true
  authFailed.value = false

  try {
    await authService.loginWithTelegram()
  } catch (err: unknown) {
    console.error('Auth error:', err)
    authFailed.value = true
    toast.error('Connection failed. Tap to retry.')
  } finally {
    loading.value = false
  }
}

const handleRetry = () => authenticate()

/* -------------------- LIFECYCLE -------------------- */
onMounted(async () => {
  try {
    WebApp.ready()
    WebApp.expand()
    await authenticate()
  } catch {
    authFailed.value = true
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  removeInteractionListeners()
})
</script>

<template>
  <!-- <LoaderComponent v-if="loading" /> -->

  <!-- <div
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
      <p class="text-sm text-gray-300 mb-8">Tap below to reconnect to the game</p>

      <button
        @click="handleRetry"
        class="w-full px-6 py-4 bg-gradient-to-r from-[#D68C62] to-[#DAC7C0] text-white font-bold rounded-xl shadow-lg"
      >
        🔄 Tap to Reconnect
      </button>

      <p class="text-xs text-gray-400 mt-6">Works best on Telegram Mobile</p>
    </div>
  </div> -->

  <!-- APP -->
  <div class="app-container">
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
    </audio>

    <div class="h-screen w-screen flex justify-center items-center">
      <div class="max-w-md w-full h-full relative">
        <RouterView />

        <nav class="grid grid-cols-4 px-2 absolute bottom-2 inset-x-0">
          <RouterLink to="/">
            <img :src="MenuItemHomeImage" alt="home" />
          </RouterLink>
          <RouterLink to="/shop">
            <img :src="MenuItemShopImage" alt="shop" />
          </RouterLink>
          <RouterLink to="/tasks">
            <img :src="MenuItemTasksImage" alt="tasks" />
          </RouterLink>
          <RouterLink to="/friends">
            <img :src="MenuItemFriendsImage" alt="friends" />
          </RouterLink>
        </nav>
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
