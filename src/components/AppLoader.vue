<template>
  <div v-if="isLoading" class="loader-overlay">
    <div class="loader-container">
      <div class="loader-content">
        <!-- Main loader icon with spinning animation -->
        <div class="loader-icon">
          <div class="spinner-outer">
            <div class="spinner-inner"></div>
          </div>
          <div class="loader-coin">
            <CoinIcon class="w-8 h-8" />
          </div>
        </div>

        <!-- Loading text with your app's styling -->
        <h2 class="loader-title">Loading...</h2>

        <!-- Progress bar matching your design -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${Math.round(progress)}%` }"></div>
          </div>
          <div class="progress-text">{{ Math.round(progress) }}%</div>
        </div>

        <!-- Loading message -->
        <div class="loading-message">{{ loadingMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { CoinIcon } from '@/assets/icons'

// Props
interface Props {
  isLoading?: boolean
  progress?: number
  loadingMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: true,
  progress: 0,
  loadingMessage: 'Initializing...',
})

// Emits
const emit = defineEmits<{
  loaded: []
}>()

// Auto-hide loader after a delay (for demo purposes)
onMounted(() => {
  setTimeout(() => {
    emit('loaded')
  }, 2000)
})
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #364b4b 0%, #2c3e50 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Inter', sans-serif;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loader-container {
  background: linear-gradient(135deg, #fac487 0%, #f4a261 100%);
  border: 3px solid #000;
  border-radius: 20px;
  padding: 40px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  text-align: center;
  min-width: 320px;
  max-width: 400px;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.loader-icon {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-outer {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 4px solid #d68c62;
  /* border-top: 4px solid #000; */
  border-top: 4px solid #e07b39;

  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-inner {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px solid transparent;
  border-top: 3px solid #f4a261;
  border-radius: 50%;
  animation: spin 2s linear infinite reverse;
  top: 8px;
  left: 8px;
}

.loader-coin {
  position: relative;
  z-index: 2;
  animation: bounce 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.loader-title {
  color: #000;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 0px #fff;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #d68c62;
  border: 2px solid #000;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  /* background: linear-gradient(90deg, #000 0%, #333 100%); */
  /* background: linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%); */
  /* background: linear-gradient(90deg, #f4a261 0%, #fac487 100%); */
  /* background: linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%); */
  background: linear-gradient(90deg, #ffb347 0%, #ffcc33 100%);

  border-radius: 8px;
  transition: width 0.3s ease-out;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 1px 1px 0px #fff;
  font-family: 'Courier New', monospace;
}

.loading-message {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  animation: fadeInOut 1.5s ease-in-out infinite alternate;
}

@keyframes fadeInOut {
  0% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 480px) {
  .loader-container {
    min-width: 280px;
    padding: 30px 20px;
    margin: 20px;
  }

  .loader-title {
    font-size: 20px;
  }

  .loader-icon {
    width: 60px;
    height: 60px;
  }

  .spinner-outer {
    width: 60px;
    height: 60px;
  }

  .spinner-inner {
    width: 45px;
    height: 45px;
    top: 6px;
    left: 6px;
  }
}
</style>
