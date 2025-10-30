<template>
  <div class="spin-wheel-wrapper">
    <div class="pointer">▼</div>

    <div class="wheel border-2" :style="wheelStyle" @transitionend="onTransitionEnd" ref="wheelRef">
      <div
        v-for="(segment, i) in segments"
        :key="i"
        class="label"
        :style="labelStyle(i)"
        v-html="segment.label"
      ></div>
    </div>

    <button
      :disabled="spinning || !canSpin"
      @click="handleSpin"
      class="bg-[#D68C62] border-2 border-black rounded-lg px-8 py-3 flex items-center gap-2 hover:bg-[#C47A4F] transition-colors shadow-lg cursor-pointer font-bold text-black text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ spinning ? 'Spinning…' : canSpin ? 'Spin' : 'Come Back Later' }}
    </button>

    <div v-if="resultLabel" class="text-lg font-semibold mt-2">You won: {{ resultLabel }}</div>

    <div v-if="cooldownRemaining" class="text-gray-600 text-sm mt-1">
      Next spin in: {{ cooldownRemaining.hours }}h {{ cooldownRemaining.minutes }}m
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type CSSProperties } from 'vue'
import { useSpinWheel } from '@/composables/useSpinWheel'
import { useGame } from '@/composables/useGame'

interface Segment {
  label: string
  color: string
}

const emit = defineEmits<{
  (e: 'finish', payload: { index: number; label: string }): void
}>()

const { canSpin, cooldownRemaining, spin, fetchStatus } = useSpinWheel()
const { sync } = useGame()

const segments = computed<Segment[]>(() => [
  { label: '5 🪙', color: '#F44336' },
  { label: '10 🪙', color: '#E91E63' },
  { label: '15 🪙', color: '#9C27B0' },
  { label: '20 🪙', color: '#3F51B5' },
  { label: '25 🪙', color: '#03A9F4' },
  { label: '30 🪙', color: '#4CAF50' },
  { label: '35 🪙', color: '#FF9800' },
  { label: '40 🪙', color: '#8BC34A' },
])

const size = 300
const spins = 5
const duration = 4000

const wheelRef = ref<HTMLDivElement | null>(null)
const spinning = ref(false)
const currentRotation = ref(0)
const result = ref<number | null>(null)

const degPer = computed(() => 360 / segments.value.length)
const wheelBackground = computed(() => {
  const parts = segments.value.map(
    (s, i) => `${s.color} ${i * degPer.value}deg ${(i + 1) * degPer.value}deg`,
  )
  return `conic-gradient(${parts.join(', ')})`
})

const wheelStyle = computed<CSSProperties>(() => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  background: wheelBackground.value,
  transform: `rotate(${currentRotation.value}deg)`,
  transition: spinning.value ? `transform ${duration}ms cubic-bezier(.22,.9,.31,1)` : 'none',
  position: 'relative',
  overflow: 'hidden',
}))

const resultLabel = computed(() =>
  result.value !== null ? (segments.value[result.value]?.label ?? '') : '',
)

function labelStyle(index: number): CSSProperties {
  const rotation = degPer.value * index + degPer.value / 2
  const distance = size * 0.42
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: '0 0',
    transform: `rotate(${rotation}deg) translate(${distance}px, -50%) rotate(90deg)`,
    textAlign: 'center',
    fontSize: '14px',
    color: '#fff',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    fontWeight: 'bold',
  }
}

function randomJitter(): number {
  return Math.random() * (degPer.value - 8)
}

async function handleSpin() {
  if (spinning.value || !canSpin.value) return

  spinning.value = true
  result.value = null

  const res = await spin()
  if (!res) {
    spinning.value = false
    return
  }

  const prize = res.prize
  const chosenIndex = segments.value.findIndex((s) => s.label.includes(String(prize)))
  const index = chosenIndex === -1 ? 0 : chosenIndex

  const segmentCenter = index * degPer.value + degPer.value / 2
  const rotationNeededMod = (270 - segmentCenter + 360) % 360
  const fullRotation = spins * 360

  currentRotation.value += fullRotation + rotationNeededMod + randomJitter()
}

async function onTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'transform') return
  spinning.value = false

  const normalized = ((currentRotation.value % 360) + 360) % 360
  const centerAngle = (270 - normalized + 360) % 360
  const idx = Math.floor(centerAngle / degPer.value) % segments.value.length

  result.value = idx
  emit('finish', { index: idx, label: segments.value[idx]?.label ?? '' })

  try {
    await sync()
  } catch (err) {
    console.error('❌ Sync after spin failed:', err)
  }
}

onMounted(fetchStatus)
</script>

<style scoped>
.spin-wheel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.wheel {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.label {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.pointer {
  font-size: 24px;
  margin-bottom: -12px;
  pointer-events: none;
  z-index: 2;
}
</style>
