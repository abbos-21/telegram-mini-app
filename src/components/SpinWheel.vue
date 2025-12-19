<script setup lang="ts">
import { ref, computed, type CSSProperties, onMounted } from 'vue'
import { SpinPointerIcon } from '@/assets/icons/winter'
import { AdButtonImage, SpinButtonImage } from '@/assets/images/winter' // CoinImage
import { useSpinWheel } from '@/composables/useSpinWheel'
import LoaderComponent from './LoaderComponent.vue'
import { useAdsgram } from '@adsgram/vue'

const spinRewardBlockId = import.meta.env.VITE_SPIN_REWARD_BLOCK_ID

interface Segment {
  label: string
  value: number
  color: string
}

const { canSpin, lastPrize, spin, fetchStatus } = useSpinWheel()
const isLoading = ref<boolean>(false)

// const wonPrize = ref<number>(5)

const SIZE = 250
const SPINS = 5
const SPIN_DURATION = 4000
const RESET_DURATION = 800
const POINTER_ANGLE = 270

const segments = ref<Segment[]>([
  { label: '+5', value: 5, color: '#FFE07D' },
  { label: '10', value: 10, color: '#b3e59f' },
  { label: '15', value: 15, color: '#7ca1bc' },
  { label: '20', value: 20, color: '#FFC251' },
  { label: '25', value: 25, color: '#E28086' },
  { label: '30', value: 30, color: '#beddf3' },
  { label: '35', value: 35, color: '#D8BFD8' },
  { label: '40', value: 40, color: '#F4A300' },
])

const wheelRef = ref<HTMLDivElement | null>(null)
const spinning = ref(false)
const resetting = ref(false)
const rotation = ref(0)
const resultIndex = ref<number | null>(null)

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
  transform: `rotate(${rotation.value}deg) translateZ(0)`,

  transition: spinning.value
    ? `transform ${SPIN_DURATION}ms cubic-bezier(.22,.9,.31,1)`
    : resetting.value
      ? `transform ${RESET_DURATION}ms ease-in-out`
      : 'none',

  position: 'relative',
  overflow: 'hidden',
  willChange: 'transform',
  backfaceVisibility: 'hidden',
}))

// const resultLabel = computed(() =>
//   resultIndex.value !== null ? segments.value[resultIndex.value]?.label : '',
// )

async function spinWheel() {
  if (spinning.value || resetting.value) return

  await spin()

  const index = segments.value.findIndex((s) => s.value === lastPrize.value)
  if (index === -1) return

  spinning.value = true
  resultIndex.value = index

  const segmentCenter = index * degPer.value + degPer.value / 2

  rotation.value = SPINS * 360 + (POINTER_ANGLE - segmentCenter)
}

// function reset() {
//   if (!wheelRef.value) return

//   resetting.value = true
//   spinning.value = false

//   rotation.value = rotation.value % 360

//   requestAnimationFrame(() => {
//     rotation.value = 0
//   })
// }

async function reset() {
  if (!wheelRef.value) return

  // Add this check to avoid setting resetting=true when no animation is needed
  if (rotation.value % 360 === 0) {
    rotation.value = 0
    resetting.value = false
    spinning.value = false
    return
  }

  resetting.value = true
  spinning.value = false

  rotation.value = rotation.value % 360

  requestAnimationFrame(() => {
    rotation.value = 0
  })
}

function onTransitionEnd(e: TransitionEvent) {
  if (e.target !== wheelRef.value) return

  if (spinning.value) {
    reset()
    return
  }

  if (resetting.value) {
    resetting.value = false
  }
}

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

async function watchAd() {
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
      isLoading.value = true
      setTimeout(async () => {
        try {
          await fetchStatus()
        } finally {
          isLoading.value = false
        }
      }, 1000)
    }
  } catch (err) {
    console.log('Error showing ad: ', err)
  }
}

onMounted(async () => {
  await fetchStatus()
})
</script>

<template>
  <LoaderComponent v-if="isLoading" />
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
      class="w-40 mt-4 disabled:opacity-50"
      :disabled="spinning || resetting"
      @click="spinWheel"
      v-if="canSpin"
    >
      <img :src="SpinButtonImage" alt="spin" />
    </button>

    <button v-else class="w-40 mt-4" @click="watchAd"><img :src="AdButtonImage" alt="ad" /></button>

    <!-- <div v-if="resultLabel" class="font-bold mt-2 flex gap-1 items-center">
      <span>You won:</span>
      <span>{{ resultLabel }}</span>
      <img :src="CoinImage" class="w-4" alt="coin" />
    </div> -->
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
