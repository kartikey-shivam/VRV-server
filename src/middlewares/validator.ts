import { NextFunction, Request, Response } from 'express'
import { Schema, ValidationOptions } from 'joi'

const options: ValidationOptions = {
  errors: {
    wrap: {
      label: false,
    },
  },
}
/**
 * Middleware to validate request bodies against a Joi schema.
 *
 * This function validates the request body using the provided Joi schema.
 * If the validation passes, it calls the next middleware function.
 * If the validation fails, it constructs an error message from the validation details and throws an error.
 *
 * @param schema - The Joi schema to validate the request body against.
 * @returns Middleware function to validate request bodies.
 */
const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("23")
    try {
      const { error } = schema.validate(req.body, options)
      const valid = error == null
      if (valid) {
        next()
      } else {
        const { details } = error
        const message = details.map((i) => i.message).join(',')
        throw new Error(message)
      }
    } catch (error) {
      next(error)
    }
  }
}
export default validateRequest
