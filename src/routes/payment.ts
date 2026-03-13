import express from "express";
import { paymentSuccess } from "../controller/payment";

const router = express.Router();

router.post("/payment-success/:requestId", paymentSuccess);



export default router;
