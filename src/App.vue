<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { HomeImage, ShopImage, TaskImage, FriendsImage } from '@/assets/images'
import { BgMusicAudio } from '@/assets/audios'
import { isMusicPlaying, isMusicEnabled, setMusicPlaying, setMusicAvailable } from '@/stores/music'
import AppLoader from '@/components/AppLoader.vue'
import { isLoading, hideLoader, showLoader } from '@/stores/loader'
import {
  preloadAllAssets,
  loadingProgress,
  loadingMessage as assetLoadingMessage,
} from '@/utils/assetPreloader'

const audioRef = ref<HTMLAudioElement | null>(null)

const handleAudioEnded = () => {
  setMusicPlaying(false)
}

const handleAudioError = () => {
  console.log('Audio could not be loaded')
  setMusicPlaying(false)
}

const handleAudioLoaded = async () => {
  if (audioRef.value && isMusicEnabled.value) {
    try {
      // Unmute and play the audio
      audioRef.value.muted = false
      await audioRef.value.play()
      setMusicPlaying(true)
      setMusicAvailable(true)
    } catch {
      console.log('Autoplay was prevented by browser policy. User interaction required.')
      setMusicPlaying(false)
      setMusicAvailable(false)
    }
  }
}

// Watch for music enabled state changes
watch(isMusicEnabled, async (enabled) => {
  if (audioRef.value) {
    if (enabled && !isMusicPlaying.value) {
      try {
        audioRef.value.muted = false
        await audioRef.value.play()
        setMusicPlaying(true)
        setMusicAvailable(true)
      } catch (error) {
        console.log('Could not start music:', error)
        setMusicPlaying(false)
        setMusicAvailable(false)
      }
    } else if (!enabled && isMusicPlaying.value) {
      audioRef.value.pause()
      setMusicPlaying(false)
    }
  }
})

// Auto-play background music when app mounts
onMounted(async () => {
  // Initialize loader
  showLoader('Initializing Bruno Earning...')

  try {
    // Preload all assets with real progress tracking
    await preloadAllAssets()

    // Wait a moment to show 100% completion
    setTimeout(() => {
      hideLoader()
    }, 500)
  } catch (error) {
    console.error('Error loading assets:', error)
    // Even if some assets fail, continue to the game
    setTimeout(() => {
      hideLoader()
    }, 1000)
  }

  // The audio will auto-play when loaded due to the autoplay attribute
  // and the handleAudioLoaded function will handle unmuting and playing
})
</script>

<template>
  <!-- App Loader -->
  <AppLoader
    :is-loading="isLoading"
    :progress="loadingProgress"
    :loading-message="assetLoadingMessage"
    @loaded="hideLoader"
  />

  <!-- Background Music - plays continuously across all routes -->
  <audio
    ref="audioRef"
    loop
    @ended="handleAudioEnded"
    @error="handleAudioError"
    preload="auto"
    autoplay
    muted
    @loadeddata="handleAudioLoaded"
  >
    <source :src="BgMusicAudio" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>

  <div class="app-container">
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
