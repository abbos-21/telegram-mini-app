import { ref } from 'vue'
import {
  HomeBgImage,
  UkFlagImage,
  MusicImage,
  CollectBgImage,
  BottleImage,
  SpinImage,
  HomeImage,
  ShopImage,
  TaskImage,
  FriendsImage,
} from '@/assets/images'
import { BgMusicAudio } from '@/assets/audios'
import {
  CoinIcon,
  WidthdrawIcon,
  CloseIcon,
  LeftArrowIcon,
  RightArrowIcon,
  AdIcon,
  MoneyBagIcon,
  MealIcon,
  PostBuildingIcon,
} from '@/assets/icons'

// All assets that need to be preloaded
const allAssets: (string | { default: string } | { render: () => unknown } | undefined)[] = [
  // Images
  HomeBgImage,
  UkFlagImage,
  MusicImage,
  CollectBgImage,
  BottleImage,
  SpinImage,
  HomeImage,
  ShopImage,
  TaskImage,
  FriendsImage,
  // Audio
  BgMusicAudio,
  // Icons (these are SVGs, so they load differently)
  CoinIcon,
  WidthdrawIcon,
  CloseIcon,
  LeftArrowIcon,
  RightArrowIcon,
  AdIcon,
  MoneyBagIcon,
  MealIcon,
  PostBuildingIcon,
]

// Asset loading state
export const loadingProgress = ref(0)
export const loadingMessage = ref('Initializing...')
export const isAssetLoadingComplete = ref(false)
export const failedAssets = ref<string[]>([])

// Load a single asset
const loadAsset = (
  src: string | { default: string } | { render: () => unknown } | undefined,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if asset is undefined
    if (!src) {
      resolve()
      return
    }

    // Skip Vue components (SVGs imported as components)
    if (typeof src === 'object' && 'render' in src) {
      resolve()
      return
    }

    // Handle Vite asset imports which come as objects with default property
    const assetUrl = typeof src === 'string' ? src : src.default

    // Check if assetUrl is undefined
    if (!assetUrl) {
      resolve()
      return
    }

    const assetName = assetUrl.split('/').pop() || 'Unknown'

    if (assetUrl.endsWith('.mp3') || assetUrl.endsWith('.wav') || assetUrl.endsWith('.ogg')) {
      // Audio file
      const audio = new Audio()
      audio.preload = 'auto'

      const timeout = setTimeout(() => {
        console.warn(`Audio loading timeout: ${assetName}`)
        reject(new Error(`Timeout loading ${assetName}`))
      }, 10000)

      audio.oncanplaythrough = () => {
        clearTimeout(timeout)
        resolve()
      }

      audio.onerror = () => {
        clearTimeout(timeout)
        reject(new Error(`Failed to load ${assetName}`))
      }

      audio.src = assetUrl
    } else if (assetUrl.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
      // Image file
      const img = new Image()

      const timeout = setTimeout(() => {
        console.warn(`Image loading timeout: ${assetName}`)
        reject(new Error(`Timeout loading ${assetName}`))
      }, 8000)

      img.onload = () => {
        clearTimeout(timeout)
        resolve()
      }

      img.onerror = () => {
        clearTimeout(timeout)
        reject(new Error(`Failed to load ${assetName}`))
      }

      img.src = assetUrl
    } else {
      // For SVGs and other assets, assume they're already loaded
      resolve()
    }
  })
}

// Load all assets with progress tracking
export const preloadAllAssets = async (): Promise<void> => {
  const totalAssets = allAssets.length
  let loadedCount = 0
  const failed: string[] = []

  loadingMessage.value = 'Loading assets...'
  loadingProgress.value = 0

  // Load assets in batches to avoid overwhelming the browser
  const batchSize = 3
  const batches: (string | { default: string } | { render: () => unknown } | undefined)[][] = []

  for (let i = 0; i < allAssets.length; i += batchSize) {
    batches.push(allAssets.slice(i, i + batchSize))
  }

  for (const batch of batches) {
    const batchPromises = batch.map(async (asset) => {
      try {
        await loadAsset(asset)
        loadedCount++
        const progress = Math.round((loadedCount / totalAssets) * 100)
        loadingProgress.value = progress

        // Update message based on progress
        if (progress < 30) {
          loadingMessage.value = 'Loading images...'
        } else if (progress < 60) {
          loadingMessage.value = 'Loading audio...'
        } else if (progress < 90) {
          loadingMessage.value = 'Loading icons...'
        } else {
          loadingMessage.value = 'Finalizing...'
        }
      } catch (error) {
        // Skip Vue components in error handling
        if (typeof asset === 'object' && 'render' in asset) {
          loadedCount++
          const progress = Math.round((loadedCount / totalAssets) * 100)
          loadingProgress.value = progress
          return
        }

        const assetUrl = typeof asset === 'string' ? asset : asset?.default || 'undefined'
        console.error(`Failed to load asset: ${assetUrl}`, error)
        failed.push(assetUrl)
        loadedCount++
        const progress = Math.round((loadedCount / totalAssets) * 100)
        loadingProgress.value = progress
      }
    })

    await Promise.all(batchPromises)
  }

  failedAssets.value = failed
  loadingProgress.value = 100
  loadingMessage.value = 'Ready to play!'
  isAssetLoadingComplete.value = true

  if (failed.length > 0) {
    console.warn(`Failed to load ${failed.length} assets:`, failed)
  }
}

// Reset loading state
export const resetLoadingState = () => {
  loadingProgress.value = 0
  loadingMessage.value = 'Initializing...'
  isAssetLoadingComplete.value = false
  failedAssets.value = []
}
