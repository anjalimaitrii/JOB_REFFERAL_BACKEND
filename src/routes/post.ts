import express from "express";
import {
    getFollowingFeed,
    getExploreFeed,
} from "../controller/follow";
import {
    createPost, getCompanyPost, toggleLike, addComment, deletePost, editPost, reportPost
} from "../controller/post";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.post("/like/:postId", authMiddleware, toggleLike);
router.post("/comment/:postId", authMiddleware, addComment);
router.get("/company/:companyId", authMiddleware, getCompanyPost);
router.get("/following", authMiddleware, getFollowingFeed);
router.get("/explore", authMiddleware, getExploreFeed);
router.delete("/:postId", authMiddleware, deletePost);
router.put("/:postId", authMiddleware, editPost);
router.post("/report/:postId", authMiddleware, reportPost);

export default router;