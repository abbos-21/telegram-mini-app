<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { CoinIcon } from '@/assets/icons'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentSection = ref(0)

// Sample sections data - you can customize these
const sections = ref([
  {
    id: 1,
    title: 'Refill health',
    content: 'Fill health tank completely to continuecoin mining.',
    image: '/src/assets/images/heart.png',
  },
  {
    id: 2,
    title: 'Refill energy',
    content: 'Fill energy tank completely to continuemining.',
    image: '/src/assets/images/flash.png',
  },
])

const currentSectionData = computed(() => {
  const section = sections.value[currentSection.value]
  return section || { id: 0, title: '', content: '', image: '' }
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

const buyWithCoins = () => {
  // Handle buying health/energy with 25 coins
  console.log('Buying with 25 coins')
  // Add your logic here
}

const watchAd = () => {
  // Handle watching ad for free refill
  console.log('Watching ad for free refill')
  // Add your logic here
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
  <!-- Overlay -->
  <Transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 blur-overlay flex items-center justify-center z-50"
      @click="closePopup"
    >
      <!-- Popup Container -->
      <div
        class="bg-[#FAC487] border-2 border-black rounded-lg p-6 max-w-sm w-full mx-4 relative shadow-2xl popup-container"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="closePopup"
          class="absolute -top-3 -right-3 w-12 h-10 bg-gradient-to-b from-red-400 to-red-600 text-white rounded-lg flex items-center justify-center border-2 border-black shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x-icon lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <!-- Carousel Content -->
        <div class="mt-4">
          <!-- Section Image -->
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

          <!-- Section Title -->
          <h3 class="text-xl font-bold text-center mb-3 text-black">
            {{ currentSectionData.title }}
          </h3>

          <!-- Section Content -->
          <div class="bg-white border border-black rounded-lg p-4 mb-4">
            <p class="text-center text-gray-800 leading-relaxed">
              {{ currentSectionData.content }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 mb-4">
            <!-- Buy with Coins Button -->
            <button
              @click="buyWithCoins"
              class="flex-1 bg-[#D68C62] border-2 border-black rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-[#C47A4F] transition-colors shadow-lg"
            >
              <CoinIcon class="w-5 h-5" />
              <span class="font-bold text-black">25</span>
            </button>

            <!-- Watch Ad Button -->
            <button
              @click="watchAd"
              class="flex-1 bg-[#4CAF50] border-2 border-black rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-[#45a049] transition-colors shadow-lg"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z"
                />
              </svg>
              <span class="font-bold text-white">Watch Ad</span>
            </button>
          </div>

          <!-- Navigation Arrows -->
          <div class="flex justify-between items-center">
            <!-- Left Arrow -->
            <button
              @click="prevSection"
              class="w-12 h-12 bg-[#D68C62] border-2 border-black rounded-full flex items-center justify-center hover:bg-[#C47A4F] transition-colors shadow-lg"
            >
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <!-- Section Indicators -->
            <div class="flex space-x-2">
              <div
                v-for="(section, index) in sections"
                :key="section.id"
                class="w-4 h-4 rounded-full border-2 border-black transition-colors"
                :class="index === currentSection ? 'bg-[#D68C62]' : 'bg-white'"
              ></div>
            </div>

            <!-- Right Arrow -->
            <button
              @click="nextSection"
              class="w-12 h-12 bg-[#D68C62] border-2 border-black rounded-full flex items-center justify-center hover:bg-[#C47A4F] transition-colors shadow-lg"
            >
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <!-- Section Counter -->
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
