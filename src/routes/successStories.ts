import express from "express";
import { getSuccessStories,createSuccessStory } from "../controller/successStories";
import { authMiddleware } from "../middleware/auth";


const router = express.Router();

router.get("/",authMiddleware, getSuccessStories);
router.post("/", authMiddleware, createSuccessStory);

export default router;