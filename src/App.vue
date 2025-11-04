<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { authService } from './api/authService'
import { RouterView, RouterLink } from 'vue-router'
import { HomeImage, ShopImage, TaskImage, FriendsImage } from '@/assets/images'
import { BgMusicAudio } from '@/assets/audios'
import { isMusicPlaying, isMusicEnabled, setMusicPlaying, setMusicAvailable } from '@/stores/music'
import { useMonetagAdHandler } from './composables/useMonetagAdHandler'
// import { useAdsgram } from '@adsgram/vue'

// const blockId = import.meta.env.VITE_BLOCK_ID

// const { show, addEventListener } = useAdsgram({
//   blockId,
// })

// addEventListener('onBannerNotFound', () => {
//   console.log('No ad available at the moment')
// })
// addEventListener('onTooLongSession', () => {
//   console.log('User session too long — ad not available')
// })

const audioRef = ref<HTMLAudioElement | null>(null)

const loading = ref<boolean>(false)

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
      }
    } else if (!enabled && isMusicPlaying.value) {
      audioRef.value.pause()
      setMusicPlaying(false)
    }
  }
})

const authenticate = async () => {
  try {
    loading.value = true
    const response = await authService.loginWithTelegram()
    console.log('✅ Authenticated as', response.data.user)
  } catch (err) {
    console.error('Auth failed:', err)
  } finally {
    loading.value = false
  }
}

// useMonetagAdHandler()

onMounted(async () => {
  await authenticate()
  // await show()
})
</script>

<template>
  <audio
    ref="audioRef"
    loop
    @ended="handleAudioEnded"
    @error="handleAudioError"
    preload="auto"
    autoplay
    muted
    @loadeddata="handleAudioLoaded"
    v-if="!loading"
  >
    <source :src="BgMusicAudio" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>

  <div class="app-container" v-if="!loading">
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

  <div v-else>Loading...</div>
</template>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
