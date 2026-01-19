import express from "express";
import { getMyRequests, sendRequest } from "../controller/request";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, sendRequest);
router.get("/my", authMiddleware, getMyRequests);


export default router;
