<script setup lang="ts">
import { ref } from 'vue'
import { CoinIcon } from '@/assets/icons'
import { WidthdrawSvg } from '@/assets/svgs'

const isMusicPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const toggleMusic = () => {
  if (!audioRef.value) return

  if (isMusicPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isMusicPlaying.value = !isMusicPlaying.value
}

const handleAudioEnded = () => {
  isMusicPlaying.value = false
}

const handleAudioError = () => {
  console.log('Audio could not be loaded')
  isMusicPlaying.value = false
}
</script>

<template>
  <audio ref="audioRef" loop @ended="handleAudioEnded" @error="handleAudioError" preload="auto">
    <source src="@/assets/audios/bg-music.mp3" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>

  <div class="h-full w-full flex flex-col justify-between relative">
    <div class="flex justify-between items-start mt-10">
      <div class="flex items-center p-2 bg-[#FAC487] gap-2 border border-[#000]">
        <CoinIcon class="w-[24px]" />
        <p class="font-bold">34923.123</p>
        <WidthdrawSvg class="ms-1 w-[24px]" />
      </div>

      <div class="flex flex-col gap-2 items-end">
        <div class="flex items-center justify-center p-2 bg-[#FAC487] border border-[#000]">
          <p class="font-bold">Your level: 1</p>
        </div>

        <button
          class="flex items-center justify-center bg-[#FAC487] border border-[#000] cursor-pointer pe-2"
        >
          <img src="@/assets/images/uk-flag.png" class="w-[40px]" alt="" />
          <span class="font-bold">EN</span>
        </button>

        <button
          class="cursor-pointer music-button relative"
          :class="{ 'music-disabled': !isMusicPlaying }"
          @click="toggleMusic"
        >
          <img src="@/assets/images/music.png" class="w-[60px]" alt="Music toggle" />
          <div v-if="!isMusicPlaying" class="absolute inset-0 flex items-center justify-center">
            <div class="diagonal-line"></div>
          </div>
        </button>
      </div>
    </div>

    <div>
      <div class="flex justify-center items-center">
        <div
          class="font-bold flex justify-center items-center p-1 border-2 w-[200px] border-[#000] rounded-[10px]"
          style="background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #f0a206 100%)"
        >
          120.00
        </div>
      </div>

      <div class="flex justify-between">
        <div class="flex flex-col items-center">
          <p class="font-bold text-[#F5E4A9] ms-1">100%</p>
          <img src="@/assets/images/level-green.png" alt="" class="w-[25px]" />
          <img src="@/assets/images/heart.png" alt="" class="w-[50px]" />
        </div>

        <div class="flex flex-col items-center">
          <p class="font-bold text-[#F5E4A9] ms-1">100 min</p>
          <img src="@/assets/images/level-blue.png" alt="" class="w-[21px]" />
          <img src="@/assets/images/flash.png" alt="" class="w-[40px]" />
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center absolute bottom-4 left-1/2 -translate-x-1/2">
      <button
        type="button"
        class="bg-[url('@/assets/images/collect-bg.png')] bg-contain bg-center bg-no-repeat w-[200px] h-[60px] pb-1 font-semibold text-[24px] cursor-pointer"
      >
        Collect
      </button>
    </div>

    <div class="flex justify-between items-center">
      <button type="button" class="cursor-pointer">
        <img src="@/assets/images/bottle.png" class="w-[60px]" />
      </button>

      <button type="button" class="cursor-pointer">
        <img src="@/assets/images/spin.png" class="w-[60px]" />
      </button>
    </div>
  </div>

  <div class="flex justify-between items-center absolute bottom-2 inset-x-0 px-2 max-w-[425px]">
    <div
      class="flex flex-col items-center justify-center bg-[#D68C62] rounded-[10px] w-20 h-20 mx-1 border border-[#FBEFE7]"
    >
      <img src="@/assets/images/home.png" alt="" class="w-10 h-10 object-contain mb-1" />
      <p class="font-bold">Home</p>
    </div>
    <div
      class="flex flex-col items-center justify-center bg-[#DAC7C0] rounded-[10px] w-20 h-20 mx-1 border border-[#FBEFE7]"
    >
      <img src="@/assets/images/shop.png" alt="" class="w-10 h-10 object-contain mb-1" />
      <p class="font-bold">Shop</p>
    </div>
    <div
      class="flex flex-col items-center justify-center bg-[#D68C62] rounded-[10px] w-20 h-20 mx-1 border border-[#FBEFE7]"
    >
      <img src="@/assets/images/task.png" alt="" class="w-10 h-10 object-contain mb-1" />
      <p class="font-bold">Task</p>
    </div>
    <div
      class="flex flex-col items-center justify-center bg-[#DAC7C0] rounded-[10px] w-20 h-20 mx-1 border border-[#FBEFE7]"
    >
      <img src="@/assets/images/friends.png" alt="" class="w-10 h-10 object-contain mb-1" />
      <p class="font-bold">Friends</p>
    </div>
  </div>
</template>

<style scoped>
.music-button {
  transition: opacity 0.2s ease;
}

.music-button:hover {
  opacity: 0.8;
}

.music-disabled {
  opacity: 0.7;
}

.diagonal-line {
  width: 40px;
  height: 2px;
  background-color: #ff0000;
  transform: rotate(45deg);
}
</style>
