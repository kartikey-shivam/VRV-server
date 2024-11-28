import { Request, Response, NextFunction } from 'express'

/**
 * Middleware to attach custom response helper functions to the Response object.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object with added success and error functions.
 * @param {NextFunction} next - Express Next function.
 */
export const attachResponseHelpers = (req: Request, res: Response, next: NextFunction) => {
  /**
   * Sends a success response with a JSON payload.
   * @param {string} message - The success message.
   * @param {object} data - Optional data to include in the response.
   * @param {number} statusCode - HTTP status code (default is 200).
   */
  res.success = (message: string, data = {}, statusCode = 200) => {
    message = req.__(message)
    res.status(statusCode).json({
      success: true,
      message,
      data,
    })
  }

  /**
   * Sends an error response with a JSON payload.
   * @param {string} message - The error message.
   * @param {object} data - Optional data to include in the response.
   * @param {number} statusCode - HTTP status code (default is 400).
   */
  res.error = (message: string, data = {}, statusCode = 400) => {
    message = req.__(message)
    res.status(statusCode).json({
      success: false,
      message,
      data,
    })
  }

  next()
}
