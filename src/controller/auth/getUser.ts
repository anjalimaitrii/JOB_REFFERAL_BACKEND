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

 
export const getEmployeesByCompany = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    const employees = await User.find({
      role: "employee",          
      company: companyId,        
    }).select("-password");      

    return res.status(200).json({
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching employees",
      error,
    });
  }
};