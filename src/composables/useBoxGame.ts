import { ref, onMounted } from 'vue'
import { boxService } from '@/api/boxService'
import { toast } from 'vue3-toastify'
import { starsService } from '@/api/starsService'
import WebApp from '@twa-dev/sdk'

const MAX_OPENS = 3

export function useBoxGame() {
  const loading = ref(false)
  const canPlay = ref(false)
  const sessionId = ref<string | null>(null) // Store current session ID
  const openedCount = ref(0)
  const invoiceLink = ref<string | null>(null)

  // Local state for the grid
  const cards = ref<
    Array<{
      id: number
      flipped: boolean
      reward?: { name: string }
    }>
  >([])

  // --- Payment Logic ---

  async function getInvoiceLink() {
    try {
      const response = await starsService.getBoxGameInvoiceLink()
      invoiceLink.value = response.data.invoiceLink
    } catch {
      console.log('Error getting invoice link')
    }
  }

  async function openInvoice() {
    loading.value = true
    await getInvoiceLink()
    if (!invoiceLink.value) {
      loading.value = false
      return
    }

    WebApp.openInvoice(invoiceLink.value, (status) => {
      if (status === 'paid') {
        loading.value = true
        window.location.reload()
      } else if (status === 'failed') {
        toast.error('Payment failed, please try again')
        loading.value = false
      } else {
        loading.value = false
      }
    })
  }

  async function payWithCoins() {
    loading.value = true
    try {
      await boxService.payWithCoins()
      // After paying, reload logic to start game immediately
      await initGame()
    } catch (e: any) {
      console.error(e)
      toast.error(e.response?.data?.message || 'Not enough coins')
    } finally {
      loading.value = false
    }
  }

  // --- Game Logic ---

  async function initGame() {
    loading.value = true
    try {
      const statusRes = await boxService.getStatus()
      const user = statusRes.data.user

      // Check if there is an existing ACTIVE session (not claimed)
      const activeSession = user.boxSession.find((s) => !s.claimed)

      if (activeSession) {
        // === RESUME STATE ===
        console.log('Resuming active session:', activeSession.id)

        canPlay.value = true
        sessionId.value = activeSession.id
        openedCount.value = activeSession.opened

        // Restore cards from the session rewards
        // The backend 'rewards' array holds the state of which are opened
        cards.value = activeSession.rewards.map((reward, i) => ({
          id: i,
          flipped: !!reward.isOpened, // Restore flipped state
          reward: reward.isOpened ? reward : undefined, // Restore reward data if flipped
        }))
      } else if (user.canPlayBox) {
        // === START NEW GAME ===
        canPlay.value = true
        const startRes = await boxService.startGame()

        sessionId.value = startRes.data.sessionId
        openedCount.value = 0

        cards.value = Array.from({ length: 12 }).map((_, i) => ({
          id: i,
          flipped: false,
        }))
      } else {
        // === NO GAME ===
        canPlay.value = false
        cards.value = []
        sessionId.value = null
      }
    } catch (error) {
      console.error('Failed to init game', error)
      toast.error('Connection error')
    } finally {
      loading.value = false
    }
  }

  async function openCard(card: { id: number; flipped: boolean; reward?: { name: string } }) {
    if (!sessionId.value) return
    if (card.flipped) return
    if (openedCount.value >= MAX_OPENS) return

    // Optimistic UI update
    card.flipped = true
    openedCount.value++

    try {
      // Pass sessionId and index (card.id)
      const res = await boxService.openCard(sessionId.value, card.id)
      card.reward = res.data.reward
    } catch (error) {
      console.error(error)
      toast.error('Failed to open card')
      // Revert on failure
      card.flipped = false
      openedCount.value--
    }

    // Check if game is finished
    if (openedCount.value === MAX_OPENS) {
      // Small delay to let user see the last card before claiming
      setTimeout(async () => {
        await finishGame()
      }, 1000)
    }
  }

  async function finishGame() {
    if (!sessionId.value) return

    try {
      loading.value = true
      await boxService.claimRewards(sessionId.value)
      toast.success('Rewards added 🎁')

      // Refresh status (should set canPlay to false)
      await initGame()
    } catch (error) {
      console.error(error)
      toast.error('Failed to claim rewards')
    } finally {
      loading.value = false
    }
  }

  onMounted(initGame)

  return {
    loading,
    canPlay,
    cards,
    openedCount,
    openCard,
    getInvoiceLink,
    openInvoice,
    payWithCoins,
  }
}
