import express from "express";
import { getAdminStats, getUsersByRole, getAllRequests } from "../controller/admin";

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/users/:role", getUsersByRole);
router.get("/requests", getAllRequests);

export default router;
