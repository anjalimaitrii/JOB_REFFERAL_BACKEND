import express from "express";
import { followEmployee, unfollowEmployee, getFollowingFeed, getExploreFeed } from "../controller/follow";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/follow", authMiddleware, followEmployee);
router.post("/unfollow", authMiddleware, unfollowEmployee);
router.get("/feed", authMiddleware, getFollowingFeed);
router.get("/explore", getExploreFeed);

export default router;
