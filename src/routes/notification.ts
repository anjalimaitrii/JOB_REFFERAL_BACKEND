import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllRead,
} from "../controller/notification";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/",authMiddleware, getNotifications);
router.patch("/mark-all-read",authMiddleware, markAllRead);
router.patch("/:id/read", authMiddleware, markAsRead);

export default router;