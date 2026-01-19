import { Request, Response } from 'express'
import User from './user'
import bcrypt from 'bcryptjs'



export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      designation,
      contact
    } = req.body

    if (!name || !email || !password || !role || !contact) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (!['student', 'employee'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    

    if (role === 'employee' && !designation) {
      return res
        .status(400)
        .json({ message: 'job title is required for employees' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      contact,
      password: hashedPassword,
      role,
      designation,
    })

    res.status(201).json({
      message: 'Registration successful',
      userId: user._id,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
