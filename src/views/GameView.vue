<script setup lang="ts">
import { ref, onMounted } from 'vue'
import kaboom from 'kaboom'
// import { carGameService } from '@/api/carGameService'

// const loading = ref<boolean>(false)
// const canPlay = ref<boolean>(false)

// const getStatus = async () => {
//   try {
//     const response = await carGameService.getStatus()
//     canPlay.value = response.data.user.canPlayCar
//   } catch (err) {
//     console.log('Error while getting status: ', err)
//   }
// }

const canvas = ref<HTMLCanvasElement | null>(null)

/* =======================
   GAME CONFIG
======================= */
const CONFIG = {
  WIDTH: 480,
  HEIGHT: 854,

  FLOOR_HEIGHT: 210,
  OBSTACLE_HEIGHT: 80,

  COIN_WIDTH: 32,
  COIN_SPAWN_CHANCE: 0.65,

  JUMP_FORCE: 800,
  GRAVITY: 2400,

  SPEED: 400,
  BG_SPEED: 300,
  ACCELERATION: 2,

  POINTS_PER_SECOND: 60,
}

/* =======================
   MOUNT
======================= */
onMounted(async () => {
  if (!canvas.value) return

  const k = kaboom({
    canvas: canvas.value,
    width: CONFIG.WIDTH,
    height: CONFIG.HEIGHT,
    background: [255, 255, 255],
    letterbox: true,
  })

  /* =======================
     ASSETS
  ======================= */
  try {
    await Promise.all([
      k.loadSprite('player', '/car128.webp'),
      k.loadSprite('background', '/background.webp'),
      k.loadSprite('ice', '/ice-cream.webp'),
      k.loadSprite('coin', '/coin.webp'),
      k.loadSound('crash', '/crash.mp3'),
      k.loadSound('bg', '/noise.mp3'),
      k.loadSound('collect', '/collect.mp3'),
    ])
  } catch {
    k.add([
      k.text('Asset loading failed 😢', { size: 28 }),
      k.pos(k.center()),
      k.anchor('center'),
      k.color(255, 80, 80),
    ])
    return
  }

  /* =======================
     GAME SCENE
  ======================= */
  k.scene('game', () => {
    k.setGravity(CONFIG.GRAVITY)

    let score = 0
    let coins = 0
    let gameTime = 0
    let gameOver = false
    // const lastIce: any = null

    /* ---- MUSIC ---- */
    const music = k.play('bg', { loop: true, volume: 0 })
    k.tween(0, 0.6, 1.5, (v) => (music.volume = v))

    /* ---- BACKGROUND ---- */
    for (let i = 0; i < 2; i++) {
      k.add([
        k.sprite('background', { width: k.width(), height: k.height() }),
        k.pos(i * k.width(), 0),
        'bg',
      ])
    }

    k.onUpdate('bg', (b) => {
      if (gameOver) return
      b.pos.x -= CONFIG.BG_SPEED * k.dt()
      if (b.pos.x <= -k.width()) b.pos.x += k.width() * 2
    })

    /* ---- FLOOR ---- */
    k.add([
      k.rect(k.width(), CONFIG.FLOOR_HEIGHT),
      k.pos(0, k.height()),
      k.anchor('botleft'),
      k.body({ isStatic: true }),
      k.area(),
      k.opacity(0),
    ])

    /* ---- PLAYER ---- */
    const player = k.add([
      k.sprite('player', { width: 64 }),
      k.pos(80, k.height() - CONFIG.FLOOR_HEIGHT - 128),
      k.area(),
      k.body(),
      k.z(10),
    ])

    /* ---- UI ---- */
    const scoreText = k.add([k.text('Score: 0'), k.pos(20, 20)])
    const coinText = k.add([k.text('Coins: 0'), k.pos(20, 52)])

    /* ---- MOVERS ---- */
    k.onUpdate(() => {
      if (gameOver) return

      k.get("mover").forEach((m) => {
        m.pos.x -= currentSpeed() * k.dt()

        if (m.pos.x < -200) {
          k.destroy(m)
        }
      })
    })

    /* ---- SPEED ---- */
    const currentSpeed = () => CONFIG.SPEED + gameTime * CONFIG.ACCELERATION

    /* ---- GAME LOOP ---- */
    k.onUpdate(() => {
      if (gameOver) return

      gameTime += k.dt()
      score += CONFIG.POINTS_PER_SECOND * k.dt()
      scoreText.text = `Score: ${Math.floor(score)}`

      if (player.pos.y > k.height() + 100) {
        music.stop()
        k.go('lose', { score: Math.floor(score), coins })
      }
    })

    /* ---- CONTROLS ---- */
    const jump = () => {
      if (!gameOver && player.isGrounded()) {
        player.jump(CONFIG.JUMP_FORCE)
      }
    }
    k.onKeyPress('space', jump)
    k.onClick(jump)

    /* ---- COIN TEXT ---- */
    const spawnCoinText = (p: { x: number; y: number }) => {
      const t = k.add([
        k.text('+1', { size: 24 }),
        k.pos(p.x, p.y),
        k.anchor('center'),
        k.color(255, 215, 0),
        k.opacity(1),
      ])
      k.tween(t.pos.y, t.pos.y - 40, 0.6, (y) => (t.pos.y = y))
      k.tween(1, 0, 0.6, (o) => (t.opacity = o))
      k.wait(0.6, () => k.destroy(t))
    }

    /* ---- SPAWN ---- */
    // const spawnObstacle = () => {
    //   if (gameOver) return

    //   const floorY = k.height() - CONFIG.FLOOR_HEIGHT

    //   const ice = k.add([
    //     k.sprite("ice", { height: CONFIG.OBSTACLE_HEIGHT }),
    //     k.pos(k.width(), floorY),
    //     k.anchor("botleft"),
    //     k.area(),
    //     k.body({ isStatic: true }),
    //     "obstacle",
    //     "mover",
    //   ])

    //   // Spawn coin group between lastIce and this ice
    //   if (lastIce) {
    //     const gapDistance = ice.pos.x - lastIce.pos.x

    //     // Number of coins based on gap size (1-5)
    //     let numCoins = 1
    //     if (gapDistance > 900) {
    //       numCoins = k.randi(4, 5)
    //     } else if (gapDistance > 650) {
    //       numCoins = k.randi(3, 4)
    //     } else if (gapDistance > 400) {
    //       numCoins = k.randi(2, 3)
    //     } else if (gapDistance > 200) {
    //       numCoins = k.randi(1, 2)
    //     }

    //     const midX = (lastIce.pos.x + ice.pos.x) / 2
    //     // const coinY = k.rand(floorY - 220, floorY - 80)
    //     const coinY = floorY - 64

    //     const spacing = 55
    //     const totalWidth = (numCoins - 1) * spacing
    //     const startX = midX - totalWidth / 2

    //     for (let i = 0; i < numCoins; i++) {
    //       k.add([
    //         k.sprite("coin", { width: CONFIG.COIN_WIDTH }),
    //         k.pos(startX + i * spacing, coinY),
    //         k.anchor("center"),
    //         k.area(),
    //         "coin",
    //         "mover",
    //       ])
    //     }
    //   }

    //   lastIce = ice

    //   k.wait(k.rand(0.8, 1.5), spawnObstacle)
    // }

    // k.wait(2, spawnObstacle)

    /* ---- SPAWN ---- */
    const spawnObstacle = () => {
      if (gameOver) return

      const floorY = k.height() - CONFIG.FLOOR_HEIGHT

      // 1. Determine gap time (randomized for gameplay variety)
      const timeToNext = k.rand(0.6, 2.4)

      // 2. Spawn current Obstacle (The "Left" wall of the gap)
      k.add([
        k.sprite('ice', { height: CONFIG.OBSTACLE_HEIGHT }),
        k.pos(k.width(), floorY),
        k.anchor('botleft'),
        k.area(),
        k.body({ isStatic: true }),
        'obstacle',
        'mover',
      ])

      // 3. Calculate Coin Placement
      const speed = currentSpeed()
      const totalGapDistance = speed * timeToNext

      // Safety buffer: Minimum distance from an ice cream (in pixels)
      // 160px ensures the player isn't mid-jump when coins appear
      const safetyPadding = 160

      // Available space for coins = Total Gap - (Padding on left + Padding on right)
      const usableSpace = totalGapDistance - safetyPadding * 2

      // Only spawn coins if the gap is wide enough
      if (usableSpace > 50) {
        // Randomize number of coins (1 to 5)
        let numCoins = k.randi(1, 6)
        const spacing = 55
        let groupWidth = (numCoins - 1) * spacing

        // If the random group is too wide for the gap, reduce coin count
        while (groupWidth > usableSpace && numCoins > 0) {
          numCoins--
          groupWidth = (numCoins - 1) * spacing
        }

        if (numCoins > 0) {
          // RANDOMIZE POSITION:
          // We can shift the group anywhere within the usable space
          const maxShift = usableSpace - groupWidth
          const randomShift = k.rand(0, maxShift)

          // Final X = ScreenEdge + Padding + RandomShift
          const startX = k.width() + safetyPadding + randomShift
          const coinY = floorY - 64

          for (let i = 0; i < numCoins; i++) {
            k.add([
              k.sprite('coin', { width: CONFIG.COIN_WIDTH }),
              k.pos(startX + i * spacing, coinY),
              k.anchor('center'),
              k.area(),
              'coin',
              'mover',
            ])
          }
        }
      }

      // 4. Wait for next cycle
      k.wait(timeToNext, spawnObstacle)
    }

    // Start the loop
    k.wait(3, spawnObstacle)

    /* ---- COLLISIONS ---- */
    player.onCollide('obstacle', () => {
      if (gameOver) return
      gameOver = true
      k.shake(16)
      k.play('crash')
      k.tween(music.volume, 0, 0.8, (v) => (music.volume = v))
      k.wait(1, () => k.go('lose', { score: Math.floor(score), coins }))
    })

    player.onCollide('coin', (c) => {
      k.play('collect')
      coins++
      coinText.text = `Coins: ${coins}`
      spawnCoinText(c.pos)
      k.destroy(c)
    })
  })

  /* =======================
     LOSE SCENE
  ======================= */
  // k.scene("lose", (data?: { score: number; coins: number }) => {
  //   k.add([
  //     k.sprite("background", { width: k.width(), height: k.height() }),
  //   ])

  //   k.add([
  //     k.text(
  //       data
  //         ? `Score: ${data.score}\nCoins: ${data.coins}\n\nPress Space or Click`
  //         : "Press Space or Click",
  //       { align: "center" },
  //     ),
  //     k.pos(k.center()),
  //     k.anchor("center"),
  //   ])

  //   k.onKeyPress("space", () => k.go("game"))
  //   k.onClick(() => k.go("game"))
  // })

  k.scene('lose', (data?: { score: number; coins: number }) => {
    // 1. Add Background
    k.add([k.sprite('background', { width: k.width(), height: k.height() })])

    // 2. Add Score Text
    k.add([
      k.text(data ? `Score: ${data.score}\nCoins: ${data.coins}` : '', {
        size: 32,
        align: 'center',
      }),
      k.pos(k.center().x, k.center().y - 100),
      k.anchor('center'),
    ])

    // 3. Create the Button
    const btn = k.add([
      k.rect(240, 80, { radius: 8 }), // Shape and size
      k.pos(k.center()), // Positioned in the middle
      k.color(255, 255, 255), // Button color
      k.outline(4), // Border
      k.area(), // Required for clicking
      k.anchor('center'),
    ])

    // 4. Add Text inside the Button
    btn.add([
      k.text('START', { size: 32 }),
      k.color(0, 0, 0), // Text color (black)
      k.anchor('center'),
    ])

    // 5. Button Logic
    btn.onClick(() => {
      k.go('game') // Only go to game if button is clicked
    })
  })

  k.go('lose')
})
</script>

<template>
  <canvas ref="canvas" tabindex="0"></canvas>
</template>
