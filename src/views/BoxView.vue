<script setup lang="ts">
import { computed } from 'vue'
import { PopupBackgroundImage } from '@/assets/backgrounds/winter'
import { BoxCoinButtonImage, BoxStarButtonImage, MenuItemBackground } from '@/assets/images/winter'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { useBoxGame } from '@/composables/useBoxGame'

const { loading, canPlay, cards, openedCount, openCard, payWithCoins, openInvoice } = useBoxGame()

const MAX_OPENS = 3

const isGridDisabled = computed(() => {
  return openedCount.value >= MAX_OPENS
})
</script>

<template>
  <LoaderComponent v-if="loading" />

  <div
    class="w-full h-full bg-cover bg-center bg-no-repeat p-2 py-8 relative flex flex-col gap-6 overflow-y-scroll scrollbar-hide"
    :style="{ backgroundImage: `url(${PopupBackgroundImage})` }"
  >
    <h1 class="text-center text-white font-bold text-xl">Choose and get your reward</h1>

    <div v-if="cards.length > 0" class="grid grid-cols-3 gap-x-4 gap-y-6 px-4">
      <div
        v-for="card in cards"
        :key="card.id"
        class="flip-card"
        :class="{
          'pointer-events-none': isGridDisabled && !card.flipped,
        }"
        @click="openCard(card)"
      >
        <div class="flip-card-inner" :class="{ flipped: card.flipped }">
          <div class="flip-card-front">
            <img :src="MenuItemBackground" alt="Gift box" class="w-full h-full object-cover" />
          </div>

          <div class="flip-card-back">
            <div class="h-full w-full flex items-center justify-center text-center px-2">
              <h2 v-if="card.reward" class="text-white font-bold text-sm leading-tight">
                {{ card.reward.name }}
              </h2>
              <span v-else class="text-white opacity-60 text-xs">...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-3 gap-x-4 gap-y-6 px-4 opacity-50">
      <div v-for="n in 12" :key="n" class="pointer-events-none aspect-4/3">
        <img :src="MenuItemBackground" alt="Gift box" class="w-full h-full object-cover" />
      </div>
    </div>

    <div v-if="!canPlay && cards.length === 0" class="grid grid-cols-2 gap-4 mt-auto px-4">
      <button
        type="button"
        @click="payWithCoins"
        :disabled="loading"
        class="active:scale-95 transition-transform"
      >
        <img :src="BoxCoinButtonImage" alt="buy-with-coins" class="w-full" />
      </button>

      <button
        type="button"
        @click="openInvoice"
        :disabled="loading"
        class="active:scale-95 transition-transform"
      >
        <img :src="BoxStarButtonImage" alt="buy-with-stars" class="w-full" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  background-color: transparent;
  perspective: 1000px;
  cursor: pointer;
  width: 100%;
  aspect-ratio: 4 / 3;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  border-radius: 12px;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

.flip-card-back {
  background-color: rgba(0, 146, 184, 0.9); /* Increased opacity for readability */
  border: 2px solid white;
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
