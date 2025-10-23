<script setup lang="ts">
import { WalletImage } from '@/assets/images'
</script>

<template>
  <div class="bg-[#364B4B] w-full h-full pb-24 p-4 flex flex-col gap-4">
    <h1 class="text-2xl text-white font-bold text-center">Transaction History</h1>

    <div
      class="p-4 flex flex-col gap-4 bg-[#475a5a] rounded-md flex-1 overflow-y-scroll scrollbar-hide"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <div class="p-2 px-3 bg-[#d9d9d9] rounded-lg font-semibold text-xs">
        <p>
          The withdrawal processing time is up to 48 hours.
          <br /><br />
          Share your payout in our chat, and celebrate your success with other players.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <div class="bg-[#556666] rounded-2xl border p-2 flex justify-between items-center">
          <div class="flex gap-2 items-center">
            <img :src="WalletImage" class="w-6" alt="" />

            <div class="text-xs text-white font-semibold flex flex-col gap-px items-start">
              <p>
                TON withdrawal to <br />
                UQA9...aeuG
              </p>

              <p class="text-[#ffd983]">Open TX</p>

              <p>18/10/2025, 14:13:41</p>
            </div>
          </div>

          <p class="font-semibold text-[#FFD983] text-sm">
            -0.1 <br />
            TON
          </p>
        </div>

        <div class="bg-[#556666] rounded-2xl border p-2 flex justify-between items-center">
          <div class="flex gap-2 items-center">
            <img :src="WalletImage" class="w-6" alt="" />

            <div class="text-xs text-white font-semibold flex flex-col gap-px items-start">
              <p>
                TON withdrawal to <br />
                UQA9...aeuG
              </p>

              <p class="text-[#ffd983]">Open TX</p>

              <p>18/10/2025, 14:13:41</p>
            </div>
          </div>

          <p class="font-semibold text-[#FFD983] text-sm">
            -0.1 <br />
            TON
          </p>
        </div>

        <RouterLink to="/widthdraw" class="text-center text-white underline text-sm font-semibold">
          Go Back
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
