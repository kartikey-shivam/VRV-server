import Joi from 'joi'
import { CurrencyCode } from '../interfaces/transaction/CurrencyCode'
import { CountryCode } from '../interfaces/transaction/CountryCode'
import { TransactionType } from '../interfaces/transaction/TransactionType'
import { TransactionState } from '../interfaces/transaction/TransactionState'
const TransactionAmountDetailsSchema = Joi.object({
  transactionAmount: Joi.number().required(),
  transactionCurrency: Joi.string()
    .valid(...Object.values(CurrencyCode))
    .required(),
  country: Joi.string()
    .valid(...Object.values(CountryCode))
    .optional(),
})

const DeviceDataSchema = Joi.object({
  batteryLevel: Joi.number().optional(),
  deviceLatitude: Joi.number().optional(),
  deviceLongitude: Joi.number().optional(),
  ipAddress: Joi.string().ip().optional(),
  deviceIdentifier: Joi.string().optional(),
  vpnUsed: Joi.boolean().optional(),
  operatingSystem: Joi.string().optional(),
  deviceMaker: Joi.string().optional(),
  deviceModel: Joi.string().optional(),
  deviceYear: Joi.string().optional(),
  appVersion: Joi.string().optional(),
})

const TagSchema = Joi.object({
  key: Joi.string().required(),
  value: Joi.string().required(),
})
export const vCreateTransaction = Joi.object({
  type: Joi.string()
    .valid(...Object.values(TransactionType))
    .required(),
  transactionId: Joi.string().required(),
  timestamp: Joi.date().required(),
  originUserId: Joi.string().optional(),
  destinationUserId: Joi.string().optional(),
  transactionState: Joi.string()
    .valid(...Object.values(TransactionState))
    .optional(),
  originAmountDetails: TransactionAmountDetailsSchema.required(),
  destinationAmountDetails: TransactionAmountDetailsSchema.required(),
  tags: Joi.array().items(TagSchema).optional(),
  description: Joi.string().optional().allow(null).empty('').default(null),
})
