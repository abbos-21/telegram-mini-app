<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { CoinIcon, CloseIcon, AdIcon, LeftArrowIcon, RightArrowIcon } from '@/assets/icons'
import { HeartImage, FlashImage } from '@/assets/images'

import { useGame } from '@/composables/useGame'

// Destructuring the functions needed to perform the recovery
const { recoverEnergy, recoverHealth } = useGame()

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentSection = ref(0)

const sections = ref([
  {
    id: 1,
    title: 'Refill health',
    content: 'Fill health tank completely to continue coin mining.',
    image: HeartImage,
    // Add an action key to make the logic cleaner in the functions
    action: 'health',
  },
  {
    id: 2,
    title: 'Refill energy',
    content: 'Fill energy tank completely to continue coin mining.',
    image: FlashImage,
    // Add an action key to make the logic cleaner in the functions
    action: 'energy',
  },
])

const currentSectionData = computed(() => {
  const section = sections.value[currentSection.value]
  return section || { id: 0, title: '', content: '', image: '', action: '' }
})

const nextSection = () => {
  if (currentSection.value < sections.value.length - 1) {
    currentSection.value++
  } else {
    currentSection.value = 0 // Loop back to first section
  }
}

const prevSection = () => {
  if (currentSection.value > 0) {
    currentSection.value--
  } else {
    currentSection.value = sections.value.length - 1 // Loop to last section
  }
}

const closePopup = () => {
  emit('close')
}

/**
 * Handles buying the current section's refill (health or energy) with coins.
 */
const buyWithCoins = () => {
  console.log('Buying with 25 coins for:', currentSectionData.value.title)

  if (currentSectionData.value.action === 'health') {
    // Logic for buying health
    // You'd typically check for sufficient coins here before calling recoverHealth
    recoverHealth()
  } else if (currentSectionData.value.action === 'energy') {
    // Logic for buying energy
    // You'd typically check for sufficient coins here before calling recoverEnergy
    recoverEnergy()
  }
  // Optionally close the popup after purchase
  closePopup()
}

/**
 * Handles watching an ad for the current section's free refill (health or energy).
 */
const watchAd = () => {
  console.log('Watching ad for free refill for:', currentSectionData.value.title)

  if (currentSectionData.value.action === 'health') {
    // Logic for watching ad for health
    // You'd typically call a function to show the ad, then call recoverHealth on success
    recoverHealth()
  } else if (currentSectionData.value.action === 'energy') {
    // Logic for watching ad for energy
    // You'd typically call a function to show the ad, then call recoverEnergy on success
    recoverEnergy()
  }
  // Optionally close the popup after a successful ad view
  closePopup()
}

// Reset to first section when popup opens
const resetToFirstSection = () => {
  currentSection.value = 0
}

// Watch for popup open to reset section
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      resetToFirstSection()
    }
  },
)

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      prevSection()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextSection()
      break
    case 'Escape':
      event.preventDefault()
      closePopup()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 blur-overlay flex items-center justify-center z-50"
      @click="closePopup"
    >
      <div
        class="bg-[#FAC487] border-2 border-black rounded-lg p-6 max-w-sm w-full mx-4 relative shadow-2xl popup-container"
        @click.stop
      >
        <button
          @click="closePopup"
          class="absolute -top-3 -right-3 w-12 h-10 bg-gradient-to-b from-red-400 to-red-600 text-white rounded-lg flex items-center justify-center border-2 border-black shadow-lg"
        >
          <CloseIcon class="w-6 h-6" />
        </button>

        <div class="mt-4">
          <div class="flex justify-center mb-4">
            <div
              class="w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center"
            >
              <img
                :src="currentSectionData.image"
                :alt="currentSectionData.title"
                class="w-16 h-16 object-contain"
              />
            </div>
          </div>

          <h3 class="text-xl font-bold text-center mb-3 text-black">
            {{ currentSectionData.title }}
          </h3>

          <div class="bg-white border border-black rounded-lg p-4 mb-4">
            <p class="text-center text-gray-800 leading-relaxed">
              {{ currentSectionData.content }}
            </p>
          </div>

          <div class="flex gap-3 mb-4">
            <button
              @click="buyWithCoins"
              class="flex-1 bg-[#D68C62] border-2 border-black rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-[#C47A4F] transition-colors shadow-lg"
            >
              <CoinIcon class="w-6 h-6" />
              <span class="font-bold text-black">25</span>
            </button>

            <button
              @click="watchAd"
              class="flex-1 bg-[#4CAF50] border-2 border-black rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-[#45a049] transition-colors shadow-lg"
            >
              <AdIcon class="w-8 h-8" />
              <span class="font-bold text-white">Free</span>
            </button>
          </div>

          <div class="flex justify-between items-center">
            <button
              @click="prevSection"
              class="w-12 h-12 bg-[#D68C62] border-2 border-black rounded-full flex items-center justify-center hover:bg-[#C47A4F] transition-colors shadow-lg"
            >
              <LeftArrowIcon class="w-6 h-6 text-black" />
            </button>

            <div class="flex space-x-2">
              <div
                v-for="(section, index) in sections"
                :key="section.id"
                class="w-4 h-4 rounded-full border-2 border-black transition-colors"
                :class="index === currentSection ? 'bg-[#D68C62]' : 'bg-white'"
              ></div>
            </div>

            <button
              @click="nextSection"
              class="w-12 h-12 bg-[#D68C62] border-2 border-black rounded-full flex items-center justify-center hover:bg-[#C47A4F] transition-colors shadow-lg"
            >
              <RightArrowIcon class="w-6 h-6 text-black" />
            </button>
          </div>

          <div class="text-center mt-3">
            <span
              class="bg-white border border-black rounded-full px-3 py-1 text-sm font-bold text-gray-800"
            >
              {{ currentSection + 1 }} of {{ sections.length }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Your CSS styles remain the same */
/* Blur overlay effect */
.blur-overlay {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Animation for overlay appearance */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Animation for popup container */
.popup-container {
  animation: popupSlideIn 0.3s ease-out;
}

@keyframes popupSlideIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Hover effects for better interactivity */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Custom scrollbar for content if needed */
.content-scroll {
  scrollbar-width: thin;
  scrollbar-color: #d68c62 #fac487;
}

.content-scroll::-webkit-scrollbar {
  width: 6px;
}

.content-scroll::-webkit-scrollbar-track {
  background: #fac487;
  border-radius: 3px;
}

.content-scroll::-webkit-scrollbar-thumb {
  background: #d68c62;
  border-radius: 3px;
}

.content-scroll::-webkit-scrollbar-thumb:hover {
  background: #c47a4f;
}
</style>
