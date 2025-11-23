<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGame } from '@/composables/useGame'

import { runChainUntilSuccess } from '@/utils/chainFunction'

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
import { useAdsgram } from '@adsgram/vue'
import { toast } from 'vue3-toastify'
import { useNavigate } from '@/composables/useNavigate'
import { useOrchestrator, type OrchestratorTask } from '@/composables/useOrchestrator'
import WebApp from '@twa-dev/sdk'

const biggies = [5035538171, 1031081189, 352641904, 1701438929]
const currentUserTelegramId = WebApp.initDataUnsafe.user?.id

function runIfUserIsNotBiggie(callback: () => void) {
  if (biggies.includes(currentUserTelegramId as number)) return
  callback()
}

const blockId = import.meta.env.VITE_BLOCK_ID
const spinBlockId = import.meta.env.VITE_SPIN_BLOCK_ID
const collectBlockId = import.meta.env.VITE_COLLECT_BLOCK_ID
const withdrawalBlockId = import.meta.env.VITE_WITHDRAWAL_BLOCK_ID
const bottleBlockId = import.meta.env.VITE_BOTTLE_BLOCK_ID

const interstitialAds = useAdsgram({ blockId })
const spinAds = useAdsgram({ blockId: spinBlockId })
const collectAds = useAdsgram({ blockId: collectBlockId })
const withdrawalAds = useAdsgram({ blockId: withdrawalBlockId })
const bottleAds = useAdsgram({ blockId: bottleBlockId })

const tasks: OrchestratorTask[] = [
  {
    name: 'Interstitial',
    probability: 25,
    fn: () => interstitialAds.show(),
  },
  {
    name: 'Spin',
    probability: 75,
    fn: () => spinAds.show(),
  },
]

const { run } = useOrchestrator(tasks)

// addEventListener('onBannerNotFound', () => {
//   console.log('No ad available at the moment')
// })
// addEventListener('onTooLongSession', () => {
//   console.log('User session too long — ad not available')
// })

const { user, mine, collect, sync, getUserData } = useGame()
const isBottlePopupOpen = ref(false)
const isSpinPopupOpen = ref(false)

const openBottlePopup = () => (isBottlePopupOpen.value = true)
const closeBottlePopup = () => (isBottlePopupOpen.value = false)
const openSpinPopup = () => (isSpinPopupOpen.value = true)
const closeSpinPopup = () => (isSpinPopupOpen.value = false)

// const syncLoop = async () => {
//   try {
//     await sync()
//   } catch (err) {
//     console.log('Sync error: ', err)
//   } finally {
//     setTimeout(syncLoop, 5000)
//   }
// }

const { goTo } = useNavigate()

onMounted(async () => {
  if (currentUserTelegramId === 1031081189) {
    alert('Hey, you must be the admin!')
  }

  const functionChain = [sync, mine, getUserData]

  await runChainUntilSuccess(functionChain)

  if (user.value?.healthLevel === 0) {
    toast.info('Health 0, coins burned')
  }

  // setTimeout(syncLoop, 5000)
})
</script>

<template>
  <div
    class="h-full w-full flex flex-col relative bg-cover bg-center bg-no-repeat p-2 gap-4 justify-between pb-24"
    :style="{ backgroundImage: `url(${HomeBgImage})` }"
  >
    <div class="flex justify-between items-start">
      <button
        type="button"
        class="flex items-center p-2 px-3 bg-[#FAC487] gap-2 border border-[#000] rounded-full cursor-pointer"
        @click="
          () => {
            runIfUserIsNotBiggie(() => withdrawalAds.show())
            goTo('/widthdraw')
          }
        "
      >
        <CoinIcon class="w-6" />
        <p class="font-bold">{{ user?.coins.toFixed(2) ?? 0 }}</p>
        <WidthdrawIcon class="ms-1 mt-1 w-7" />
      </button>

      <div class="flex flex-col gap-2 items-end">
        <div
          class="flex items-center justify-center p-2 px-3 bg-[#FAC487] border border-[#000] rounded-full"
        >
          <p class="font-bold">Your level: {{ user?.level ?? 0 }}</p>
        </div>

        <button
          class="flex items-center justify-center bg-[#FAC487] border border-[#000] pe-2 ps-px rounded-full cursor-pointer"
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
      <button
        type="button"
        class="cursor-pointer"
        @click="
          () => {
            openBottlePopup()
            runIfUserIsNotBiggie(() => bottleAds.show())
          }
        "
      >
        <img :src="BottleImage" class="w-12" />
      </button>

      <button
        type="button"
        class="cursor-pointer"
        @click="
          () => {
            openSpinPopup()
            run()
          }
        "
      >
        <img :src="SpinImage" class="w-12" />
      </button>
    </div>

    <div class="flex justify-center items-center">
      <button
        type="button"
        @click="
          () => {
            collect()
            runIfUserIsNotBiggie(() => collectAds.show())
          }
        "
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
