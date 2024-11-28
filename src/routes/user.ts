import express from 'express'
import UserController from '../controllers/user'
import { isAuthenticated } from '../middlewares/auth'

const router = express.Router()

router.get('/', isAuthenticated, UserController.index)

export default router
