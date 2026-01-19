import express , {Request ,Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import connectDB from './config/db';
import companyRoutes from './routes/company';
import requestRoutes from './routes/request';



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



const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});