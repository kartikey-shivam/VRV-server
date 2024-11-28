import { Schema, model } from 'mongoose'
import { IUser } from '../interfaces/user'
import bcrypt from 'bcrypt'

const userSchema = new Schema<IUser>(
  {
    firstName: String,
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role:{type : String,default:'User'},
    avatar: String,
    emailVerified: { type: Boolean, default: false },
  },

  { timestamps: true }
)
userSchema.pre<IUser>('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    return next()
  } catch (error: any) {
    return next(error)
  }
})
const User = model<IUser>('User', userSchema)
export default User
