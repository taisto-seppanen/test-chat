import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'

const app = express()
const port = 3001
const clients = new Set()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  clients.add(ws)

  ws.on('message', function message(data) {
    const message = JSON.parse(data)
    message.time = new Date().toLocaleTimeString()
    sendMessageToUsers(message)
  })
  console.log('User connected')
})

function sendMessageToUsers(message) {
  clients.forEach(client => client.send(JSON.stringify(message)))
}

server.listen(port, () => {
  console.log(`Application is running`)
})