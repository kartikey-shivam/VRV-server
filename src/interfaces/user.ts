import { Document } from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  role:string
  emailVerified: boolean
  googleId?: string
  avatar?: string
}
