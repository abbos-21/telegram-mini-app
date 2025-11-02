<script setup lang="ts">
import { CoinIcon } from '@/assets/icons'
import { ref, onMounted } from 'vue'
import { userService } from '@/api/userService'
import type { User } from '@/api/types'

type ReferralRewardsArray = [string, number][]

const referralLink = ref<string | null>(null)
const referrals = ref<User[] | null>(null)
const totalReferralsCount = ref<number | null>(null)
const referralCounts = ref<Record<number, number>>({})
const referralEarnings = ref<number | null>(null)
const referralRewards = ref<null | ReferralRewardsArray>(null)
const loading = ref<boolean>(false)
const copied = ref(false)

function copyLink(e: Event) {
  e.preventDefault()
  navigator.clipboard.writeText(referralLink.value as string).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  })
}

const getReferralLink = async () => {
  try {
    const response = await userService.getReferralLink()
    referralLink.value = response.data.link
  } catch (err) {
    console.log('Error while getting referral link: ', err)
  }
}

const getReferrals = async () => {
  try {
    const response = await userService.getAllReferrals()
    referrals.value = response.data.referrals as User[]
    totalReferralsCount.value = response.data.count
    referralEarnings.value = response.data.referralEarnings
    referralRewards.value = Object.entries(response.data.referralRewards)

    referralCounts.value = referrals.value.reduce(
      (acc, curr) => {
        acc[curr.level] = (acc[curr.level] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )
  } catch (err) {
    console.log('Error while getting referrals: ', err)
  }
}

const getReferralData = async () => {
  try {
    loading.value = true
    await getReferralLink()
    await getReferrals()
  } catch (err) {
    console.log('Error while getting referral data: ', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getReferralData()
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else class="w-full h-full flex flex-col p-4 gap-6 pb-24 pt-8 bg-[#364B4B]">
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

      <h1 class="text-center text-white font-semibold">
        Earnings from referrals: {{ referralEarnings }} coins
      </h1>

      <div class="p-4 flex gap-4 bg-[#FAC487] border justify-between">
        <div class="flex flex-col gap-1">
          <h1 class="font-semibold text-black">Your referrals’ upgrades</h1>
          <ul class="text-sm font-semibold text-[#17212B]">
            <li
              v-for="level in Object.keys(referralCounts)
                .map(Number)
                .sort((a, b) => a - b)"
              :key="level"
            >
              Level {{ level }} referrals: {{ referralCounts[level] }}
            </li>
          </ul>
        </div>

        <h1 class="font-semibold text-black">
          Total referrals: <span class="underline">{{ totalReferralsCount }}</span>
        </h1>
      </div>

      <div class="p-4 bg-[#FAC487] border mt-2">
        <h1 class="font-semibold text-black">Referrals level rewards</h1>

        <div class="flex flex-col gap-2 mt-2">
          <div
            v-for="[level, reward] in referralRewards"
            :key="level"
            class="flex justify-between items-center text-sm font-semibold text-[#17212B]"
          >
            <p>Level {{ level }}</p>

            <div class="flex items-center gap-1">
              <p class="text-black font-bold">{{ reward }}</p>
              <CoinIcon class="w-5 h-5" />
            </div>
          </div>
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
