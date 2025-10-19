<script setup lang="ts">
import { ref } from 'vue'
import { CoinIcon } from '@/assets/icons'
import { WidthdrawSvg } from '@/assets/svgs'
import EnergyLevel from '@/components/EnergyLevel.vue'
import HealthLevel from '@/components/HealthLevel.vue'
import BottlePopup from '@/components/BottlePopup.vue'
import SpinPopup from '@/components/SpinPopup.vue'

const isMusicPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const isBottlePopupOpen = ref(false)
const isSpinPopupOpen = ref(false)

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

const openBottlePopup = () => {
  isBottlePopupOpen.value = true
}

const closeBottlePopup = () => {
  isBottlePopupOpen.value = false
}

const openSpinPopup = () => {
  isSpinPopupOpen.value = true
}

const closeSpinPopup = () => {
  isSpinPopupOpen.value = false
}
</script>

<template>
  <audio ref="audioRef" loop @ended="handleAudioEnded" @error="handleAudioError" preload="auto">
    <source src="@/assets/audios/bg-music.mp3" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>

  <div class="h-full w-full flex flex-col justify-between relative">
    <div class="flex justify-between items-start">
      <div class="flex items-center p-2 bg-[#FAC487] gap-2 border border-[#000]">
        <CoinIcon class="w-6" />
        <p class="font-bold">34923.123</p>
        <WidthdrawSvg class="ms-1 mt-1 w-7" />
      </div>

      <div class="flex flex-col gap-2 items-end">
        <div class="flex items-center justify-center p-2 bg-[#FAC487] border border-[#000]">
          <p class="font-bold">Your level: 1</p>
        </div>

        <button
          class="flex items-center justify-center bg-[#FAC487] border border-[#000] cursor-pointer pe-2"
        >
          <img src="@/assets/images/uk-flag.png" class="w-10 h-10" alt="" />
          <span class="font-bold">EN</span>
        </button>

        <button
          class="cursor-pointer music-button relative"
          :class="{ 'music-disabled': !isMusicPlaying }"
          @click="toggleMusic"
        >
          <img src="@/assets/images/music.png" class="w-15" alt="Music toggle" />
          <div v-if="!isMusicPlaying" class="absolute inset-0 flex items-center justify-center">
            <div class="diagonal-line"></div>
          </div>
        </button>
      </div>
    </div>

    <div>
      <!-- <div class="flex justify-center items-center">
        <div
          class="font-bold flex justify-center items-center p-1 border-2 w-[200px] border-[#000] rounded-[10px]"
          style="background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #f0a206 100%)"
        >
          120.00
        </div>
      </div> -->

      <div class="flex justify-center items-center">
        <div class="relative w-[214px] h-[37px]">
          <svg
            width="214"
            height="37"
            viewBox="0 0 214 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute top-0 left-0"
          >
            <g clip-path="url(#clip0_608_57)">
              <path
                d="M193.56 0.991211C195.508 0.991264 197.283 1.70951 198.657 3.09272C200.389 4.83431 203.079 7.67949 205.659 10.9722C208.229 14.2519 210.739 18.0376 212.051 21.6566C213.357 25.2555 213.567 28.973 211.051 31.7686C208.6 34.4912 203.829 36.0091 196.091 36.0091H19.3339C17.2749 36.0091 15.3897 35.199 14.0031 33.6733C12.3605 31.8661 9.88787 29.0003 7.54287 25.7132C5.20634 22.438 2.95366 18.6857 1.8013 15.1121C0.656258 11.561 0.522202 7.92448 2.85208 5.18455C5.14514 2.48799 9.55987 0.991251 16.6359 0.991211H193.56Z"
                fill="url(#paint0_linear_608_57)"
                stroke="black"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_608_57"
                x1="212"
                y1="18.5001"
                x2="1.99987"
                y2="18.5001"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="1" stop-color="#F0A206" />
              </linearGradient>
              <clipPath id="clip0_608_57">
                <rect width="214" height="37" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <span class="absolute inset-0 flex items-center justify-center font-bold">120.00</span>
        </div>
      </div>

      <div class="flex justify-between mb-2">
        <div class="flex flex-col items-center">
          <HealthLevel
            :current-value="100"
            :max-value="100"
            :min-value="0"
            color="green"
            size="medium"
            :show-glow="true"
            :animated="true"
          />
        </div>

        <div class="flex flex-col items-center">
          <EnergyLevel
            :current-value="90"
            :max-value="100"
            :min-value="0"
            unit="min"
            color="blue"
            size="medium"
            :show-glow="true"
            :show-stats="false"
            :animated="true"
          />
        </div>
      </div>
    </div>

    <div
      class="flex justify-center items-center absolute bottom-6 left-1/2 -translate-x-1/2 w-[223px] h-[65px]"
    >
      <button
        type="button"
        class="bg-[url('@/assets/images/collect-bg.png')] bg-cover bg-center bg-no-repeat w-full h-full pb-1 font-semibold text-2xl cursor-pointer"
      >
        Collect
      </button>
    </div>

    <div class="flex justify-between items-center">
      <button type="button" class="cursor-pointer" @click="openBottlePopup">
        <img src="@/assets/images/bottle.png" class="w-12" />
      </button>

      <button type="button" class="cursor-pointer" @click="openSpinPopup">
        <img src="@/assets/images/spin.png" class="w-12" />
      </button>
    </div>
  </div>

  <div class="grid grid-cols-4 gap-2 absolute bottom-2 inset-x-0 px-2 max-w-[425px]">
    <button
      type="button"
      class="cursor-pointer flex flex-col items-center justify-center bg-[#D68C62] rounded-[10px] w-full h-16 border border-[#FBEFE7]"
    >
      <img src="@/assets/images/home.png" alt="" class="w-8 h-8 object-contain" />
      <p class="font-bold">Home</p>
    </button>
    <button
      type="button"
      class="cursor-pointer flex flex-col items-center justify-center bg-[#DAC7C0] rounded-[10px] w-full h-16 border border-[#FBEFE7]"
    >
      <img src="@/assets/images/shop.png" alt="" class="w-8 h-8 object-contain" />
      <p class="font-bold">Shop</p>
    </button>
    <button
      type="button"
      class="cursor-pointer flex flex-col items-center justify-center bg-[#D68C62] rounded-[10px] w-full h-16 border border-[#FBEFE7]"
    >
      <img src="@/assets/images/task.png" alt="" class="w-8 h-8 object-contain" />
      <p class="font-bold">Task</p>
    </button>
    <button
      type="button"
      class="cursor-pointer flex flex-col items-center justify-center bg-[#DAC7C0] rounded-[10px] w-full h-16 border border-[#FBEFE7]"
    >
      <img src="@/assets/images/friends.png" alt="" class="w-8 h-8 object-contain" />
      <p class="font-bold">Friends</p>
    </button>
  </div>

  <!-- Bottle Popup -->
  <BottlePopup :is-open="isBottlePopupOpen" @close="closeBottlePopup" />

  <!-- Spin Popup -->
  <SpinPopup :is-open="isSpinPopupOpen" @close="closeSpinPopup" />
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
