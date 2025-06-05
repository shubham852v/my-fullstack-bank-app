// banking-system/src/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('Error: MONGO_URI environment variable is not set.');
            process.exit(1);
        }

        await mongoose.connect(mongoUri, {
            // useNewUrlParser: true, // Deprecated in Mongoose 6+
            // useUnifiedTopology: true, // Deprecated in Mongoose 6+
            // useCreateIndex: true, // Deprecated in Mongoose 6+ (for `createIndex`)
            // useFindAndModify: false // Deprecated in Mongoose 6+ (for `findOneAndUpdate`, `findByIdAndUpdate`, etc.)
            // Mongoose 6+ options are typically fine by default
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
