import { Request, Response } from "express";
import User from "../models/user";
import Company from "../models/company";

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const employeeCount = await User.countDocuments({ role: "employee" });
    const totalCompanies = await Company.countDocuments();
    const pendingCompanies = await Company.countDocuments({ isVerified: false });

    // Recent registrations (last 5)
    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentCompanies = await Company.find()
      .select("name industry location isVerified createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      data: {
        counts: {
          students: studentCount,
          employees: employeeCount,
          totalCompanies: totalCompanies,
          pendingCompanies: pendingCompanies,
        },
        recentUsers,
        recentCompanies,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching admin stats",
      error,
    });
  }
};

export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    
    if (role !== "student" && role !== "employee") {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const users = await User.find({ role })
      .select("name email role createdAt personalInfo education experience skills")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error fetching ${req.params.role}s`,
      error,
    });
  }
};
