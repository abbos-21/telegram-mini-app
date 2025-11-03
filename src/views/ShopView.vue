<script setup lang="ts">
import { onMounted, ref, type Component } from 'vue'
import { CoinIcon, MealIcon, MoneyBagIcon, PostBuildingIcon, ImmuneIcon } from '@/assets/icons'
import { ShopBgImage } from '@/assets/images'
import { useGame } from '@/composables/useGame'
import { upgradeService } from '@/api/upgradeService'
import type { UpgradeStatusItem } from '@/api/types'

const { getUserData, user } = useGame()

const upgradeStatus = ref<UpgradeStatusItem[] | null>(null)
const loading = ref(false)
const upgradingName = ref<string | null>(null)

const icons: Record<UpgradeStatusItem['name'], Component | string> = {
  wealth: MoneyBagIcon,
  work: PostBuildingIcon,
  food: MealIcon,
  immune: ImmuneIcon,
}

const getUpgradeStatus = async () => {
  try {
    const response = await upgradeService.status()
    upgradeStatus.value = response.data.status
  } catch (err) {
    console.error('Error while getting upgrade status: ', err)
  }
}

const handleUpgrade = async (name: UpgradeStatusItem['name']) => {
  try {
    loading.value = true
    upgradingName.value = name
    await upgradeService.upgrade(name)
    await getUserData()
    await getUpgradeStatus()
  } catch (err) {
    console.error('Error while upgrading:', err)
  } finally {
    loading.value = false
    upgradingName.value = null
  }
}

onMounted(async () => {
  await getUserData()
  await getUpgradeStatus()
})
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
        <span class="font-bold">{{ user?.coins }}</span>
      </div>

      <div
        class="flex items-center gap-2 bg-[#FAC487] border border-[#000] py-2 px-4 rounded-[25px]"
      >
        <span class="font-bold">Your level: {{ user?.level }}</span>
      </div>
    </div>

    <div
      class="flex flex-col gap-4 overflow-y-scroll scrollbar-hide"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <div
        v-for="upgrade in upgradeStatus ?? []"
        :key="upgrade.name"
        class="p-4 bg-[rgba(35,44,57,0.9)] rounded-[5px] border-2 border-[#17212B]"
      >
        <div class="flex gap-2 items-start">
          <div
            class="bg-[#fff] border border-[#CBCBCB] rounded-[10px] w-14 h-14 flex justify-center items-center"
          >
            <component :is="icons[upgrade.name]" class="w-8" />
          </div>

          <div class="flex-1">
            <div class="flex justify-between items-start">
              <p class="text-[#fff]">
                <span class="uppercase font-bold text-lg">{{ upgrade.name }}</span>
                - {{ upgrade.description }}
              </p>

              <div
                class="shrink-0 bg-[#fff] border border-[#CBCBCB] rounded-[5px] flex items-center justify-center px-1"
              >
                <p class="font-bold text-sm">
                  Lvl. <span class="text-[#3C863C]">{{ upgrade.level }}</span> /
                  <span class="text-[#F79423]">{{ upgrade.maxLevel }}</span>
                </p>
              </div>
            </div>

            <div class="flex flex-col items-start gap-1">
              <span class="bg-[#fff] rounded-[5px] p-px px-1 text-xs font-medium">
                {{ upgrade.effect }}
              </span>

              <span
                class="bg-[#fff] rounded-[5px] p-px px-[6px] text-xs font-medium flex items-center gap-1"
              >
                <CoinIcon class="w-[14px]" />
                Required coins:
                <span v-if="upgrade.cost !== null">{{ upgrade.cost }}</span>
                <span v-else>—</span>
              </span>
            </div>

            <p class="text-xs text-[#fff] mt-1 font-medium">
              {{ upgrade.details }}
            </p>
          </div>
        </div>

        <div class="flex justify-center items-center mt-4">
          <button
            type="button"
            class="bg-[#FAC487] uppercase cursor-pointer font-semibold py-1 px-12 rounded-full disabled:opacity-50"
            :disabled="loading || !upgrade.canUpgrade"
            @click="handleUpgrade(upgrade.name)"
          >
            <template v-if="loading && upgradingName === upgrade.name"> upgrading... </template>
            <template v-else-if="!upgrade.canUpgrade"> max level </template>
            <template v-else> upgrade level </template>
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
