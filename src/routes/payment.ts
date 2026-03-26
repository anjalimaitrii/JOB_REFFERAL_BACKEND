import express from "express";
import { getTransactions, getAllTransactions, paymentSuccess, withdrawAmount } from "../controller/payment";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/payment-success/:requestId", paymentSuccess);
router.get("/transactions", authMiddleware, getTransactions);
router.get("/all-transactions", authMiddleware, getAllTransactions);
router.post("/withdraw", authMiddleware, withdrawAmount);



export default router;
