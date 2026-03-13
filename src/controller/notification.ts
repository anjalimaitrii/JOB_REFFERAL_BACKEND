import { Request, Response } from "express";
import Notification from "../models/notification";


// ── GET /api/notifications ────────────────────────────────────
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const notifications = await Notification.find({
      receiver: userId,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name avatar")
      .populate({
        path: "request",
        select: "company role",
        populate: {
          path: "company",
          select: "name"
        }
      });

    res.status(200).json({
      message: "Notifications fetched",
      data: notifications,
      unreadCount: notifications.filter(n => !n.isRead).length,
    });

  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};


// ── PATCH /api/notifications/:id/read ────────────────────────
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    await Notification.findOneAndUpdate(
      { _id: id, receiver: userId },
      { isRead: true }
    );

    res.status(200).json({ message: "Marked as read" });

  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};


// ── PATCH /api/notifications/mark-all-read ───────────────────
export const markAllRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    await Notification.updateMany(
      { receiver: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All marked as read" });

  } catch (err) {
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};
