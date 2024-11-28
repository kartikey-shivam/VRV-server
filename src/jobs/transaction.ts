import cron, { ScheduledTask } from 'node-cron'
import { CreateRandomTransaction } from '../utils/transaction'

class TransactionCronJobManager {
  private static instance: TransactionCronJobManager
  private cronJob: ScheduledTask | null = null
  private startTime: number | null = null

  private constructor() {}

  public static getInstance(): TransactionCronJobManager {
    if (!TransactionCronJobManager.instance) {
      TransactionCronJobManager.instance = new TransactionCronJobManager()
    }
    return TransactionCronJobManager.instance
  }
  public start() {
    if (this.cronJob) {
      console.log('Transaction Cron Job already running')
      return
    }
    this.startTime = Date.now()
    this.cronJob = cron.schedule('* * * * * *', async () => {
      try {
        const currentTime = Date.now()
        const elapsedTime = (currentTime - this.startTime!) / 1000 / 60
        if (elapsedTime >= 5) {
          // If running for 5 minutes or more, stop it
          console.log('Transaction Cron Job has been running for over an hour. Stopping...')
          this.stop()
        }
        const transaction = CreateRandomTransaction()
        await transaction.save()
      } catch (error) {
        console.error('Error during transaction processing:', error)
      }
    })

    console.log('Transaction Cron Job started')
  }
  public stop() {
    if (this.cronJob) {
      this.cronJob.stop()
      this.cronJob = null
      this.startTime = null
      console.log('Transaction Cron Job stopped.')
    } else {
      console.log('Transaction Cron Job is not running.')
    }
  }
  public isRunning(): boolean {
    return this.cronJob !== null
  }
}

export default TransactionCronJobManager
