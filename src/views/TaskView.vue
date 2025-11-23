<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TelegramImage } from '@/assets/images'
import { CoinIcon } from '@/assets/icons'
import { taskService } from '@/api/taskService'
import type { ApiError } from '@/api/types'
import { toast } from 'vue3-toastify'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { AdsgramTask } from '@adsgram/vue'

const error = ref<ApiError | null>(null)
const loading = ref<boolean>(false)
const tasks = ref<string[] | null>(null)
const allTasks = ref<string[] | null>(null)
const subscribedChannels = ref<Set<string>>(new Set())
const processingChannel = ref<string | null>(null)

const tg = window.Telegram?.WebApp

onMounted(() => {
  tg?.ready()
  tg?.expand()
  mountFetch()
})

const fetchAllTasks = async () => {
  try {
    const response = await taskService.getAllTasks()
    allTasks.value = response.data.tasks
  } catch (err) {
    console.log(err)
  }
}

const fetchTasks = async () => {
  try {
    const response = await taskService.getTasks()
    tasks.value = response.data.tasks
  } catch (err) {
    // error.value = err as ApiError
    // toast.error((err as ApiError).response?.data?.message || 'Failed to load tasks')
    console.log(err)
  }
}

const mountFetch = async () => {
  try {
    loading.value = true
    await fetchAllTasks()
    await fetchTasks()
  } catch (err) {
    console.log(err)
    toast.error('Failed to load tasks')
  } finally {
    loading.value = false
  }
}

const openChannel = (channel: string) => {
  const username = channel.slice(1)
  const url = `https://t.me/${username}`

  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url)
  } else {
    tg?.openLink(url)
  }

  subscribedChannels.value = new Set(subscribedChannels.value).add(channel)
}

const checkSubscription = async (channel: string) => {
  processingChannel.value = channel
  try {
    const response = await taskService.checkSubscription(channel)
    toast.success(response?.message || 'Verified!')
  } catch (err) {
    error.value = err as ApiError
    toast.error((err as ApiError).response?.data?.message || 'Check failed')
  } finally {
    processingChannel.value = null
    await mountFetch()
  }
}
</script>

<template>
  <LoaderComponent v-if="loading" />
  <div class="h-full w-full flex flex-col p-4 pt-6 gap-6 pb-24 bg-[#364B4B]">
    <h1 class="text-center text-2xl font-bold text-white">Tasks</h1>

    <div
      class="flex flex-col gap-4 overflow-y-scroll scrollbar-hide"
      style="scrollbar-width: none; -ms-overflow-style: none"
      v-if="tasks?.length || allTasks?.length"
    >
      <AdsgramTask block-id="task-18086" class="adsgram-task" data-debug="true">
        <!-- LEFT SIDE: icon + text -->
        <template #left>
          <div class="flex gap-3 items-center flex-1 min-w-0">
            <img :src="TelegramImage" alt="task" class="w-10 h-10 shrink-0" />

            <div class="flex flex-col justify-between items-start flex-1 min-w-0">
              <p class="font-bold truncate w-full">Adsgram Task</p>

              <div class="flex gap-1 items-center">
                <CoinIcon class="w-4 h-4 flex-shrink-0" />
                <p class="text-sm font-bold">100</p>
              </div>
            </div>
          </div>
        </template>

        <!-- ACTION BUTTON (show ad / go) -->
        <template #button="{ show }">
          <button @click="show" class="task-button">Go</button>
        </template>

        <!-- CLAIM BUTTON -->
        <template #claim="{ claim }">
          <button @click="claim" class="task-button_claim">Claim</button>
        </template>

        <!-- DONE BUTTON -->
        <template #done>
          <button disabled class="task-button_done">Done</button>
        </template>
      </AdsgramTask>

      <div
        v-for="(channel, index) in tasks"
        :key="index"
        class="flex justify-between gap-4 items-center bg-[#fff] rounded-lg px-3 py-1"
      >
        <div class="flex gap-3 items-center flex-1 min-w-0">
          <img :src="TelegramImage" alt="task" class="w-10 h-10 shrink-0" />

          <div class="flex flex-col justify-between items-start flex-1 min-w-0">
            <p class="font-bold truncate w-full">{{ channel }}</p>

            <div class="flex gap-1 items-center">
              <CoinIcon class="w-4 h-4 flex-shrink-0" />
              <p class="text-sm font-bold">20</p>
            </div>
          </div>
        </div>

        <button
          v-if="!subscribedChannels.has(channel)"
          @click="openChannel(channel)"
          class="subscribe-button bg-[#D9D9D9] border border-[#000] text-[#17212B] px-2 py-1 rounded-sm cursor-pointer flex justify-center items-center whitespace-nowrap text-sm font-medium transition-all hover:bg-[#c0c0c0]"
        >
          Subscribe
        </button>

        <button
          v-else-if="processingChannel !== channel"
          @click="checkSubscription(channel)"
          class="subscribe-button bg-[#D9D9D9] border border-[#000] text-[#17212B] px-2 py-1 rounded-sm cursor-pointer flex justify-center items-center whitespace-nowrap text-sm font-medium transition-all hover:bg-[#c0c0c0]"
        >
          Check
        </button>

        <button
          v-else
          disabled
          class="subscribe-button bg-[#D9D9D9] border border-[#000] text-[#17212B] px-2 py-1 rounded-sm opacity-70 cursor-not-allowed flex justify-center items-center whitespace-nowrap text-sm font-medium"
        >
          Checking...
        </button>
      </div>

      <div
        v-for="(channel, index) in allTasks"
        :key="index"
        class="flex justify-between gap-4 items-center bg-[#fff] rounded-lg px-3 py-1 opacity-70"
      >
        <div class="flex gap-3 items-center flex-1 min-w-0">
          <img :src="TelegramImage" alt="task" class="w-10 h-10 shrink-0" />

          <div class="flex flex-col justify-between items-start flex-1 min-w-0">
            <p class="font-bold truncate w-full">{{ channel }}</p>

            <div class="flex gap-1 items-center">
              <CoinIcon class="w-4 h-4 flex-shrink-0" />
              <p class="text-sm font-bold">20</p>
            </div>
          </div>
        </div>

        <button
          disabled
          type="button"
          class="subscribe-button bg-[#D9D9D9] border border-[#000] text-[#17212B] px-2 py-1 rounded-sm cursor-pointer flex justify-center items-center whitespace-nowrap text-sm font-medium"
        >
          Subscribed
        </button>
      </div>
    </div>

    <div v-else class="text-center text-white">No tasks available</div>
  </div>
</template>

<style scoped>
.adsgram-task {
  background: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #000;
}

/* main buttons */
.task-button,
.task-button_claim,
.task-button_done {
  font-family: 'Lalezar', sans-serif;
  background: #d9d9d9;
  border: 1px solid #000;
  color: #17212b;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: 0.15s;
}

.task-button:hover,
.task-button_claim:hover {
  background: #c0c0c0;
}

/* done state */
.task-button_done {
  opacity: 0.6;
  cursor: not-allowed;
}

.subscribe-button {
  font-family: 'Lalezar', sans-serif;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
