<template>
  <div v-if="isLoading" class="loader-overlay">
    <div class="loader-container">
      <div class="loader-content">
        <div class="loader-icon">
          <div class="spinner"></div>
        </div>
        <h2 class="loader-title">Loading Game Assets</h2>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
          <span class="progress-text">{{ Math.round(progress) }}%</span>
        </div>
        <div class="loading-details">
          <p class="loading-item" v-if="currentAsset">Loading: {{ currentAsset }}</p>
          <p class="loading-stats">{{ loadedAssets }}/{{ totalAssets }} assets loaded</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props
interface Props {
  assets: string[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  loaded: []
}>()

// Reactive state
const isLoading = ref(true)
const progress = ref(0)
const loadedAssets = ref(0)
const totalAssets = ref(0)
const currentAsset = ref('')

// Asset loading tracking
const loadAsset = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    currentAsset.value = src.split('/').pop() || src

    if (src.endsWith('.mp3') || src.endsWith('.wav') || src.endsWith('.ogg')) {
      // Audio file
      const audio = new Audio()
      audio.oncanplaythrough = () => {
        loadedAssets.value++
        updateProgress()
        resolve()
      }
      audio.onerror = () => {
        loadedAssets.value++
        updateProgress()
        resolve() // Continue even if audio fails
      }
      audio.src = src
    } else if (src.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
      // Image file
      const img = new Image()
      img.onload = () => {
        loadedAssets.value++
        updateProgress()
        resolve()
      }
      img.onerror = () => {
        loadedAssets.value++
        updateProgress()
        resolve() // Continue even if image fails
      }
      img.src = src
    } else {
      // Other assets - assume they load immediately
      loadedAssets.value++
      updateProgress()
      resolve()
    }
  })
}

// Update progress percentage
const updateProgress = () => {
  if (totalAssets.value > 0) {
    progress.value = (loadedAssets.value / totalAssets.value) * 100
  }
}

// Load all assets
const loadAllAssets = async () => {
  totalAssets.value = props.assets.length
  loadedAssets.value = 0
  progress.value = 0

  try {
    await Promise.all(props.assets.map((asset) => loadAsset(asset)))

    // Add a small delay to show 100% completion
    setTimeout(() => {
      isLoading.value = false
      emit('loaded')
    }, 500)
  } catch (error) {
    console.error('Error loading assets:', error)
    isLoading.value = false
    emit('loaded')
  }
}

// Start loading when component mounts
onMounted(() => {
  loadAllAssets()
})
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Arial', sans-serif;
}

.loader-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 400px;
  backdrop-filter: blur(10px);
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader-icon {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner {
  width: 80px;
  height: 80px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader-title {
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.progress-container {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #333;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #333;
  font-size: 18px;
  font-weight: bold;
  min-width: 50px;
}

.loading-details {
  margin-top: 10px;
}

.loading-item {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
  font-style: italic;
}

.loading-stats {
  color: #888;
  font-size: 12px;
  margin: 5px 0;
}

/* Responsive design */
@media (max-width: 480px) {
  .loader-container {
    min-width: 300px;
    padding: 30px 20px;
    margin: 20px;
  }

  .loader-title {
    font-size: 20px;
  }

  .progress-container {
    flex-direction: column;
    gap: 10px;
  }

  .progress-text {
    font-size: 16px;
  }
}
</style>
