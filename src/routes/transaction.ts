import express from 'express'
import TransactionController from '../controllers/transaction'
import { isAuthenticated } from '../middlewares/auth'
import validateRequest from '../middlewares/validator'
import { vCreateTransaction } from '../validators/transaction'
const router = express.Router()

router.get('/', isAuthenticated, TransactionController.index)
router.get('/:id', isAuthenticated, TransactionController.show)
router.post('/cron/toggle', isAuthenticated, TransactionController.toggleCronJob)
router.post('/create', isAuthenticated, validateRequest(vCreateTransaction), TransactionController.store)
router.get('/cron/status', isAuthenticated, TransactionController.cronJobStatus)
router.post('/download-csv', isAuthenticated, TransactionController.downloadCSV)
router.get('/report/get', isAuthenticated, TransactionController.generateReport)
router.get('/report/amounts', isAuthenticated, TransactionController.generateAmountReport)
router.get('/report/number-of-transactions', isAuthenticated, TransactionController.generateNumberOfTransactionsReport)
router.get('/report/transaction-type', isAuthenticated, TransactionController.generateTransactionTypeReport)
export default router
