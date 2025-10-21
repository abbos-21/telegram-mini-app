<script setup lang="ts">
import { ref } from 'vue'
import { SpinImage } from '@/assets/images'
import { CoinIcon } from '@/assets/icons'

const items = ref(
  Array.from({ length: 6 }, (_, i) => ({
    title: `Bruno Earning ${i + 1}`,
    amount: 100,
  })),
)
</script>

<template>
  <div class="h-full w-full flex flex-col p-4 pt-6 gap-6 pb-24 bg-[#364B4B]">
    <h1 class="text-center text-2xl font-bold text-white">Tasks</h1>

    <!-- <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center bg-[#fff] rounded-lg px-3 py-1">
        <div class="flex gap-3 items-center">
          <img :src="SpinImage" alt="task" class="w-12 h-12" />

          <div class="flex flex-col justify-between items-start">
            <p class="font-bold">Bruno Earning</p>

            <div class="flex gap-1 items-center">
              <CoinIcon class="w-4 h-4" />
              <p class="text-sm font-bold">100</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="bg-[#D9D9D9] border border-[#000] text-[#17212B] px-2 py-1 rounded-sm cursor-pointer flex justify-center items-center"
          style="font-family: 'Lalezar', sans-serif"
        >
          Subscribe
        </button>
      </div>
    </div> -->

    <div
      class="flex flex-col gap-4 overflow-y-scroll scrollbar-hide"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex justify-between items-center bg-[#fff] rounded-lg px-3 py-1"
      >
        <div class="flex gap-3 items-center">
          <img :src="SpinImage" alt="task" class="w-12 h-12" />

          <div class="flex flex-col justify-between items-start">
            <p class="font-bold">{{ item.title }}</p>

            <div class="flex gap-1 items-center">
              <CoinIcon class="w-4 h-4" />
              <p class="text-sm font-bold">{{ item.amount }}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="bg-[#D9D9D9] border border-[#000] text-[#17212B] px-2 py-1 rounded-sm cursor-pointer flex justify-center items-center"
          style="font-family: 'Lalezar', sans-serif"
        >
          Subscribe
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
