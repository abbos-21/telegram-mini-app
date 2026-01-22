<script setup lang="ts">
import { ref, onMounted } from 'vue'
import kaboom from 'kaboom'

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

  JUMP_FORCE: 800,
  GRAVITY: 1800,

  SPEED: 380,
  BG_SPEED: 240,
  ACCELERATION: 1.6,

  POINTS_PER_SECOND: 50,
}

/* =======================
   MOUNT
======================= */
onMounted(async () => {
  if (!canvas.value) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const k = kaboom({
    canvas: canvas.value,
    width: CONFIG.WIDTH,
    height: CONFIG.HEIGHT,
    scale: Math.min(
      window.innerWidth / CONFIG.WIDTH,
      window.innerHeight / CONFIG.HEIGHT
    ),
    pixelDensity: dpr,
    background: [255, 255, 255],
    letterbox: true,
  })

  /* =======================
     ASSETS
  ======================= */
  await Promise.all([
    k.loadSprite('player', '/car128.webp'),
    k.loadSprite('background', '/background.webp'),
    k.loadSprite('ice', '/ice-cream.webp'),
    k.loadSprite('coin', '/coin.webp'),
    k.loadSound('crash', '/crash.mp3'),
    k.loadSound('bg', '/noise.mp3'),
    k.loadSound('collect', '/collect.mp3'),
  ])

  /* =======================
     GAME SCENE
  ======================= */
  k.scene('game', () => {
    k.setGravity(CONFIG.GRAVITY)

    let score = 0
    let coins = 0
    let gameTime = 0
    let gameOver = false

    /* ---- MUSIC ---- */
    const music = k.play('bg', {
      loop: true,
      volume: 0.3,
      paused: true,
    })

    const startAudio = () => {
      music.paused = false
    }

    /* ---- BACKGROUND ---- */
    for (let i = 0; i < 2; i++) {
      k.add([
        k.sprite('background', {
          width: k.width(),
          height: k.height(),
        }),
        k.pos(i * k.width(), 0),
        'bg',
      ])
    }

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

    /* ---- SPEED ---- */
    const currentSpeed = () =>
      CONFIG.SPEED + gameTime * CONFIG.ACCELERATION

    /* ---- INPUT ---- */
    const jump = () => {
      if (!gameOver && player.isGrounded()) {
        player.jump(CONFIG.JUMP_FORCE)
      }
    }

    k.onKeyPress('space', jump)
    k.onMousePress(jump)
    k.onTouchStart(() => {
      startAudio()
      jump()
    })

    /* ---- COIN TEXT ---- */
    const spawnCoinText = (p: { x: number; y: number }) => {
      const t = k.add([
        k.text('+1', { size: 22 }),
        k.pos(p.x, p.y),
        k.anchor('center'),
        k.color(255, 215, 0),
        k.opacity(1),
      ])

      k.tween(t.pos.y, t.pos.y - 40, 0.5, y => (t.pos.y = y))
      k.tween(1, 0, 0.5, o => (t.opacity = o))
      k.wait(0.5, () => k.destroy(t))
    }

    /* ---- SPAWN ---- */
    const spawnObstacle = () => {
      if (gameOver) return

      const floorY = k.height() - CONFIG.FLOOR_HEIGHT
      const timeToNext = k.rand(0.8, 2)

      k.add([
        k.sprite('ice', { height: CONFIG.OBSTACLE_HEIGHT }),
        k.pos(k.width(), floorY),
        k.anchor('botleft'),
        k.area(),
        k.body({ isStatic: true }),
        'obstacle',
        'mover',
      ])

      const speed = currentSpeed()
      const gap = speed * timeToNext
      const padding = 160
      const usable = gap - padding * 2

      if (usable > 60 && k.get('coin').length < 12) {
        let count = k.randi(1, 5)
        const spacing = 55
        while ((count - 1) * spacing > usable && count > 0) count--

        const shift = k.rand(0, usable - (count - 1) * spacing)
        const startX = k.width() + padding + shift
        const coinY = floorY - 64

        for (let i = 0; i < count; i++) {
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

      k.wait(timeToNext, spawnObstacle)
    }

    k.wait(2, spawnObstacle)

    /* ---- UPDATE LOOP ---- */
    k.onUpdate(() => {
      if (gameOver) return

      const dt = k.dt()
      gameTime += dt
      score += CONFIG.POINTS_PER_SECOND * dt
      scoreText.text = `Score: ${Math.floor(score)}`

      k.get('bg').forEach(b => {
        b.pos.x -= CONFIG.BG_SPEED * dt
        if (b.pos.x <= -k.width()) b.pos.x += k.width() * 2
      })

      k.get('mover').forEach(m => {
        m.pos.x -= currentSpeed() * dt
        if (m.pos.x < -300) k.destroy(m)
      })

      if (player.pos.y > k.height() + 100) {
        music.stop()
        k.go('lose', { score: Math.floor(score), coins })
      }
    })

    /* ---- COLLISIONS ---- */
    player.onCollide('obstacle', () => {
      if (gameOver) return
      gameOver = true
      k.shake(16)
      k.play('crash')
      k.wait(1, () => k.go('lose', { score: Math.floor(score), coins }))
    })

    player.onCollide('coin', c => {
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
  k.scene('lose', (data?: { score: number; coins: number }) => {
    k.add([
      k.sprite('background', { width: k.width(), height: k.height() }),
    ])

    k.add([
      k.text(
        data ? `Score: ${data.score}\nCoins: ${data.coins}` : '',
        { size: 32, align: 'center' }
      ),
      k.pos(k.center().x, k.center().y - 120),
      k.anchor('center'),
    ])

    const btn = k.add([
      k.rect(240, 80, { radius: 10 }),
      k.pos(k.center()),
      k.color(255, 255, 255),
      k.outline(4),
      k.area(),
      k.anchor('center'),
    ])

    btn.add([
      k.text('START', { size: 32 }),
      k.color(0, 0, 0),
      k.anchor('center'),
    ])

    btn.onClick(() => k.go('game'))
    k.onTouchStart(() => k.go('game'))
  })

  k.go('lose')
})
</script>

<template>
  <canvas
    ref="canvas"
    tabindex="0"
    style="touch-action:none; width:100%; height:100%;"
  />
</template>
