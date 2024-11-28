import express from 'express'
import UserController from '../controllers/user'
import { isAuthenticated, isAdmin } from '../middlewares/auth';
import { permissionValidatorWrapper } from '../validators/auth';

const router = express.Router()

router.get('/', isAuthenticated, UserController.index)
router.post('/permission/add',isAuthenticated,isAdmin,UserController.addPermission)
router.patch('/role/update',isAuthenticated,isAdmin,UserController.userUpdate);
router.patch('/permission/update',isAuthenticated,permissionValidatorWrapper('User_permission_update'),UserController.updateUserPermission)
export default router
