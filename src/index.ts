import express , {Request ,Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import connectDB from './config/db';
import companyRoutes from './routes/company';
import requestRoutes from './routes/request';
import {Server} from 'socket.io';
import http from 'http';
import { initSocket } from "./socket";
import chatRoutes from './routes/chat';

dotenv.config();

 const app =express();
 connectDB();
 app.use(cors());
app.use(express.json());

app.get('/api/health',(_req:Request,res:Response)=>{
    res.json({status:'ok', message:'Backend Connected'})
});

app.use('/api/auth', authRoutes)
app.use("/api/company", companyRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/chat", chatRoutes);



const server= http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});