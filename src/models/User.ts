import { Schema, model } from 'mongoose'
import { IPermission,IUser } from '../interfaces/user'
import bcrypt from 'bcrypt'
// Permission schema
const permissionSchema = new Schema({
  name: { type: String, required: true,unique:true }, // e.g., 'create transactions', 'download report'
  description: { type: String, default: "" }, // Optional description for clarity
});

export enum RoleEnum {
  Admin = "admin",
  Moderator = "moderator",
  User = "user",
}

//user schema
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    emailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(RoleEnum), // Only allow values from RoleEnum
      default: RoleEnum.User,
    },
    permissions: [{ type: String }], // Direct user-specific permissions
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
export const Permission = model<IPermission>("Permission", permissionSchema);
export default User
