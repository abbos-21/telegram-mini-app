<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TelegramImage } from '@/assets/images'
import { CoinIcon } from '@/assets/icons'
import { taskService } from '@/api/taskService'
import type { ApiError } from '@/api/types'
import { toast } from 'vue3-toastify'
import LoaderComponent from '@/components/LoaderComponent.vue'

const error = ref<ApiError | null>(null)
const loading = ref<boolean>(false)
const tasks = ref<string[] | null>(null)
const buttonClicked = ref<boolean>(false)

const fetchTasks = async () => {
  try {
    loading.value = true
    const response = await taskService.getTasks()
    tasks.value = response.data.tasks
  } catch (err) {
    error.value = err as ApiError
    toast.error(error.value.response.data.message)
  } finally {
    loading.value = false
  }
}

const checkSubscription = async (channel: string | null) => {
  try {
    const response = await taskService.checkSubscription(channel)
    toast.success(response?.message)
  } catch (err) {
    error.value = err as ApiError
    toast.error(error.value.response.data.message)
  } finally {
    buttonClicked.value = false
    await fetchTasks()
  }
}

onMounted(async () => {
  await fetchTasks()
})
</script>

<template>
  <LoaderComponent v-if="loading" />
  <div class="h-full w-full flex flex-col p-4 pt-6 gap-6 pb-24 bg-[#364B4B]">
    <h1 class="text-center text-2xl font-bold text-white">Tasks</h1>

    <div
      class="flex flex-col gap-4 overflow-y-scroll scrollbar-hide"
      style="scrollbar-width: none; -ms-overflow-style: none"
      v-if="tasks?.length"
    >
      <div
        v-for="(channel, index) in tasks"
        :key="index"
        class="flex justify-between gap-4 items-center bg-[#fff] rounded-lg px-3 py-1"
      >
        <div class="flex gap-3 items-center flex-1 min-w-0">
          <img :src="TelegramImage" alt="task" class="w-12 h-12 flex-shrink-0" />

          <div class="flex flex-col justify-between items-start flex-1 min-w-0">
            <p class="font-bold truncate w-full">{{ channel }}</p>

            <div class="flex gap-1 items-center">
              <CoinIcon class="w-4 h-4 flex-shrink-0" />
              <p class="text-sm font-bold">100</p>
            </div>
          </div>
        </div>

        <a
          v-if="!buttonClicked"
          @click="buttonClicked = true"
          :href="`https://t.me/${channel.slice(1)}`"
          class="bg-[#D9D9D9] border border-[#000] text-[#17212B] px-2 py-1 rounded-sm cursor-pointer flex justify-center items-center whitespace-nowrap text-sm font-medium"
        >
          Subscribe
        </a>

        <button
          v-if="buttonClicked"
          type="button"
          @click="checkSubscription(channel)"
          class="bg-[#D9D9D9] border border-[#000] text-[#17212B] px-2 py-1 rounded-sm cursor-pointer flex justify-center items-center whitespace-nowrap text-sm font-medium"
        >
          Check
        </button>
      </div>
    </div>

    <div v-else class="text-center">No tasks available</div>
  </div>
</template>

<style scoped>
.subscribe-button {
  font-family: 'Lalezar', sans-serif;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
