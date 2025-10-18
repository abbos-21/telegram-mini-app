<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Loader from '@/components/Loader.vue'
import { getAllAssets } from '@/utils/assetLoader'

const isAppReady = ref(false)

const handleAssetsLoaded = () => {
  isAppReady.value = true
}
</script>

<template>
  <div class="app-container">
    <!-- Loader Component -->
    <Loader v-if="!isAppReady" :assets="getAllAssets()" @loaded="handleAssetsLoaded" />

    <!-- Main App Content -->
    <div
      v-if="isAppReady"
      class="bg-[url('@/assets/images/home-bg.png')] bg-cover bg-center h-screen w-screen max-w-[425px] bg-no-repeat p-2 pb-[100px]"
    >
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
