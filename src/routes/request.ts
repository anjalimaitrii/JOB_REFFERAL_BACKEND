import express from "express";
import { getMyRequests, sendRequest, updateRequestStatus } from "../controller/request";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, sendRequest);
router.get("/my", authMiddleware, getMyRequests);
router.patch("/:requestId/status",authMiddleware,updateRequestStatus)


export default router;
