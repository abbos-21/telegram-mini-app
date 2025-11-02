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
const { sync, mine, getUserData } = useGame()

const isSpinning = ref(false)
const hasFinished = ref(false)

const runChainUntilSuccess = async (functions: Array<() => Promise<unknown>>) => {
  for (const func of functions) {
    try {
      await func()
      console.log(`Successfully executed: ${func.name}. Stopping chain.`)
      return
    } catch (error) {
      console.warn(`Function ${func.name} failed. Moving to next function.`, error)
    }
  }

  console.error('FAILURE: All functions in the chain failed to execute successfully.')
}

const closePopup = async () => {
  if (isSpinning.value) return

  emit('close')

  if (hasFinished.value) {
    try {
      await runChainUntilSuccess([sync, mine, getUserData])
    } catch (err) {
      console.error('❌ Sync after popup close failed:', err)
    }
    hasFinished.value = false
  }
}

const handleSpinning = (value: boolean) => {
  isSpinning.value = value
  if (!value) {
    hasFinished.value = true
    runChainUntilSuccess([sync, mine, getUserData]).catch((err) =>
      console.error('❌ Sync after spin failed:', err),
    )
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
            'absolute -top-3 -right-3 w-12 h-10 rounded-lg flex items-center justify-center border-2 border-black shadow-lg transition-transform z-30',
            isSpinning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-b from-red-400 to-red-600 text-white hover:scale-105 active:scale-95',
          ]"
          title="Close"
        >
          <CloseIcon class="w-6 h-6" />
        </button>

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
