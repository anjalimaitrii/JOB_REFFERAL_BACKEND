import express from "express";
import { getSuccessStories, createSuccessStory, getAllSuccessStoriesForAdmin, verifySuccessStory } from "../controller/successStories";
import { authMiddleware } from "../middleware/auth";


const router = express.Router();

router.get("/", authMiddleware, getSuccessStories);
router.post("/", authMiddleware, createSuccessStory);
router.get("/admin/all", authMiddleware, getAllSuccessStoriesForAdmin);
router.patch("/:id/verify", authMiddleware, verifySuccessStory);

export default router;