<script setup lang="ts">
import { ref, onMounted } from "vue"
import kaboom from "kaboom"

const canvas = ref<HTMLCanvasElement | null>(null)

/* =======================
   SCALE
======================= */
const SCALE = 0.5 // 4x lower resolution

const s = (v: number) => v * SCALE

/* =======================
   GAME CONFIG
======================= */
const CONFIG = {
  WIDTH: s(480),
  HEIGHT: s(854),

  FLOOR_HEIGHT: s(210),
  OBSTACLE_HEIGHT: s(80),

  COIN_WIDTH: s(32),

  JUMP_FORCE: s(800),
  GRAVITY: s(2400),

  SPEED: s(400),
  BG_SPEED: s(300),
  ACCELERATION: s(2),

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
    pixelDensity: 1, // important for low-res
  })

  /* =======================
     ASSETS
  ======================= */
  try {
    await Promise.all([
      k.loadSprite("player", "/car128.png"),
      k.loadSprite("background", "/background.png"),
      k.loadSprite("ice", "/ice-cream.png"),
      k.loadSprite("coin", "/coin.png"),
      k.loadSound("crash", "/crash.mp3"),
      k.loadSound("bg", "/noise.mp3"),
      k.loadSound("collect", "/collect.mp3"),
    ])
  } catch {
    k.add([
      k.text("Asset loading failed 😢", { size: s(28) }),
      k.pos(k.center()),
      k.anchor("center"),
      k.color(255, 80, 80),
    ])
    return
  }

  /* =======================
     GAME SCENE
  ======================= */
  k.scene("game", () => {
    k.setGravity(CONFIG.GRAVITY)

    let score = 0
    let coins = 0
    let gameTime = 0
    let gameOver = false

    /* ---- MUSIC ---- */
    const music = k.play("bg", { loop: true, volume: 0 })
    k.tween(0, 0.6, 1.5, (v) => (music.volume = v))

    /* ---- BACKGROUND ---- */
    for (let i = 0; i < 2; i++) {
      k.add([
        k.sprite("background", {
          width: k.width(),
          height: k.height(),
        }),
        k.pos(i * k.width(), 0),
        "bg",
      ])
    }

    k.onUpdate("bg", (b) => {
      if (gameOver) return
      b.pos.x -= CONFIG.BG_SPEED * k.dt()
      if (b.pos.x <= -k.width()) b.pos.x += k.width() * 2
    })

    /* ---- FLOOR ---- */
    k.add([
      k.rect(k.width(), CONFIG.FLOOR_HEIGHT),
      k.pos(0, k.height()),
      k.anchor("botleft"),
      k.body({ isStatic: true }),
      k.area(),
      k.opacity(0),
    ])

    /* ---- PLAYER ---- */
    const player = k.add([
      k.sprite("player", { width: s(64) }),
      k.pos(s(80), k.height() - CONFIG.FLOOR_HEIGHT - s(128)),
      k.area(),
      k.body(),
      k.z(10),
    ])

    /* ---- UI ---- */
    const scoreText = k.add([
      k.text("Score: 0", { size: s(24) }),
      k.pos(s(20), s(20)),
    ])

    const coinText = k.add([
      k.text("Coins: 0", { size: s(24) }),
      k.pos(s(20), s(52)),
    ])

    /* ---- SPEED ---- */
    const currentSpeed = () =>
      CONFIG.SPEED + gameTime * CONFIG.ACCELERATION

    /* ---- MOVERS ---- */
    k.onUpdate("mover", (m) => {
      if (!gameOver) m.pos.x -= currentSpeed() * k.dt()
    })

    /* ---- GAME LOOP ---- */
    k.onUpdate(() => {
      if (gameOver) return

      gameTime += k.dt()
      score += CONFIG.POINTS_PER_SECOND * k.dt()
      scoreText.text = `Score: ${Math.floor(score)}`

      if (player.pos.y > k.height() + s(100)) {
        music.stop()
        k.go("lose", { score: Math.floor(score), coins })
      }
    })

    /* ---- CONTROLS ---- */
    const jump = () => {
      if (!gameOver && player.isGrounded()) {
        player.jump(CONFIG.JUMP_FORCE)
      }
    }
    k.onKeyPress("space", jump)
    k.onClick(jump)

    /* ---- COIN TEXT ---- */
    const spawnCoinText = (p: { x: number; y: number }) => {
      const t = k.add([
        k.text("+1", { size: s(24) }),
        k.pos(p.x, p.y),
        k.anchor("center"),
        k.color(255, 215, 0),
        k.opacity(1),
      ])
      k.tween(t.pos.y, t.pos.y - s(40), 0.6, (y) => (t.pos.y = y))
      k.tween(1, 0, 0.6, (o) => (t.opacity = o))
      k.wait(0.6, () => k.destroy(t))
    }

    /* ---- SPAWN ---- */
    const spawnObstacle = () => {
      if (gameOver) return

      const floorY = k.height() - CONFIG.FLOOR_HEIGHT
      const timeToNextObstacle = k.rand(0.8, 2.2)

      k.add([
        k.sprite("ice", { height: CONFIG.OBSTACLE_HEIGHT }),
        k.pos(k.width(), floorY),
        k.anchor("botleft"),
        k.area(),
        k.body({ isStatic: true }),
        "obstacle",
        "mover",
      ])

      if (timeToNextObstacle > 1.2) {
        const distanceToNext = currentSpeed() * timeToNextObstacle
        const gapCenterOffset = distanceToNext / 2

        let numCoins = 1
        if (timeToNextObstacle > 1.8) numCoins = k.randi(3, 5)
        else if (timeToNextObstacle > 1.4) numCoins = k.randi(2, 3)

        const spacing = s(55)
        const totalWidth = (numCoins - 1) * spacing
        const startX =
          k.width() + gapCenterOffset - totalWidth / 2

        const coinY = floorY - s(64)

        for (let i = 0; i < numCoins; i++) {
          k.add([
            k.sprite("coin", { width: CONFIG.COIN_WIDTH }),
            k.pos(startX + i * spacing, coinY),
            k.anchor("center"),
            k.area(),
            "coin",
            "mover",
          ])
        }
      }

      k.wait(timeToNextObstacle, spawnObstacle)
    }

    k.wait(2, spawnObstacle)

    /* ---- COLLISIONS ---- */
    player.onCollide("obstacle", () => {
      if (gameOver) return
      gameOver = true
      k.shake(s(16))
      k.play("crash")
      k.tween(music.volume, 0, 0.8, (v) => (music.volume = v))
      k.wait(1, () =>
        k.go("lose", { score: Math.floor(score), coins }),
      )
    })

    player.onCollide("coin", (c) => {
      k.play("collect")
      coins++
      coinText.text = `Coins: ${coins}`
      spawnCoinText(c.pos)
      k.destroy(c)
    })
  })

  /* =======================
     LOSE SCENE
  ======================= */
  k.scene("lose", (data?: { score: number; coins: number }) => {
    k.add([
      k.sprite("background", {
        width: k.width(),
        height: k.height(),
      }),
    ])

    k.add([
      k.text(
        data
          ? `Score: ${data.score}\nCoins: ${data.coins}\n\nPress Space or Click`
          : "Press Space or Click",
        { align: "center", size: s(28) },
      ),
      k.pos(k.center()),
      k.anchor("center"),
    ])

    k.onKeyPress("space", () => k.go("game"))
    k.onClick(() => k.go("game"))
  })

  k.go("lose")
})
</script>

<template>
  <canvas ref="canvas" tabindex="0"></canvas>
</template>
