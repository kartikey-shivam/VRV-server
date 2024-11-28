import { ErrorRequestHandler, Response } from 'express'

export const errorHandler: ErrorRequestHandler = (err: any, _, res: Response, __) => {
  console.log('Error=>\t', err, typeof err.message)
  res.status(err.status || 400).json({
    status: false,
    message: err.errors || err.message || 'Something went wrong, please try again.',
  })
}
