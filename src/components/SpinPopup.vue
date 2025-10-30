<script setup lang="ts">
import { ref } from 'vue'
import SpinWheel from './SpinWheel.vue'
import { CloseIcon } from '@/assets/icons'
import { useGame } from '@/composables/useGame'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { sync } = useGame()

const isSpinning = ref(false)
const hasFinished = ref(false)

/**
 * Handles closing of popup.
 * Prevents closing while wheel is spinning.
 * Automatically syncs if popup was closed right after finishing.
 */
const closePopup = async () => {
  if (isSpinning.value) return

  emit('close')

  // If the user closes popup immediately after spin finishes,
  // ensure sync() is called one last time.
  if (hasFinished.value) {
    try {
      await sync()
    } catch (err) {
      console.error('❌ Sync after popup close failed:', err)
    }
    hasFinished.value = false
  }
}

/**
 * Called from <SpinWheel /> when spinning starts or stops.
 */
const handleSpinning = (value: boolean) => {
  isSpinning.value = value
  if (!value) {
    hasFinished.value = true
    sync().catch((err) => console.error('❌ Sync after spin failed:', err))
  }
}
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
          :disabled="isSpinning"
          :class="[
            'absolute -top-3 -right-3 w-12 h-10 rounded-lg flex items-center justify-center border-2 border-black shadow-lg transition-transform',
            isSpinning
              ? 'bg-gray-400 cursor-not-allowed opacity-70'
              : 'bg-gradient-to-b from-red-400 to-red-600 text-white hover:scale-105 active:scale-95',
          ]"
          title="Close"
        >
          <CloseIcon class="w-6 h-6" />
        </button>

        <!-- Overlay shown while spinning -->
        <div
          v-if="isSpinning"
          class="absolute inset-0 bg-black/10 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-20"
        >
          <span class="text-black/80 font-semibold text-lg animate-pulse"> Spinning... </span>
        </div>

        <SpinWheel @spinning="handleSpinning" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.blur-overlay {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.popup-container {
  animation: popupSlideIn 0.3s ease-out;
  position: relative;
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
</style>
