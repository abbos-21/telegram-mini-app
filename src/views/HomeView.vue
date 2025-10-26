<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
// import { userService } from '@/api/userService'
import type { User } from '@/api/types'
import ProgressBar from '@/components/ProgressBar.vue'

const user = ref<User | null>(null)
const isBottlePopupOpen = ref(false)
const isSpinPopupOpen = ref(false)
const tempCoins = ref<number>(0)

// const getUserData = async () => {
//   const response = await userService.getCurrentUser()
//   user.value = response.data
// }

let miningIntervalId: number | null = null

const startMining = async () => {
  if (miningIntervalId !== null) {
    clearInterval(miningIntervalId)
  }

  const response = await gameService.mine()
  const fixedTempCoins = response.data.tempCoins.toFixed(2)
  tempCoins.value = +fixedTempCoins
  user.value = response.data

  miningIntervalId = setInterval(() => {
    tempCoins.value += 0.01
  }, 1000)
}

const collectCoins = async () => {
  await gameService.collect()
  await startMining()
}

const openBottlePopup = () => (isBottlePopupOpen.value = true)
const closeBottlePopup = () => (isBottlePopupOpen.value = false)
const openSpinPopup = () => (isSpinPopupOpen.value = true)
const closeSpinPopup = () => (isSpinPopupOpen.value = false)

// import { socket } from '@/api/socket'

// const connectionStatus = ref<string>('Connecting...')

// const EVENT_NAME = 'tempCoinsUpdate'

// const handleCounterUpdate = (value: number) => {
//   tempCoins.value = value
// }

// const miningLoop = async () => {
//   try {
//     await startMining()
//   } catch (err) {
//     console.log('Mining loop error: ', err)
//   } finally {
//     setTimeout(miningLoop, 1000)
//   }
// }

onMounted(async () => {
  await startMining()

  // if (socket.connected) {
  //   connectionStatus.value = 'Connected ✅'
  // }

  // socket.on(EVENT_NAME, handleCounterUpdate)

  // socket.on('connect', () => {
  //   connectionStatus.value = 'Connected ✅'
  // })
  // socket.on('disconnect', () => {
  //   connectionStatus.value = 'Disconnected 🛑'
  // })
})

// onUnmounted(() => {
//   socket.off(EVENT_NAME, handleCounterUpdate)
// })
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

      <!-- <RouterLink to="/counter">Counter</RouterLink> -->

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
        <div class="w-[200px]">
          <ProgressBar :current-value="+tempCoins.toFixed(2)" :max-value="120" :min-value="0" />
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
