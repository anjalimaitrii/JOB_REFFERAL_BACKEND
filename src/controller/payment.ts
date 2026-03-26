import { Request, Response } from "express";
import RequestModel from "../models/request";
import Notification from "../models/notification";
import Payment from "../models/payment";
import { refundQueue } from "../queue/refundQueue";
import Transaction from "../models/transaction";
import User from "../models/user";


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
            amount: request.amount,
            status: "paid",
        });
        await Transaction.create({
            user: request.sender,
            type: "debit",
            amount: request.amount,
            source: "payment",
            request: request._id,
            description: "Paid for referral",
        });

        console.log("🚀 Adding job to queue...");

        await refundQueue.add(
            "autoRefund",
            { requestId: request._id },
            {
                delay: 2 * 60 * 1000,
                // delay: 48 * 60 * 60 * 1000, 
            }
        );
        console.log("✅ Job added!");
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

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const transactions = await Transaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        console.error("GET TRANSACTIONS ERROR 👉", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find()
            .populate({
                path: "user",
                select: "name email profilePhoto company role",
                populate: {
                    path: "company",
                    select: "name logo industry location",
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        console.error("GET ALL TRANSACTIONS ERROR 👉", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const withdrawAmount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.wallet < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Deduct from wallet
        user.wallet -= amount;
        await user.save();

        // Create transaction record
        await Transaction.create({
            user: userId,
            type: "debit",
            amount,
            source: "withdrawal",
            description: "Withdrawal request",
            status: "pending",
        });

        res.status(200).json({
            success: true,
            message: "Withdrawal request processed correctly",
        });
    } catch (error) {
        console.error("WITHDRAW AMOUNT ERROR 👉", error);
        res.status(500).json({ message: "Server error" });
    }
};
