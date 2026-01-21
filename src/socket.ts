import jwt from "jsonwebtoken"
import { Server, Socket } from "socket.io"
import Message from "./models/message"

export const initSocket = (io: Server) => {


  io.use((socket, next) => {
    const token = socket.handshake.auth?.token

    console.log(" SOCKET TOKEN RECEIVED:", token)


    if (!token) {
      console.log(" No token in handshake (allowed)")
      return next()
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET!)
      ;(socket as any).user = user
      console.log("SOCKET USER:", user)
      next()
    } catch (err) {
      console.log("JWT ERROR:", err)
      next() 
    }
  })

  io.on("connection", (socket: Socket) => {
    console.log(" Socket connected:", socket.id)

    
    socket.on("join-room", ({ requestId }) => {
      if (!(socket as any).user) return
      socket.join(requestId)
      console.log(" Joined room:", requestId)
    })

    
    socket.on("send-message", async ({ requestId, receiver, text }) => {
      const user = (socket as any).user
      if (!user) return

      const msg = await Message.create({
        sender: user._id,
        receiver,
        request: requestId,
        text,
      })

      socket.to(requestId).emit("receive-message", {
        _id: msg._id,
        sender: user._id,
        receiver,
        text,
        createdAt: msg.createdAt,
      })
      
  

    })

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id)
    })
  })
}
