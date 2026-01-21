import { Request, Response } from "express";
import Message from "../models/message";

export const getChatByRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const userId = (req as any).user._id;

    const messages = await Message.find({
      request: requestId,
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "Chat fetched",
      data: messages,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat" });
  }
};
