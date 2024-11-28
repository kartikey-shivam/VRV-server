import { Schema, model } from 'mongoose'
import { ITransaction } from '../interfaces/transaction/transaction'
import { CountryCode } from '../interfaces/transaction/CountryCode'
import { TransactionType } from '../interfaces/transaction/TransactionType'
import { TransactionState } from '../interfaces/transaction/TransactionState'
import { DeviceData } from '../interfaces/transaction/DeviceData'
import { TransactionAmountDetails } from '../interfaces/transaction/TransactionAmountDetails'
import { Tag } from '../interfaces/transaction/Tag'
import { CurrencyCode } from '../interfaces/transaction/CurrencyCode'

const TransactionAmountDetailsSchema = new Schema<TransactionAmountDetails>({
  transactionAmount: { type: Number, required: true },
  transactionCurrency: { type: String, required: true, enum: CurrencyCode },
  country: { type: String, enum: CountryCode },
})
const DeviceDataSchema = new Schema<DeviceData>({
  batteryLevel: { type: Number },
  deviceLatitude: { type: Number },
  deviceLongitude: { type: Number },
  ipAddress: { type: String },
  deviceIdentifier: { type: String },
  vpnUsed: { type: Boolean },
  operatingSystem: { type: String },
  deviceMaker: { type: String },
  deviceModel: { type: String },
  deviceYear: { type: String },
  appVersion: { type: String },
})
const TagSchema: Schema = new Schema<Tag>({
  key: { type: String, required: true },
  value: { type: String, required: true },
})

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: TransactionType,
      required: true,
    },
    transactionId: { type: String, required: true, unique: true },
    timestamp: { type: Date, required: true },
    originUserId: { type: String },
    destinationUserId: { type: String },
    transactionState: { type: String, enum: TransactionState },
    originAmountDetails: { type: TransactionAmountDetailsSchema, required: true },
    destinationAmountDetails: { type: TransactionAmountDetailsSchema, required: true },
    promotionCodeUsed: { type: Boolean, required: false },
    reference: { type: String, required: false },
    originDeviceData: { type: DeviceDataSchema, required: false },
    destinationDeviceData: { type: DeviceDataSchema, required: false },
    tags: { _id: false, type: [TagSchema], required: false },
    description: { type: String },
  },
  { timestamps: true }
)

transactionSchema.index({ transactionId: 1, originUserId: 1, destinationUserId: 1 })

const TransactionSchema = model<ITransaction>('Transaction', transactionSchema)

export default TransactionSchema
