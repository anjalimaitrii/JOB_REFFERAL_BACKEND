import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

export const refundQueue = new Queue("refundQueue", {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        tls: {},
        maxRetriesPerRequest: null,

    }
});