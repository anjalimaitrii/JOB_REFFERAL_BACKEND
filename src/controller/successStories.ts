import { Request, Response } from "express";
import SuccessStory from "../models/successStory";


export const getSuccessStories = async (
  req: Request,
  res: Response
) => {
  try {
    const stories = await SuccessStory.find({ status: "approved" })
      .populate("user", "name")
      .populate("company")
      .sort({ createdAt: -1 });

    const formatted = stories.map((story: any) => ({
      _id: story._id.toString(),
      name: story.user?.name || "",
      role: story.role,
      rating: story.rating,
      comment: story.comment,
      company: story.company?.name || "",
      status: story.status,
    }));

    return res.status(200).json({
      data: formatted,
    });
  } catch (error) {
    console.error("GET SUCCESS STORIES ERROR 👉", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};


export const createSuccessStory = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { role, rating, comment, company } = req.body;

    if (!role || !rating || !comment || !company) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const story = await SuccessStory.create({
      user: user._id,
      role,
      rating,
      comment,
      company,
      status: "pending",
    });

    return res.status(201).json({
      message: "Success story submitted and pending approval",
      data: story,
    });
  } catch (error) {
    console.error("CREATE SUCCESS STORY ERROR 👉", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * Admin Controllers
 */

export const getAllSuccessStoriesForAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const stories = await SuccessStory.find()
      .populate("user", "name email")
      .populate("company", "name")
      .sort({ createdAt: -1 });

    const formatted = stories.map((story: any) => ({
      _id: story._id.toString(),
      name: story.user?.name || "",
      email: story.user?.email || "",
      role: story.role,
      rating: story.rating,
      comment: story.comment,
      company: story.company?.name || "",
      status: story.status,
      createdAt: story.createdAt,
    }));

    return res.status(200).json({
      data: formatted,
    });
  } catch (error) {
    console.error("GET ADMIN SUCCESS STORIES ERROR 👉", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const verifySuccessStory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const story = await SuccessStory.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({
        message: "Success story not found",
      });
    }

    return res.status(200).json({
      message: `Success story ${status} successfully`,
      data: story,
    });
  } catch (error) {
    console.error("VERIFY SUCCESS STORY ERROR 👉", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
