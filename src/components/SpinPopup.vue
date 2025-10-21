<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { CoinIcon, CloseIcon } from '@/assets/icons'
import { SpinImage } from '@/assets/images'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isSpinning = ref(false)
const wheelRotation = ref(0)
const selectedPrize = ref<number | null>(null)

// Prize wheel data
const prizes = ref([
  { id: 1, amount: 10, color: '#FF6B6B', textColor: '#FFFFFF' },
  { id: 2, amount: 25, color: '#4ECDC4', textColor: '#FFFFFF' },
  { id: 3, amount: 50, color: '#45B7D1', textColor: '#FFFFFF' },
  { id: 4, amount: 100, color: '#96CEB4', textColor: '#FFFFFF' },
  { id: 5, amount: 200, color: '#FFEAA7', textColor: '#2D3436' },
  { id: 6, amount: 500, color: '#DDA0DD', textColor: '#FFFFFF' },
  { id: 7, amount: 1000, color: '#98D8C8', textColor: '#2D3436' },
  { id: 8, amount: 5, color: '#F7DC6F', textColor: '#2D3436' },
])

const closePopup = () => {
  emit('close')
}

const spinWheel = () => {
  if (isSpinning.value) return

  isSpinning.value = true
  selectedPrize.value = null

  // Generate random rotation (multiple full rotations + random angle)
  const randomRotation = Math.random() * 360 + 1440 // 4 full rotations + random
  const finalRotation = wheelRotation.value + randomRotation
  wheelRotation.value = finalRotation

  // Calculate which prize was selected
  const normalizedRotation = finalRotation % 360
  const prizeIndex = Math.floor((360 - normalizedRotation) / 45) % prizes.value.length
  selectedPrize.value = prizes.value[prizeIndex]?.amount || 0

  // Stop spinning after animation
  setTimeout(() => {
    isSpinning.value = false
  }, 3000)
}

// Reset wheel when popup opens
const resetWheel = () => {
  wheelRotation.value = 0
  selectedPrize.value = null
  isSpinning.value = false
}

// Watch for popup open to reset wheel
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      resetWheel()
    }
  },
)

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      closePopup()
      break
    case ' ':
      event.preventDefault()
      spinWheel()
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
        class="bg-[#FAC487] border-2 border-black rounded-lg p-6 max-w-md w-full mx-4 relative shadow-2xl popup-container"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="closePopup"
          class="absolute -top-3 -right-3 w-12 h-10 bg-gradient-to-b from-red-400 to-red-600 text-white rounded-lg flex items-center justify-center border-2 border-black shadow-lg"
        >
          <CloseIcon class="w-6 h-6" />
        </button>

        <!-- Popup Content -->
        <div class="mt-4">
          <!-- Title -->
          <h3 class="text-2xl font-bold text-center mb-4 text-black">Prize Wheel</h3>

          <!-- Wheel Container -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <!-- Wheel -->
              <div
                class="w-64 h-64 rounded-full border-4 border-black relative overflow-hidden transition-transform duration-3000 ease-out"
                :style="{ transform: `rotate(${wheelRotation}deg)` }"
              >
                <!-- Prize Segments -->
                <div
                  v-for="(prize, index) in prizes"
                  :key="prize.id"
                  class="absolute w-full h-full"
                  :style="{
                    transform: `rotate(${index * 45}deg)`,
                    transformOrigin: 'center',
                  }"
                >
                  <div
                    class="absolute top-0 left-1/2 w-0 h-0 border-l-32 border-r-32 border-b-32 border-l-transparent border-r-transparent"
                    :style="{
                      borderBottomColor: prize.color,
                      transform: 'translateX(-50%)',
                    }"
                  ></div>
                  <!-- Prize Text -->
                  <div
                    class="absolute top-8 left-1/2 transform -translate-x-1/2 text-center"
                    :style="{ color: prize.textColor }"
                  >
                    <div class="flex items-center justify-center gap-1">
                      <CoinIcon class="w-4 h-4" />
                      <span class="font-bold text-sm">{{ prize.amount }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Center Circle -->
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center"
              >
                <div class="w-8 h-8 bg-[#D68C62] rounded-full flex items-center justify-center">
                  <span class="text-black font-bold text-sm">SPIN</span>
                </div>
              </div>

              <!-- Pointer -->
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div
                  class="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-black"
                ></div>
              </div>
            </div>
          </div>

          <!-- Spin Button -->
          <div class="flex justify-center mb-4">
            <button
              @click="spinWheel"
              :disabled="isSpinning"
              class="bg-[#D68C62] border-2 border-black rounded-lg px-8 py-3 flex items-center gap-2 hover:bg-[#C47A4F] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img :src="SpinImage" class="w-6 h-6" alt="Spin" />
              <span class="font-bold text-black text-lg">
                {{ isSpinning ? 'Spinning...' : 'SPIN WHEEL' }}
              </span>
            </button>
          </div>

          <!-- Selected Prize Display -->
          <div v-if="selectedPrize && !isSpinning" class="text-center">
            <div class="bg-white border border-black rounded-lg p-4">
              <p class="text-lg font-bold text-gray-800 mb-2">Congratulations!</p>
              <div class="flex items-center justify-center gap-2">
                <CoinIcon class="w-6 h-6" />
                <span class="text-2xl font-bold text-black">{{ selectedPrize }} coins</span>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="text-center text-sm text-gray-700">
            <p>Press SPACE to spin or click the button</p>
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
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Wheel spinning animation */
.wheel-spinning {
  animation: spin 3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(var(--final-rotation, 1440deg));
  }
}
</style>
