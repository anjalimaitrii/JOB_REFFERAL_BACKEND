import { Router } from 'express'
import { register } from '../controller/auth/register'
import { login } from '../controller/auth/login'
import { updateUser } from '../controller/auth/updateUser'
import { authMiddleware } from '../middleware/auth'
import { getUser } from '../controller/auth/getUser'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/get', authMiddleware, getUser)
router.put('/update', authMiddleware, updateUser)

export default router
