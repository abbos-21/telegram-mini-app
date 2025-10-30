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
      :disabled="spinning"
      @click="spin"
      class="bg-[#D68C62] border-2 border-black rounded-lg px-8 py-3 flex items-center gap-2 hover:bg-[#C47A4F] transition-colors shadow-lg cursor-pointer font-bold text-black text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ spinning ? 'Spinning…' : 'Spin' }}
    </button>

    <div v-if="result !== null" class="text-lg font-semibold">You won: {{ resultLabel }}</div>
  </div>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue'

const props = defineProps({
  segments: {
    type: Array,
    default: () => [
      { label: '5 🪙', color: '#F44336' },
      { label: '10 🪙', color: '#E91E63' },
      { label: '15 🪙', color: '#9C27B0' },
      { label: '20 🪙', color: '#3F51B5' },
      { label: '25 🪙', color: '#03A9F4' },
      { label: '30 🪙', color: '#4CAF50' },
      { label: '35 🪙', color: '#FF9800' },
      { label: '40 🪙', color: '#8BC34A' },
    ],
  },
  size: { type: Number, default: 300 },
  spins: { type: Number, default: 5 },
  duration: { type: Number, default: 4000 },
})

const emit = defineEmits(['finish'])

const { segments, size, spins, duration } = toRefs(props)
const wheelRef = ref(null)
const spinning = ref(false)
const currentRotation = ref(0)
const targetRotation = ref(0)
const result = ref(null)

const degPer = computed(() => 360 / segments.value.length)

const wheelBackground = computed(() => {
  const parts = segments.value.map(
    (s, i) => `${s.color} ${i * degPer.value}deg ${(i + 1) * degPer.value}deg`,
  )
  return `conic-gradient(${parts.join(', ')})`
})

const wheelStyle = computed(() => ({
  width: `${size.value}px`,
  height: `${size.value}px`,
  borderRadius: '50%',
  background: wheelBackground.value,
  transform: `rotate(${currentRotation.value}deg)`,
  transition: spinning.value ? `transform ${duration.value}ms cubic-bezier(.22,.9,.31,1)` : 'none',
  position: 'relative',
  overflow: 'hidden',
}))

const resultLabel = computed(() =>
  result.value === null ? '' : segments.value[result.value].label,
)

function labelStyle(index) {
  const rotation = degPer.value * index + degPer.value / 2
  // distanceFromCenter controls how far labels sit from center (0..0.5*size)
  const distanceFromCenter = size.value * 0.42
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: '0 0',
    transform: `rotate(${rotation}deg) translate(${distanceFromCenter}px, -50%) rotate(90deg)`,
    textAlign: 'center',
    fontSize: '14px',
    color: '#fff',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  }
}

function pickIndexRandomly() {
  return Math.floor(Math.random() * segments.value.length)
}

function randomJitter() {
  const maxJitter = Math.max(0, degPer.value - 8)
  return Math.random() * maxJitter
}

function spin() {
  if (spinning.value) return
  spinning.value = true
  result.value = null

  const chosenIndex = pickIndexRandomly()

  // segment center angle measured from 3 o'clock clockwise
  const segmentCenter = chosenIndex * degPer.value + degPer.value / 2

  // Pointer is at top -> that's 270deg (from 3 o'clock clockwise)
  // We need to rotate the wheel so that (segmentCenter + rotation) % 360 === 270
  // Solve: rotation_mod = (270 - segmentCenter + 360) % 360
  const rotationNeededMod = (270 - segmentCenter + 360) % 360

  const fullRotation = spins.value * 360
  targetRotation.value = currentRotation.value + fullRotation + rotationNeededMod + randomJitter()
  // apply target
  currentRotation.value = Math.round(targetRotation.value * 1000) / 1000

  // save pending index in case we want to show during animation
  if (wheelRef.value) wheelRef.value._pendingIndex = chosenIndex
}

function onTransitionEnd(e) {
  if (e.propertyName !== 'transform') return
  // ensure we read the final computed rotation (currentRotation should already be set to target)
  spinning.value = false

  const normalized = ((currentRotation.value % 360) + 360) % 360
  // The wheel's point at angle A (from 3 o'clock clockwise) after rotation appears at (A + normalized) %360.
  // We want which segment's center A satisfies (A + normalized) %360 === 270 -> A = (270 - normalized + 360) %360
  const centerAngleAtTop = (270 - normalized + 360) % 360
  const idx = Math.floor(centerAngleAtTop / degPer.value) % segments.value.length

  result.value = idx
  emit('finish', { index: idx, label: segments.value[idx].label })
}
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
  position: absolute;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.pointer {
  font-size: 24px;
  margin-bottom: -12px; /* overlap with wheel edge */
  pointer-events: none;
  z-index: 2;
}
</style>
