import { Request, Response } from "express";
import RequestModel from "../models/request";

export const sendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user._id; 
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const existingRequest = await RequestModel.findOne({
      sender: senderId,
      receiver: employeeId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const request = await RequestModel.create({
      sender: senderId,
      receiver: employeeId,
      status: "pending",
    });

    res.status(201).json({
      message: "Request sent successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const employeeId = (req as any).user._id; 

    const requests = await RequestModel.find({
      receiver: employeeId,
    })
      .populate("sender", "name email") 
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