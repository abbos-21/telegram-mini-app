<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import WebApp from '@twa-dev/sdk'
import { toast } from 'vue3-toastify'

import { taskService } from '@/api/taskService'
import type { ApiError } from '@/api/types'

import { ChevronIcon } from '@/assets/icons/winter'
import { CoinImage, TaskImage } from '@/assets/images/winter'
import LoaderComponent from '@/components/LoaderComponent.vue'
// import { AdsgramTask } from '@adsgram/vue'

// const isUserBiggie = inject('isUserBiggie')
const loading = ref(false)
const error = ref<ApiError | null>(null)

const tasks = ref<string[]>([]) // active tasks
const allTasks = ref<string[]>([]) // completed tasks

const subscribedChannels = ref<Set<string>>(new Set())
const processingChannel = ref<string | null>(null)

const openedTask = ref<string | null>(null)

/* -------------------- api -------------------- */
const fetchTasks = async () => {
  const res = await taskService.getTasks()
  tasks.value = res.data.tasks
}

const fetchAllTasks = async () => {
  const res = await taskService.getAllTasks()
  allTasks.value = res.data.tasks
}

const mountFetch = async () => {
  try {
    loading.value = true
    await Promise.all([fetchTasks(), fetchAllTasks()])
  } catch (err) {
    console.error(err)
    toast.error('Failed to load tasks')
  } finally {
    loading.value = false
  }
}

/* -------------------- computed: sorted tasks -------------------- */
const activeTasksSorted = computed(() => {
  return [...tasks.value].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
})

const completedTasksSorted = computed(() => {
  return [...allTasks.value].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
})

// Optional: uncomment and customize if you want to show only specific channels

const allowedChannels = [
  '@CoinUPuz',
  '@coinup_projects',

  '@zrbtua',
  '@perviu1million',
  '@tmton',
  '@TON_Elixir',
  '@Crypto_Meteora',
  '@CryptoZaryad',
  '@kopee4ka_k_kopee4ke1',
  '@cryptomaxbablo',
  '@Hamsters_APProach',
  '@bronia_tg',

  '@cryptoproject25',
  '@nekro_ton',
  '@marsiklovw',
  '@bydvtemesdenchicom',
  '@OlegAleksenko1988',
  '@Crypt0Hud',
  '@criptodro',
  '@lopsamff',
  '@cryptcharmer',
]

const filteredActiveTasks = computed(() => {
  return activeTasksSorted.value.filter((channel) => allowedChannels.includes(channel))
})

const filteredCompletedTasks = computed(() => {
  return completedTasksSorted.value.filter((channel) => allowedChannels.includes(channel))
})

/* -------------------- actions -------------------- */
const toggle = (channel: string) => {
  openedTask.value = openedTask.value === channel ? null : channel
}

const openChannel = (channel: string) => {
  const username = channel.replace('@', '')
  const url = `https://t.me/${username}`

  if (WebApp.openTelegramLink) {
    WebApp.openTelegramLink(url)
  } else {
    WebApp.openLink(url)
  }

  subscribedChannels.value = new Set(subscribedChannels.value).add(channel)
}

const checkSubscription = async (channel: string) => {
  processingChannel.value = channel
  try {
    const res = await taskService.checkSubscription(channel)
    toast.success(res?.message || 'Verified!')
  } catch (err) {
    error.value = err as ApiError
    subscribedChannels.value.delete(channel)
    toast.error((err as ApiError).response?.data?.message || 'Check failed')
  } finally {
    processingChannel.value = null
    await mountFetch()
  }
}

const taskImages: Record<string, string> = {
  '@CoinUPuz': '/CoinUPuz.jpg',
  '@coinup_projects': '/coinup_projects.jpg',

  '@zrbtua': '/zrbtua.jpg',
  '@perviu1million': '/perviu1million.jpg',
  '@tmton': '/tmton.jpg',
  '@TON_Elixir': '/TON_Elixir.jpg',
  '@Crypto_Meteora': '/Crypto_Meteora.jpg',
  '@CryptoZaryad': '/CryptoZaryad.jpg',
  '@kopee4ka_k_kopee4ke1': '/kopee4ka_k_kopee4ke1.jpg',
  '@cryptomaxbablo': '/cryptomaxbablo.jpg',
  '@Hamsters_APProach': '/Hamsters_APProach.jpg',
  '@bronia_tg': '/bronia_tg.jpg',

  '@cryptoproject25': '/cryptoproject25.jpg',
  '@nekro_ton': '/nekro_ton.jpg',
  '@marsiklovw': '/marsiklovw.jpg',
  '@bydvtemesdenchicom': '/bydvtemesdenchicom.jpg',
  '@OlegAleksenko1988': '/OlegAleksenko1988.jpg',
  '@Crypt0Hud': '/Crypt0Hud.jpg',
  '@criptodro': '/criptodro.jpg',
  '@lopsamff': '/lopsamff.jpg',
  '@cryptcharmer': '/cryptcharmer.jpg',
}

// Fallback image when no specific one is found
const fallbackTaskImage = TaskImage

// Helper to get correct image per channel
const getTaskImage = (channel: string) => {
  return taskImages[channel] || fallbackTaskImage
}

// TASK AD
// const handleReward = () => {
//   toast.success('10 coins have been successfully added to your balance!')
// }

// const handleError = (event: CustomEvent<string>) => {
//   console.error('Task error:', event.detail)
// }

// const rawHtml = ref<string>(
//   "<span slot='reward' style='font-size: 14px; display: flex; align-items: center; gap: 4px;'><img src='/coin.png' style='width: 16px; height: 16px;' alt='coin-image' />10</span><div slot='button' style='background-color: #00bc7d; color: white; border-radius: 6px; padding: 4px 0; font-weight: bold;'>Go</div><div slot='claim' style='background-color: #ffac33; color: white; border-radius: 6px; padding: 4px 0; font-weight: bold;'>Claim</div><div slot='done' style='background-color: #00b8db; color: white; border-radius: 6px; padding: 4px 0; font-weight: bold;'>Done</div>",
// )

onMounted(async () => {
  await mountFetch()
})
</script>

<template>
  <LoaderComponent v-if="loading" />

  <div class="my-4 flex flex-col gap-4 overflow-y-scroll scrollbar-hide">
    <!-- ADSGRAM TASK -->
    <!-- eslint-disable -->
    <!-- <AdsgramTask
      v-if="!isUserBiggie"
      blockId="task-19654"
      :debug="false"
      class="task"
      :onReward="handleReward"
      :onError="handleError"
      v-html="rawHtml"
    /> -->

    <!-- ACTIVE TASKS (sorted) -->
    <div
      v-for="channel in filteredActiveTasks"
      :key="channel"
      class="bg-[rgba(179,223,220,0.75)] rounded-xl p-2 text-neutral-600"
    >
      <button
        type="button"
        class="w-full flex items-center justify-between gap-3 min-w-0"
        @click="toggle(channel)"
      >
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <img :src="getTaskImage(channel)" class="w-12 rounded-lg shrink-0" />
          <h1 class="font-bold text-start truncate">Join {{ channel }}</h1>
        </div>

        <div class="flex gap-4 items-center shrink-0">
          <div
            class="flex gap-1 items-center rounded-full bg-[#FFAC33] px-2 py-px whitespace-nowrap"
          >
            <img :src="CoinImage" class="w-6" />
            <span class="font-bold text-sm">20</span>
          </div>

          <ChevronIcon
            class="w-4 transition-transform shrink-0"
            :class="openedTask === channel ? 'rotate-180' : ''"
          />
        </div>
      </button>

      <!-- COLLAPSE -->
      <div
        class="overflow-hidden transition-all duration-300"
        :style="{
          maxHeight: openedTask === channel ? '200px' : '0',
          opacity: openedTask === channel ? '1' : '0',
        }"
      >
        <div class="pt-2">
          <div class="w-full h-px bg-black"></div>

          <p class="mt-2 text-sm font-medium">
            Subscribe to <span class="text-black">{{ channel }}</span> channel
          </p>

          <div class="mt-3 flex justify-between gap-2">
            <button
              @click="openChannel(channel)"
              :disabled="subscribedChannels.has(channel)"
              class="w-1/2 rounded-full bg-sky-500 py-1 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed!"
            >
              Complete
            </button>

            <button
              @click="checkSubscription(channel)"
              :disabled="processingChannel === channel"
              class="w-1/2 rounded-full bg-white py-1 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed!"
            >
              {{ processingChannel === channel ? 'Checking...' : 'Check' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- COMPLETED TASKS (sorted) -->
    <div
      v-for="channel in filteredCompletedTasks"
      :key="channel"
      class="bg-[rgba(179,223,220,0.75)] rounded-xl p-2 opacity-75 text-neutral-600"
    >
      <div class="flex items-center justify-between gap-3 min-w-0">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <img :src="getTaskImage(channel)" class="w-12 shrink-0 rounded-lg" />
          <h1 class="font-bold truncate">
            {{ channel }}
          </h1>
        </div>

        <button
          disabled
          class="shrink-0 rounded-full bg-white px-4 py-1 font-bold whitespace-nowrap"
        >
          Subscribed
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
