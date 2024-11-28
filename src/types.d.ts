import Stripe from 'stripe'
import { IUser } from './interfaces/user'
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'

declare global {
  namespace Express {
    export interface Request {
      user: IUser
      stripeEvent: Stripe.Event
    }

    export interface Response {
      /**
       * Sends a success response with a JSON payload.
       * @param {string} message - The success message.
       * @param {object} data - Optional data to include in the response.
       * @param {number} statusCode - HTTP status code (default is 200).
       */
      success: (message: string, data?: any, statusCode?: number) => void

      /**
       * Sends an error response with a JSON payload.
       * @param {string} message - The error message.
       * @param {object} data - Optional data to include in the response.
       * @param {number} statusCode - HTTP status code (default is 400).
       */
      error: (message: string, data?: any, statusCode?: number) => void
    }
  }
}
