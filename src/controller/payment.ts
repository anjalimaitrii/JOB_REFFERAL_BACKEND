import { Request, Response } from "express";
import RequestModel from "../models/request";
import Notification from "../models/notification";
import Payment from "../models/payment";


export const paymentSuccess = async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;
        const { amount } = req.body;

        const request = await RequestModel.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        request.paymentStatus = "paid";
        request.amount = amount;

        await request.save();
        await Payment.create({
            student: request.sender,
            employee: request.receiver,
            request: request._id,
            amount: request.amount
        });

        await Notification.create({
            receiver: request.receiver,
            sender: request.sender,
            type: "payment_success_employee",
            request: request._id,
        });

        await Notification.create({
            receiver: request.sender,
            sender: request.receiver,
            type: "payment_success_student",
            request: request._id,
        });

        res.status(200).json({
            message: "Payment marked successful",
        });

    } catch (error) {
        console.error("PAYMENT SUCCESS ERROR 👉", error);
        res.status(500).json({ message: "Server error" });
    }
};