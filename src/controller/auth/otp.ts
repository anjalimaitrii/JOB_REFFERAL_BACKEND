import { Request, Response } from 'express';
import User from '../../models/user';
import { sendEmail } from '../../utils/email';

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        user.otp = otp;
        await user.save();

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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
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
