import { Request, Response } from "express";
import RequestModel from "../models/request";
import Notification from "../models/notification";
import Payment from '../models/payment';
import User from '../models/user';
import Transaction from "../models/transaction";

export const sendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user._id;
    const { receiver, company, role, jobId } = req.body;

    if (!receiver) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const existingRequest = await RequestModel.findOne({
      sender: senderId,
      receiver,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const request = await RequestModel.create({
      sender: senderId,
      receiver,
      company,
      role,
      jobId,
      status: "pending",
    });
    await Notification.create({
      receiver: receiver,
      sender: senderId,
      type: "request_received",
      request: request._id,
    });
    res.status(201).json({
      message: "Request sent successfully",
      data: request,
    });
  } catch (error) {
    console.log("SEND REQUEST ERROR 👉", error);
    res.status(500).json({ message: error });
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const employeeId = (req as any).user._id;

    const requests = await RequestModel.find({
      receiver: employeeId,
    })
      .populate("sender")
      .populate("company", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Employee requests fetched",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const employeeId = (req as any).user._id;
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await RequestModel.findOne({
      _id: requestId,
      receiver: employeeId,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = status;
    await request.save();



    await Notification.create({
      receiver: request.sender,
      sender: employeeId,
      type: status === "accepted" ? "request_accepted" : "request_rejected",
      request: request._id,
    });

    res.status(200).json({
      message: `Request ${status}`,
      data: request,
    });
  } catch (error) {
    console.error("UPDATE REQUEST STATUS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMySentRequests = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user._id;

    const requests = await RequestModel.find({
      sender: studentId,
    })
      .populate("receiver", "name email")
      .populate("company", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Student requests fetched",
      data: requests,
    });
  } catch (error) {
    console.error("GET MY SENT REQUESTS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markCompleted = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const request = await RequestModel.findByIdAndUpdate(
      requestId,
      { status: "completed" },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    console.log("STEP 1");
    // find payment for this request
    const payment = await Payment.findOne({ request: requestId });
    console.log("STEP 2");
    if (payment && payment.status !== "released") {
      console.log("STEP 3 updating wallet");

      // mark payment released
      payment.status = "released";
      await payment.save();

      // credit employee wallet
      await User.findByIdAndUpdate(request.receiver, {
        $inc: { wallet: payment.amount }
      });
    }
    console.log("STEP 4 creating transaction");
    await Transaction.create({
      user: request.receiver,
      type: "credit",
      amount: request.amount,
      source: "payment",
      request: request._id,
      description: "Referral completed",
    }); console.log("🔥 markCompleted HIT");
    console.log("STEP 5 creating notification");
    await Notification.create({
      receiver: request?.sender,
      sender: request?.receiver,
      type: "referral_completed",
      request: request?._id,
    });

    res.json({
      message: "Referral completed",
      data: request,
    });
  } catch (error) {
    res.status(500).json({ message: "Error completing referral" });
  }
};