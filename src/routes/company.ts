import express from "express";
import { createCompany, getAllCompanies, getCompanyById } from "../controller/company";

const router = express.Router();

// POST - create company
router.post("/", createCompany);
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);

export default router;
