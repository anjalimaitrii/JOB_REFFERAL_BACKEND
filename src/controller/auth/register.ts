import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../../models/user'

export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      contact,
      company,
      designation,
    } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (!['student', 'employee'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

 

    if (role === 'employee' && (!company || !designation)) {
      return res
        .status(400)
        .json({ message: 'Company and job title are required for employees' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
     
      contact,
      company,
      designation,
    })

    res.status(201).json({
      message: 'Registration successful',
      userId: user._id,
    })
  } catch (err: any) {
  console.error('REGISTER ERROR 👉', err)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.keys(err.errors).map(
        key => `${key} is required`
      ),
    })
  }

  res.status(500).json({
    message: err.message || 'Server error',
  })
}
}
