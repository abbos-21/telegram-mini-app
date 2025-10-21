<script setup lang="ts">
import { CoinIcon, MealIcon, MoneyBagIcon, PostBuildingIcon } from '@/assets/icons'
import { ImmuneImage, ShopBgImage } from '@/assets/images'
</script>

<template>
  <div
    class="h-full w-full flex flex-col relative bg-cover bg-center bg-no-repeat p-4 gap-4 pb-24"
    :style="{ backgroundImage: `url(${ShopBgImage})` }"
  >
    <div class="flex justify-between items-center">
      <div
        class="flex items-center gap-2 bg-[#FAC487] border border-[#000] py-2 px-4 rounded-[25px]"
      >
        <CoinIcon class="w-5" />
        <span class="font-bold">0</span>
      </div>

      <div
        class="flex items-center gap-2 bg-[#FAC487] border border-[#000] py-2 px-4 rounded-[25px]"
      >
        <span class="font-bold">Your level: 1</span>
      </div>
    </div>

    <div
      class="flex flex-col gap-4 overflow-y-scroll scrollbar-hide"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <div class="p-4 bg-[rgba(35,44,57,0.9)] rounded-[5px] border-2 border-[#17212B]">
        <div class="flex gap-2 items-start">
          <div
            class="bg-[#fff] border border-[#CBCBCB] rounded-[10px] w-14 h-14 flex justify-center items-center"
          >
            <MoneyBagIcon class="w-8" />
          </div>

          <div class="flex-1">
            <div class="flex justify-between">
              <p class="text-[#fff]">
                <span class="uppercase font-bold text-lg">wealth</span> - Coin capacity
              </p>

              <div
                class="bg-[#fff] border border-[#CBCBCB] rounded-[5px] flex items-center justify-center px-1"
              >
                <p class="font-bold text-sm">
                  Lvl. <span class="text-[#3C863C]">0</span> /
                  <span class="text-[#F79423]">13</span>
                </p>
              </div>
            </div>

            <span class="bg-[#fff] rounded-[5px] p-px px-1 text-xs font-medium"
              >Capacity: 60 -> 80</span
            >

            <p class="text-xs text-[#fff] mt-1 font-medium">
              Increase coin storage to accumulate more before collecting.
            </p>
          </div>
        </div>

        <div class="flex justify-center items-center mt-4">
          <button
            type="button"
            class="bg-[#FAC487] uppercase cursor-pointer font-semibold py-1 px-12 rounded-full"
          >
            upgrade level
          </button>
        </div>
      </div>

      <div class="p-4 bg-[rgba(35,44,57,0.9)] rounded-[5px] border-2 border-[#17212B]">
        <div class="flex gap-2 items-start">
          <div
            class="bg-[#fff] border border-[#CBCBCB] rounded-[10px] w-14 h-14 flex justify-center items-center"
          >
            <PostBuildingIcon class="w-8" />
          </div>

          <div class="flex-1">
            <div class="flex justify-between">
              <p class="text-[#fff]">
                <span class="uppercase font-bold text-lg">work</span> - Coin mining
              </p>

              <div
                class="bg-[#fff] border border-[#CBCBCB] rounded-[5px] flex items-center justify-center px-1"
              >
                <p class="font-bold text-sm">
                  Lvl. <span class="text-[#3C863C]">0</span> /
                  <span class="text-[#F79423]">13</span>
                </p>
              </div>
            </div>

            <span class="bg-[#fff] rounded-[5px] p-px px-1 text-xs font-medium"
              >Income: 0.01/sec -> 0.02/sec</span
            >

            <p class="text-xs text-[#fff] mt-1 font-medium">
              Increase mining speed to earn more coins per second.
            </p>
          </div>
        </div>

        <div class="flex justify-center items-center mt-4">
          <button
            type="button"
            class="bg-[#FAC487] uppercase cursor-pointer font-semibold py-1 px-12 rounded-full"
          >
            upgrade level
          </button>
        </div>
      </div>

      <div class="p-4 bg-[rgba(35,44,57,0.9)] rounded-[5px] border-2 border-[#17212B]">
        <div class="flex gap-2 items-start">
          <div
            class="bg-[#fff] border border-[#CBCBCB] rounded-[10px] w-14 h-14 flex justify-center items-center"
          >
            <MealIcon class="w-8" />
          </div>

          <div class="flex-1">
            <div class="flex justify-between">
              <p class="text-[#fff]">
                <span class="uppercase font-bold text-lg">food</span> - Energy tank
              </p>

              <div
                class="bg-[#fff] border border-[#CBCBCB] rounded-[5px] flex items-center justify-center px-1"
              >
                <p class="font-bold text-sm">
                  Lvl. <span class="text-[#3C863C]">0</span> /
                  <span class="text-[#F79423]">13</span>
                </p>
              </div>
            </div>

            <span class="bg-[#fff] rounded-[5px] p-px px-1 text-xs font-medium"
              >Work time: 60 min -> 80 min</span
            >

            <p class="text-xs text-[#fff] mt-1 font-medium">
              Increase Energy tank for longer work without refilling.
            </p>
          </div>
        </div>

        <div class="flex justify-center items-center mt-4">
          <button
            type="button"
            class="bg-[#FAC487] uppercase cursor-pointer font-semibold py-1 px-12 rounded-full"
          >
            upgrade level
          </button>
        </div>
      </div>

      <div class="p-4 bg-[rgba(35,44,57,0.9)] rounded-[5px] border-2 border-[#17212B]">
        <div class="flex gap-2 items-start">
          <div
            class="bg-[#fff] border border-[#CBCBCB] rounded-[10px] w-14 h-14 flex justify-center items-center"
          >
            <img :src="ImmuneImage" alt="immune" class="w-10" />
          </div>

          <div class="flex-1">
            <div class="flex justify-between">
              <p class="text-[#fff]">
                <span class="uppercase font-bold text-lg">immune</span> - Immune strength
              </p>

              <div
                class="bg-[#fff] border border-[#CBCBCB] rounded-[5px] flex items-center justify-center px-1"
              >
                <p class="font-bold text-sm">
                  Lvl. <span class="text-[#3C863C]">0</span> /
                  <span class="text-[#F79423]">13</span>
                </p>
              </div>
            </div>

            <span class="bg-[#fff] rounded-[5px] p-px px-1 text-xs font-medium"
              >Withstand diseases: 2 -> 3</span
            >

            <p class="text-xs text-[#fff] mt-1 font-medium">
              Improve disease resistance. Higher level = fewer daily damages.
            </p>
          </div>
        </div>

        <div class="flex justify-center items-center mt-4">
          <button
            type="button"
            class="bg-[#FAC487] uppercase cursor-pointer font-semibold py-1 px-12 rounded-full"
          >
            upgrade level
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
