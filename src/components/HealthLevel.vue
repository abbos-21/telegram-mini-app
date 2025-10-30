<template>
  <div class="health-container-vertical">
    <div class="health-label">
      <span class="health-text">{{ Math.round(percentage) }}%</span>
    </div>

    <div class="health-bar" :class="healthBarClass">
      <div class="health-fill" :style="{ height: `${percentage}%` }" :class="healthFillClass">
        <div class="health-glow" v-if="showGlow"></div>
      </div>

      <div class="health-segments-vertical">
        <div
          v-for="segment in segments"
          :key="segment"
          class="health-segment"
          :class="{ active: segment <= percentage / 10 }"
        ></div>
      </div>
    </div>

    <div class="health-icon">
      <img :src="HeartImage" class="w-8" alt="Health" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HeartImage } from '@/assets/images'

interface Props {
  currentValue?: number
  maxValue?: number
  minValue?: number
  color?: 'green' | 'red' | 'yellow' | 'blue'
  size?: 'small' | 'medium' | 'large'
  showGlow?: boolean
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentValue: 100,
  maxValue: 100,
  minValue: 0,
  color: 'green',
  size: 'medium',
  showGlow: true,
  animated: true,
})

const percentage = computed(() => {
  const range = props.maxValue - props.minValue
  const current = props.currentValue - props.minValue
  return Math.min(100, Math.max(0, (current / range) * 100))
})

const healthBarClass = computed(() => [
  `health-bar-${props.size}`,
  `health-bar-${props.color}`,
  { animated: props.animated },
])

const healthFillClass = computed(() => [
  `health-fill-${props.color}`,
  { pulse: props.animated && percentage.value > 80 },
])

const segments = computed(() => {
  const segmentCount = props.size === 'small' ? 5 : props.size === 'large' ? 15 : 10
  return Array.from({ length: segmentCount }, (_, i) => i + 1)
})
</script>

<style scoped>
.health-container-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.health-label {
  text-align: center;
}

.health-text {
  font-weight: bold;
  font-size: 14px;
  color: #f5e4a9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.health-bar {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #333;
  background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column-reverse;
  align-items: stretch;
}

.health-bar-small {
  width: 12px;
  height: 60px;
}

.health-bar-medium {
  width: 14px;
  height: 196px;
}

.health-bar-large {
  width: 25px;
  height: 250px;
}

@media only screen and (max-height: 700px) {
  .health-bar-medium {
    height: 148px;
  }
}

.health-bar-green {
  border-color: #16a34a;
}
.health-bar-red {
  border-color: #dc2626;
}
.health-bar-yellow {
  border-color: #ca8a04;
}
.health-bar-blue {
  border-color: #2563eb;
}

.health-fill {
  width: 100%;
  border-radius: 0 0 6px 6px;
  transition: height 0.5s ease-in-out;
  position: relative;
}

.health-fill-green {
  background: linear-gradient(180deg, #22c55e 0%, #15803d 100%);
}
.health-fill-red {
  background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
}
.health-fill-yellow {
  background: linear-gradient(180deg, #facc15 0%, #a16207 100%);
}
.health-fill-blue {
  background: linear-gradient(180deg, #3b82f6 0%, #1e40af 100%);
}

.health-glow {
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

.health-segments-vertical {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  padding: 2px;
}

.health-segment {
  flex: 1;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  transition: background 0.3s ease;
}

.health-segment.active {
  background: rgba(255, 255, 255, 0.1);
}

.health-icon img {
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
