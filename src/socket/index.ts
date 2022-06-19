import http from 'http'
import { Server } from 'socket.io'

const server = http.createServer()

export const io = new Server(server, {
    cors: {
      origin: '*'
    }
})

server.listen(3334, () => console.log('Server started on port 3334'))