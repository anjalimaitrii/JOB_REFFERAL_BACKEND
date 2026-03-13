import { Request, Response } from "express";
import RequestModel from "../models/request";
import Notification from "../models/notification";


export const markPaymentSuccess = async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;

        const request = await RequestModel.findByIdAndUpdate(
            requestId,
            { paymentStatus: "paid" },
            { new: true }
        );

        res.json({
            message: "Payment marked successful",
            data: request
        });
    } catch (err) {
        res.status(500).json({ message: "Payment update failed" });
    }
};

export const paymentSuccess = async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;

        const request = await RequestModel.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // payment status update
        request.paymentStatus = "paid";

        // 48 hours deadline
        // request.referralDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);

        await request.save();
        console.log("Creating notification");

        // 🔔 Employee notification
        await Notification.create({
            receiver: request.receiver,
            sender: request.sender,
            type: "payment_success_employee",
            request: request._id,
        });

        // 🔔 Student notification
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