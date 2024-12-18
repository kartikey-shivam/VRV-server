import { Request, Response, NextFunction } from 'express'
import jwt, { decode } from 'jsonwebtoken'
import env from '../configs/env'
import User from '../models/User'
import { IUser } from '../interfaces/user'

/**
 * Middleware to authenticate users based on JWT token.
 *
 * This function checks for the presence of a JWT token in the `Authorization` header of the request.
 * If the token is missing, it returns a 401 status with an appropriate message.
 * If the token is present, it verifies the token and decodes the payload to find the associated user.
 * If the user is not found or the email is not verified, it throws an error.
 * If authentication is successful, it attaches the user to the request object and calls the next middleware.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }
  else {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, env.TOKEN_SECRET)
      req.body.user = decoded;
      //@ts-ignore
      const user = await User.findOne({ email: decoded.email }).select('-password')
      if (!user) throw new Error('Invalid token')
      req['user'] = user as IUser
      next()
    } catch (err) {
      next(err)
    }
  }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction)=>{

    try {
      const decoded = req.body.user
      //@ts-ignore
      const user = await User.findOne({ email: decoded?.email }).select('-password')
      req['user'] = user as IUser
      if(user?.role!='admin') throw new Error('Only Admin can access!')
        next()
    } catch (err) {
      next(err)
    }
  

}
export const permissionValidator = async (permission:string,req:Request, res:Response, next: NextFunction)=>{
 
  
    try {
      const decoded = req.body.user
      //@ts-ignore
      const user = await User.findOne({ email: decoded?.email }).select('-password')
      req['user'] = user as IUser
      const permissions = user?.permissions
      if(!permissions) throw new Error('No permissions assigned to this user')
      for(const perm of permissions){
        if(perm == permission || perm=='All'){
          next()
        }
      }
        throw new Error('You do not have permission to access it')
    } catch (error) {
      
    }
  
}