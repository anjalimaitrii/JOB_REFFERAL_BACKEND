import { Request, Response } from 'express'
import User from '../../models/user'

export const getUser = async (req: Request, res: Response) => {
  const user = (req as any).user

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const data = await User.findById(user._id).select('-password')
  res.json(data)
}
