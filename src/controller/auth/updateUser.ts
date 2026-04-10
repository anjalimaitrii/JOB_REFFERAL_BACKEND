import { Request, Response } from 'express'
import User from '../../models/user'

export const updateUser = async (req: Request, res: Response) => {
  try {

    const user = (req as any).user

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { company, designation } = req.body;

    console.log("Update User Request Body:", req.body);
    console.log("Original company:", company, "Type:", typeof company);
    console.log("Original designation:", designation, "Type:", typeof designation);
    //
    if (company === "") {
      console.log("Sanitizing company to null");
      req.body.company = null;
    }
    if (designation === "") {
      console.log("Sanitizing designation to null");
      req.body.designation = null;
    }
    if (company && company.length !== 24) {
      delete req.body.company
    }



    // Handle profile photo upload via memory storage
    if (req.file) {
      const b64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      req.body.profilePhoto = `data:${mimeType};base64,${b64}`;
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
