import { Request, Response } from "express";
import SuccessStory from "../models/SuccessStory";

export const getSuccessStories = async (
  req: Request,
  res: Response
) => {
  try {
    const stories = await SuccessStory.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const formatted = stories.map((story: any) => ({
      id: story._id.toString(),
      name: story.user?.name || "",
      role: story.role,
      rating: story.rating,
      comment: story.comment,
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

    const { role, rating, comment } = req.body;

    if (!role || !rating || !comment) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const story = await SuccessStory.create({
      user: user._id,
      role,
      rating,
      comment,
    });

    return res.status(201).json({
      message: "Success story submitted",
      data: story,
    });
  } catch (error) {
    console.error("CREATE SUCCESS STORY ERROR 👉", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};