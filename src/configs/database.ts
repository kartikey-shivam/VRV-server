import mongoose from 'mongoose'
import env from './env'
const uri = env.MONGODB_URI
const connectDB = () => {
  mongoose
    .connect(uri)
    .then(() => console.log('Database connection established successfully'))
    .catch((error) => {
      console.log('Error connecting to Database ', error)
      process.exit(1)
    })
}
export default connectDB
