import { Request, Response } from 'express'
import User from '../../models/user'

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let data = await User.findById(user._id).select("-password");

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    const mongoose = require("mongoose");
    if (data.company && mongoose.Types.ObjectId.isValid(data.company)) {
      await data.populate("company");
    }
    let companyName = "";
    let jobTitle = "";
    const userData: any = data.toObject();

    if (userData.companyDetails) {
      companyName = userData.companyDetails.name;

      if (userData.designation && userData.companyDetails.jobs) {
        const job = userData.companyDetails.jobs.find(
          (job: any) => job._id.toString() === userData.designation.toString()
        );
        if (job) {
          jobTitle = job.title;
        }
      }
    }

    return res.json({
      ...userData,
      companyName: companyName || "",
      jobTitle: jobTitle || "",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user", error });
  }
};


export const getEmployeesByCompany = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    const employees = await User.find({
      role: "employee",
      company: companyId,
    }).select("-password");

    return res.status(200).json({
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching employees",
      error,
    });
  }
};

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await User.find({
      role: "employee",
    }).populate("company")
      .select("-password");

    return res.status(200).json({
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching employees",
      error,
    });
  }
};