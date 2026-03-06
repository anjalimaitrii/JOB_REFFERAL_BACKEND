import { Request, Response } from 'express';
import User from '../models/user';
import Post from '../models/post';
import Report from "../models/report";

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content, image } = req.body;
        const user = await User.findById((req as any).user._id);
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        if (user.role !== 'employee') {
            return res.status(403).json({ message: 'only employee can post' })
        }

        if (!user.company) {
            return res.status(400).json({ message: 'employee is not linked to any device' })
        }

        const newPost = await Post.create({
            employee: user._id,
            company: user.company,
            content,
            image
        });

        res.status(201).json({
            message: 'post created successfully',
            post: newPost,
        });
    } catch (error) {
        res.status(500).json({
            message: 'server error'
        })
    }
}

export const getCompanyPost = async (req: Request, res: Response) => {
    try {
        const { companyId } = req.params;
        const posts = await Post.find({ companyId })
            .populate("employee", "name profilePhoto designation")
            .populate("company", "name logo jobs")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'server error' })
    }
}

export const toggleLike = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = (req as any).user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'post not found' });
        }

        const likes = (post.likes as any) || [];
        const likeIndex = likes.indexOf(userId);

        if (likeIndex === -1) {
            likes.push(userId);
        } else {
            likes.splice(likeIndex, 1);
        }

        post.likes = likes;
        await post.save();
        res.status(200).json({ message: 'like toggled', likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
}

export const addComment = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = (req as any).user._id;

        if (!content) {
            return res.status(400).json({ message: 'comment content is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'post not found' });
        }

        (post as any).comments.push({
            user: userId,
            content
        });

        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate("employee", "name profilePhoto designation")
            .populate("company", "name logo")
            .populate("comments.user", "name profilePhoto");

        res.status(201).json({ message: 'comment added', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = (req as any).user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        if (post.employee.toString() !== userId.toString()) {
            return res.status(403).json({ message: "not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
};

export const editPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { content, image } = req.body;
        const userId = (req as any).user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        if (post.employee.toString() !== userId.toString()) {
            return res.status(403).json({ message: "not authorized to edit this post" });
        }

        post.content = content ?? post.content;
        post.image = image ?? post.image;

        await post.save();

        res.status(200).json({
            message: "post updated successfully",
            post,
        });
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
};

export const reportPost = async (req: Request, res: Response) => {
    try {

        const { postId } = req.params;
        const { reason } = req.body;

        const userId = (req as any).user._id;

        if (!reason) {
            return res.status(400).json({
                message: "Report reason is required"
            });
        }

        const alreadyReported = await Report.findOne({
            reporter: userId,
            post: postId
        });

        if (alreadyReported) {
            return res.status(400).json({
                message: "You already reported this post"
            });
        }

        const report = await Report.create({
            reporter: userId,
            post: postId,
            reason
        });

        await Post.findByIdAndUpdate(postId, {
            $inc: { reportCount: 1 }
        });

        res.status(201).json({
            message: "Post reported successfully",
            report
        });

    } catch {
        res.status(500).json({ message: "Server error" });
    }
};