<script setup lang="ts">
import { ref, computed, onMounted, type CSSProperties } from 'vue'
import { useSpinWheel } from '@/composables/useSpinWheel'
import { SpinPointerIcon } from '@/assets/icons/winter'
import { CoinImage, SpinButtonImage } from '@/assets/images/winter'

interface Segment {
  label: string
  color: string
}

const emit = defineEmits<{
  (e: 'finish', payload: { index: number; label: string }): void
  (e: 'spinning', spinning: boolean): void
}>()

const { canSpin, cooldownRemaining, spin, fetchStatus } = useSpinWheel()

const segments = computed<Segment[]>(() => [
  { label: '-5', color: '#FFE07D' },
  { label: '10', color: '#b3e59f' },
  { label: '15', color: '#7ca1bc' },
  { label: '20', color: '#FFC251' },
  { label: '25', color: '#E28086' },
  { label: '30', color: '#beddf3' },
  { label: '35', color: '#D8BFD8' },
  { label: '40', color: '#F4A300' },
])

const size = 250
const spins = 5
const duration = 4000

const wheelRef = ref<HTMLDivElement | null>(null)
const spinning = ref(false)
const currentRotation = ref(0)
const result = ref<number | null>(null)
const resPrize = ref<number | null>(null)

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
    color: '#fff',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    fontWeight: 'bold',
  }
}

async function handleSpin() {
  if (spinning.value || !canSpin.value) return

  spinning.value = true
  emit('spinning', true)
  result.value = null

  const res = await spin()
  if (!res) {
    spinning.value = false
    emit('spinning', false)
    return
  }

  resPrize.value = res.prize
  const chosenIndex = segments.value.findIndex((s) => s.label.includes(String(resPrize.value)))
  const index = chosenIndex === -1 ? 0 : chosenIndex

  const segmentCenter = index * degPer.value + degPer.value / 2
  const rotationNeededMod = (270 - segmentCenter + 360) % 360
  const fullRotation = spins * 360

  currentRotation.value = currentRotation.value + fullRotation + rotationNeededMod
}

function onTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'transform') return
  spinning.value = false
  emit('spinning', false)

  const prizeSegmentIndex = segments.value.findIndex((s) =>
    s.label.includes(String(resPrize.value)),
  )

  if (prizeSegmentIndex !== -1 && segments.value[prizeSegmentIndex]) {
    result.value = prizeSegmentIndex
    emit('finish', {
      index: prizeSegmentIndex,
      label: segments.value[prizeSegmentIndex].label,
    })
  }
}

onMounted(fetchStatus)
</script>

<template>
  <div class="spin-wheel-wrapper">
    <SpinPointerIcon class="w-6 -mb-5 z-10 text-[#eaf3f9]" />

    <div
      class="wheel border-[#eaf3f9] border-8"
      :style="wheelStyle"
      @transitionend="onTransitionEnd"
      ref="wheelRef"
    >
      <div
        v-for="(segment, i) in segments"
        :key="i"
        class="label"
        :style="labelStyle(i)"
        v-html="segment.label"
      ></div>
    </div>

    <!-- <button
      :disabled="spinning || !canSpin"
      @click="handleSpin"
      class="bg-[#D68C62] border-2 border-black rounded-lg px-8 py-3 flex items-center gap-2 hover:bg-[#C47A4F] transition-colors shadow-lg cursor-pointer font-bold text-black text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
    >
      {{ spinning ? 'Spinning…' : canSpin ? 'Spin' : 'Come Back Later' }}
    </button> -->

    <button :disabled="spinning || !canSpin" @click="handleSpin" class="w-40 mt-4">
      <img :src="SpinButtonImage" alt="spin" />
    </button>

    <div class="font-bold mt-2 flex items-center justify-center gap-1" v-if="resultLabel">
      <p>You won:</p>

      <div class="flex justify-center gap-1 items-center">
        <span>{{ resultLabel }}</span>
        <img :src="CoinImage" class="w-4" alt="coin" />
      </div>
    </div>

    <div v-if="cooldownRemaining" class="text-xs font-bold mt-2">
      Next spin in: {{ cooldownRemaining.hours }}h {{ cooldownRemaining.minutes }}m :
    </div>
  </div>
</template>

<style scoped>
.spin-wheel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wheel {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.label {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}
</style>
