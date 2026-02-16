import express from "express";
import { getAdminStats, getUsersByRole } from "../controller/admin";

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/users/:role", getUsersByRole);

export default router;
