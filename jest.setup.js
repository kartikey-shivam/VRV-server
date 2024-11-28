const mongoose = require('mongoose')
const env = require('./src/configs/env').default

beforeAll(async () => {
    try {
        await mongoose.connect(env.MONGODB_URI)
    } catch (error) {
        console.error('MongoDB connection error:', error)
        throw error
    }
})

afterAll(async () => {
    try {
        await mongoose.connection.close()
    } catch (error) {
        console.error('Error closing MongoDB connection:', error)
        throw error
    }
})

afterEach(async () => {
    try {
        const collections = mongoose.connection.collections
        for (const key in collections) {
            console.log(`Cleaning collection: ${key}`);
            await collections[key].deleteMany({})
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
        throw error;
    }
})

// Add global error handling for unhandled promises
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error)
}) 