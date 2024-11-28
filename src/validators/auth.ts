import Joi from 'joi'

export const vRegister = Joi.object({
  firstName: Joi.string().min(3).max(25).required(),
  lastName: Joi.string().min(3).max(25).required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
})

export const vResetPassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
})
export const vDeleteAccount = Joi.object({
  password: Joi.string().required(),
})
