<script setup lang="ts">
import { PopupBackgroundImage } from '@/assets/backgrounds/winter'
import {
  BoxClaimButtonImage,
  BoxCoinButtonImage,
  BoxStarButtonImage,
  MenuItemBackground,
} from '@/assets/images/winter'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { useBoxGame } from '@/composables/useBoxGame'

const {
  loading,
  canPlay,
  cards,
  openedCount,
  openCard,
  canClaim,
  claimRewards,
  payWithCoins,
  openInvoice,
} = useBoxGame()
</script>

<template>
  <LoaderComponent v-if="loading" />

  <div
    class="w-full h-full bg-cover bg-center p-2 py-8 flex flex-col gap-8"
    :style="{ backgroundImage: `url(${PopupBackgroundImage})` }"
  >
    <h1 class="text-center text-white font-bold text-xl">Choose and get your reward</h1>

    <!-- Cards -->
    <div v-if="cards.length" class="grid grid-cols-3 gap-4 px-4">
      <div
        v-for="card in cards"
        :key="card.id"
        class="flip-card"
        :class="{ 'pointer-events-none': openedCount >= 3 && !card.flipped }"
        @click="openCard(card)"
      >
        <div class="flip-card-inner" :class="{ flipped: card.flipped }">
          <div class="flip-card-front">
            <img :src="MenuItemBackground" class="w-full h-full" />
          </div>
          <div class="flip-card-back">
            <h2 class="text-white font-bold">
              {{ card.reward.name }}
            </h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Locked -->
    <div v-if="!canPlay" class="grid grid-cols-3 gap-4 px-4 opacity-50">
      <div v-for="n in 12" :key="n">
        <img :src="MenuItemBackground" />
      </div>
    </div>

    <!-- Claim -->
    <div v-if="canClaim" class="flex justify-center">
      <button @click="claimRewards">
        <img :src="BoxClaimButtonImage" />
      </button>
    </div>

    <!-- Buy -->
    <div v-if="!canPlay" class="grid grid-cols-2 gap-4">
      <button @click="payWithCoins">
        <img :src="BoxCoinButtonImage" />
      </button>
      <button @click="openInvoice">
        <img :src="BoxStarButtonImage" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  perspective: 1000px;
  cursor: pointer;
  aspect-ratio: 4 / 3;
}
.flip-card-inner {
  transition: transform 0.8s;
  transform-style: preserve-3d;
}
.flip-card-inner.flipped {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  backface-visibility: hidden;
}
.flip-card-back {
  transform: rotateY(180deg);
}
</style>
