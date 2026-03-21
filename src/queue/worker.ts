import { Worker } from "bullmq";
import RequestModel from "../models/request";
import Payment from "../models/payment";
import User from "../models/user";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Notification from "../models/notification";
import Transaction from "../models/transaction";

dotenv.config();
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/job_referral";

if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongoUri)
        .then(() => console.log("✅ Worker DB Connected"))
        .catch(err => console.error("❌ DB Error:", err));
}

console.log("🚀 Refund Worker Started");
const worker = new Worker(
    "refundQueue",
    async (job) => {
        const { requestId } = job.data;

        const request = await RequestModel.findById(requestId);
        if (!request) return

        // agar employee ne complete kar diya
        if (request.status === "completed") {
            console.log("⏭ Completed → employee already paid");
            return;
        }

        //  agar abhi bhi accepted hai → refund
        if (request.status === "accepted" && request.paymentStatus === "paid") {

            // student ko refund
            await User.findByIdAndUpdate(request.sender, {
                $inc: { wallet: request.amount },
            });
            request.status = "refunded";
            request.paymentStatus = "refunded";
            await request.save();
            const paymentDoc = await Payment.findOne({ request: requestId });

            if (paymentDoc) {
                paymentDoc.status = "refunded";
                await paymentDoc.save();
            }
            await Notification.create({
                receiver: request.sender,
                sender: request.receiver,
                type: "refund_received",
                request: request._id,
            });

            await Transaction.create({
                user: request.sender,
                type: "credit",
                amount: request.amount,
                source: "refund",
                request: request._id,
                description: "Refund for expired request",
            });
            //  employee ko
            await Notification.create({
                receiver: request.receiver,
                sender: request.sender,
                type: "request_expired",
                request: request._id,
            });

        }
    },
    {
        connection: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD,

            tls: {},

            maxRetriesPerRequest: null,
        },
    }
);