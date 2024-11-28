// Define the interface for the Transaction document
import { Document } from 'mongoose'
import { CurrencyCode } from './CurrencyCode'
import { CountryCode } from './CountryCode'
import { TransactionType } from './TransactionType'
import { TransactionState } from './TransactionState'
import { TransactionAmountDetails } from './TransactionAmountDetails'
import { TransactionOriginPaymentDetails } from './TransactionOriginPaymentDetails'
import { OriginFundsInfo } from './OriginFundsInfo'
import { DeviceData } from './DeviceData'
import { Tag } from './Tag'
import { TransactionDestinationPaymentDetails } from './TransactionDestinationPaymentDetails'

export interface ITransaction extends Document {
  type: TransactionType
  transactionId: string
  timestamp: Date
  originUserId?: string
  destinationUserId?: string
  transactionState?: TransactionState
  originAmountDetails?: TransactionAmountDetails
  destinationAmountDetails?: TransactionAmountDetails
  originPaymentDetails?: TransactionOriginPaymentDetails
  destinationPaymentDetails?: TransactionDestinationPaymentDetails
  originFundsInfo?: OriginFundsInfo
  relatedTransactionIds?: string[]
  productType?: string
  promotionCodeUsed?: boolean
  reference?: string
  originDeviceData?: DeviceData
  destinationDeviceData?: DeviceData
  tags?: Tag[]
  description: string
}
