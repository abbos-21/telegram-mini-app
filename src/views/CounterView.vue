<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import { socket } from '@/api/socket'

const counter = ref<number>(0)

const connectionStatus = ref<string>('Connecting...')

const EVENT_NAME = 'counterUpdate'

const handleCounterUpdate = (value: number) => {
  counter.value = value
}

onMounted(() => {
  if (socket.connected) {
    connectionStatus.value = 'Connected ✅'
  }

  socket.on(EVENT_NAME, handleCounterUpdate)

  socket.on('connect', () => {
    connectionStatus.value = 'Connected ✅'
  })
  socket.on('disconnect', () => {
    connectionStatus.value = 'Disconnected 🛑'
  })
})

onUnmounted(() => {
  socket.off(EVENT_NAME, handleCounterUpdate)
})
</script>

<template>
  <div class="counter-container">
    <h1>Real-Time Counter from Loop</h1>
    <div id="counter-value">{{ counter }}</div>
    <p class="status">{{ connectionStatus }}</p>
  </div>
</template>

<style scoped>
.counter-container {
  text-align: center;
  padding: 40px;
}
#counter-value {
  font-size: 5em;
  font-weight: bold;
  color: #007bff;
  margin: 20px 0;
}
.status {
  margin-top: 20px;
  font-style: italic;
  color: #6c757d;
}
</style>
