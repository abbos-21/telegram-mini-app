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
    >
      <div
        v-for="(channel, index) in tasks"
        :key="index"
        class="flex justify-between items-center bg-[#fff] rounded-lg px-3 py-1"
      >
        <div class="flex gap-3 items-center">
          <img :src="TelegramImage" alt="task" class="w-12 h-12" />

          <div class="flex flex-col justify-between items-start">
            <p class="font-bold">{{ channel }}</p>

            <div class="flex gap-1 items-center">
              <CoinIcon class="w-4 h-4" />
              <p class="text-sm font-bold">100</p>
            </div>
          </div>
        </div>

        <a
          :href="`https://t.me/${channel.slice(1)}`"
          target="_blank"
          class="subscribe-button bg-[#D9D9D9] border border-[#000] text-[#17212B] px-2 py-1 rounded-sm cursor-pointer flex justify-center items-center"
        >
          Subscribe
        </a>
      </div>
    </div>
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
