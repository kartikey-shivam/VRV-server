import express from 'express'
import UserController from '../controllers/user'
import { isAuthenticated, isAdmin } from '../middlewares/auth';

const router = express.Router()

router.get('/', isAuthenticated, UserController.index)
router.post('/permission/add',isAuthenticated,isAdmin,UserController.addPermission)
router.patch('/permission/update',isAuthenticated,isAdmin,UserController.updateUserPermission)

export default router
