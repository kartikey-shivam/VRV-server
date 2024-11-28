import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import env from '../configs/env'
import User from '../models/User'
import bcrypt from 'bcrypt'
class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) return res.error('auth.accountNotFound', {}, 404)
      if (!user.password) return res.error('auth.oAuthError')
      const verifyPassword = await bcrypt.compare(password, user.password)
      if (!verifyPassword) throw { status: 401, message: 'Incorrect Password' }
      //@ts-ignore
      user.password = undefined
      const payload = {
        _id: user._id,
        email: user.email,
      }
      const token = jwt.sign(payload, env.TOKEN_SECRET, { expiresIn: '30d' })
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        ...(env.NODE_ENV != 'local' && { domain: '' }),
      })
      return res.success('auth.loggedIn', { user })
    } catch (error) {
      next(error)
    }
  }

  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      let { firstName, lastName, email, password, role = 'customer' } = req.body
      const findUser = await User.findOne({ email })
      if (findUser) return res.error('auth.userAlreadyRegistered')
      const user = await User.create({ firstName, lastName, email, password })
      console.log(user,"43")

      //@ts-ignore
      user.password = undefined
      return res.success('auth.registrationComplete', {}, 201)
    } catch (error) {
      next(error)
    }
  }
  public static async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { fallbackUrl = env.FRONTEND_URL } = req.query
      passport.authenticate('google', {
        scope: ['email', 'profile'],
        state: JSON.stringify({ fallbackUrl }),
      })(req, res)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  public static async googleAuthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { state } = req.query
      //@ts-ignore
      const { fallbackUrl } = JSON.parse(decodeURIComponent(state)) || {}
      passport.authenticate('google', {
        failureRedirect: '/failure',
        session: false,
      })(req, res, async () => {
        const payload = {
          _id: req.user._id,
          email: req.user.email,
        }
        const token = jwt.sign(payload, env.TOKEN_SECRET, { expiresIn: '30d' })
        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 30 * 24 * 60 * 60 * 1000,
          ...(env.NODE_ENV != 'local' && { domain: '' }),
        })
        res.redirect(`${fallbackUrl}`)
      })
    } catch (error) {
      next(error)
    }
  }
  public static async logout(req: Request, res: Response, next: NextFunction) {
    return res
      .status(200)
      .clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        ...(env.NODE_ENV != 'local' && { domain: '' }), // Correct dynamic spread syntax
      })
      .success('auth.logout')
  }
}
export default AuthController