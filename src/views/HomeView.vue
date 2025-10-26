<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import { CoinIcon, WidthdrawIcon } from '@/assets/icons'
import {
  UkFlagImage,
  MusicImage,
  CollectBgImage,
  BottleImage,
  SpinImage,
  HomeBgImage,
} from '@/assets/images'

import { isMusicEnabled, isMusicAvailable, toggleMusic } from '@/stores/music'
import EnergyLevel from '@/components/EnergyLevel.vue'
import HealthLevel from '@/components/HealthLevel.vue'
import { RouterLink } from 'vue-router'
import BottlePopup from '@/components/BottlePopup.vue'
import SpinPopup from '@/components/SpinPopup.vue'

import { gameService } from '@/api/gameService'
import { userService } from '@/api/userService'
import type { User } from '@/api/types'

const user = ref<User | null>(null)
const isBottlePopupOpen = ref(false)
const isSpinPopupOpen = ref(false)

const getUserData = async () => {
  const response = await userService.getCurrentUser()
  user.value = response.data
}

const startMining = async () => {
  const response = await gameService.mine()
  user.value = response.data
}

const collectCoins = async () => {
  await gameService.collect()
  await getUserData()
}

const openBottlePopup = () => (isBottlePopupOpen.value = true)
const closeBottlePopup = () => (isBottlePopupOpen.value = false)
const openSpinPopup = () => (isSpinPopupOpen.value = true)
const closeSpinPopup = () => (isSpinPopupOpen.value = false)

import { socket } from '@/api/socket'

const tempCoins = ref<number>(0)

const connectionStatus = ref<string>('Connecting...')

const EVENT_NAME = 'tempCoinsUpdate'

const handleCounterUpdate = (value: number) => {
  tempCoins.value = value
}

onMounted(async () => {
  await getUserData()
  await startMining()

  if (socket.connected) {
    connectionStatus.value = 'Connected ✅'
  }

  socket.on(EVENT_NAME, handleCounterUpdate)

  socket.on('connect', () => {
    connectionStatus.value = 'Connected ✅'
  })
  socket.on('disconnect', () => {
    connectionStatus.value = 'Disconnected 🛑'
  })
})

onUnmounted(() => {
  socket.off(EVENT_NAME, handleCounterUpdate)
})
</script>

<template>
  <div
    class="h-full w-full flex flex-col relative bg-cover bg-center bg-no-repeat p-2 gap-4 justify-between pb-24"
    :style="{ backgroundImage: `url(${HomeBgImage})` }"
  >
    <div class="flex justify-between items-start">
      <RouterLink
        to="/widthdraw"
        class="flex items-center p-2 bg-[#FAC487] gap-2 border border-[#000]"
      >
        <CoinIcon class="w-6" />
        <p class="font-bold">{{ user?.coins }}</p>
        <WidthdrawIcon class="ms-1 mt-1 w-7" />
      </RouterLink>

      <RouterLink to="/counter">Counter</RouterLink>

      <div class="flex flex-col gap-2 items-end">
        <div class="flex items-center justify-center p-2 bg-[#FAC487] border border-[#000]">
          <p class="font-bold">Your level: {{ user?.level }}</p>
        </div>

        <button
          class="flex items-center justify-center bg-[#FAC487] border border-[#000] cursor-pointer pe-2"
        >
          <img :src="UkFlagImage" class="w-10 h-10" alt="" />
          <span class="font-bold">EN</span>
        </button>

        <button
          class="cursor-pointer music-button relative"
          :class="{ 'music-disabled': !isMusicEnabled || !isMusicAvailable }"
          @click="toggleMusic"
        >
          <img :src="MusicImage" alt="Music toggle" class="w-15" />
          <div
            v-if="!isMusicEnabled || !isMusicAvailable"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="diagonal-line"></div>
          </div>
        </button>
      </div>
    </div>

    <div>
      <div class="flex justify-center items-center">
        <div class="relative w-[214px] h-[37px]">
          <svg
            width="214"
            height="37"
            viewBox="0 0 214 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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

          <span class="absolute inset-0 flex items-center justify-center font-bold">
            {{ tempCoins }}; {{ user?.tempCoins }}
          </span>
        </div>
      </div>

      <!-- 🚨 Vault full notice
      <p
        v-if="user && user.tempCoins >= user.vaultCapacity"
        class="text-red-600 font-bold text-center mt-2"
      >
        Vault full! Collect your coins to continue mining.
      </p> -->

      <div class="flex justify-between mt-2">
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

    <div class="flex justify-between items-center">
      <button type="button" class="cursor-pointer" @click="openBottlePopup">
        <img :src="BottleImage" class="w-12" />
      </button>

      <button type="button" class="cursor-pointer" @click="openSpinPopup">
        <img :src="SpinImage" class="w-12" />
      </button>
    </div>

    <div class="flex justify-center items-center">
      <button
        type="button"
        @click="collectCoins"
        class="bg-cover bg-center bg-no-repeat pb-1 font-semibold text-2xl cursor-pointer w-[223px] h-[65px]"
        :style="{ backgroundImage: `url(${CollectBgImage})` }"
      >
        Collect
      </button>
    </div>
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
