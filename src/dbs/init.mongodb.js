'use strict';
const mongoose = require('mongoose');
require('dotenv').config();
const { countConnect, checkOverload  } = require('../helpers/check.connect');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        const connectString = process.env.MONGO_URI;

        if (!connectString) {
            console.error('[ERROR] MongoDB connection string is missing!');
            process.exit(1);
        }

        mongoose.connect(connectString, {
            maxPoolSize:50,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no response
        })
            .then(() => {
                console.log('[INFO] ✅ Connected to MongoDB successfully PRO');
                countConnect(); // ✅ Call countConnect() separately
                checkOverload(); // Start monitoring overload
            })
            .catch(err => {
                console.error('[ERROR] ❌ MongoDB connection error:', err);
                process.exit(1);
            });

        // Handle MongoDB connection errors
        mongoose.connection.on('error', err => {
            console.error('[ERROR] ❌ MongoDB error:', err);
        });

        // Handle MongoDB disconnections
        mongoose.connection.on('disconnected', () => {
            console.warn('[WARN] 🔄 MongoDB disconnected! Attempting to reconnect...');
            this._reconnect();
        });

        // Enable debug mode in development
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', { color: true });
        }
    }

    _reconnect() {
        setTimeout(() => {
            console.log('[INFO] 🔄 Reconnecting to MongoDB...');
            this._connect();
        }, 5000); // Wait 5 seconds before retrying
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Database(); // Create an instance if it doesn't exist
        }
        return mongoose; // Always return the mongoose instance
    }
}

module.exports = Database.getInstance();
