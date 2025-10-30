<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGame } from '@/composables/useGame'
import { RouterLink } from 'vue-router'

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
import BottlePopup from '@/components/BottlePopup.vue'
import SpinPopup from '@/components/SpinPopup.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const { user, mine, collect, sync, getUserData } = useGame()
const isBottlePopupOpen = ref(false)
const isSpinPopupOpen = ref(false)

const openBottlePopup = () => (isBottlePopupOpen.value = true)
const closeBottlePopup = () => (isBottlePopupOpen.value = false)
const openSpinPopup = () => (isSpinPopupOpen.value = true)
const closeSpinPopup = () => (isSpinPopupOpen.value = false)

const runChainUntilSuccess = async (functions: Array<() => Promise<unknown>>) => {
  for (const func of functions) {
    try {
      await func()
      console.log(`Successfully executed: ${func.name}. Stopping chain.`)
      return
    } catch (error) {
      console.warn(`Function ${func.name} failed. Moving to next function.`, error)
    }
  }

  console.error('FAILURE: All functions in the chain failed to execute successfully.')
}

onMounted(async () => {
  const functionChain = [mine, sync, getUserData]

  await runChainUntilSuccess(functionChain)
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
        <p class="font-bold">{{ user?.coins ?? 0 }}</p>
        <WidthdrawIcon class="ms-1 mt-1 w-7" />
      </RouterLink>

      <div class="flex flex-col gap-2 items-end">
        <div class="flex items-center justify-center p-2 bg-[#FAC487] border border-[#000]">
          <p class="font-bold">Your level: {{ user?.level ?? 0 }}</p>
        </div>

        <button class="flex items-center justify-center bg-[#FAC487] border border-[#000] pe-2">
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
          <ProgressBar
            :current-value="user?.tempCoins ?? 0"
            :max-value="user?.vaultCapacity ?? 100"
            :min-value="0"
          />
        </div>
      </div>

      <div class="flex justify-between mt-2">
        <HealthLevel
          :current-value="user?.currentHealth"
          :max-value="user?.maxHealth"
          color="green"
          size="medium"
          :show-glow="true"
          :animated="true"
        />
        <EnergyLevel
          :current-value="user?.currentEnergy"
          :max-value="user?.maxEnergy"
          color="blue"
          size="medium"
          :show-glow="true"
          :animated="true"
        />
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
        @click="collect"
        :disabled="!user || user.tempCoins < user.vaultCapacity * 0.1"
        class="bg-cover bg-center bg-no-repeat pb-1 font-semibold text-2xl w-[223px] h-[65px]"
        :class="{
          'cursor-not-allowed opacity-50': user && user.tempCoins < user.vaultCapacity * 0.1,
          'cursor-pointer': user && user.tempCoins >= user.vaultCapacity * 0.1,
        }"
        :style="{ backgroundImage: `url(${CollectBgImage})` }"
      >
        Collect
      </button>
    </div>
  </div>

  <BottlePopup :is-open="isBottlePopupOpen" @close="closeBottlePopup" />
  <SpinPopup :is-open="isSpinPopupOpen" @close="closeSpinPopup" />
</template>

<style scoped>
.music-button {
  transition: opacity 0.2s ease;
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
