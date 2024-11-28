import express from 'express'
import TransactionController from '../controllers/transaction'
import { isAuthenticated, permissionValidator } from '../middlewares/auth'
import validateRequest from '../middlewares/validator'
import { vCreateTransaction } from '../validators/transaction'
import { permissionValidatorWrapper } from '../validators/auth'
const router = express.Router()

router.get('/', isAuthenticated, TransactionController.index)
router.get('/:id', isAuthenticated, TransactionController.show)
router.post('/cron/toggle', isAuthenticated,permissionValidatorWrapper('Cron_job_access '), TransactionController.toggleCronJob)
router.post('/create', isAuthenticated,permissionValidatorWrapper('Create_Transaction'), validateRequest(vCreateTransaction), TransactionController.store)
router.get('/cron/status', isAuthenticated,permissionValidatorWrapper('Cron_job_access'), TransactionController.cronJobStatus)
router.post('/download-csv', isAuthenticated,permissionValidatorWrapper('Download_report'), TransactionController.downloadCSV)
// router.get('/report/get', isAuthenticated,permissionValidatorWrapper('Create_Transaction'), TransactionController.generateReport)
// router.get('/report/amounts', isAuthenticated, TransactionController.generateAmountReport)
// router.get('/report/number-of-transactions', isAuthenticated, TransactionController.generateNumberOfTransactionsReport)
// router.get('/report/transaction-type', isAuthenticated, TransactionController.generateTransactionTypeReport)
export default router
