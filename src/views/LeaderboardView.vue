<script setup lang="ts">
import { LeaderboardBackgroundImage } from '@/assets/backgrounds/winter'
import { ArrowBackIcon, CupIcon, InfoIcon, SwitchIcon } from '@/assets/icons/winter'
import { CoinImage, UserImage } from '@/assets/images/winter'
</script>

<template>
  <div
    class="w-full h-full bg-cover bg-center bg-no-repeat p-2 relative flex flex-col justify-between text-white"
    :style="{ backgroundImage: `url(${LeaderboardBackgroundImage})` }"
  >
    <div class="flex flex-col gap-2 items-center">
      <div class="flex justify-between items-center p-4 w-full">
        <RouterLink
          to="/"
          class="w-8 h-8 bg-[rgba(60,143,151,0.5)] rounded-full border border-white flex justify-center items-center"
        >
          <ArrowBackIcon class="w-6" />
        </RouterLink>

        <div class="flex justify-center gap-4 items-center">
          <button
            type="button"
            class="w-8 h-8 bg-[rgba(60,143,151,0.5)] rounded-full border border-white flex justify-center items-center"
          >
            <SwitchIcon class="w-4 opacity-60" />
          </button>

          <h1 class="uppercase font-bold text-xl">season 1</h1>

          <button
            type="button"
            class="w-8 h-8 bg-[rgba(60,143,151,0.5)] rounded-full border border-white flex justify-center items-center"
          >
            <SwitchIcon class="w-4 rotate-180" />
          </button>
        </div>

        <button
          type="button"
          class="w-8 h-8 bg-[rgba(60,143,151,0.5)] rounded-full border border-white flex justify-center items-center"
        >
          <InfoIcon class="w-6" />
        </button>
      </div>

      <div
        class="border border-[#b6d4d7] bg-[rgba(60,143,151,0.5)] px-4 py-2 rounded-full font-bold"
      >
        29d 10h 54m 53s
      </div>
    </div>

    <div class="flex flex-col gap-2 flex-1 px-4 my-4 scrollbar-hide overflow-y-scroll">
      <div
        class="flex justify-between items-center border border-[#b6d4d7] bg-[rgba(60,143,151,0.5)] p-2 rounded-xl"
      >
        <div class="flex items-center gap-2">
          <img :src="UserImage" class="w-12" alt="user-image" />

          <div class="flex flex-col gap-1 font-bold leading-none">
            <h2 class="text-sm">Shaxzod</h2>
            <p class="text-xs opacity-60">@shakh_oripov</p>

            <div class="text-xs flex gap-1 items-center">
              <img :src="CoinImage" class="w-4" alt="coin-image" />
              <span>123 345</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-1 font-bold leading-none">
          <CupIcon class="w-6 text-orange-400" />
          <p class="text-xs">5000 coins</p>
          <p class="text-[10px] opacity-60">= 0.2 USDT</p>
        </div>
      </div>

      <div
        class="flex justify-between items-center border border-[#b6d4d7] bg-[rgba(60,143,151,0.5)] p-2 rounded-xl"
      >
        <div class="flex items-center gap-2">
          <img :src="UserImage" class="w-12" alt="user-image" />

          <div class="flex flex-col gap-1 font-bold leading-none">
            <h2 class="text-sm">Shaxzod</h2>
            <p class="text-xs opacity-60">@shakh_oripov</p>

            <div class="text-xs flex gap-1 items-center">
              <img :src="CoinImage" class="w-4" alt="coin-image" />
              <span>123 345</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-1 font-bold leading-none">
          <CupIcon class="w-6 text-slate-400" />
          <p class="text-xs">5000 coins</p>
          <p class="text-[10px] opacity-60">= 0.2 USDT</p>
        </div>
      </div>

      <div
        class="flex justify-between items-center border border-[#b6d4d7] bg-[rgba(60,143,151,0.5)] p-2 rounded-xl"
      >
        <div class="flex items-center gap-2">
          <img :src="UserImage" class="w-12" alt="user-image" />

          <div class="flex flex-col gap-1 font-bold leading-none">
            <h2 class="text-sm">Shaxzod</h2>
            <p class="text-xs opacity-60">@shakh_oripov</p>

            <div class="text-xs flex gap-1 items-center">
              <img :src="CoinImage" class="w-4" alt="coin-image" />
              <span>123 345</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-1 font-bold leading-none">
          <CupIcon class="w-6 text-[#C67747]" />
          <p class="text-xs">5000 coins</p>
          <p class="text-[10px] opacity-60">= 0.2 USDT</p>
        </div>
      </div>

      <div
        class="flex justify-between items-center border border-[#b6d4d7] bg-[rgba(60,143,151,0.5)] p-2 rounded-xl"
      >
        <div class="flex items-center gap-2">
          <img :src="UserImage" class="w-12" alt="user-image" />

          <div class="flex flex-col gap-1 font-bold leading-none">
            <h2 class="text-sm">Shaxzod</h2>
            <p class="text-xs opacity-60">@shakh_oripov</p>

            <div class="text-xs flex gap-1 items-center">
              <img :src="CoinImage" class="w-4" alt="coin-image" />
              <span>123 345</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-1 font-bold leading-none">
          <h1>#4</h1>
          <p class="text-xs">5000 coins</p>
          <p class="text-[10px] opacity-60">= 0.2 USDT</p>
        </div>
      </div>

      <div
        class="flex justify-between items-center border border-[#b6d4d7] bg-[rgba(60,143,151,0.5)] p-2 rounded-xl"
      >
        <div class="flex items-center gap-2">
          <img :src="UserImage" class="w-12" alt="user-image" />

          <div class="flex flex-col gap-1 font-bold leading-none">
            <h2 class="text-sm">Shaxzod</h2>
            <p class="text-xs opacity-60">@shakh_oripov</p>

            <div class="text-xs flex gap-1 items-center">
              <img :src="CoinImage" class="w-4" alt="coin-image" />
              <span>123 345</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-1 font-bold leading-none">
          <h1>#5</h1>
          <p class="text-xs">5000 coins</p>
          <p class="text-[10px] opacity-60">= 0.2 USDT</p>
        </div>
      </div>

      <div
        class="flex justify-between items-center border border-[#b6d4d7] bg-[rgba(60,143,151,0.5)] p-2 rounded-xl"
      >
        <div class="flex items-center gap-2">
          <img :src="UserImage" class="w-12" alt="user-image" />

          <div class="flex flex-col gap-1 font-bold leading-none">
            <h2 class="text-sm">Shaxzod</h2>
            <p class="text-xs opacity-60">@shakh_oripov</p>

            <div class="text-xs flex gap-1 items-center">
              <img :src="CoinImage" class="w-4" alt="coin-image" />
              <span>123 345</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-1 font-bold leading-none">
          <h1>#6</h1>
          <p class="text-xs">5000 coins</p>
          <p class="text-[10px] opacity-60">= 0.2 USDT</p>
        </div>
      </div>
    </div>

    <div class="flex justify-center gap-4 items-center p-4">
      <button
        type="button"
        class="w-8 h-8 bg-[rgba(60,143,151,0.5)] rounded-full border border-white flex justify-center items-center"
      >
        <SwitchIcon class="w-4 opacity-60" />
      </button>

      <div class="border border-white rounded-full bg-[rgba(60,143,151,0.5)] px-4 py-1">
        <h1 class="uppercase font-bold text-lg">level 1</h1>
      </div>

      <button
        type="button"
        class="w-8 h-8 bg-[rgba(60,143,151,0.5)] rounded-full border border-white flex justify-center items-center"
      >
        <SwitchIcon class="w-4 rotate-180" />
      </button>
    </div>
  </div>
</template>
