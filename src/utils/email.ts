import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #333;">Email Verification</h2>
        <p>Hello,</p>
        <p>Your OTP for verifying your email address is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${otp}</span>
        </div>
        <p>Please enter this OTP in the application to complete your verification.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Job Referral Team</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
