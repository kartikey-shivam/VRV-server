import { NextFunction, Request, Response } from 'express'

class UserController {
  public static async index(req: Request, res: Response, next: NextFunction) {
    try {
      return res.success('user.index', { user: req.user })
    } catch (error) {
      next(error)
    }
  }
}
export default UserController
