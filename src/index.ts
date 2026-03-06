import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth';
import connectDB from './config/db';
import companyRoutes from './routes/company';
import requestRoutes from './routes/request';
import { Server } from 'socket.io';
import http from 'http';
import { initSocket } from "./socket";
import chatRoutes from './routes/chat';
import collegeRoutes from './routes/college';
import adminRoutes from './routes/admin';
import notificationRoutes from './routes/notification';
import successStoriesRoutes from './routes/successStories';
import postRoutes from './routes/post'
import followRoutes from './routes/follow'


const app = express();
connectDB();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend Connected' })
});

app.use('/api/auth', authRoutes)
app.use("/api/company", companyRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/success-stories', successStoriesRoutes);
app.use('/api/posts', postRoutes)
app.use('/api/follow', followRoutes)



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});