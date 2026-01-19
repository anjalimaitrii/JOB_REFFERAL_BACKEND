import { Request, Response } from 'express'
import User from '../../models/user'

export const updateUser = async (req: Request, res: Response) => {
  try {

    const user = (req as any).user

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      req.body,        
      { new: true }
    ).select('-password')

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    })
  } catch (err) {
    console.error('UPDATE USER ERROR 👉', err)
    res.status(500).json({ message: 'Server error' })
  
  
  }
}
