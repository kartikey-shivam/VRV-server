import { faker } from '@faker-js/faker'
import { v4 as uuidv4 } from 'uuid'
import { CurrencyCode } from '../interfaces/transaction/CurrencyCode'
import { TransactionState } from '../interfaces/transaction/TransactionState'
import { TransactionType } from '../interfaces/transaction/TransactionType'
import TransactionSchema from '../models/transaction'
import { transactionMethods } from './common'

const operatingSystems = ['Windows 10', 'Windows 11', 'macOS', 'Linux', 'Android', 'iOS', 'Chrome OS', 'Ubuntu', 'Debian', 'Fedora', 'iPadOS']

const deviceMakers = ['Apple', 'Samsung', 'Google', 'Microsoft', 'Dell', 'Lenovo', 'Huawei', 'Xiaomi', 'OnePlus', 'LG']

const deviceModels = ['iPhone 14', 'Galaxy S21', 'Pixel 6', 'Surface Laptop 4', 'MacBook Pro', 'ThinkPad X1', 'Mate 40 Pro', 'Mi 11', 'OnePlus 9', 'LG V60']
const generateDeviceData = () => {
  return {
    batteryLevel: faker.number.int({ min: 5, max: 100 }),
    deviceLatitude: faker.location.latitude(),
    deviceLongitude: faker.location.longitude(),
    ipAddress: faker.internet.ipv4(),
    deviceIdentifier: uuidv4(),
    vpnUsed: faker.datatype.boolean(),
    operatingSystem: faker.helpers.arrayElement(operatingSystems),
    deviceMaker: faker.helpers.arrayElement(deviceMakers),
    deviceModel: faker.helpers.arrayElement(deviceModels),
    deviceYear: faker.date.past({ years: 10 }).getFullYear().toString(),
    appVersion: `${faker.number.int({ min: 1, max: 10 })}.${faker.number.int({ min: 0, max: 9 })}.${faker.number.int({ min: 0, max: 99 })}`,
  }
}
export const CreateRandomTransaction = () => {
  const currentTimestamp = new Date()
  const oneYearAgo = new Date() // 1 year ago in milliseconds
  oneYearAgo.setFullYear(currentTimestamp.getFullYear() - 1)
  const randomTimestamp = faker.date.between({ from: oneYearAgo, to: currentTimestamp })
  // const amount = faker.finance.amount()
  const currency = faker.helpers.arrayElement(Object.values(CurrencyCode))
  const verb = faker.hacker.verb()
  const transaction = new TransactionSchema({
    type: faker.helpers.arrayElement(Object.values(TransactionType)),
    transactionId: faker.database.mongodbObjectId(),
    timestamp: randomTimestamp,
    originUserId: faker.database.mongodbObjectId(),
    destinationUserId: faker.database.mongodbObjectId(),
    transactionState: faker.helpers.arrayElement(Object.values(TransactionState)),
    originAmountDetails: {
      transactionAmount: faker.finance.amount(),
      transactionCurrency: currency,
    },
    destinationAmountDetails: {
      transactionAmount: faker.finance.amount(),
      transactionCurrency: currency,
    },
    originPaymentDetails: {
      method: faker.helpers.arrayElement(transactionMethods),
    },
    destinationPaymentDetails: {
      method: faker.helpers.arrayElement(transactionMethods),
    },
    relatedTransactionIds: [faker.database.mongodbObjectId()],
    originDeviceData: generateDeviceData(),
    destinationDeviceData: generateDeviceData(),
    tags: [
      {
        key: verb,
        value: verb,
      },
    ],
    description: faker.word.words({ count: { min: 5, max: 10 } }),
  })
  return transaction
}
