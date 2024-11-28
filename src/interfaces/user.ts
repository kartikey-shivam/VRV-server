import { Document } from 'mongoose'
import { RoleEnum } from '../models/User'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  role:RoleEnum
  permissions:IPermission
  emailVerified: boolean
  googleId?: string
  avatar?: string
}

export interface IPermission {
  name: string; 
  description?: string; 
}
