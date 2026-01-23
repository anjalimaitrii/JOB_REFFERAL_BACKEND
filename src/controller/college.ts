import { Request, Response } from "express";
import Collage from "../models/collage";
import User from "../models/user";

export const getColleges = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    let colleges;

    // 🔹 CASE 1: Search by name
    if (name && name.length > 0) {
      colleges = await Collage.find({
        name: { $regex: name, $options: "i" }, // partial & case-insensitive search
      }).sort({ createdAt: -1 }).limit(10);;
    }
    // 🔹 CASE 2: Initial load (only 5 colleges)
    else {
      colleges = await Collage.find()
        .sort({ createdAt: -1 })
        .limit(10);
    }

    if (!colleges || colleges.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No colleges found",
      });
    }

    return res.status(200).json({
      status: "success",
      count: colleges.length,
      data: colleges,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching colleges",
      error,
    });
  }
};

export const getCollegesWithEmployees = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find(
      {
        role: "employee",
        "education.institute": { $exists: true, $ne: "" },
      },
      { education: 1 }
    );

    const collegeSet = new Set<string>();

    users.forEach((user) => {
      user.education?.forEach((edu: any) => {
        if (edu.institute) {
          collegeSet.add(edu.institute);
        }
      });
    });

    return res.status(200).json({
      status: "success",
      data: Array.from(collegeSet),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch colleges",
      error,
    });
  }
};

export const getEmployeesByCollege = async (
  req: Request,
  res: Response
) => {
  try {
    const { collegeName } = req.query;

    if (!collegeName) {
      return res.status(400).json({
        message: "collegeName is required",
      });
    }

    const employees = await User.find({
      role: "employee",
      "education.institute": collegeName,
    });

    return res.status(200).json({
      status: "success",
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch employees by college",
      error,
    });
  }
};
