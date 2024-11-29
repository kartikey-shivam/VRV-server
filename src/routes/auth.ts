import express from 'express'
import AuthController from '../controllers/auth'
import { vRegister } from '../validators/auth'
import validateRequest from '../middlewares/validator'

const router = express.Router()

router.post('/login', AuthController.login)
router.post('/register', validateRequest(vRegister), AuthController.register)
router.post('/logout', AuthController.logout)
router.post('/send-verification-email', AuthController.sendEmailVerification)
router.get('/verify-email', AuthController.verifyEmail)
// Google OAuth
router.get('/google/login', AuthController.googleLogin)
router.get('/google/callback', AuthController.googleAuthCallback)

export default router
