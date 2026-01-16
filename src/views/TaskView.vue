<script setup lang="ts">
import { inject, onMounted } from 'vue'
import WebApp from '@twa-dev/sdk'
import { TealSnowBackgroundImage } from '@/assets/backgrounds/winter'

const navHeight = inject('navHeight')

onMounted(() => {
  WebApp.ready()
  WebApp.expand()
})
</script>

<template>
  <div
    class="w-full h-full bg-cover bg-center bg-no-repeat p-2 relative flex flex-col"
    :style="{ backgroundImage: `url(${TealSnowBackgroundImage})`, paddingBottom: `${navHeight}px` }"
  >
    <div class="flex flex-col gap-2 items-center">
      <h1 class="uppercase text-center text-white text-lg font-bold">task list</h1>

      <div class="flex justify-center gap-4 items-center">
        <RouterLink to="/tasks/main" class="tab" active-class="active"> Main </RouterLink>
        <RouterLink to="/tasks/partner" class="tab relative" active-class="active">
          Partner
          <span
            class="hey-badge absolute w-10 h-5 rounded-full font-bold bg-red-500 text-white -top-2 -right-2 flex justify-center items-center text-xs"
          >
            Hey!
          </span>
        </RouterLink>
      </div>
    </div>

    <RouterView />
  </div>
</template>

<style scoped>
.tab {
  background: transparent;
  border: 1px solid white;
  color: white;
  font-weight: bold;
  border-radius: 9999px;
  text-align: center;
  padding: 0.25rem 2rem;
}

.active {
  background: rgba(4, 4, 4, 0.75);
  border-color: rgba(4, 4, 4, 0.75);
}

@keyframes aggressive-shake {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  10% {
    transform: translate(-2px, -2px) rotate(-5deg);
  }
  20% {
    transform: translate(3px, -1px) rotate(8deg);
  }
  30% {
    transform: translate(-4px, 2px) rotate(-8deg);
  }
  40% {
    transform: translate(4px, -2px) rotate(8deg);
  }
  50% {
    transform: translate(-3px, 3px) rotate(-5deg);
  }
  60% {
    transform: translate(3px, -1px) rotate(5deg);
  }
  70% {
    transform: translate(-2px, 2px) rotate(-8deg);
  }
  80% {
    transform: translate(2px, -3px) rotate(8deg);
  }
  90% {
    transform: translate(-1px, 1px) rotate(-5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.hey-badge {
  animation: aggressive-shake 0.5s ease-in-out infinite;
  /* Optional: make it even more noticeable */
  /* box-shadow: 0 0 8px rgba(239, 68, 68, 0.8); */
}
</style>
