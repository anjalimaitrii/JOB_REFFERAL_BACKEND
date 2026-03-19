import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import Follow from "../models/follow";
import Post from "../models/post";

export const followEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.body;

        const userId = (req as any).user._id;
        const role = (req as any).user.role;

        if (role !== "student" && role !== "employee") {
            return res.status(403).json({ message: "Only students can follow" });
        }

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "Invalid employee id" });
        }

        const employeeExists = await User.findById(employeeId);
        if (!employeeExists) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const alreadyFollowing = await Follow.findOne({
            student: userId,
            employee: employeeId,
        });

        if (alreadyFollowing) {
            return res.status(400).json({ message: "Already following" });
        }

        const follow = await Follow.create({
            student: userId,
            employee: employeeId,
        });

        res.status(201).json({ message: "Employee followed", follow });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const unfollowEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.body;
        const userId = (req as any).user._id;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "Invalid employee id" });
        }

        const deletedFollow = await Follow.findOneAndDelete({
            student: userId,
            employee: employeeId,
        });

        if (!deletedFollow) {
            return res.status(404).json({ message: "Not following this employee" });
        }

        res.status(200).json({ message: "Employee unfollowed" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const getFollowingFeed = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const follows = await Follow.find({ student: userId });

        if (!follows.length) {
            return res.status(200).json([]);
        }

        const employeeIds = follows.map((f) => f.employee);

        const posts = await Post.find({ employee: { $in: employeeIds } })
            .populate("employee", "name profilePhoto designation")
            .populate("company", "name logo");

        const filteredPosts = posts
            .map(post => {
                const likesCount = post.likes?.length || 0;
                const dislikesCount = post.dislikes?.length || 0;
                const score = likesCount - dislikesCount;

                return {
                    ...post.toObject(),
                    score,
                    isFollowing: true
                };
            })
            .filter(post => post.score >= -4)
            .sort((a, b) => {
                if (b.score === a.score) {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
                return b.score - a.score;
            });

        res.status(200).json(filteredPosts);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const getExploreFeed = async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId((req as any).user._id);
        const posts = await Post.find()
            .populate("employee", "name profilePhoto designation")
            .populate("company", "name logo ")
            .limit(20);

        let followedEmployeeIds: string[] = [];
        if (userId) {
            const follows = await Follow.find({ student: userId });
            followedEmployeeIds = follows.map(f => f.employee.toString());
        }

        const postsWithFollowStatus = posts
            .map(post => {
                const likesCount = post.likes?.length || 0;
                const dislikesCount = post.dislikes?.length || 0;
                const score = likesCount - dislikesCount;

                return {
                    ...post.toObject(),
                    score,
                    isFollowing: followedEmployeeIds.includes(post.employee?._id?.toString())
                };
            })
            .filter(post => post.score >= -4)
            .sort((a, b) => {
                if (b.score === a.score) {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
                return b.score - a.score;
            });
        res.status(200).json(postsWithFollowStatus);
    } catch (error) {
        console.error("Explore feed error:", error);
        res.status(500).json({ message: "Server error" });
    }
};