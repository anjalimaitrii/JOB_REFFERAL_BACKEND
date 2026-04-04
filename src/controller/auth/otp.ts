import { Request, Response } from 'express';
import User from '../../models/user';
import { sendEmail } from '../../utils/email';
import jwt from 'jsonwebtoken';

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        let user;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
                user = await User.findById(decoded._id);
            } catch (err) {
                console.error("Token verification failed in sendOtp:", err);
            }
        }

        // If no user found via token, find via email (e.g. for registration/forgot password)
        if (!user) {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        
        // --- HARDENED LOGIC ---
        // Only update the OTP field to prevent premature field changes from being saved
        await User.updateOne({ _id: user._id }, { $set: { otp } });

        await sendEmail(email, otp);


        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        let user;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
                user = await User.findById(decoded._id);
            } catch (err) {
                console.error("Token verification failed in verifyOtp:", err);
            }
        }

        // If no user found by token, find by email
        if (!user) {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // --- CONDITION-BASED UPDATE ---
        // If the user's current email doesn't match the email in the request, it's an update
        if (user.email !== email) {
            const emailInUse = await User.findOne({ email });
            if (emailInUse) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

        user.isEmailVerified = true;
        user.otp = ''; // Clear OTP after verification
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error: any) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
