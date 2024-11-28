const mongoose = require('mongoose')

module.exports = async function () {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close()
    }
} 