<script setup lang="ts">
import { ref, onMounted } from 'vue'
import kaboom from 'kaboom'

const canvas = ref<HTMLCanvasElement | null>(null)

// 1. GAME CONFIGURATION (unchanged)
const CONFIG = {
  FLOOR_HEIGHT: 210,
  OBSTACLE_HEIGHT: 80,
  COIN_WIDTH: 32,
  COIN_SPAWN_MIN: 1.5,
  COIN_SPAWN_MAX: 3,
  JUMP_FORCE: 800,
  SPEED: 400,
  BG_SPEED: 300,
  ACCELERATION: 2,
  POINTS_PER_SECOND: 60,
  GRAVITY: 2400,
  WIDTH: 480,
  HEIGHT: 854,
}

onMounted(async () => {
  if (!canvas.value) return

  // 2. INITIALIZE KABOOM
  const k = kaboom({
    canvas: canvas.value,
    background: [255, 255, 255],
    width: CONFIG.WIDTH,
    height: CONFIG.HEIGHT,
    letterbox: true,
    pixelDensity: 1,
  })

  // 3. LOAD ALL ASSETS AND WAIT
  try {
    await Promise.all([
      k.loadSprite('player', '/car128.png'),
      k.loadSprite('background', '/background.png'),
      k.loadSprite('ice-cream', '/ice-cream.png'),
      k.loadSprite('coin', '/coin.png'),
      k.loadSound('crash', './crash.mp3'),
      k.loadSound('bgMusic', '/noise.mp3'), // update path if needed
      k.loadSound('collect', '/collect.mp3'), // update path if needed
    ])
  } catch (err) {
    console.error('Failed to load assets:', err)
    k.add([
      k.text('Failed to load game assets 😢\nCheck file paths and try again', {
        size: 28,
        align: 'center',
      }),
      k.pos(k.center()),
      k.anchor('center'),
      k.color(255, 80, 80),
    ])
    return
  }

  // 4. GAME SCENE
  k.scene('game', () => {
    k.setGravity(CONFIG.GRAVITY)

    let score = 0
    let coins = 0
    let isGameOver = false
    let gameTime = 0
    let currentSpeed = CONFIG.SPEED
    let currentBgSpeed = CONFIG.BG_SPEED
    const BG_RATIO = CONFIG.BG_SPEED / CONFIG.SPEED

    const music = k.play('bgMusic', {
      loop: true,
      volume: 0,
    })
    k.tween(0, 0.6, 1.5, (v) => (music.volume = v), k.easings.easeInOutQuad)

    // -- BACKGROUND --
    for (let i = 0; i < 2; i++) {
      k.add([
        k.sprite('background', { width: k.width(), height: k.height() }),
        k.pos(i * k.width(), 0),
        k.z(0),
        'bg',
      ])
    }

    // -- BACKGROUND LOOPING & MOVEMENT --
    k.onUpdate('bg', (b) => {
      if (isGameOver) return
      b.pos.x -= currentBgSpeed * k.dt()
      if (b.pos.x <= -k.width()) {
        b.pos.x += k.width() * 2
      }
    })

    // -- FLOOR --
    k.add([
      k.rect(k.width(), CONFIG.FLOOR_HEIGHT),
      k.pos(0, k.height()),
      k.anchor('botleft'),
      k.area(),
      k.body({ isStatic: true }),
      k.opacity(0),
      'ground',
    ])

    // -- PLAYER --
    const player = k.add([
      k.sprite('player', { width: 64 }),
      k.pos(80, k.height() - CONFIG.FLOOR_HEIGHT - 128),
      k.area(),
      k.body(),
      k.z(10),
    ])

    // -- UI --
    const scoreLabel = k.add([k.text('Score: 0'), k.pos(24, 24), k.z(20)])
    const coinLabel = k.add([k.text('Coins: 0'), k.pos(24, 56), k.z(20)])

    // -- MOVER UPDATE --
    k.onUpdate('mover', (m) => {
      if (isGameOver) return
      m.pos.x -= currentSpeed * k.dt()
    })

    // -- GAME LOOP --
    k.onUpdate(() => {
      if (isGameOver) return

      gameTime += k.dt()
      currentSpeed = CONFIG.SPEED + gameTime * CONFIG.ACCELERATION
      currentBgSpeed = currentSpeed * BG_RATIO

      score += CONFIG.POINTS_PER_SECOND * k.dt()
      scoreLabel.text = `Score: ${Math.floor(score)}`

      if (player.pos.y > k.height() + 100) {
        music.stop()
        k.go('lose', { score: Math.floor(score), coins })
      }
    })

    // -- CONTROLS --
    function jump() {
      if (isGameOver) return
      if (player.isGrounded()) {
        player.jump(CONFIG.JUMP_FORCE)
      }
    }
    k.onKeyPress('space', jump)
    k.onClick(jump)

    // -- FLOATING +1 TEXT --
    function spawnCoinText(p: { x: number; y: number }) {
      const t = k.add([
        k.text('+1', { size: 24 }),
        k.pos(k.vec2(p.x, p.y)),
        k.anchor('center'),
        k.color(255, 215, 0),
        k.opacity(1),
        k.z(30),
      ])
      k.tween(t.pos.y, t.pos.y - 40, 0.6, (y) => (t.pos.y = y), k.easings.easeOutCubic)
      k.tween(1, 0, 0.6, (o) => (t.opacity = o), k.easings.linear)
      k.wait(0.6, () => k.destroy(t))
    }

    // -- OBSTACLES AND COINS --
    function spawnObstacleWithPossibleCoin() {
      if (isGameOver) return

      const ice = k.add([
        k.sprite('ice-cream', { height: CONFIG.OBSTACLE_HEIGHT }),
        k.area(),
        k.body({ isStatic: true }),
        k.pos(k.width(), k.height() - CONFIG.FLOOR_HEIGHT),
        k.anchor('botleft'),
        k.z(5),
        'obstacle',
        'mover',
      ])

      if (k.rand() < 0.65) {
        const side = k.randi(0, 2)
        let coinX: number
        let coinY: number
        const floorTop = k.height() - CONFIG.FLOOR_HEIGHT

        if (side === 0) {
          coinX = ice.pos.x - k.rand(100, 220)
          coinY = k.rand(floorTop - 140, floorTop - 40)
        } else if (side === 1) {
          coinX = ice.pos.x + k.rand(120, 260)
          coinY = k.rand(floorTop - 140, floorTop - 40)
        } else {
          coinX = ice.pos.x + k.rand(20, 60)
          coinY = floorTop - CONFIG.OBSTACLE_HEIGHT - k.rand(60, 140)
        }

        k.add([
          k.sprite('coin', { width: CONFIG.COIN_WIDTH }),
          k.area(),
          k.pos(coinX, coinY),
          k.anchor('center'),
          k.z(5),
          'coin',
          'mover',
        ])
      }

      k.wait(k.rand(0.7, 1.2), spawnObstacleWithPossibleCoin)
    }

    k.wait(3, spawnObstacleWithPossibleCoin)

    // -- COLLISIONS --
    player.onCollide('obstacle', () => {
      if (isGameOver) return
      isGameOver = true
      k.shake(16)
      k.play('crash')
      k.tween(music.volume, 0, 0.8, (v) => (music.volume = v), k.easings.easeOutQuad)
      k.wait(0.9, () => music.stop())
      k.wait(1, () => k.go('lose', { score: Math.floor(score), coins }))
    })

    player.onCollide('coin', (coin) => {
      k.play('collect')
      coins++
      coinLabel.text = `Coins: ${coins}`
      spawnCoinText(coin.pos)
      k.destroy(coin)
    })
  })

  // 5. LOSE SCENE
  k.scene('lose', (data: { score: number; coins: number }) => {
    k.add([
      k.sprite('background', { width: k.width(), height: k.height() }),
      k.pos(0, 0),
      k.fixed(),
      k.z(-1),
    ])

    if (data) {
      k.add([
        k.text(
          `Score: ${data.score}\nCoins Collected: ${data.coins}\n\nPress Space or Click to Restart`,
          {
            align: 'center',
          },
        ),
        k.pos(k.center()),
        k.anchor('center'),
      ])
    } else {
      k.add([
        k.text(`Press Space or Click to Restart`, {
          align: 'center',
        }),
        k.pos(k.center()),
        k.anchor('center'),
      ])
    }

    k.onKeyPress('space', () => k.go('game'))
    k.onClick(() => k.go('game'))
  })

  // 6. START THE GAME
  k.go('lose')
  canvas.value?.focus()
})
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
