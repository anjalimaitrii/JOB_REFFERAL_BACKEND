import { Router } from 'express'
import { register } from '../controller/auth/register'
import { login } from '../controller/auth/login'
import { updateUser } from '../controller/auth/updateUser'
import { authMiddleware } from '../middleware/auth'
import { getEmployeesByCompany, getUser, getAllEmployees } from '../controller/auth/getUser'
import { sendOtp, verifyOtp } from '../controller/auth/otp'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/get', authMiddleware, getUser)
router.get("/company/:companyId", getEmployeesByCompany);
router.get("/employees", getAllEmployees);
router.put('/update', authMiddleware, updateUser)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)


export default router
