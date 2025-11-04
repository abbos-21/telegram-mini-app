<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { WalletImage } from '@/assets/images'
import { withdrawService } from '@/api/withdrawService'
import type { Withdrawal } from '@/api/types'
import { RouterLink } from 'vue-router'

const withdrawals = ref<Withdrawal[]>([])
const loading = ref(true)
const error = ref('')

const fetchWithdrawals = async () => {
  try {
    loading.value = true
    const response = await withdrawService.getWithdrawalHistory()
    withdrawals.value = response.data || []
  } catch (err) {
    console.error(err)
    error.value = 'Failed to fetch withdrawal history'
  } finally {
    loading.value = false
  }
}

onMounted(fetchWithdrawals)

const formatDate = (dateStr: string | Date) => {
  const date = new Date(dateStr)
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}
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
        <p v-if="loading" class="text-white text-center">Loading...</p>
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
        <p v-if="!loading && withdrawals.length === 0" class="text-white text-center">
          No withdrawal history yet.
        </p>

        <div
          v-for="withdrawal in withdrawals"
          :key="withdrawal.id"
          class="bg-[#556666] rounded-2xl border p-2 flex justify-between items-center"
        >
          <div class="flex gap-2 items-center">
            <img :src="WalletImage" class="w-6" alt="" />

            <div class="text-xs text-white font-semibold flex flex-col gap-px items-start">
              <p>
                TON withdrawal to <br />
                {{ withdrawal.targetAddress.slice(0, 4) }}...{{
                  withdrawal.targetAddress.slice(-4)
                }}
              </p>

              <p v-if="withdrawal.txHash" class="text-[#ffd983]">
                <a
                  :href="`https://tonscan.io/tx/${withdrawal.txHash}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open TX
                </a>
              </p>
              <p v-else class="text-gray-400">Pending</p>

              <p>{{ formatDate(withdrawal.createdAt) }}</p>
            </div>
          </div>

          <p class="font-semibold text-[#FFD983] text-sm">
            -{{ withdrawal.amountTon }} <br />
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
