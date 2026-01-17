<script setup lang="ts">
import { ref, onMounted } from 'vue'
import kaboom, { Vec2 } from 'kaboom'

const canvas = ref<HTMLCanvasElement | null>(null)

// 1. GAME CONFIGURATION
const CONFIG = {
  FLOOR_HEIGHT: 210,
  OBSTACLE_HEIGHT: 80,
  COIN_WIDTH: 32,
  COIN_SPAWN_MIN: 1.5,
  COIN_SPAWN_MAX: 3,
  JUMP_FORCE: 800,
  SPEED: 640,
  BG_SPEED: 320,
  ACCELERATION: 2, // Pixels per second increase per second
  POINTS_PER_SECOND: 60,
  GRAVITY: 2400,
  WIDTH: 480,
  HEIGHT: 854,
}

onMounted(() => {
  if (!canvas.value) return

  // 2. INITIALIZE KABOOM
  kaboom({
    canvas: canvas.value,
    background: [255, 255, 255],
    width: CONFIG.WIDTH,
    height: CONFIG.HEIGHT,
    letterbox: true,
  })

  // 3. LOAD ASSETS
  loadSprite('player', '/car128.png')
  loadSprite('background', '/background.png')
  loadSprite('ice-cream', '/ice-cream.png')
  loadSprite('coin', '/coin.png')

  // 4. GAME SCENE
  scene('game', () => {
    setGravity(CONFIG.GRAVITY)

    let score = 0
    let coins = 0
    let isGameOver = false
    let gameTime = 0
    let currentSpeed = CONFIG.SPEED
    let currentBgSpeed = CONFIG.BG_SPEED
    const BG_RATIO = CONFIG.BG_SPEED / CONFIG.SPEED

    // -- BACKGROUND --
    for (let i = 0; i < 2; i++) {
      add([
        sprite('background', { width: width(), height: height() }),
        pos(i * width(), 0),
        z(0),
        'bg',
      ])
    }

    // -- BACKGROUND LOOPING & MOVEMENT --
    onUpdate('bg', (b) => {
      if (isGameOver) return
      b.pos.x -= currentBgSpeed * dt()
      if (b.pos.x <= -width()) {
        b.pos.x += width() * 2
      }
    })

    // -- FLOOR --
    add([
      rect(width(), CONFIG.FLOOR_HEIGHT),
      pos(0, height()),
      anchor('botleft'),
      area(),
      body({ isStatic: true }),
      opacity(0),
      'ground',
    ])

    // -- PLAYER --
    const player = add([
      sprite('player', { width: 64 }),
      pos(80, height() - CONFIG.FLOOR_HEIGHT - 128),
      area(),
      body(),
      z(10),
    ])

    // -- UI --
    const scoreLabel = add([text('Score: 0'), pos(24, 24), z(20)])

    const coinLabel = add([text('Coins: 0'), pos(24, 56), z(20)])

    // -- MOVER UPDATE (for obstacles & coins) --
    onUpdate('mover', (m) => {
      if (isGameOver) return
      m.pos.x -= currentSpeed * dt()
    })

    // -- GAME LOOP --
    onUpdate(() => {
      if (isGameOver) return

      gameTime += dt()
      currentSpeed = CONFIG.SPEED + gameTime * CONFIG.ACCELERATION
      currentBgSpeed = currentSpeed * BG_RATIO

      score += CONFIG.POINTS_PER_SECOND * dt()
      scoreLabel.text = `Score: ${Math.floor(score)}`

      if (player.pos.y > height() + 100) {
        go('lose', { score: Math.floor(score), coins })
      }
    })

    // -- CONTROLS --
    function jump() {
      if (isGameOver) return
      if (player.isGrounded()) {
        player.jump(CONFIG.JUMP_FORCE)
      }
    }

    onKeyPress('space', jump)
    onClick(jump)

    // -- FLOATING +1 TEXT --
    function spawnCoinText(p: Vec2) {
      const t = add([
        text('+1', { size: 24 }),
        pos(p),
        anchor('center'),
        color(255, 215, 0),
        opacity(1),
        z(30),
      ])

      tween(t.pos.y, t.pos.y - 40, 0.6, (y) => (t.pos.y = y), easings.easeOutCubic)

      tween(1, 0, 0.6, (o) => (t.opacity = o), easings.linear)

      wait(0.6, () => destroy(t))
    }

    // -- OBSTACLES AND COINS --
    function spawnObstacleWithPossibleCoin() {
      if (isGameOver) return

      const ice = add([
        sprite('ice-cream', { height: CONFIG.OBSTACLE_HEIGHT }),
        area(),
        body({ isStatic: true }),
        pos(width(), height() - CONFIG.FLOOR_HEIGHT),
        anchor('botleft'),
        z(5),
        'obstacle',
        'mover',
      ])

      // Decide whether to spawn coin near this obstacle
      if (rand() < 0.65) {
        // ~65% chance of coin near this obstacle
        const side = randi(0, 2) // 0 = before, 1 = after, 2 = above

        let coinX: number
        let coinY: number

        const floorTop = height() - CONFIG.FLOOR_HEIGHT

        if (side === 0) {
          // before obstacle
          coinX = ice.pos.x - rand(100, 220)
          coinY = rand(floorTop - 140, floorTop - 40)
        } else if (side === 1) {
          // after obstacle
          coinX = ice.pos.x + rand(120, 260)
          coinY = rand(floorTop - 140, floorTop - 40)
        } else {
          // above the ice-cream (jump over)
          coinX = ice.pos.x + rand(20, 60) // slightly offset
          coinY = floorTop - CONFIG.OBSTACLE_HEIGHT - rand(60, 140)
        }

        add([
          sprite('coin', { width: CONFIG.COIN_WIDTH }),
          area(),
          pos(coinX, coinY),
          anchor('center'),
          z(5),
          'coin',
          'mover',
        ])
      }

      wait(rand(0.7, 1.2), spawnObstacleWithPossibleCoin)
    }

    wait(3, spawnObstacleWithPossibleCoin)

    // -- COLLISIONS --
    player.onCollide('obstacle', () => {
      if (isGameOver) return
      isGameOver = true

      shake(16)

      wait(1, () => go('lose', { score: Math.floor(score), coins }))
    })

    player.onCollide('coin', (coin) => {
      coins++
      coinLabel.text = `Coins: ${coins}`
      spawnCoinText(coin.pos)
      destroy(coin)
    })
  })

  // 5. LOSE SCENE
  scene('lose', (data: { score: number; coins: number }) => {
    add([sprite('background', { width: width(), height: height() }), pos(0, 0), fixed(), z(-1)])

    add([
      text(`Score: ${data.score}\nCoins Collected: ${data.coins}\n\nPress Space to Restart`, {
        align: 'center',
      }),
      pos(center()),
      anchor('center'),
    ])

    onKeyPress('space', () => go('game'))
    onClick(() => go('game'))
  })

  go('game')
  canvas.value?.focus()
})
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
