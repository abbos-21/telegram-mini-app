// import { io } from 'socket.io-client'

// export const socket = io('http://localhost:8080', {
//   transports: ['websocket'],
//   reconnection: true,
// })

import { io } from 'socket.io-client'

const URL = 'http://localhost:8080'

const token = localStorage.getItem('token')
console.log(token)

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  transports: ['websocket', 'polling'],
  auth: {
    token,
  },
})

socket.on('connect', () => {
  console.log('Socket.IO client connected.')
})

socket.on('disconnect', (reason) => {
  console.log(`Socket.IO client disconnected: ${reason}`)
})
