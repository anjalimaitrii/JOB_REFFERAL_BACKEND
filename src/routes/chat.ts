import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getChatByRequest } from "../controller/chat";


const router = Router();

router.get("/:requestId", authMiddleware, getChatByRequest);

export default router;