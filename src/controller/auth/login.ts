import { Request, Response } from 'express'
import bcrypt from 'bcryptjs';
import User from '../../models/user'
import jwt from 'jsonwebtoken'

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, loginAs } = req.body

    if (!email || !password || !loginAs) {
      return res.status(400).json({ message: 'Missing credentials' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Role check
    if (user.role !== loginAs) {
      return res.status(403).json({
        message: `You are not authorized as ${loginAs}`,
      })
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
       user: {
        _id: user._id,
        role: user.role,
        company: user.company,    
        designation: user.designation,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
  console.error('LOGIN ERROR 👉', error);
  res.status(500).json({ message: 'Server error' });
}

}
