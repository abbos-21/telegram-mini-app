// Asset loader utility to collect all media assets from the project

export const getAllAssets = (): string[] => {
  const assets: string[] = []

  // Images from assets/images
  const imageAssets = [
    '@/assets/images/home-bg.png',
    '@/assets/images/main-bg.png',
    '@/assets/images/man.png',
    '@/assets/images/uk-flag.png',
    '@/assets/images/music.png',
    '@/assets/images/level-green.png',
    '@/assets/images/heart.png',
    '@/assets/images/level-blue.png',
    '@/assets/images/flash.png',
    '@/assets/images/collect-bg.png',
    '@/assets/images/bottle.png',
    '@/assets/images/spin.png',
    '@/assets/images/home.png',
    '@/assets/images/shop.png',
    '@/assets/images/task.png',
    '@/assets/images/friends.png',
  ]

  // Audio files
  const audioAssets = ['@/assets/audios/bg-music.mp3']

  // SVG icons
  const iconAssets = ['@/assets/icons/coin.svg']

  // Combine all assets
  assets.push(...imageAssets, ...audioAssets, ...iconAssets)

  return assets
}

// Alternative method to dynamically collect assets
export const collectAssetsFromComponents = (): string[] => {
  const assets: string[] = []

  // This could be extended to scan Vue components and extract asset references
  // For now, we'll use the static list above

  return getAllAssets()
}

// Validate asset paths
export const validateAsset = async (src: string): Promise<boolean> => {
  try {
    // Convert @ alias to actual path if needed
    const actualPath = src.replace('@/', '/src/')

    // Try to fetch the asset
    const response = await fetch(actualPath, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}
