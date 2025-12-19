<script setup lang="ts">
import { ref } from 'vue'
import SpinWheel from './SpinWheel.vue'
import { useGame } from '@/composables/useGame'
import { runChainUntilSuccess } from '@/utils/chainFunction'
import { PopupBackgroundImage } from '@/assets/backgrounds/winter'
import { CloseImage } from '@/assets/images/winter'

interface Props {
  isOpen: boolean
}

const emit = defineEmits<{ (e: 'close'): void }>()
defineProps<Props>()

const { sync, mine, getUserData } = useGame()

const isSpinning = ref(false)
const hasFinished = ref(false)

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
        class="popup-container border-2 border-white rounded-xl p-6 pt-8 max-w-sm w-full mx-4 text-white"
        :style="{ backgroundImage: `url(${PopupBackgroundImage})` }"
        @click.stop
      >
        <button @click="closePopup" :disabled="isSpinning" class="absolute -top-4 -right-4 w-15">
          <img :src="CloseImage" alt="close" />
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
  background-size: cover;
  background-position: center;
  animation: popupSlideIn 0.3s ease-out;
  position: relative;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
