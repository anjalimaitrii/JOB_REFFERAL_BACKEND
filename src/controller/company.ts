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
