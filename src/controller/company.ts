import { Request, Response } from "express";
import Company from "../models/company";


/**
 * POST /api/company
 * Create company
 */
export const createCompany = async (req: Request, res: Response) => {
  try {
    const {
      name,
      logo,
      industry,
      location,
      otherLocations,
      companySize,
      website,
      jobs
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Company name and location are required",
      });
    }

    const company = await Company.create({
      name,
      logo,
      industry,
      location,
      otherLocations,
      companySize,
      website,
      jobs
    });

    return res.status(201).json({
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating company",
      error,
    });
  }
};

export const getAllCompanies = async (_req: Request, res: Response) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    return res.status(200).json({
      data: companies,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching companies",
      error,
    });
  }
};

/**
 * GET /api/company/:id
 * Get single company
 */
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    return res.status(200).json({
      data: company,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching company",
      error,
    });
  }
};
