'use strict'
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectString = process.env.MONGO_URI;

if (!connectString) {
    console.error('MongoDB connection string is missing!');
    process.exit(1);
}

mongoose.connect(connectString)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

// Enable debug mode if NODE_ENV is set to development
if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}

module.exports = mongoose;
