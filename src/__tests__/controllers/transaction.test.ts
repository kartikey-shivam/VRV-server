import { NextFunction, Request, Response } from 'express'
import TransactionController from '../../controllers/transaction'
import { IUser } from '../../interfaces/user'
import TransactionCronJobManager from '../../jobs/transaction'
import TransactionSchema from '../../models/transaction'

// Mock dependencies
jest.mock('../../models/transaction')
jest.mock('../../jobs/transaction')
jest.mock('../../services/Email')

describe('TransactionController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
      user: {
        email: 'test@example.com',
        firstName: 'Test',
      } as IUser,
    }
    mockResponse = {
      success: jest.fn(),
      error: jest.fn(),
      setHeader: jest.fn(),
      send: jest.fn(),
    }
    mockNext = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('store', () => {
    it('should create a new transaction successfully', async () => {
      mockRequest.body = {
        transactionId: 'test123',
        originUserId: 'user1',
        destinationUserId: 'user2',
      }

      jest.spyOn(TransactionSchema, 'findOne').mockResolvedValue(null)
      jest.spyOn(TransactionSchema, 'create').mockResolvedValue({ ...mockRequest.body })

      await TransactionController.store(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.success).toHaveBeenCalledWith('transaction.store', expect.any(Object))
    })

    it('should return error if destination and origin IDs are same', async () => {
      mockRequest.body = {
        transactionId: 'test123',
        originUserId: 'user1',
        destinationUserId: 'user1',
      }

      await TransactionController.store(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.error).toHaveBeenCalledWith('field.destOriginIdSame')
    })

    it('should return error if transaction already exists', async () => {
      mockRequest.body = {
        transactionId: 'test123',
        originUserId: 'user1',
        destinationUserId: 'user2',
      }

      jest.spyOn(TransactionSchema, 'findOne').mockResolvedValue({ ...mockRequest.body })

      await TransactionController.store(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.error).toHaveBeenCalledWith('transaction.alreadyExists')
    })
  })

  describe('index', () => {
    it('should fetch transactions with default pagination', async () => {
      jest.spyOn(TransactionSchema, 'countDocuments').mockResolvedValue(15)
      jest.spyOn(TransactionSchema, 'aggregate').mockResolvedValue([])

      await TransactionController.index(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.success).toHaveBeenCalledWith('transaction.fetched', expect.any(Object))
    })

    it('should apply filters correctly', async () => {
      mockRequest.query = {
        type: 'PAYMENT',
        transactionId: 'test123',
        originUserId: 'user1',
        destinationUserId: 'user2',
        transactionState: 'COMPLETED',
        description: 'test',
        timestamp: ['2023-01-01', '2023-12-31'],
        amountGte: '100',
        amountLte: '1000',
        currencyCode: 'USD',
        tags: ['tag1', 'tag2'],
      }

      jest.spyOn(TransactionSchema, 'countDocuments').mockResolvedValue(5)
      jest.spyOn(TransactionSchema, 'aggregate').mockResolvedValue([])

      await TransactionController.index(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.success).toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('should fetch a single transaction successfully', async () => {
      mockRequest.params = { id: 'test123' }

      jest.spyOn(TransactionSchema, 'findOne').mockResolvedValue({ transactionId: 'test123' })

      await TransactionController.show(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.success).toHaveBeenCalledWith('transaction.fetched', expect.any(Object))
    })

    it('should return error if transaction not found', async () => {
      mockRequest.params = { id: 'test123' }

      jest.spyOn(TransactionSchema, 'findOne').mockResolvedValue(null)

      await TransactionController.show(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.error).toHaveBeenCalledWith('transaction.notFound')
    })
  })

  describe('toggleCronJob', () => {
    it('should stop running cron job', async () => {
      const mockCronManager = {
        isRunning: jest.fn().mockReturnValue(true),
        stop: jest.fn(),
        start: jest.fn(),
      }

      jest.spyOn(TransactionCronJobManager, 'getInstance').mockReturnValue(mockCronManager as any)

      await TransactionController.toggleCronJob(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.success).toHaveBeenCalledWith('transaction.jobStopped', { status: false })
    })

    it('should start stopped cron job', async () => {
      const mockCronManager = {
        isRunning: jest.fn().mockReturnValue(false),
        stop: jest.fn(),
        start: jest.fn(),
      }

      jest.spyOn(TransactionCronJobManager, 'getInstance').mockReturnValue(mockCronManager as any)

      await TransactionController.toggleCronJob(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.success).toHaveBeenCalledWith('transaction.jobStarted', { status: true })
    })
  })

  describe('generateAmountReport', () => {
    it('should generate amount report with default parameters', async () => {
      jest.spyOn(TransactionSchema, 'aggregate').mockResolvedValue([])

      await TransactionController.generateAmountReport(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.success).toHaveBeenCalledWith('transaction.report.amount', expect.any(Object))
    })
  })

  describe('generateNumberOfTransactionsReport', () => {
    it('should generate transaction count report', async () => {
      jest.spyOn(TransactionSchema, 'aggregate').mockResolvedValue([])

      await TransactionController.generateNumberOfTransactionsReport(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.success).toHaveBeenCalledWith('transaction.report.numberOfTransactions', expect.any(Object))
    })
  })

  describe('generateTransactionTypeReport', () => {
    it('should generate transaction type report', async () => {
      jest.spyOn(TransactionSchema, 'aggregate').mockResolvedValue([])

      await TransactionController.generateTransactionTypeReport(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.success).toHaveBeenCalledWith('transaction.report.transactionType', expect.any(Object))
    })
  })
})
