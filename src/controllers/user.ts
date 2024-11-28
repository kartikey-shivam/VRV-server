import { NextFunction, Request, Response } from 'express'
import User, { Permission } from '../models/User';

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
    try {
      
      const {email,permission} = req.body;
      const user = await User.findOne({email})
      if(!user) return res.error('user.notexist')
        const validPermissions = await Permission.find({
          name: { $in: permission },
        });
        if (validPermissions.length !== permission.length) {
          const invalidPermissions = permission.filter(
            (name: string) => !validPermissions.some((perm) => perm.name === name)
          );
          return res.error('One or more permissions are invalid',
            {invalidPermissions}
          );
        }
        const permissionIds = validPermissions.map((perm) => perm._id);
        const update = { permission: permissionIds  } ;

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
}
export default UserController
