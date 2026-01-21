import { Request, Response } from "express";
import RequestModel from "../models/request";

export const sendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user._id; 
    const { receiver,company,role } = req.body;

    if (!receiver) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // const existingRequest = await RequestModel.findOne({
    //   sender: senderId,
    //   receiver,
    //   status: "pending",
    // });

    // if (existingRequest) {
    //   return res.status(400).json({
    //     message: "Request already sent",
    //   });
    // }

    const request = await RequestModel.create({
      sender: senderId,
      receiver,
      company,
      role,
      status: "pending",
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
      .populate("sender", "name email") 
      .populate("company", "name jobs")
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
      .populate("company", "name jobs")
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
