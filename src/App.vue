<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="bg-[url('@/assets/images/home-bg.png')] bg-cover bg-center h-screen w-screen max-w-[425px] bg-no-repeat p-2 pb-[100px]"
  >
    <RouterView />
  </div>
</template>
