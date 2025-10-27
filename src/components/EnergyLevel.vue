<template>
  <div class="energy-container-vertical">
    <div class="energy-label">
      <span class="energy-text">{{ currentValue.toFixed(2) }} {{ unit }}</span>
    </div>

    <div class="energy-bar" :class="energyBarClass">
      <div class="energy-fill" :style="{ height: `${percentage}%` }" :class="energyFillClass">
        <div class="energy-glow" v-if="showGlow"></div>
      </div>

      <div class="energy-segments-vertical">
        <div
          v-for="segment in segments"
          :key="segment"
          class="energy-segment"
          :class="{ active: segment <= percentage / 10 }"
        ></div>
      </div>
    </div>

    <div class="energy-icon">
      <img :src="FlashImage" class="w-8" alt="Energy" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FlashImage } from '@/assets/images'

interface Props {
  currentValue?: number
  maxValue?: number
  minValue?: number
  unit?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  size?: 'small' | 'medium' | 'large'
  showGlow?: boolean
  showStats?: boolean
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentValue: 80,
  maxValue: 100,
  minValue: 0,
  unit: 'min',
  color: 'blue',
  size: 'medium',
  showGlow: true,
  showStats: false,
  animated: true,
})

const percentage = computed(() => {
  const range = props.maxValue - props.minValue
  const current = props.currentValue - props.minValue
  return Math.min(100, Math.max(0, (current / range) * 100))
})

const energyBarClass = computed(() => [
  `energy-bar-${props.size}`,
  `energy-bar-${props.color}`,
  { animated: props.animated },
])

const energyFillClass = computed(() => [
  `energy-fill-${props.color}`,
  { pulse: props.animated && percentage.value > 80 },
])

const segments = computed(() => {
  const segmentCount = props.size === 'small' ? 5 : props.size === 'large' ? 15 : 10
  return Array.from({ length: segmentCount }, (_, i) => i + 1)
})
</script>

<style scoped>
.energy-container-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-family: 'Arial', sans-serif;
}

.energy-label {
  text-align: center;
}

.energy-text {
  font-weight: bold;
  font-size: 14px;
  color: #f5e4a9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.energy-bar {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #333;
  background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column-reverse;
}

/* Sizes */
.energy-bar-small {
  width: 12px;
  height: 60px;
}
.energy-bar-medium {
  width: 14px;
  height: 196px;
}
.energy-bar-large {
  width: 20px;
  height: 150px;
}

@media only screen and (max-height: 700px) {
  .energy-bar-medium {
    height: 148px;
  }
}

/* Border Colors */
.energy-bar-blue {
  border-color: #2563eb;
}
.energy-bar-green {
  border-color: #16a34a;
}
.energy-bar-red {
  border-color: #dc2626;
}
.energy-bar-yellow {
  border-color: #ca8a04;
}
.energy-bar-purple {
  border-color: #9333ea;
}

.energy-fill {
  width: 100%;
  transition: height 0.5s ease-in-out;
}

/* Fill Gradients */
.energy-fill-blue {
  background: linear-gradient(180deg, #3b82f6 0%, #1e40af 100%);
}
.energy-fill-green {
  background: linear-gradient(180deg, #22c55e 0%, #15803d 100%);
}
.energy-fill-red {
  background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
}
.energy-fill-yellow {
  background: linear-gradient(180deg, #facc15 0%, #a16207 100%);
}
.energy-fill-purple {
  background: linear-gradient(180deg, #a855f7 0%, #7c3aed 100%);
}

.energy-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

/* Segments */
.energy-segments-vertical {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  padding: 2px;
}

.energy-segment {
  flex: 1;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  transition: background 0.3s ease;
}

.energy-segment.active {
  background: rgba(255, 255, 255, 0.1);
}

.energy-icon img {
  display: block;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
}

@keyframes shimmer {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-100%);
  }
}
</style>
