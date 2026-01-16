<script setup lang="ts">
import { ref, onMounted } from 'vue'
import kaboom from 'kaboom'

const canvas = ref<HTMLCanvasElement | null>(null)

// 1. GAME CONFIGURATION
const CONFIG = {
  FLOOR_HEIGHT: 210,
  OBSTACLE_HEIGHT: 80,
  JUMP_FORCE: 800,
  SPEED: 640,
  BG_SPEED: 320,
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
  loadSprite('player', '/car.png')
  loadSprite('background', '/background.png')
  loadSprite('ice-cream', '/ice-cream.png')

  // 4. GAME SCENE
  scene('game', () => {
    setGravity(CONFIG.GRAVITY)
    let score = 0
    let isGameOver = false

    // -- LAYERS & BACKGROUND --
    for (let i = 0; i < 2; i++) {
      add([
        sprite('background', { width: width(), height: height() }),
        pos(i * width(), 0),
        move(LEFT, CONFIG.BG_SPEED),
        area(),
        z(0),
        'bg',
      ])
    }

    onUpdate('bg', (b) => {
      if (isGameOver) return
      if (b.pos.x <= -width()) {
        b.pos.x += width() * 2
      }
    })

    // -- STATIC FLOOR --
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
      sprite('player'),
      pos(80, height() - CONFIG.FLOOR_HEIGHT - 100),
      area(),
      body(),
      z(10),
    ])

    // -- UI --
    const scoreLabel = add([text('0'), pos(24, 24), z(20)])

    // -- GAME LOOP --
    onUpdate(() => {
      if (isGameOver) return

      score++
      scoreLabel.text = score.toString()

      if (player.pos.y > height() + 100) {
        go('lose', score)
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

    // -- OBSTACLES --
    function spawnIceCream() {
      if (isGameOver) return

      add([
        sprite('ice-cream', { height: CONFIG.OBSTACLE_HEIGHT }),
        area(),
        // FIX: Make obstacle solid so the player can land on it
        body({ isStatic: true }),
        pos(width(), height() - CONFIG.FLOOR_HEIGHT),
        anchor('botleft'),
        move(LEFT, CONFIG.SPEED),
        offscreen({ destroy: true }),
        z(5),
        'obstacle',
      ])

      wait(rand(0.5, 1.25), spawnIceCream)
    }

    wait(2, spawnIceCream)

    // -- COLLISIONS --
    player.onCollide('obstacle', () => {
      if (isGameOver) return
      isGameOver = true

      shake(16)

      // 1. Stop Background Movement
      get('bg').forEach((bg) => {
        bg.unuse('move')
      })

      // 2. Stop Obstacle Movement
      // Because it has body({ isStatic: true }), it now becomes a
      // solid stationary platform the car can rest on.
      get('obstacle').forEach((obs) => {
        obs.unuse('move')
      })

      // 3. Wait a moment before switching scene
      wait(1, () => go('lose', score))
    })
  })

  // 5. LOSE SCENE
  scene('lose', (finalScore) => {
    // Background (same as game)
    add([
      sprite('background'),
      pos(0, 0),
      scale(width() / sprite('background').width, height() / sprite('background').height),
      fixed(),
      z(-1),
    ])

    add([
      text(`Score: ${finalScore}\n\nPress Space to Restart`, { align: 'center' }),
      pos(center()),
      anchor('center'),
    ])

    onKeyPress('space', () => go('game'))
    onClick(() => go('game'))
  })

  go('game')
  canvas.value.focus()
})
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
