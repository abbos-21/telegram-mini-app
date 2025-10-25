<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// import { socket } from '../socket'; // Import the singleton socket instance
import { socket } from '@/api/socket'

// State for the counter value
const counter = ref<number>(0)

const connectionStatus = ref<string>('Connecting...')

// The unique event name from the server
const EVENT_NAME = 'counterUpdate'

// Function to handle the incoming socket message
const handleCounterUpdate = (value: number) => {
  // Update the reactive counter variable
  counter.value = value
}

// Lifecycle hook to register the socket listener
// ... (imports and state remain the same)

// Lifecycle hook to register the socket listener
onMounted(() => {
  // 1. **CRITICAL FIX:** Check current status on mount
  if (socket.connected) {
    connectionStatus.value = 'Connected ✅'
  }
  // If not connected, it remains 'Connecting...' until the 'connect' event fires

  // 2. Register listeners for future changes
  socket.on(EVENT_NAME, handleCounterUpdate)

  // Listen for connection status changes
  socket.on('connect', () => {
    connectionStatus.value = 'Connected ✅' // This handles disconnections/reconnections
  })
  socket.on('disconnect', () => {
    connectionStatus.value = 'Disconnected 🛑'
  })
})

// ... (onUnmounted and template remain the same)

// Lifecycle hook to clean up the listener to prevent memory leaks/multiple connections
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
