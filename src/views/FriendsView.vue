<script setup lang="ts">
import { CoinIcon } from '@/assets/icons'
import { ref, onMounted } from 'vue'
import WebApp from '@twa-dev/sdk'

const userId = ref<number | null>(null)

const referralLink = ref<string | null>(null)
const copied = ref(false)

function copyLink(e: Event) {
  e.preventDefault()
  navigator.clipboard.writeText(referralLink.value as string).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  })
}

onMounted(() => {
  userId.value = WebApp.initDataUnsafe.user?.id as number
  if (userId.value) {
    referralLink.value = `https://t.me/brunoearning/${userId.value}`
  } else {
    referralLink.value = 'No referral link available'
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col p-4 gap-6 pb-24 pt-8 bg-[#364B4B]">
    <h1 class="text-center text-2xl font-bold text-white">Invite and earn!</h1>

    <div
      class="flex flex-col gap-2 overflow-y-scroll scrollbar-hide"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-xs text-white font-extrabold">Your referral link</h1>
        <form class="w-full flex gap-2" @submit="copyLink">
          <input
            type="text"
            disabled
            :value="referralLink"
            class="bg-[#FAC487] border border-[#000] px-2 flex-1 text-xs font-extrabold"
          />
          <button
            type="submit"
            class="bg-[#DAC7C0] text-[#000] font-extrabold px-4 py-2 cursor-pointer border border-[#000] flex items-center justify-center min-w-[75px]"
          >
            <span v-if="!copied">Copy</span>
            <span v-else>&check;</span>
          </button>
        </form>
      </div>

      <h1 class="text-center text-white font-semibold">Earnings from referrals: 0 coins</h1>

      <div class="p-4 flex gap-4 bg-[#FAC487] border justify-between">
        <div class="flex flex-col gap-1">
          <h1 class="font-semibold text-black">Your referrals’ upgrades</h1>
          <ul class="text-sm font-semibold text-[#17212B]">
            <li>No referral upgrades yet</li>
          </ul>
        </div>

        <h1 class="font-semibold text-black">Total referrals: 0</h1>
      </div>

      <div class="p-4 bg-[#FAC487] border mt-2">
        <h1 class="font-semibold text-black">Total referrals: 0</h1>

        <div class="flex flex-col gap-2 mt-2">
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 2</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">195</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 3</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">274</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 4</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">1034</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 5</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">1607</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 6</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">2317</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 7</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">3375</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 8</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">5197</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 9</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">9083</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 10</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">12095</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 11</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">13533</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 12</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">15440</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 13</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">16647</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]">
            <p>Level 14</p>
            <div class="flex items-center gap-1">
              <p class="text-black font-bold">38251</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-semibold text-[#17212B]"></div>
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
