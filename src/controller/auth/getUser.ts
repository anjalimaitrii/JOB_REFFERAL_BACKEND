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

    // Conditional populate: Only if 'company' is a valid ObjectId string
    const mongoose = require("mongoose");
    if (data.company && mongoose.Types.ObjectId.isValid(data.company)) {
       await data.populate("companyDetails");
    }

    let companyName = "";
    let jobTitle = "";
    const userData: any = data.toObject();

    // Check if virtual populated successfully
    if (userData.companyDetails) {
      companyName = userData.companyDetails.name;

      // Extract job title from companyDetails.jobs matching userData.designation (if it's a valid ID)
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
      company: companyName || userData.company, 
      designation: jobTitle || userData.designation, 
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