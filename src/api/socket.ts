// import { io } from 'socket.io-client'

// export const socket = io('http://localhost:8080', {
//   transports: ['websocket'],
//   reconnection: true,
// })

// src/socket.ts
import { io } from 'socket.io-client'

const URL = 'http://localhost:8080' // Address of your Node.js server

const token = localStorage.getItem('token')
console.log(token)

// Create the Socket.IO client instance
export const socket = io(URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  auth: {
    token,
  }, // Recommended transports for production
})

// Optional: Add listeners for global connection status
socket.on('connect', () => {
  console.log('Socket.IO client connected.')
})

socket.on('disconnect', (reason) => {
  console.log(`Socket.IO client disconnected: ${reason}`)
})
