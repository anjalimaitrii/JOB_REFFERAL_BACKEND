import express from "express";
import { createCompany, getAllCompanies, getCompanyById, getAllCompaniesForAdmin, verifyCompany } from "../controller/company";

const router = express.Router();

// POST - create company
router.post("/", createCompany);
router.get("/", getAllCompanies);
router.get("/admin/all", getAllCompaniesForAdmin);
router.get("/:id", getCompanyById);
router.patch("/:id/verify", verifyCompany);

export default router;
