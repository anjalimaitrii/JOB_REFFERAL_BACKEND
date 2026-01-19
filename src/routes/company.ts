import express from "express";
import { createCompany } from "../controller/company";

const router = express.Router();

// POST - create company
router.post("/", createCompany);

export default router;
