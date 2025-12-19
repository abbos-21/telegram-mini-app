import { ref } from 'vue'
import { gameService } from '@/api/gameService'
import { toast } from 'vue3-toastify'

const canSpin = ref(false)
const lastPrize = ref<number | null>(null)
const isSpinning = ref(false)

export function useSpinWheel() {
  const fetchStatus = async () => {
    try {
      const res = await gameService.getSpinWheelStatus()
      canSpin.value = res.data.canSpin
    } catch (err) {
      console.error('Failed to fetch spin status:', err)
    }
  }

  const spin = async () => {
    if (!canSpin.value || isSpinning.value) return null
    isSpinning.value = true

    try {
      const res = await gameService.spinWheel()
      lastPrize.value = res.data.prize
      canSpin.value = false
      setTimeout(() => {
        toast.success(`You won ${lastPrize.value} coins! Keep going!`)
      }, 4000)
      return res.data
    } catch (err) {
      console.error('Spin failed:', err)
      throw err
    } finally {
      isSpinning.value = false
    }
  }

  return {
    canSpin,
    isSpinning,
    lastPrize,
    fetchStatus,
    spin,
  }
}
