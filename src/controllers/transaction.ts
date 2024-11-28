import { NextFunction, Request, Response } from 'express'
import moment from 'moment'
import XLSX from 'xlsx'
import { TransactionType } from '../interfaces/transaction/TransactionType'
import TransactionCronJobManager from '../jobs/transaction'
import TransactionSchema from '../models/transaction'
import { sendEMail } from '../services/Email'
import { TransactionState } from '../interfaces/transaction/TransactionState'

class TransactionController {
  public static async store(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId, originUserId, destinationUserId } = req.body
      if (destinationUserId === originUserId) return res.error('field.destOriginIdSame')
      if (await TransactionSchema.findOne({ transactionId })) return res.error('transaction.alreadyExists')
      const transaction = await TransactionSchema.create(req.body)
      res.success('transaction.store', { transaction })
    } catch (error) {
      next(error)
    }
  }
  public static async index(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1
      const pageSize = parseInt(req.query.limit as string, 10) || 10
      const skip = (page - 1) * pageSize

      // Build filter object
      const filter: any = {}

      if (req.query.type) {
        const states = Array.isArray(req.query.type) ? req.query.type : (req.query.type as string).split(',')
        filter.type = { $in: states }
      }
      if (req.query.transactionId) filter.transactionId = req.query.transactionId
      if (req.query.originUserId) filter.originUserId = req.query.originUserId
      if (req.query.destinationUserId) filter.destinationUserId = req.query.destinationUserId
      if (req.query.transactionState) {
        const states = Array.isArray(req.query.transactionState) ? req.query.transactionState : (req.query.transactionState as string).split(',')
        filter.transactionState = { $in: states }
      }
      if (req.query.description) {
        const description = req.query.description as string
        const objectIdMatch = description.match(/\b[A-Fa-f0-9]{24}\b/)

        if (objectIdMatch) {
          filter.$or = [{ transactionId: objectIdMatch[0] }, { originUserId: objectIdMatch[0] }, { destinationUserId: objectIdMatch[0] }]
        } else {
          // If description doesn't match an ObjectId, treat it as a text search
          filter.description = { $regex: description, $options: 'i' } // Case-insensitive match
        }

        const timestampMatch = description.match(/(\d{4}-\d{2}-\d{2})(\s*to\s*(\d{4}-\d{2}-\d{2}))?/)
        if (timestampMatch) {
          const startDate = new Date(timestampMatch[1])
          const endDate = timestampMatch[3] ? new Date(timestampMatch[3]) : startDate
          filter.timestamp = { $gte: startDate, $lte: endDate }
        }

        if (TransactionType[description.toUpperCase() as keyof typeof TransactionType]) {
          filter.type = TransactionType[description.toUpperCase() as keyof typeof TransactionType]
        }

        if (TransactionState[description.toUpperCase() as keyof typeof TransactionState]) {
          filter.transactionState = TransactionState[description.toUpperCase() as keyof typeof TransactionState]
        }
      }
      // Timestamp range filters
      if (req.query.timestamp) {
        const timestamps = Array.isArray(req.query.timestamp) ? req.query.timestamp.map((ts) => ts as string) : [req.query.timestamp as string]

        if (timestamps.length === 1) {
          filter.timestamp = { $gte: new Date(timestamps[0]) }
        } else if (timestamps.length === 2) {
          filter.timestamp = {
            $gte: new Date(timestamps[0]),
            $lte: new Date(timestamps[1]),
          }
        }
      }

      // Amount filter
      // if (req.query.amountGte) filter['originAmountDetails.transactionAmount'] = { ...filter['originAmountDetails.transactionAmount'], $gte: parseFloat(req.query.amountGte as string) }
      // if (req.query.amountLte) filter['originAmountDetails.transactionAmount'] = { ...filter['originAmountDetails.transactionAmount'], $lte: parseFloat(req.query.amountLte as string) }
      // if (req.query.amountGte) filter['destinationAmountDetails.transactionAmount'] = { ...filter['destinationAmountDetails.transactionAmount'], $gte: parseFloat(req.query.amountGte as string) }
      // if (req.query.amountLte) filter['destinationAmountDetails.transactionAmount'] = { ...filter['destinationAmountDetails.transactionAmount'], $lte: parseFloat(req.query.amountLte as string) }
      if (req.query.originAmountDetails) {
        const originAmount = parseFloat(req.query.originAmountDetails as string)
        filter['$expr'] = {
          $lte: [{ $toDouble: '$originAmountDetails.transactionAmount' }, originAmount],
        }
      }

      if (req.query.destinationAmountDetails) {
        const destinationAmount = parseFloat(req.query.destinationAmountDetails as string)
        filter['$expr'] = {
          $lte: [{ $toDouble: '$destinationAmountDetails.transactionAmount' }, destinationAmount],
        }
      }
      // Currency filter
      if (req.query.currencyCode) {
        const currencies = Array.isArray(req.query.currencyCode) ? req.query.currencyCode : (req.query.currencyCode as string).split(',')
        filter['originAmountDetails.transactionCurrency'] = { $in: currencies }
      }

      // Tags filter (matches at least one tag)
      if (req.query.tags) {
        const tags = Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]
        filter['tags.value'] = { $in: tags }
      }

      let sortBy = req.query.sortBy || 'timestamp'
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

      const validSortFields = ['timestamp', 'originAmount', 'destinationAmount']
      if (!validSortFields.includes(sortBy as string)) {
        return res.error('filed.invalid')
      }
      if (sortBy === 'originAmount') sortBy = 'originAmountDetails.transactionAmount'
      else if (sortBy === 'destinationAmount') sortBy = 'destinationAmountDetails.transactionAmount'
      const totalDocs = await TransactionSchema.countDocuments(filter)
      const transaction = await TransactionSchema.aggregate([{ $match: filter }, { $sort: { [sortBy as string]: sortOrder } }, { $skip: skip }, { $limit: pageSize }])

      const totalPages = Math.ceil(totalDocs / pageSize)
      const hasNextPage = page < totalPages
      const hasPrevPage = page > 1

      const metadata = {
        totalDocs,
        limit: pageSize,
        page,
        totalPages,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
        hasNextPage,
        hasPrevPage,
      }
      res.success('transaction.fetched', { transaction, metadata })
    } catch (error) {
      next(error)
    }
  }
  public static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const transaction = await TransactionSchema.findOne({ transactionId: id })
      if (!transaction) return res.error('transaction.notFound')
      return res.success('transaction.fetched', { transaction })
    } catch (error) {
      next(error)
    }
  }
  public static async toggleCronJob(req: Request, res: Response, next: NextFunction) {
    try {
      const cronManager = TransactionCronJobManager.getInstance()
      const isRunning = cronManager.isRunning()

      if (isRunning) {
        cronManager.stop()
        return res.success('transaction.jobStopped', { status: false })
      } else {
        cronManager.start()
        return res.success('transaction.jobStarted', { status: true })
      }
    } catch (error) {
      next(error)
    }
  }
  public static async cronJobStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const cronManager = TransactionCronJobManager.getInstance()
      const status = cronManager.isRunning()
      res.success('transaction.statusFetched', { status })
    } catch (error) {
      next(error)
    }
  }
  public static async downloadCSV(req: Request, res: Response, next: NextFunction) {
    try {
      const transactions = await TransactionSchema.find().lean()
      const data = transactions.map((transaction) => ({
        type: transaction.type,
        transactionId: transaction.transactionId,
        description: transaction.description,
        timestamp: transaction.timestamp,
        originUserId: transaction.originUserId,
        destinationUserId: transaction.destinationUserId,
        transactionState: transaction.transactionState,
        amountSent: transaction.originAmountDetails?.transactionAmount,
        amountReceived: transaction.destinationAmountDetails?.transactionAmount,
        currency: transaction.originAmountDetails?.transactionCurrency,
        country: transaction.originAmountDetails?.country,
        // Origin Device Data
        originBatteryLevel: transaction.originDeviceData?.batteryLevel,
        originDeviceLatitude: transaction.originDeviceData?.deviceLatitude,
        originDeviceLongitude: transaction.originDeviceData?.deviceLongitude,
        originIpAddress: transaction.originDeviceData?.ipAddress,
        originDeviceIdentifier: transaction.originDeviceData?.deviceIdentifier,
        originVpnUsed: transaction.originDeviceData?.vpnUsed,
        originOperatingSystem: transaction.originDeviceData?.operatingSystem,
        originDeviceMaker: transaction.originDeviceData?.deviceMaker,
        originDeviceModel: transaction.originDeviceData?.deviceModel,
        originDeviceYear: transaction.originDeviceData?.deviceYear,
        originAppVersion: transaction.originDeviceData?.appVersion,
        // Destination Device Data
        destinationBatteryLevel: transaction.destinationDeviceData?.batteryLevel,
        destinationDeviceLatitude: transaction.destinationDeviceData?.deviceLatitude,
        destinationDeviceLongitude: transaction.destinationDeviceData?.deviceLongitude,
        destinationIpAddress: transaction.destinationDeviceData?.ipAddress,
        destinationDeviceIdentifier: transaction.destinationDeviceData?.deviceIdentifier,
        destinationVpnUsed: transaction.destinationDeviceData?.vpnUsed,
        destinationOperatingSystem: transaction.destinationDeviceData?.operatingSystem,
        destinationDeviceMaker: transaction.destinationDeviceData?.deviceMaker,
        destinationDeviceModel: transaction.destinationDeviceData?.deviceModel,
        destinationDeviceYear: transaction.destinationDeviceData?.deviceYear,
        destinationAppVersion: transaction.destinationDeviceData?.appVersion,
        //tags
        tags: transaction.tags?.map((tag) => tag.value).join(', '),
      }))

      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1')
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
      res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx')
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.send(buffer)
    } catch (error) {
      next(error)
    }
  }
  public static async generateReport(req: Request, res: Response, next: NextFunction) {
    try {
      // Fetch all transactions
      const transactions = await TransactionSchema.find().lean()

      // Total number of transactions
      const totalTransactions = transactions.length

      // Group transactions by type
      const transactionsByType = transactions.reduce<Record<TransactionType, number>>(
        (acc, transaction) => {
          acc[transaction.type] = (acc[transaction.type] || 0) + 1
          return acc
        },
        {} as Record<TransactionType, number>
      )

      // Active users (origin + destination)
      const activeUsers = new Set()
      transactions.forEach((transaction) => {
        if (transaction.originUserId) activeUsers.add(transaction.originUserId)
        if (transaction.destinationUserId) activeUsers.add(transaction.destinationUserId)
      })

      // Most common tags
      const tagCounts = transactions.reduce<Record<string, number>>(
        (acc, transaction) => {
          transaction.tags?.forEach((tag) => {
            acc[tag.value] = (acc[tag.value] || 0) + 1
          })
          return acc
        },
        {} as Record<string, number>
      )
      const mostCommonTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }))

      // Average transaction amount (origin)
      const totalAmountSent = transactions.reduce((acc, transaction) => acc + (transaction.originAmountDetails?.transactionAmount || 0), 0)
      const averageAmountSent = totalTransactions > 0 ? totalAmountSent / totalTransactions : 0

      // Device insights
      const devicesUsed = transactions.reduce<Record<string, number>>(
        (acc, transaction) => {
          const originDevice = transaction.originDeviceData?.deviceMaker || 'Unknown'
          const destinationDevice = transaction.destinationDeviceData?.deviceMaker || 'Unknown'

          acc[originDevice] = (acc[originDevice] || 0) + 1
          acc[destinationDevice] = (acc[destinationDevice] || 0) + 1

          return acc
        },
        {} as Record<string, number>
      )

      // Generate the report object
      const data = {
        totalTransactions,
        transactionsByType,
        totalActiveUsers: activeUsers.size,
        mostCommonTags,
        averageAmountSent: averageAmountSent.toFixed(2),
        devicesUsed,
        timestamp: new Date().toISOString(), // Report generation timestamp
      }

      await sendEMail(req.user.email, 'report', 'vrv Transaction Report', data)

      res.success('transaction.report.sent')
    } catch (error) {
      console.error('Error generating report:', error)
      throw error
    }
  }
  public static async generateAmountReport(req: Request, res: Response, next: NextFunction) {
    try {
      let { amount = '3', unit = 'months' } = req.query
      const today = moment()
      //@ts-ignore
      let xDaysAgo = moment().subtract(amount, unit)
      const report = await TransactionSchema.aggregate([
        {
          $match: {
            timestamp: {
              $gte: xDaysAgo.toDate(),
              $lte: today.toDate(),
            },
          },
        },
        {
          $project: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            amountSent: '$originAmountDetails.transactionAmount',
            amountReceived: '$destinationAmountDetails.transactionAmount',
          },
        },
        {
          $group: {
            _id: '$date',
            amountSent: { $sum: '$amountSent' },
            amountReceived: { $sum: '$amountReceived' },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            date: '$_id',
            amountSent: 1,
            amountReceived: 1,
            _id: 0,
          },
        },
      ])
      res.success('transaction.report.amount', { report })
    } catch (error) {
      next(error)
    }
  }
  public static async generateNumberOfTransactionsReport(req: Request, res: Response, next: NextFunction) {
    try {
      let { amount = '3', unit = 'months' } = req.query
      const today = moment()
      //@ts-ignore
      let xDaysAgo = moment().subtract(amount, unit)
      const report = await TransactionSchema.aggregate([
        {
          $match: {
            timestamp: {
              $gte: xDaysAgo.toDate(),
              $lte: today.toDate(),
            },
          },
        },
        {
          $project: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
          },
        },
        {
          $group: {
            _id: '$date',
            transactionCount: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            date: '$_id',
            transactionCount: '$transactionCount',
            _id: 0,
          },
        },
      ])
      res.success('transaction.report.numberOfTransactions', { report })
    } catch (error) {
      next(error)
    }
  }
  public static async generateTransactionTypeReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await TransactionSchema.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            transactionType: '$_id',
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: { count: -1 },
        },
      ])
      res.success('transaction.report.transactionType', { report })
    } catch (error) {
      next(error)
    }
  }
}

export default TransactionController
