<script setup lang="ts">
import { ref, computed, onMounted, type CSSProperties } from 'vue'
import { useSpinWheel } from '@/composables/useSpinWheel'
import { SpinPointerIcon } from '@/assets/icons/winter'
import { AdButtonImage, CoinImage, SpinButtonImage } from '@/assets/images/winter'
import { useAdsgram } from '@adsgram/vue'
import LoaderComponent from './LoaderComponent.vue'

/* =========================
   Types
========================= */

interface Segment {
  label: string
  value: number
  color: string
}

/* =========================
   Emits
========================= */

const emit = defineEmits<{
  (e: 'finish', payload: { index: number; label: string }): void
  (e: 'spinning', spinning: boolean): void
}>()

const spinRewardBlockId = import.meta.env.VITE_SPIN_REWARD_BLOCK_ID

/* =========================
   Composables
========================= */

const { canSpin, spin, fetchStatus } = useSpinWheel()

/* =========================
   Constants
========================= */

const SIZE = 250
const SPINS = 5
const DURATION = 4000
const POINTER_ANGLE = 270 // top

/* =========================
   Segments
========================= */

const segments = computed<Segment[]>(() => [
  { label: '+5', value: 5, color: '#FFE07D' },
  { label: '10', value: 10, color: '#b3e59f' },
  { label: '15', value: 15, color: '#7ca1bc' },
  { label: '20', value: 20, color: '#FFC251' },
  { label: '25', value: 25, color: '#E28086' },
  { label: '30', value: 30, color: '#beddf3' },
  { label: '35', value: 35, color: '#D8BFD8' },
  { label: '40', value: 40, color: '#F4A300' },
])

/* =========================
   State
========================= */

const wheelRef = ref<HTMLDivElement | null>(null)
const spinning = ref(false)
const currentRotation = ref(0)
const resultIndex = ref<number | null>(null)

/* =========================
   Computed
========================= */

const degPer = computed(() => 360 / segments.value.length)

const wheelBackground = computed(() => {
  return `conic-gradient(${segments.value
    .map((s, i) => `${s.color} ${i * degPer.value}deg ${(i + 1) * degPer.value}deg`)
    .join(', ')})`
})

const wheelStyle = computed<CSSProperties>(() => ({
  width: `${SIZE}px`,
  height: `${SIZE}px`,
  borderRadius: '50%',
  background: wheelBackground.value,
  transform: `rotate(${currentRotation.value}deg)`,
  transition: spinning.value ? `transform ${DURATION}ms cubic-bezier(.22,.9,.31,1)` : 'none',
  position: 'relative',
  overflow: 'hidden',
}))

const resultLabel = computed(() =>
  resultIndex.value !== null ? (segments.value[resultIndex.value]?.label ?? '') : '',
)

/* =========================
   Methods
========================= */

function labelStyle(index: number): CSSProperties {
  const rotation = degPer.value * index + degPer.value / 2
  const distance = SIZE * 0.42

  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: '0 0',
    transform: `rotate(${rotation}deg) translate(${distance}px, -50%) rotate(90deg)`,
    color: '#fff',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  }
}

async function handleSpin() {
  if (spinning.value || !canSpin.value) return

  resetWheel() // 🔥 HARD RESET BEFORE EVERY SPIN

  spinning.value = true
  emit('spinning', true)
  resultIndex.value = null

  const res = await spin()
  if (!res) {
    spinning.value = false
    emit('spinning', false)
    return
  }

  const index = segments.value.findIndex((s) => s.value === res.prize)

  if (index === -1) return

  resultIndex.value = index

  const segmentCenter = index * degPer.value + degPer.value / 2

  const targetRotation = SPINS * 360 + (POINTER_ANGLE - segmentCenter)

  currentRotation.value += targetRotation
}

function onTransitionEnd(e: TransitionEvent) {
  if (e.target !== wheelRef.value) return

  resetWheel()

  emit('spinning', false)

  if (resultIndex.value !== null) {
    emit('finish', {
      index: resultIndex.value,
      label: segments.value[resultIndex.value]?.label ?? '',
    })
  }
}
/* =========================
   Lifecycle
========================= */

const loading = ref<boolean>(false)

onMounted(fetchStatus)

function resetWheel() {
  if (!wheelRef.value) return

  // 1️⃣ Disable animation
  spinning.value = false

  // 2️⃣ Normalize angle
  currentRotation.value = currentRotation.value % 360

  // 3️⃣ Force DOM reflow (VERY IMPORTANT)
  void wheelRef.value.offsetHeight

  // 4️⃣ Re-enable animation on next spin
}

async function watchSpinAd() {
  resetWheel()
  resultIndex.value = null
  const { show, addEventListener } = useAdsgram({
    blockId: spinRewardBlockId,
  })

  addEventListener('onBannerNotFound', () => {
    console.log('No ad available at the moment')
  })
  addEventListener('onTooLongSession', () => {
    console.log('User session too long — ad not available')
  })

  try {
    const result = await show()

    if (result.done && !result.error) {
      loading.value = true
      setTimeout(() => {
        fetchStatus().then(() => {
          loading.value = false
        })
      }, 1000)
    }
  } catch (err) {
    console.log('Error showing ad: ', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LoaderComponent v-if="loading" />
  <div class="spin-wheel-wrapper">
    <SpinPointerIcon class="w-6 -mb-5 z-10 text-[#eaf3f9]" />

    <div
      ref="wheelRef"
      class="wheel border-[#eaf3f9] border-8"
      :style="wheelStyle"
      @transitionend="onTransitionEnd"
    >
      <div
        v-for="(segment, i) in segments"
        :key="segment.value"
        class="label"
        :style="labelStyle(i)"
      >
        {{ segment.label }}
      </div>
    </div>

    <button
      :disabled="spinning"
      v-if="canSpin"
      @click="handleSpin"
      class="w-40 mt-4 disabled:opacity-50 disabled:cursor-not-allowed!"
    >
      <img :src="SpinButtonImage" alt="spin" />
    </button>

    <button v-else class="w-40 mt-4" @click="watchSpinAd">
      <img :src="AdButtonImage" alt="ad" />
    </button>

    <div v-if="resultLabel" class="font-bold mt-2 flex gap-1 items-center">
      <span>You won:</span>
      <span>{{ resultLabel }}</span>
      <img :src="CoinImage" class="w-4 h-4" alt="coin" />
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
