import { NextFunction, Request, Response } from 'express'
import User, { Permission } from '../models/User';
import jwt from 'jsonwebtoken';
import env from '../configs/env';
import { IUser } from '../interfaces/user';

class UserController {
  public static async index(req: Request, res: Response, next: NextFunction) {
    try {
      return res.success('user.index', { user: req.user })
    } catch (error) {
      next(error)
    }
  }
  public static async addPermission(req:Request, res:Response,next:NextFunction){
    try {
      
      const {name} = req.body;
      if (await Permission.findOne({ name })) return res.error('permission.alreadyExists')
        const permission = await Permission.create(req.body)
        res.success('permission.add', { permission })
    } catch (error) {
        next(error)
    }
  }
  public static async updateUserPermission(req:Request, res:Response,next:NextFunction){
    let token = req.cookies.token
    if(!token)res.status(498).send({message:"Token missing"})
    try {
      
      const {permission} = req.body;
      const decoded = jwt.verify(token, env.TOKEN_SECRET)
      console.log(decoded,"43")
      //@ts-ignore
      const user = await User.findOne({ email: decoded?.email }).select('-password')
      if(!user) return res.error('user.notexist')
      req['user'] = user as IUser
        const validPermissions = await Permission.find({
          name: { $in: permission },
        });
        if (validPermissions.length !== permission.length) {
          const invalidPermissions = permission.filter(
            (name: string) => !validPermissions.some((perm) => perm.name === name)
          );
          return res.error('permission.invalid',
            {invalidPermissions}
          );
        }
        const permissionIds = validPermissions.map((perm) => perm._id);

          const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { permissions: permissionIds }, 
            { new: true } 
          ).populate("permissions");
        res.success('permission.updateSuccess',{updatedUser})
    } catch (error) {
        next(error)
    }
  }
  public static async userUpdate(req:Request, res:Response,next:NextFunction){
    let token = req.cookies.token
    if(!token)res.status(498).send({message:"Token missing"})
      try {
        const roleUpdated = req.body
        const decoded = jwt.verify(token, env.TOKEN_SECRET)
        console.log(decoded,"43")
        //@ts-ignore
        const user = await User.findOne({ email: decoded?.email }).select('-password')
        if(!user) return res.error('user.notexist')

        req['user'] = user as IUser
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { role: roleUpdated }, 
          { new: true } 
        ).populate("role");
      res.success('role.updated',{updatedUser})
      } catch (error) {
        next(error)
      }
  }
}
export default UserController
